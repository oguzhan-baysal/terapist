export default function TerapistLoading() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profil Resmi */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            </div>

            <div className="flex-grow space-y-4">
              {/* İsim ve Puan */}
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
                </div>
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>

              {/* Konum ve Deneyim */}
              <div className="flex items-center space-x-4">
                <div className="h-4 w-32 bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
              </div>

              {/* Uzmanlık Alanları */}
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, j) => (
                  <div
                    key={j}
                    className="h-6 w-24 bg-gray-100 dark:bg-gray-600 rounded-full animate-pulse"
                  />
                ))}
              </div>

              {/* Fiyat ve Buton */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                  <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
                </div>
                <div className="mt-4 sm:mt-0">
                  <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 