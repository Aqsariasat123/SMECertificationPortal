export default function UserLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-8 w-40 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-56 bg-slate-100 rounded" />
        </div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 h-12 bg-slate-100 rounded-xl" />
          <div className="flex gap-3">
            <div className="h-12 w-32 bg-slate-100 rounded-xl" />
            <div className="h-12 w-32 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>

      {/* SME Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-slate-200 rounded-xl" />
              <div className="flex-1">
                <div className="h-5 w-36 bg-slate-200 rounded mb-2" />
                <div className="h-4 w-24 bg-slate-100 rounded mb-3" />
                <div className="h-3 w-full bg-slate-100 rounded mb-2" />
                <div className="h-3 w-3/4 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-4 w-20 bg-slate-100 rounded" />
                <div className="h-6 w-16 bg-slate-200 rounded-full" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-24 bg-slate-100 rounded-lg" />
                <div className="h-9 w-32 bg-slate-200 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
