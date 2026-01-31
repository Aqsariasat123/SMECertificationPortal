export default function SMELoading() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-64 bg-slate-100 rounded" />
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-xl" />
      </div>

      {/* Status Banner Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
          <div className="flex-1">
            <div className="h-5 w-40 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-64 bg-slate-100 rounded" />
          </div>
          <div className="h-10 w-36 bg-slate-200 rounded-xl hidden sm:block" />
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/60 p-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
              <div className="flex-1">
                <div className="h-5 w-32 bg-slate-200 rounded mb-2" />
                <div className="h-4 w-48 bg-slate-100 rounded mb-4" />
                <div className="h-2.5 w-full bg-slate-100 rounded-full mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-slate-200 rounded-full" />
                      <div className="h-3 w-28 bg-slate-100 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
