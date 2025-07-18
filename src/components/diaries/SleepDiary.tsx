import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Moon, ArrowLeft, ArrowRight } from 'lucide-react';
import { SleepDiaryData } from './sleep/types';
import Step1Sleep from './sleep/Step1Sleep';
import Step2Quality from './sleep/Step2Quality';
import Step3Factors from './sleep/Step3Factors';
import Step4Rest from './sleep/Step4Rest';
import Step5Impact from './sleep/Step5Impact';

const SleepDiary = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const form = useForm<SleepDiaryData>({
    defaultValues: {
      bedtime: '',
      wakeUpTime: '',
      sleepDuration: 0,
      sleepQuality: 0,
      nightAwakenings: 0,
      morningFeeling: 5,
      hasDayRest: false,
      dayRestType: '',
      dayRestEffectiveness: 5,
      overallSleepImpact: 0,
      sleepDisruptors: [],
      sleepComment: '',
      restComment: ''
    }
  });

  const sleepQuality = form.watch('sleepQuality');
  const sleepDuration = form.watch('sleepDuration');
  const nightAwakenings = form.watch('nightAwakenings');
  const morningFeeling = form.watch('morningFeeling');
  const overallSleepImpact = form.watch('overallSleepImpact');

  // Определяем, нужен ли шаг с факторами влияния
  const needsFactorsStep = sleepQuality <= -2 || sleepDuration < 6 || nightAwakenings >= 2;

  const generateRecommendations = (data: SleepDiaryData): string[] => {
    const recs: string[] = [];

    // Рекомендации по продолжительности сна
    if (data.sleepDuration < 6) {
      recs.push('Постарайтесь увеличить продолжительность сна до 7-9 часов');
      recs.push('Рассмотрите возможность более раннего отхода ко сну');
    }

    // Рекомендации по качеству сна
    if (data.sleepQuality <= -2) {
      recs.push('Создайте комфортные условия для сна: темнота, тишина, прохлада');
      recs.push('Избегайте экранов за час до сна');
    }

    // Рекомендации по ночным пробуждениям
    if (data.nightAwakenings >= 2) {
      recs.push('При частых пробуждениях попробуйте техники расслабления');
      recs.push('Ведите дневник сна для выявления паттернов');
    }

    // Рекомендации по утреннему самочувствию
    if (data.morningFeeling <= 5) {
      recs.push('Создайте мягкий утренний ритуал для плавного пробуждения');
      recs.push('Попробуйте естественное освещение утром');
    }

    // Рекомендации по дневному отдыху
    if (data.hasDayRest && (data.dayRestEffectiveness || 0) < 5) {
      recs.push('Экспериментируйте с разными видами дневного отдыха');
      recs.push('Короткие прогулки или медитация могут быть эффективны');
    }

    // Рекомендации по общему влиянию
    if (data.overallSleepImpact <= -2) {
      recs.push('Рассмотрите техники для вечернего расслабления (дыхание 4-7-8)');
      recs.push('При серьёзных проблемах со сном обратитесь к специалисту');
    }

    // Позитивные рекомендации
    if (data.sleepQuality >= 2 && data.sleepDuration >= 7 && data.morningFeeling >= 7) {
      recs.push('Отличная работа! Продолжайте поддерживать здоровый режим сна');
      recs.push('Ваши привычки сна положительно влияют на качество жизни');
    }

    return recs;
  };

  const handleNext = () => {
    // Пропускаем шаг с факторами, если он не нужен
    if (currentStep === 2 && !needsFactorsStep) {
      setCurrentStep(4);
    } else if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    // Обрабатываем возврат с учётом пропущенного шага
    if (currentStep === 4 && !needsFactorsStep) {
      setCurrentStep(2);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: SleepDiaryData) => {
    const generatedRecommendations = generateRecommendations(data);
    setRecommendations(generatedRecommendations);
    
    console.log('Sleep diary entry saved:', data);
    // Здесь будет сохранение в базу данных
  };

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

  const getStepTitle = (step: number) => {
    const titles = {
      1: 'Время сна',
      2: 'Качество',
      3: 'Факторы',
      4: 'Отдых',
      5: 'Итоги'
    };
    return titles[step as keyof typeof titles];
  };

  const getTotalSteps = () => {
    return needsFactorsStep ? 5 : 4;
  };

  const getCurrentStepForProgress = () => {
    if (!needsFactorsStep && currentStep > 2) {
      return currentStep - 1;
    }
    return currentStep;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Moon className="w-6 h-6 text-indigo-500" />
            <span>Дневник сна и отдыха</span>
          </CardTitle>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(getCurrentStepForProgress() / getTotalSteps()) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Шаг {getCurrentStepForProgress()} из {getTotalSteps()}: {getStepTitle(currentStep)}
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
                    className="bg-indigo-500 hover:bg-indigo-600"
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