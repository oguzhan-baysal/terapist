import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// Validasyon şeması
const appointmentSchema = z.object({
  terapistId: z.string(),
  date: z.string(),
  time: z.string(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Oturum açmanız gerekiyor" }, { status: 401 });
    }

    const body = await request.json();
    
    // Veri validasyonu
    const validationResult = appointmentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Geçersiz veri formatı", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { terapistId, date, time, notes } = validationResult.data;

    const { db } = await connectToDatabase();

    // Terapist kontrolü
    const terapist = await db.collection("therapists").findOne({
      _id: new ObjectId(terapistId)
    });

    if (!terapist) {
      return NextResponse.json(
        { error: "Terapist bulunamadı" },
        { status: 404 }
      );
    }

    // Çalışma saatleri kontrolü
    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.toLocaleDateString('tr-TR', { weekday: 'long' }).toLowerCase();
    
    const workingHours = terapist.contact?.workingHours?.find(
      (wh: { day: string; hours: string }) => 
      wh.day.toLowerCase() === dayOfWeek
    );

    if (!workingHours) {
      return NextResponse.json(
        { error: "Seçilen gün için çalışma saati bulunmamaktadır" },
        { status: 400 }
      );
    }

    const [startTime, endTime] = workingHours.hours.split("-");
    const appointmentTime = parseInt(time.split(":")[0]);
    const workStartTime = parseInt(startTime.split(":")[0]);
    const workEndTime = parseInt(endTime.split(":")[0]);

    if (appointmentTime < workStartTime || appointmentTime >= workEndTime) {
      return NextResponse.json(
        { error: "Seçilen saat çalışma saatleri dışındadır" },
        { status: 400 }
      );
    }

    // Randevu çakışması kontrolü
    const existingAppointment = await db.collection("appointments").findOne({
      terapistId: new ObjectId(terapistId),
      date: new Date(date),
      time,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "Bu tarih ve saatte başka bir randevu bulunmaktadır" },
        { status: 409 }
      );
    }

    // Randevuyu oluştur
    const appointment = await db.collection("appointments").insertOne({
      terapistId: new ObjectId(terapistId),
      userId: new ObjectId(session.user.id),
      date: new Date(date),
      time,
      notes,
      status: 'pending',
      createdAt: new Date()
    });

    // Başarılı yanıt
    return NextResponse.json({
      message: "Randevu talebi başarıyla oluşturuldu",
      appointmentId: appointment.insertedId,
      status: 'pending'
    });

  } catch (error) {
    console.error("Randevu oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Randevu oluşturulamadı. Lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Oturum açmanız gerekiyor" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const terapistId = searchParams.get("terapistId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const { db } = await connectToDatabase();

    // Filtreleme kriterleri
    const filter: any = {};

    // Terapist ID filtresi
    if (terapistId) {
      filter.terapistId = new ObjectId(terapistId);
    }

    // Kullanıcı rolüne göre filtreleme
    if (session.user.role === 'user') {
      filter.userId = new ObjectId(session.user.id);
    }

    // Durum filtresi
    if (status) {
      filter.status = status;
    }

    // Tarih aralığı filtresi
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Randevuları getir
    const appointments = await db.collection("appointments")
      .find(filter)
      .sort({ date: 1, time: 1 })
      .toArray();

    // Randevuları formatla
    const formattedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const [terapist, user] = await Promise.all([
          db.collection("therapists").findOne({ _id: appointment.terapistId }),
          db.collection("users").findOne({ _id: appointment.userId })
        ]);

        return {
          id: appointment._id,
          date: appointment.date,
          time: appointment.time,
          status: appointment.status,
          notes: appointment.notes,
          terapist: terapist ? {
            id: terapist._id,
            name: terapist.name,
            email: terapist.email
          } : null,
          user: user ? {
            id: user._id,
            name: user.name,
            email: user.email
          } : null
        };
      })
    );

    return NextResponse.json(formattedAppointments);

  } catch (error) {
    console.error("Randevu listesi getirme hatası:", error);
    return NextResponse.json(
      { error: "Randevular getirilemedi. Lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }
}

// Randevu durumunu güncelleme (onaylama/reddetme)
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'therapist') {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { appointmentId, status, message } = await request.json();

    if (!appointmentId || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: "Geçersiz istek" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const result = await db.collection("appointments").updateOne(
      { 
        _id: new ObjectId(appointmentId),
        terapistId: new ObjectId(session.user.id)
      },
      { 
        $set: { 
          status,
          statusMessage: message,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Randevu bulunamadı veya yetkiniz yok" },
        { status: 404 }
      );
    }

    // Kullanıcıya bildirim gönder (e-posta veya bildirim sistemi eklenebilir)
    // TODO: Bildirim sistemi eklenecek

    return NextResponse.json({
      message: `Randevu başarıyla ${status === 'approved' ? 'onaylandı' : 'reddedildi'}`
    });
  } catch (error) {
    console.error("Randevu güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Randevu güncellenemedi" },
      { status: 500 }
    );
  }
} 