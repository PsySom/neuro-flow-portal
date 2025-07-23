
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Brain } from 'lucide-react';
import { ThoughtsDiaryData } from './thoughts/types';
import Step1Awareness from './thoughts/Step1Awareness';
import Step2Description from './thoughts/Step2Description';
import Step3Categorization from './thoughts/Step3Categorization';
import Step4Distortions from './thoughts/Step4Distortions';
import Step5Emotions from './thoughts/Step5Emotions';
import Step6Alternatives from './thoughts/Step6Alternatives';
import Step7Actions from './thoughts/Step7Actions';
import Step8Reflection from './thoughts/Step8Reflection';

interface ThoughtsDiaryProps {
  onComplete?: () => void;
}

const ThoughtsDiary: React.FC<ThoughtsDiaryProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;
  
  const form = useForm<ThoughtsDiaryData>({
    defaultValues: {
      hasDisturbingThought: undefined,
      thoughtText: '',
      trigger: '',
      triggerOther: '',
      categories: [],
      categoryOther: '',
      cognitiveDistortions: [],
      distortionOther: '',
      abcAnalysis: {
        activatingEvent: '',
        belief: '',
        consequence: ''
      },
      emotions: [],
      emotionOther: '',
      reactions: [],
      reactionOther: '',
      evidenceFor: '',
      evidenceAgainst: '',
      alternativeThought: '',
      selfCompassion: '',
      supportivePhrase: '',
      alternativeActions: [],
      actionOther: '',
      copingStrategies: [],
      copingOther: '',
      currentFeeling: '',
      selfCareAction: ''
    }
  });

  const handleNext = () => {
    if (currentStep === 1 && form.watch('hasDisturbingThought') === false) {
      return;
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

  const handleSubmit = (data: ThoughtsDiaryData) => {
    console.log('Thoughts diary entry:', data);
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
        return <Step1Awareness form={form} />;
      case 2:
        return <Step2Description form={form} />;
      case 3:
        return <Step3Categorization form={form} />;
      case 4:
        return <Step4Distortions form={form} />;
      case 5:
        return <Step5Emotions form={form} />;
      case 6:
        return <Step6Alternatives form={form} />;
      case 7:
        return <Step7Actions form={form} />;
      case 8:
        return <Step8Reflection form={form} onSubmit={handleSubmit} />;
      default:
        return <Step1Awareness form={form} />;
    }
  };

  const getStepTitle = () => {
    const titles = [
      'Осознанность',
      'Фиксация и описание',
      'Категоризация',
      'Когнитивные искажения',
      'Эмоции и реакция',
      'Альтернативы',
      'Альтернативные действия',
      'Рефлексия'
    ];
    return titles[currentStep - 1];
  };

  if (currentStep === 1 && form.watch('hasDisturbingThought') === false) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-indigo-600" />
              <span>Дневник работы с мыслями</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Step1Awareness form={form} />
            <div className="mt-6">
              <Button
                onClick={() => form.setValue('hasDisturbingThought', undefined)}
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
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-indigo-600" />
              <span>Дневник работы с мыслями</span>
            </div>
            <span className="text-sm text-gray-500">
              Шаг {currentStep} из {totalSteps}: {getStepTitle()}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
          
          {currentStep < 8 && (
            <div className="flex justify-between mt-8">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                variant="outline"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
              <Button onClick={handleNext}>
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

export default ThoughtsDiary;
