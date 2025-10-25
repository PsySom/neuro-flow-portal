import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const OnboardingSkeleton: React.FC = () => {
  return (
    <div className="onboarding-container">
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        {/* Progress skeleton */}
        <div className="flex justify-center items-center gap-2 mb-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="w-2.5 h-2.5 rounded-full" />
          ))}
        </div>

        {/* Main card skeleton */}
        <Card className="onboarding-card">
          <CardContent className="p-6 md:p-8 space-y-6">
            {/* Title */}
            <div className="space-y-3 text-center">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              
              <div className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-24 w-full" />
              </div>
              
              <div className="space-y-3">
                <Skeleton className="h-5 w-36" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-6 border-t">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>

        {/* Hint skeleton */}
        <div className="flex justify-center mt-4">
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </div>
  );
};

export default OnboardingSkeleton;
