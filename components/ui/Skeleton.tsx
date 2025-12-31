
import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`}></div>
);

export const CardSkeleton = () => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 space-y-4">
    <Skeleton className="h-3 w-20" />
    <div className="flex items-baseline gap-2">
      <Skeleton className="h-10 w-16" />
      <Skeleton className="h-3 w-12" />
    </div>
  </div>
);

export const ListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="p-10 flex items-center justify-between gap-8">
        <div className="flex items-center gap-10 w-full">
          <Skeleton className="w-16 h-16 rounded-2xl flex-shrink-0" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
        <Skeleton className="h-12 w-32 rounded-2xl hidden md:block" />
      </div>
    ))}
  </div>
);

export const AuditLogSkeleton = () => (
  <div className="space-y-8 pl-7 relative">
    <div className="absolute left-[13px] top-0 bottom-0 w-px bg-slate-100"></div>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="relative p-5 -ml-5 space-y-4">
        <div className="absolute left-[13px] top-8 w-2 h-2 rounded-full -translate-x-1/2 bg-slate-200"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    ))}
  </div>
);

export const TableSkeleton = () => (
  <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden">
    <div className="bg-slate-950 h-20 w-full"></div>
    <div className="divide-y divide-slate-50">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="px-12 py-10 flex items-center justify-between gap-8">
          <div className="flex items-center gap-8 flex-1">
            <Skeleton className="w-14 h-14 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex-1">
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20 rounded-xl" />
            <Skeleton className="h-10 w-20 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-12">
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div className="space-y-3">
        <Skeleton className="h-10 w-64" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <Skeleton className="h-14 w-48 rounded-2xl" />
    </header>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
    <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden h-96">
      <div className="h-20 bg-slate-50 border-b border-slate-100"></div>
      <ListSkeleton count={3} />
    </div>
  </div>
);
