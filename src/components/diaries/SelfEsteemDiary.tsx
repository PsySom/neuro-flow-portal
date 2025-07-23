
import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Step1BasicAssessment from './self-esteem/Step1BasicAssessment';
import Step2CriticalThoughts from './self-esteem/Step2CriticalThoughts';
import Step3Reframing from './self-esteem/Step3Reframing';
import Step4Compassion from './self-esteem/Step4Compassion';
import Step5Support from './self-esteem/Step5Support';
import { SelfEsteemDiaryData, getInitialSelfEsteemData } from './self-esteem/types';

interface SelfEsteemDiaryProps {
  onComplete?: () => void;
}

const SelfEsteemDiary: React.FC<SelfEsteemDiaryProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<SelfEsteemDiaryData>(getInitialSelfEsteemData());
  const { toast } = useToast();

  const totalSteps = 5;
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
    // Сохранение данных дневника
    console.log('Self-Esteem Diary Data:', data);
    
    toast({
      title: "Дневник сохранен",
      description: "Ваша работа с самооценкой записана. Вы сделали важный шаг к лучшему пониманию себя!",
    });
    
    // Сброс данных для нового дневника
    setData(getInitialSelfEsteemData());
    setCurrentStep(1);
    
    // Вызываем callback завершения
    onComplete?.();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicAssessment
            data={data}
            onDataChange={handleDataChange}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <Step2CriticalThoughts
            data={data}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 3:
        return (
          <Step3Reframing
            data={data}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 4:
        return (
          <Step4Compassion
            data={data}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 5:
        return (
          <Step5Support
            data={data}
            onDataChange={handleDataChange}
            onComplete={handleComplete}
            onPrev={handlePrev}
          />
        );
      default:
        return (
          <Step1BasicAssessment
            data={data}
            onDataChange={handleDataChange}
            onNext={handleNext}
          />
        );
    }
  };

  const getStepTitle = () => {
    const titles = [
      'Базовая самооценка дня',
      'Критикующие мысли',
      'Переосмысление и поддержка',
      'Принятие и самосострадание',
      'Самоподдержка и выводы'
    ];
    return titles[currentStep - 1];
  };

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Дневник работы с самооценкой
            </h2>
            <span className="text-sm text-muted-foreground">
              Шаг {currentStep} из {totalSteps}: {getStepTitle()}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Дневник самооценки поможет вам развить самосострадание и более здоровое отношение к себе. 
            Помните: вы достойны доброты, особенно от самого себя.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelfEsteemDiary;
