export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 sm:p-10 animate-pulse">
          {/* Logo Skeleton */}
          <div className="flex justify-center mb-8">
            <div className="w-10 h-10 bg-slate-200 rounded-xl" />
          </div>

          {/* Title Skeleton */}
          <div className="mb-8">
            <div className="h-8 w-40 bg-slate-200 rounded mb-3" />
            <div className="h-4 w-56 bg-slate-100 rounded" />
          </div>

          {/* Form Fields Skeleton */}
          <div className="space-y-5">
            <div>
              <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
              <div className="h-12 w-full bg-slate-100 rounded-xl" />
            </div>
            <div>
              <div className="h-4 w-20 bg-slate-200 rounded mb-2" />
              <div className="h-12 w-full bg-slate-100 rounded-xl" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-200 rounded" />
                <div className="h-4 w-24 bg-slate-100 rounded" />
              </div>
              <div className="h-4 w-28 bg-slate-100 rounded" />
            </div>
            <div className="h-12 w-full bg-slate-200 rounded-xl" />
          </div>

          {/* Footer Skeleton */}
          <div className="mt-8">
            <div className="h-px bg-slate-200 mb-4" />
            <div className="h-12 w-full bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
