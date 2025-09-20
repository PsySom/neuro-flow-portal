import { useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { SleepDiaryData } from '../types';

export const useSleepDiaryLogic = (onComplete?: () => void) => {
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

  // Проверяем, нужен ли шаг с факторами влияния
  const needsFactorsStep = useMemo(() => 
    sleepQuality <= -2 || sleepDuration < 6 || nightAwakenings >= 2,
    [sleepQuality, sleepDuration, nightAwakenings]
  );

  const stepTitles = useMemo(() => ({
    1: 'Время сна',
    2: 'Качество',
    3: 'Факторы',
    4: 'Отдых',
    5: 'Итоги'
  }), []);

  const getTotalSteps = useMemo(() => 
    needsFactorsStep ? 5 : 4,
    [needsFactorsStep]
  );

  const getCurrentStepForProgress = useMemo(() => {
    if (!needsFactorsStep && currentStep > 2) {
      return currentStep - 1;
    }
    return currentStep;
  }, [needsFactorsStep, currentStep]);

  const getStepTitle = useCallback((step: number) => 
    stepTitles[step as keyof typeof stepTitles],
    [stepTitles]
  );

  const generateRecommendations = useCallback((data: SleepDiaryData): string[] => {
    const recs: string[] = [];

    if (data.sleepDuration < 6) {
      recs.push('Постарайтесь увеличить продолжительность сна до 7-9 часов');
      recs.push('Рассмотрите возможность более раннего отхода ко сну');
    }

    if (data.sleepQuality <= -2) {
      recs.push('Создайте комфортные условия для сна: темнота, тишина, прохлада');
      recs.push('Избегайте экранов за час до сна');
    }

    if (data.nightAwakenings >= 2) {
      recs.push('При частых пробуждениях попробуйте техники расслабления');
      recs.push('Ведите дневник сна для выявления паттернов');
    }

    if (data.morningFeeling <= 5) {
      recs.push('Создайте мягкий утренний ритуал для плавного пробуждения');
      recs.push('Попробуйте естественное освещение утром');
    }

    if (data.hasDayRest && (data.dayRestEffectiveness || 0) < 5) {
      recs.push('Экспериментируйте с разными видами дневного отдыха');
      recs.push('Короткие прогулки или медитация могут быть эффективны');
    }

    if (data.overallSleepImpact <= -2) {
      recs.push('Рассмотрите техники для вечернего расслабления (дыхание 4-7-8)');
      recs.push('При серьёзных проблемах со сном обратитесь к специалисту');
    }

    if (data.sleepQuality >= 2 && data.sleepDuration >= 7 && data.morningFeeling >= 7) {
      recs.push('Отличная работа! Продолжайте поддерживать здоровый режим сна');
      recs.push('Ваши привычки сна положительно влияют на качество жизни');
    }

    return recs;
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep === 2 && !needsFactorsStep) {
      setCurrentStep(4);
    } else if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, needsFactorsStep]);

  const handlePrev = useCallback(() => {
    if (currentStep === 4 && !needsFactorsStep) {
      setCurrentStep(2);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, needsFactorsStep]);

  const onSubmit = useCallback(async (data: SleepDiaryData) => {
    const generatedRecommendations = generateRecommendations(data);
    setRecommendations(generatedRecommendations);
    
    try {
      console.log('💾 Сохраняем запись дневника сна:', data);
      
      // Импортируем сервис для сохранения
      const { backendDiaryService } = await import('@/services/backend-diary.service');
      
      // Конвертируем данные в формат SleepEntry
      const sleepEntry = {
        bedtime: data.bedtime,
        wake_up_time: data.wakeUpTime,
        sleep_duration: data.sleepDuration,
        sleep_quality: data.sleepQuality,
        night_awakenings: data.nightAwakenings,
        morning_feeling: data.morningFeeling,
        has_day_rest: data.hasDayRest,
        day_rest_type: data.dayRestType,
        day_rest_effectiveness: data.dayRestEffectiveness,
        overall_sleep_impact: data.overallSleepImpact,
        sleep_disruptors: data.sleepDisruptors,
        sleep_comment: data.sleepComment,
        rest_comment: data.restComment,
        timestamp: new Date().toISOString()
      };
      
      // Сохраняем через backend сервис
      const savedEntry = await backendDiaryService.createSleepEntry(sleepEntry, generatedRecommendations);
      console.log('✅ Запись дневника сна сохранена:', savedEntry);
      
      // Обновляем статус дневника в localStorage
      const today = new Date().toISOString().split('T')[0];
      const diaryStatus = JSON.parse(localStorage.getItem('diary-status-/sleep-diary') || '{}');
      const updatedStatus = { ...diaryStatus, lastEntryDate: today };
      localStorage.setItem('diary-status-/sleep-diary', JSON.stringify(updatedStatus));
      console.log('📅 Статус дневника сна обновлен:', updatedStatus);
      
      // Отправляем событие обновления для других компонентов
      window.dispatchEvent(new CustomEvent('diaryStatusUpdate', {
        detail: { path: '/sleep-diary', status: updatedStatus }
      }));
      
    } catch (error) {
      console.error('❌ Ошибка при сохранении записи дневника сна:', error);
      // В случае ошибки все равно показываем рекомендации
    }
    
    // Вызываем callback завершения через некоторое время
    setTimeout(() => {
      onComplete?.();
    }, 2000);
  }, [generateRecommendations, onComplete]);

  return {
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
  };
};