"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CourseSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <Skeleton className="aspect-video w-full" />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-10" />
        </div>
        
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-4/5 mb-6" />
        
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-11/12 mb-8" />
        
        <div className="flex gap-2 mb-6">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </Card>
  );
}

interface CourseSkeletonGridProps {
  count: number;
}

export function CourseSkeletonGrid({ count = 6 }: CourseSkeletonGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count).fill(0).map((_, index) => (
        <div 
          key={index}
          className="rounded-lg border bg-card overflow-hidden animate-pulse"
        >
          <div className="aspect-video bg-muted"></div>
          <div className="p-4 space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-8 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="flex justify-between">
              <div className="h-6 bg-muted rounded w-1/4"></div>
              <div className="h-6 bg-muted rounded w-1/4"></div>
            </div>
            <div className="h-10 bg-muted rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
} 