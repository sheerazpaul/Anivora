export function SkeletonCard() {
  return (
    <div className="flex-none w-44 md:w-52 animate-pulse">
      <div className="aspect-[2/3] rounded-2xl shimmer" />
      <div className="mt-3 space-y-2 px-0.5">
        <div className="h-3.5 rounded-full shimmer w-3/4" />
        <div className="h-3 rounded-full shimmer w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonHorizontal() {
  return (
    <div className="flex-none w-[340px] md:w-[420px] h-[200px] rounded-2xl shimmer" />
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-8 h-8 border-[3px] border-primary/15 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-[3px] border-primary/15 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Loading...</p>
      </div>
    </div>
  );
}
