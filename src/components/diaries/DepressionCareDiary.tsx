
import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Step1DailyCare from './depression-care/Step1DailyCare';
import Step2EmotionalState from './depression-care/Step2EmotionalState';
import Step3ThoughtsWork from './depression-care/Step3ThoughtsWork';
import Step4BasicNeeds from './depression-care/Step4BasicNeeds';
import Step5OvercomingAvoidance from './depression-care/Step5OvercomingAvoidance';
import Step6RecoveryPlanning from './depression-care/Step6RecoveryPlanning';
import Step7CrisisSupport from './depression-care/Step7CrisisSupport';
import Step8LongTermObservation from './depression-care/Step8LongTermObservation';
import { DepressionCareDiaryData, getInitialDepressionCareData } from './depression-care/types';

const DepressionCareDiary: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<DepressionCareDiaryData>(getInitialDepressionCareData());
  const { toast } = useToast();

  const totalSteps = 8;
  const progress = (currentStep / totalSteps) * 100;

  const handleDataChange = (field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    console.log('Depression Care Diary Data:', data);
    
    toast({
      title: "Дневник сохранен",
      description: "Ваша работа с заботливым выходом из депрессии сохранена. Каждый шаг важен!",
    });
    
    setData(getInitialDepressionCareData());
    setCurrentStep(1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1DailyCare
            data={data}
            onDataChange={handleDataChange}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <Step2EmotionalState
            data={data}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 3:
        return (
          <Step3ThoughtsWork
            data={data}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 4:
        return (
          <Step4BasicNeeds
            data={data}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 5:
        return (
          <Step5OvercomingAvoidance
            data={data}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 6:
        return (
          <Step6RecoveryPlanning
            data={data}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 7:
        return (
          <Step7CrisisSupport
            data={data}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 8:
        return (
          <Step8LongTermObservation
            data={data}
            onDataChange={handleDataChange}
            onComplete={handleComplete}
            onPrev={handlePrev}
          />
        );
      default:
        return null;
    }
  };

  const stepTitles = [
    "Ежедневная забота о себе",
    "Эмоциональное состояние",
    "Работа с мыслями",
    "Базовые потребности",
    "Преодоление избегания",
    "Планирование восстановления",
    "Кризисная поддержка",
    "Долгосрочное наблюдение"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.history.back()}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Дневник заботливого выхода из депрессии
              </h1>
              <p className="text-gray-600 mb-2">
                {stepTitles[currentStep - 1]} • Шаг {currentStep} из {totalSteps}
              </p>
              <p className="text-sm text-purple-600 italic">
                Этот дневник — твой личный спутник на пути к выздоровлению. 
                Здесь нет места самокритике, только понимание, поддержка и маленькие шаги к лучшему самочувствию.
              </p>
            </div>
          </div>
          
          <Progress value={progress} className="h-3" />
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-purple-100 border border-purple-200 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">
              💝 Важные напоминания
            </h3>
            <div className="text-sm text-purple-800 space-y-2">
              <p>• Нет правильных и неправильных ответов — только твоя правда</p>
              <p>• Прогресс не линейный — плохие дни не означают отсутствие прогресса</p>
              <p>• Маленькие шаги важнее больших скачков</p>
              <p>• Самосострадание важнее самокритики</p>
              <p>• Это процесс, а не результат — исцеление требует времени</p>
            </div>
          </div>
          
          <div className="mt-6 bg-pink-100 border border-pink-200 rounded-xl p-4 max-w-xl mx-auto">
            <p className="text-sm text-pink-800">
              🌈 <strong>Депрессия — это не навсегда.</strong> Каждый день, когда ты заполняешь этот дневник, 
              ты делаешь шаг к выздоровлению. Ты достоин/на любви, заботы и счастья.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepressionCareDiary;
