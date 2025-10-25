import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Loader2, WifiOff, AlertCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import OnboardingProgress from './OnboardingProgress';
import MotivationalMessage from './MotivationalMessage';
import OnboardingSkeleton from './OnboardingSkeleton';
import { useOnboardingState } from './hooks/useOnboardingState';
import { cn } from '@/lib/utils';
import Step1Welcome from './steps/Step1Welcome';
import Step2AboutYou from './steps/Step2AboutYou';
import Step3GoalsAndChallenges from './steps/Step3GoalsAndChallenges';
import Step4CurrentState from './steps/Step4CurrentState';
import Step5Sleep from './steps/Step5Sleep';
import Step6Rhythm from './steps/Step6Rhythm';
import Step7Complete from './steps/Step7Complete';
import { toast } from '@/hooks/use-toast';
import { onboardingAnalytics, isOnline, retryWithBackoff } from '@/utils/onboardingAnalytics';

interface OnboardingContainerProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TOTAL_STEPS = 7;

const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  onComplete,
  onSkip
}) => {
  const { 
    data, 
    updateData, 
    nextStep, 
    prevStep, 
    isStepValid,
    saveToSupabase,
    skipOnboarding 
  } = useOnboardingState();
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [offline, setOffline] = useState(!isOnline());
  const [retryCount, setRetryCount] = useState(0);

  // Track initial load
  useEffect(() => {
    onboardingAnalytics.trackStepView(1);
  }, []);

  // Track step changes
  useEffect(() => {
    if (data.step > 1) {
      onboardingAnalytics.trackStepView(data.step, data);
    }
  }, [data.step]);

  // Track drop-off on unmount
  useEffect(() => {
    return () => {
      if (data.step < TOTAL_STEPS) {
        onboardingAnalytics.trackDropOff(data.step);
      }
    };
  }, [data.step]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setOffline(false);
      toast({
        title: 'Соединение восстановлено',
        description: 'Вы снова онлайн',
      });
    };

    const handleOffline = () => {
      setOffline(true);
      toast({
        title: 'Нет соединения',
        description: 'Проверьте подключение к интернету',
        variant: 'destructive',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Enter to proceed (except when in textarea)
      if (e.key === 'Enter' && !e.shiftKey && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        if (data.step < TOTAL_STEPS && isStepValid()) {
          e.preventDefault();
          handleNext();
        }
      }
      
      // Escape to show skip dialog
      if (e.key === 'Escape' && data.step < TOTAL_STEPS) {
        e.preventDefault();
        setShowSkipDialog(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [data.step, isStepValid]);

  const handleNext = useCallback(() => {
    if (data.step === TOTAL_STEPS) {
      handleCompleteOnboarding();
      return;
    }

    // Validate current step before moving
    if (!isStepValid()) {
      const validationError = `Step ${data.step} validation failed`;
      onboardingAnalytics.trackValidationError(data.step, 'form', validationError);
      
      toast({
        title: 'Заполните все поля',
        description: 'Пожалуйста, заполните обязательные поля перед продолжением',
        variant: 'destructive',
      });
      return;
    }

    // Track completion of current step
    onboardingAnalytics.trackStepComplete(data.step, data);
    onboardingAnalytics.trackNavigation(data.step, data.step + 1, 'next');
    
    setIsTransitioning(true);
    setTimeout(() => {
      nextStep();
      setIsTransitioning(false);
    }, 150);
  }, [data, isStepValid, nextStep]);

  const handleBack = useCallback(() => {
    if (data.step === 1) return;

    onboardingAnalytics.trackNavigation(data.step, data.step - 1, 'back');
    
    setIsTransitioning(true);
    setTimeout(() => {
      prevStep();
      setIsTransitioning(false);
    }, 150);
  }, [data.step, prevStep]);

  const handleSkip = async () => {
    setShowSkipDialog(false);
    setIsSaving(true);

    onboardingAnalytics.trackSkip(data.step, 'user_initiated');
    
    try {
      const result = await retryWithBackoff(
        async () => await skipOnboarding(),
        3,
        1000
      );
      
      if (result.success) {
        toast({
          title: 'Онбординг пропущен',
          description: 'Вы сможете заполнить профиль позже',
        });
        onSkip();
      } else {
        throw new Error(result.error || 'Failed to skip onboarding');
      }
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      onboardingAnalytics.trackError(data.step, 'skip_failed', error);
      
      toast({
        title: 'Ошибка',
        description: 'Не удалось пропустить онбординг. Попробуйте ещё раз.',
        variant: 'destructive',
      });
      
      setRetryCount(prev => prev + 1);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    setIsSaving(true);
    
    try {
      const result = await retryWithBackoff(
        async () => {
          onboardingAnalytics.trackRetry(data.step, retryCount + 1);
          return await saveToSupabase();
        },
        3,
        1000
      );
      
      if (result.success) {
        const metrics = onboardingAnalytics.getCompletionMetrics();
        onboardingAnalytics.trackCompletion(metrics.totalTimeSeconds, data);
        
        toast({
          title: 'Профиль успешно создан!',
          description: 'Добро пожаловать в Mental Balance',
        });
        onComplete();
      } else {
        throw new Error(result.error || 'Failed to complete onboarding');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      onboardingAnalytics.trackError(data.step, 'completion_failed', error);
      
      toast({
        title: 'Ошибка сохранения',
        description: 'Попробуйте ещё раз',
        variant: 'destructive',
      });
      
      setRetryCount(prev => prev + 1);
    } finally {
      setIsSaving(false);
    }
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
        return <Step7Complete {...stepProps} onComplete={handleCompleteOnboarding} />;
      default:
        return <Step1Welcome {...stepProps} />;
    }
  };

  return (
    <div className="onboarding-container" role="main" aria-label="Онбординг">
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        {/* Offline Alert */}
        {offline && (
          <Alert variant="destructive" className="mb-4 animate-fade-in">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>Нет соединения</AlertTitle>
            <AlertDescription>
              Проверьте подключение к интернету. Изменения сохранятся локально.
            </AlertDescription>
          </Alert>
        )}

        {/* Motivational Message */}
        {data.step > 1 && data.step < TOTAL_STEPS && (
          <MotivationalMessage 
            step={data.step} 
            totalSteps={TOTAL_STEPS} 
            className="mb-6" 
          />
        )}

        {/* Header with Skip button */}
        <div className="flex justify-between items-center mb-6">
          <OnboardingProgress 
            currentStep={data.step} 
            totalSteps={TOTAL_STEPS}
            aria-label={`Шаг ${data.step} из ${TOTAL_STEPS}`}
          />
          
          {data.step < TOTAL_STEPS && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSkipDialog(true)}
              disabled={isSaving}
              className="text-muted-foreground hover:text-foreground transition-all"
              aria-label="Пропустить онбординг"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" aria-hidden="true" />
                  Сохранение...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-1" aria-hidden="true" />
                  Пропустить
                </>
              )}
            </Button>
          )}
        </div>

        {/* Main content card */}
        <Card className="onboarding-card">
          <CardContent className="p-6 md:p-8">
            {/* Step content with transition */}
            <div
              className={cn(
                "onboarding-step",
                isTransitioning && "opacity-0"
              )}
              role="region"
              aria-live="polite"
              aria-busy={isTransitioning}
            >
              {renderStep()}
            </div>

            {/* Navigation buttons */}
            {data.step < TOTAL_STEPS && (
              <div 
                className="flex justify-between items-center mt-8 pt-6 border-t"
                role="navigation"
                aria-label="Навигация по онбордингу"
              >
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={data.step === 1 || isSaving}
                  className="onboarding-button gap-2"
                  aria-label="Назад к предыдущему шагу"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  Назад
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={isSaving || !isStepValid()}
                  className="onboarding-button gap-2"
                  aria-label="Перейти к следующему шагу"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      Далее
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress hint */}
        {data.step < TOTAL_STEPS && (
          <p className="text-center text-sm text-muted-foreground mt-4 animate-fade-in">
            Займет всего 2-3 минуты • Используйте Enter для продолжения
          </p>
        )}

        {/* Retry hint */}
        {retryCount > 0 && (
          <Alert className="mt-4 animate-fade-in">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Проблемы с подключением</AlertTitle>
            <AlertDescription>
              Попыток повтора: {retryCount}. Проверьте интернет-соединение.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Skip Confirmation Dialog */}
      <AlertDialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Пропустить онбординг?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы сможете заполнить профиль позже в настройках. Но персонализированные рекомендации станут доступны только после завершения.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Продолжить</AlertDialogCancel>
            <AlertDialogAction onClick={handleSkip} disabled={isSaving}>
              {isSaving ? 'Сохранение...' : 'Пропустить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OnboardingContainer;
