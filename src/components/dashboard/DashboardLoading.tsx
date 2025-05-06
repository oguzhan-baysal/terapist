export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-1">
      {/* Stats Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
              </div>
              <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="mt-2 h-4 w-32 bg-gray-100 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>

      {/* Table Loading */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 space-y-2">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-64 bg-gray-100 dark:bg-gray-700 rounded" />
        </div>
        <div className="overflow-x-auto">
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-8 w-32 bg-gray-100 dark:bg-gray-700 rounded" />
                <div className="h-8 w-24 bg-gray-100 dark:bg-gray-700 rounded" />
                <div className="h-8 w-24 bg-gray-100 dark:bg-gray-700 rounded" />
                <div className="h-8 w-20 bg-gray-100 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Loading */}
      <div className="space-y-4">
        <div className="px-1 space-y-2">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-48 bg-gray-100 dark:bg-gray-700 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-start space-x-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse"
            >
              <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 