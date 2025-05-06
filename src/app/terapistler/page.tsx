import { Suspense } from "react";
import TerapistList from "@/components/terapist/TerapistList";
import TerapistFilters from "@/components/terapist/TerapistFilters";
import TerapistLoading from "@/components/terapist/TerapistLoading";

export const metadata = {
  title: "Terapist Bul | Terapist Rehberi",
  description: "Size en uygun terapisti bulun. Uzman terapistler arasından seçim yapın.",
};

export default async function TerapistlerPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Terapist Bul
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Alanında uzman terapistler arasından size en uygun olanı seçin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <TerapistFilters />
          </aside>

          <div className="lg:col-span-3">
            <Suspense fallback={<TerapistLoading />}>
              <TerapistList />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
} 