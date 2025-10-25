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
    <div className={cn("onboarding-progress", className)}>
      {/* Animated dots indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={cn(
              "progress-dot",
              step < currentStep && "completed",
              step === currentStep && "active"
            )}
          />
        ))}
      </div>
      
      {/* Step counter with fade animation */}
      <p className="text-sm text-muted-foreground font-medium animate-fade-in">
        Шаг {currentStep} из {totalSteps}
      </p>
    </div>
  );
};

export default OnboardingProgress;
