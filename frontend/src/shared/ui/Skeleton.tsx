import { cn } from '../lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: Readonly<SkeletonProps>) {
  return (
    <div className={cn('bg-white/5 rounded-xl animate-pulse', className)} />
  );
}

export function EventCardSkeleton() {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
      <Skeleton className="h-64 rounded-none" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <div className="pt-6 border-t border-white/5">
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
      <Skeleton className="h-64 rounded-none" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/4" />
        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
