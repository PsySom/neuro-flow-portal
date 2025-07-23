
import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Step1Awareness from './ocd/Step1Awareness';
import Step2Compulsions from './ocd/Step2Compulsions';
import { OCDDiaryData, getInitialOCDData } from './ocd/types';

interface OCDDiaryProps {
  onComplete?: () => void;
}

const OCDDiary: React.FC<OCDDiaryProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OCDDiaryData>(getInitialOCDData());
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
    // Сохранение данных дневника
    console.log('OCD Diary Data:', data);
    
    toast({
      title: "Дневник сохранен",
      description: "Ваши записи успешно сохранены. Продолжайте работу над собой!",
    });
    
    // Сброс данных для нового дневника
    setData(getInitialOCDData());
    setCurrentStep(1);
    
    // Вызываем callback завершения
    onComplete?.();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Awareness
            data={data}
            onDataChange={handleDataChange}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <Step2Compulsions
            data={data}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Остальные шаги в разработке...</p>
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              <Check className="w-4 h-4 mr-2" />
              Завершить дневник
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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
              <h1 className="text-2xl font-bold text-gray-900">
                Дневник работы с ОКР
              </h1>
              <p className="text-gray-600 mt-1">
                Шаг {currentStep} из {totalSteps}
              </p>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Любое заполнение дневника — вклад в ваш путь к свободе от ОКР. 
            Даже если кажется, что прогресса нет, вы учитесь замечать себя и заботиться о себе!
          </p>
        </div>
      </div>
    </div>
  );
};

export default OCDDiary;
