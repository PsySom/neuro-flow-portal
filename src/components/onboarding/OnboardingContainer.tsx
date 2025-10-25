import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import OnboardingProgress from './OnboardingProgress';
import { useOnboardingState } from './hooks/useOnboardingState';
import { cn } from '@/lib/utils';
import Step1Welcome from './steps/Step1Welcome';
import Step2AboutYou from './steps/Step2AboutYou';
import Step3GoalsAndChallenges from './steps/Step3GoalsAndChallenges';
import Step4CurrentState from './steps/Step4CurrentState';
import Step5Sleep from './steps/Step5Sleep';
import Step6Rhythm from './steps/Step6Rhythm';
import Step7Complete from './steps/Step7Complete';

interface OnboardingContainerProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TOTAL_STEPS = 7;

const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  onComplete,
  onSkip
}) => {
  const { data, updateData, nextStep, prevStep, goToStep } = useOnboardingState();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = () => {
    if (data.step === TOTAL_STEPS) {
      onComplete();
      return;
    }
    
    setIsTransitioning(true);
    setTimeout(() => {
      nextStep();
      setIsTransitioning(false);
    }, 150);
  };

  const handleBack = () => {
    if (data.step === 1) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      prevStep();
      setIsTransitioning(false);
    }, 150);
  };

  const renderStep = () => {
    const stepProps = {
      data,
      updateData,
      onNext: handleNext
    };

    switch (data.step) {
      case 1:
        return <Step1Welcome {...stepProps} />;
      case 2:
        return <Step2AboutYou {...stepProps} />;
      case 3:
        return <Step3GoalsAndChallenges {...stepProps} />;
      case 4:
        return <Step4CurrentState {...stepProps} />;
      case 5:
        return <Step5Sleep {...stepProps} />;
      case 6:
        return <Step6Rhythm {...stepProps} />;
      case 7:
        return <Step7Complete {...stepProps} onComplete={onComplete} />;
      default:
        return <Step1Welcome {...stepProps} />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-2xl">
        {/* Header with Skip button */}
        <div className="flex justify-between items-center mb-6">
          <OnboardingProgress currentStep={data.step} totalSteps={TOTAL_STEPS} />
          
          {data.step < TOTAL_STEPS && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Пропустить
            </Button>
          )}
        </div>

        {/* Main content card */}
        <Card className="border-2 shadow-xl">
          <CardContent className="p-6 md:p-8">
            {/* Step content with transition */}
            <div
              className={cn(
                "transition-opacity duration-150",
                isTransitioning ? "opacity-0" : "opacity-100"
              )}
            >
              {renderStep()}
            </div>

            {/* Navigation buttons */}
            {data.step < TOTAL_STEPS && (
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={data.step === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Назад
                </Button>

                <Button
                  onClick={handleNext}
                  className="gap-2"
                >
                  Далее
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress hint */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Займет всего 2-3 минуты
        </p>
      </div>
    </div>
  );
};

export default OnboardingContainer;
