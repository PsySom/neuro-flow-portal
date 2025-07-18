import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Moon, ArrowLeft, ArrowRight } from 'lucide-react';
import Step1Sleep from './sleep/Step1Sleep';
import Step2Quality from './sleep/Step2Quality';
import Step3Factors from './sleep/Step3Factors';
import Step4Rest from './sleep/Step4Rest';
import Step5Impact from './sleep/Step5Impact';
import { useSleepDiaryLogic } from './sleep/hooks/useSleepDiaryLogic';

const SleepDiary = () => {
  const {
    currentStep,
    form,
    needsFactorsStep,
    recommendations,
    getTotalSteps,
    getCurrentStepForProgress,
    getStepTitle,
    handleNext,
    handlePrev,
    onSubmit
  } = useSleepDiaryLogic();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Sleep form={form} />;
      case 2:
        return <Step2Quality form={form} />;
      case 3:
        return <Step3Factors form={form} showFactors={needsFactorsStep} />;
      case 4:
        return <Step4Rest form={form} />;
      case 5:
        return (
          <Step5Impact
            form={form}
            onSubmit={onSubmit}
            recommendations={recommendations}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-background/70 backdrop-blur-lg border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Moon className="w-6 h-6 text-primary" />
            <span>Дневник сна и отдыха</span>
          </CardTitle>
          
          {/* Progress bar */}
          <div className="w-full bg-muted/20 rounded-full h-2 mt-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(getCurrentStepForProgress / getTotalSteps) * 100}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Шаг {getCurrentStepForProgress} из {getTotalSteps}: {getStepTitle(currentStep)}
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              {renderCurrentStep()}
              
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
                
                {currentStep < 5 && (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Далее
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepDiary;