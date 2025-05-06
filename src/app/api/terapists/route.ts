import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Tüm terapistleri getir
    const terapists = await db
      .collection("therapists")
      .find({})
      .toArray();

    console.log("Bulunan terapistler:", terapists);

    return NextResponse.json(terapists);
  } catch (error) {
    console.error("Terapistler getirilemedi:", error);
    return NextResponse.json(
      { error: "Terapistler getirilemedi" },
      { status: 500 }
    );
  }
} 