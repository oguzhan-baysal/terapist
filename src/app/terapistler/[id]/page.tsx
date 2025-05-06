import Image from "next/image";
import { Star, MapPin, Calendar, User, Mail, Phone, Clock } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import AppointmentButton from "@/components/appointment/AppointmentButton";

interface Education {
  school: string;
  degree: string;
  field: string;
  year: number;
}

interface WorkingHours {
  day: string;
  hours: string;
}

interface Terapist {
  _id: string;
  name: string;
  email: string;
  image?: string;
  title?: string;
  specialties?: string[];
  experience?: number;
  education?: Education[];
  contact?: {
    phone: string;
    address: string;
    workingHours: WorkingHours[];
  };
  location?: {
    city?: string;
    district?: string;
  };
  rating?: number;
  reviewCount?: number;
  pricing?: {
    sessionPrice: number;
    currency: string;
  };
}

async function getTerapist(id: string): Promise<Terapist> {
  try {
    const { db } = await connectToDatabase();
    const terapist = await db
      .collection("therapists")
      .findOne({ _id: new ObjectId(id) });

    if (!terapist) {
      notFound();
    }

    // Çalışma saatlerini normalize et
    if (terapist.contact?.workingHours) {
      terapist.contact.workingHours = terapist.contact.workingHours.map((wh: any) => {
        const dayMap: { [key: string]: string } = {
          'pazartesi': 'pazartesi',
          'salı': 'sali',
          'çarşamba': 'carsamba',
          'perşembe': 'persembe',
          'cuma': 'cuma',
          'cumartesi': 'cumartesi',
          'pazar': 'pazar'
        };

        const normalizedDay = wh.day.toLowerCase().trim();
        return {
          day: dayMap[normalizedDay] || normalizedDay,
          hours: wh.hours
        };
      });
    }

    // MongoDB dökümanını düz objeye çevir
    const normalizedTerapist = {
      ...terapist,
      _id: terapist._id.toString(),
      contact: terapist.contact ? {
        ...terapist.contact,
        workingHours: terapist.contact.workingHours
      } : undefined
    };

    return normalizedTerapist as Terapist;
  } catch (error) {
    console.error("Terapist getirme hatası:", error);
    notFound();
  }
}

export default async function TerapistDetay({ params }: { params: { id: string } }) {
  const terapist = await getTerapist(params.id);

  if (!terapist) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Üst Bölüm - Profil Bilgileri */}
        <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profil Fotoğrafı */}
            <div className="flex-shrink-0">
              <div className="relative w-40 h-40 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                {terapist.image ? (
                  <Image
                    src={terapist.image}
                    alt={`${terapist.name} profil fotoğrafı`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 160px) 100vw, 160px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Temel Bilgiler */}
            <div className="flex-grow space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {terapist.name}
                </h1>
                {terapist.title && (
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                    {terapist.title}
                  </p>
                )}
              </div>

              {/* Değerlendirme ve Konum */}
              <div className="flex flex-wrap gap-4">
                {(terapist.rating || terapist.reviewCount) && (
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {terapist.rating}
                    </span>
                    {terapist.reviewCount && (
                      <span className="text-gray-500 dark:text-gray-400">
                        ({terapist.reviewCount} değerlendirme)
                      </span>
                    )}
                  </div>
                )}

                {terapist.location && (terapist.location.city || terapist.location.district) && (
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>
                      {[terapist.location.district, terapist.location.city]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}

                {terapist.experience && (
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{terapist.experience} yıl deneyim</span>
                  </div>
                )}
              </div>

              {/* Uzmanlık Alanları */}
              {terapist.specialties && terapist.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {terapist.specialties.map((specialty: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Seans Ücreti ve Randevu Butonu */}
            <div className="md:text-right space-y-4">
              {terapist.pricing && (
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {terapist.pricing.sessionPrice} {terapist.pricing.currency}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    seans ücreti
                  </p>
                </div>
              )}
              <AppointmentButton terapistId={params.id} workingHours={terapist.contact?.workingHours} />
            </div>
          </div>
        </div>

        {/* Alt Bölüm - Detaylı Bilgiler */}
        <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* İletişim Bilgileri */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              İletişim Bilgileri
            </h2>
            <div className="space-y-4">
              {terapist.email && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Mail className="w-5 h-5 mr-3" />
                  <span>{terapist.email}</span>
                </div>
              )}
              {terapist.contact?.phone && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Phone className="w-5 h-5 mr-3" />
                  <span>{terapist.contact.phone}</span>
                </div>
              )}
              {terapist.contact?.address && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="w-5 h-5 mr-3" />
                  <span>{terapist.contact.address}</span>
                </div>
              )}
            </div>

            {/* Çalışma Saatleri */}
            {terapist.contact?.workingHours && terapist.contact.workingHours.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Çalışma Saatleri
                </h3>
                <div className="space-y-2">
                  {terapist.contact.workingHours.map((schedule: WorkingHours, index: number) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-600 dark:text-gray-400"
                    >
                      <Clock className="w-4 h-4 mr-3" />
                      <span className="w-20">{schedule.day}:</span>
                      <span>{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Eğitim Bilgileri */}
          {terapist.education && terapist.education.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Eğitim Bilgileri
              </h2>
              <div className="space-y-4">
                {terapist.education.map((edu: Education, index: number) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      {edu.school}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {edu.degree} - {edu.field}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {edu.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 