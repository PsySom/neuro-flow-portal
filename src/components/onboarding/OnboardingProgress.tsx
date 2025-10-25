import React from 'react';
import { cn } from '@/lib/utils';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Dots indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              step <= currentStep
                ? "bg-primary scale-110"
                : "bg-muted"
            )}
          />
        ))}
      </div>
      
      {/* Step counter */}
      <p className="text-sm text-muted-foreground font-medium">
        {currentStep}/{totalSteps}
      </p>
    </div>
  );
};

export default OnboardingProgress;
