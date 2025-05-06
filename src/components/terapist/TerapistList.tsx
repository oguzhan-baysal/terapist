import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Terapist {
  _id: string;
  name?: string;
  title?: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  location?: {
    city?: string;
    district?: string;
  };
  specialties?: string[];
  experience?: number;
  pricing?: {
    sessionPrice: number;
    currency: string;
  };
}

async function getTerapists() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    console.log("API çağrısı yapılıyor:", `${baseUrl}/api/terapists`);
    
    const res = await fetch(`${baseUrl}/api/terapists`, { 
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error("API yanıt durumu:", res.status, res.statusText);
      throw new Error("Terapistler yüklenirken bir hata oluştu");
    }

    const data = await res.json();
    console.log("API'den gelen veriler:", data);
    return data;
  } catch (error) {
    console.error("Terapistler getirilemedi:", error);
    return [];
  }
}

export default async function TerapistList() {
  const terapistler = await getTerapists();
  console.log("Render edilecek terapistler:", terapistler);

  if (!terapistler || terapistler.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Henüz hiç terapist bulunamadı.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {terapistler.map((terapist: Terapist) => (
        <div
          key={terapist._id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                {terapist.image ? (
                  <Image
                    src={terapist.image}
                    alt={`${terapist.name || 'Terapist'} profil fotoğrafı`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 128px) 100vw, 128px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <User 
                      className="w-12 h-12 text-gray-400"
                      aria-label="Varsayılan profil resmi"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-grow space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {terapist.name || 'İsimsiz Terapist'}
                  </h2>
                  {terapist.title && (
                    <p className="text-gray-600 dark:text-gray-400">{terapist.title}</p>
                  )}
                </div>
                {(terapist.rating || terapist.reviewCount) && (
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    {terapist.rating && (
                      <span className="font-medium text-gray-900 dark:text-white">
                        {terapist.rating}
                      </span>
                    )}
                    {terapist.reviewCount && (
                      <span className="text-gray-500 dark:text-gray-400">
                        ({terapist.reviewCount} değerlendirme)
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {terapist.location && (terapist.location.city || terapist.location.district) && (
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    {[terapist.location.district, terapist.location.city].filter(Boolean).join(", ")}
                  </div>
                )}
                {terapist.experience && (
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {terapist.experience} yıl deneyim
                  </div>
                )}
              </div>

              {terapist.specialties && terapist.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {terapist.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                {terapist.pricing && (
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {terapist.pricing.sessionPrice} {terapist.pricing.currency}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      seans ücreti
                    </p>
                  </div>
                )}
                <div className="mt-4 sm:mt-0">
                  <Link href={`/terapistler/${terapist._id}`}>
                    <Button>
                      Profili İncele
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 