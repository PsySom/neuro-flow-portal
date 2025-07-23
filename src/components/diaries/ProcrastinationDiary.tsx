
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { ProcrastinationDiaryData } from './procrastination/types';
import Step1Initial from './procrastination/Step1Initial';
import Step2TaskDetails from './procrastination/Step2TaskDetails';
import Step3Impact from './procrastination/Step3Impact';
import Step4Solutions from './procrastination/Step4Solutions';

interface ProcrastinationDiaryProps {
  onComplete?: () => void;
}

const ProcrastinationDiary: React.FC<ProcrastinationDiaryProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const form = useForm<ProcrastinationDiaryData>({
    defaultValues: {
      hadProcrastination: undefined,
      tasks: []
    }
  });

  const handleNext = () => {
    if (currentStep === 1 && form.watch('hadProcrastination') === false) {
      return;
    }
    if (currentStep === 1 && form.watch('hadProcrastination') === true) {
      // Add first task when proceeding from step 1
      const tasks = form.watch('tasks');
      if (tasks.length === 0) {
        form.setValue('tasks', [{
          id: Date.now().toString(),
          description: '',
          sphere: '',
          sphereOther: '',
          reasons: [],
          reasonOther: '',
          emotions: [],
          emotionOther: '',
          thoughts: '',
          hasCategoricalThoughts: false,
          impactLevel: 0,
          missingResources: [],
          missingResourceOther: '',
          helpStrategies: [],
          helpStrategyOther: '',
          smallStep: '',
          willDoSmallStep: false
        }]);
      }
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: ProcrastinationDiaryData) => {
    console.log('Procrastination diary entry:', data);
    // Here you would save to your backend/local storage
    alert('Запись сохранена в дневник!');
    
    // Вызываем callback завершения
    setTimeout(() => {
      onComplete?.();
    }, 1000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Initial form={form} />;
      case 2:
        return <Step2TaskDetails form={form} />;
      case 3:
        return <Step3Impact form={form} />;
      case 4:
        return <Step4Solutions form={form} onSubmit={handleSubmit} />;
      default:
        return <Step1Initial form={form} />;
    }
  };

  const getStepTitle = () => {
    const titles = [
      'Фиксация факта',
      'Детализация и анализ',
      'Оценка влияния и ресурсов',
      'Самоподдержка и выводы'
    ];
    return titles[currentStep - 1];
  };

  if (currentStep === 1 && form.watch('hadProcrastination') === false) {
    return (
      <div className="w-full">
        <Card className="bg-card/50 backdrop-blur-sm border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-6 h-6 text-orange-600" />
              <span>Дневник прокрастинации и избегания</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Step1Initial form={form} />
            <div className="mt-6">
              <Button
                onClick={() => form.setValue('hadProcrastination', undefined)}
                variant="outline"
              >
                Начать заново
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card className="bg-card/50 backdrop-blur-sm border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-6 h-6 text-orange-600" />
              <span>Дневник прокрастинации и избегания</span>
            </div>
            <span className="text-sm text-gray-500">
              Шаг {currentStep} из {totalSteps}: {getStepTitle()}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
          
          {currentStep < 4 && (
            <div className="flex justify-between mt-8">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                variant="outline"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
              <Button 
                onClick={handleNext}
                disabled={currentStep === 1 && form.watch('hadProcrastination') === undefined}
              >
                Далее
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcrastinationDiary;
