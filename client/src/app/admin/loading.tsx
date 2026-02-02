export default function AdminLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/60 border-l-4 border-l-slate-200 p-3 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 sm:w-12 sm:h-12 bg-slate-200 rounded-lg sm:rounded-xl" />
              <div className="w-16 h-6 bg-slate-200 rounded-full hidden sm:block" />
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="h-8 w-20 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-24 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100">
            <div className="h-6 w-40 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-32 bg-slate-100 rounded" />
          </div>
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
                  <div className="h-3 w-24 bg-slate-100 rounded" />
                </div>
                <div className="w-20 h-6 bg-slate-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100">
            <div className="h-6 w-32 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-28 bg-slate-100 rounded" />
          </div>
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg">
                <div className="w-8 h-8 bg-slate-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-3 w-full bg-slate-200 rounded mb-2" />
                  <div className="h-3 w-16 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
