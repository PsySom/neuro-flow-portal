
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { onboardingService } from '@/services/onboarding.service';
import { useToast } from '@/hooks/use-toast';
import type { 
  Gender, ActivityPreference, SleepQuality, EnergyLevel, 
  FatigueFrequency, StressImpact, ProcrastinationFrequency, 
  TaskApproach, AnxietyFrequency, RelationshipQuality, 
  LonelinessFrequency, DailyPracticeTime, ReminderFrequency, 
  RecommendationTime, DevelopmentApproach, DayStructure, 
  SupportStyle, FeedbackStyle 
} from '@/types/onboarding.types';
import RegistrationForm from './RegistrationForm';
import EmailVerification from './EmailVerification';
import WelcomeScreen from './WelcomeScreen';
import BasicInfo from './BasicInfo';
import NaturalRhythmsScreen from './NaturalRhythmsScreen';
import CurrentStateScreen from './CurrentStateScreen';
import ChallengesScreen from './ChallengesScreen';
import ProfessionalHelpScreen from './ProfessionalHelpScreen';
import ProcrastinationScreen from './ProcrastinationScreen';
import AnxietyScreen from './AnxietyScreen';
import SocialSupportScreen from './SocialSupportScreen';
import GoalsScreen from './GoalsScreen';
import PreferencesScreen from './PreferencesScreen';
import PersonalizationScreen from './PersonalizationScreen';
import ConfirmationScreen from './ConfirmationScreen';

export type OnboardingStep = 
  | 'registration'
  | 'email-verification'
  | 'welcome'
  | 'basic-info'
  | 'natural-rhythms'
  | 'current-state'
  | 'challenges'
  | 'professional-help'
  | 'procrastination'
  | 'anxiety'
  | 'social-support'
  | 'goals'
  | 'preferences'
  | 'personalization'
  | 'confirmation';

interface OnboardingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingDialog: React.FC<OnboardingDialogProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('registration');
  const [userData, setUserData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && currentStep === 'welcome') {
      // Запускаем процесс онбординга после регистрации
      onboardingService.startOnboarding().catch(console.error);
    }
  }, [isOpen, currentStep]);

  const handleStepComplete = async (stepData: any) => {
    const newUserData = { ...userData, ...stepData };
    setUserData(newUserData);
    setIsLoading(true);

    try {
      // Отправляем данные на бэкенд в зависимости от этапа
      await saveStepData(currentStep, stepData);
      
      toast({
        title: "Данные сохранены",
        description: "Переходим к следующему этапу",
      });
    } catch (error) {
      console.error('Ошибка сохранения данных:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить данные. Попробуйте еще раз.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Новый порядок шагов согласно обновленному техническому заданию
    const stepOrder: OnboardingStep[] = [
      'registration',      // 1. Регистрация
      'email-verification', // Подтверждение email
      'welcome',           // 2. Знакомство
      'basic-info',        // 3. Базовые данные
      'natural-rhythms',   // 4. Естественные ритмы
      'current-state',     // 5. Текущее состояние
      'challenges',        // 6. Основные вызовы и трудности
      'professional-help', // 7. Диагнозы и профессиональная помощь
      'procrastination',   // 8. Прокрастинация и мотивация
      'anxiety',          // 9. Тревожность и беспокойство
      'social-support',   // 10. Социальная поддержка и связи
      'goals',            // 11. Цели с PsyBalans
      'preferences',      // 12. Предпочтения в работе с приложением
      'personalization',  // 13. Персонализация поддержки
      'confirmation'      // 14. Подтверждение и запуск
    ];
    
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    } else {
      // Завершаем онбординг
      try {
        await onboardingService.completeOnboarding();
        toast({
          title: "Онбординг завершен!",
          description: "Добро пожаловать в PsyBalans!",
        });
      } catch (error) {
        console.error('Ошибка завершения онбординга:', error);
      }
      onClose();
    }
    setIsLoading(false);
  };

  const saveStepData = async (step: OnboardingStep, data: any) => {
    switch (step) {
      case 'basic-info':
        await onboardingService.saveIntroduction({
          name: data.name,
          age: data.age[0],
          gender: mapGender(data.gender),
          timezone: data.timezone
        });
        break;
      case 'natural-rhythms':
        await onboardingService.saveNaturalRhythms({
          activity_preference: mapActivityPreference(data.activeTime),
          wake_time: formatTime(data.wakeTime),
          sleep_time: formatTime(data.sleepTime),
          sleep_quality: mapSleepQuality(data.sleepQuality)
        });
        break;
      case 'current-state':
        await onboardingService.saveCurrentState({
          mood_score: data.mood + 5, // конвертируем из -5..5 в 1..10
          energy_level: mapEnergyLevel(data.energy),
          fatigue_frequency: mapFatigueFrequency(data.sleep),
          stress_impact: mapStressImpact(data.stress),
          coping_strategies: data.copingStrategies || []
        });
        break;
      case 'challenges':
        await onboardingService.saveMainChallenges({
          challenges: data.challenges || [],
          other_description: data.otherChallenge
        });
        break;
      case 'professional-help':
        await onboardingService.saveMedicalInfo({
          diagnosed_conditions: data.diagnoses || [],
          working_with_therapist: data.therapy || 'Нет',
          taking_medication: data.medication || false
        });
        break;
      case 'procrastination':
        await onboardingService.saveProcrastination({
          frequency: mapProcrastinationFrequency(data.procrastinationFrequency),
          barriers: data.barriers || [],
          task_approach: mapTaskApproach(data.approach)
        });
        break;
      case 'anxiety':
        await onboardingService.saveAnxiety({
          frequency: mapAnxietyFrequency(data.anxietyFrequency),
          triggers: data.triggers || [],
          manifestations: data.manifestations || [],
          coping_methods: data.copingMethods || []
        });
        break;
      case 'social-support':
        await onboardingService.saveSocialSupport({
          relationship_quality: mapRelationshipQuality(data.relationshipsQuality),
          loneliness_frequency: mapLonelinessFrequency(data.lonelinessFrequency),
          support_sources: data.supportSources || [],
          barriers_to_support: data.barriersToSupport || [],
          loneliness_situations: data.lonelinessSituations || []
        });
        break;
      case 'goals':
        await onboardingService.saveGoalsPriorities({
          selected_goals: data.goals || []
        });
        break;
      case 'preferences':
        await onboardingService.saveAppPreferences({
          daily_practice_time: mapDailyPracticeTime(data.timeCommitment),
          reminder_frequency: mapReminderFrequency(data.reminderFrequency),
          recommendation_time: mapRecommendationTime(data.recommendationTime),
          development_approach: mapDevelopmentApproach(data.developmentApproach),
          day_structure: mapDayStructure(data.structurePreference)
        });
        break;
      case 'personalization':
        await onboardingService.savePersonalization({
          support_style: mapSupportStyle(data.supportStyle),
          feedback_style: mapFeedbackStyle(data.feedbackStyle)
        });
        break;
    }
  };

  // Маппинг функции для преобразования данных формы в API формат
  const mapGender = (gender: string): Gender => {
    const mapping: Record<string, Gender> = {
      'male': 'male',
      'female': 'female', 
      'other': 'non_binary',
      'prefer-not-to-say': 'prefer_not_to_say'
    };
    return mapping[gender] || 'prefer_not_to_say';
  };

  const mapActivityPreference = (time: string): ActivityPreference => {
    const mapping: Record<string, ActivityPreference> = {
      'morning': 'morning',
      'day': 'afternoon',
      'evening': 'evening',
      'varies': 'varies'
    };
    return mapping[time] || 'varies';
  };

  const mapSleepQuality = (quality: string): SleepQuality => {
    const mapping: Record<string, SleepQuality> = {
      'poor': 'poor_interrupted',
      'light': 'light_tired',
      'normal': 'normal',
      'good': 'deep_restorative'
    };
    return mapping[quality] || 'normal';
  };

  const mapEnergyLevel = (level: string): EnergyLevel => {
    const mapping: Record<string, EnergyLevel> = {
      'very-low': 'very_low',
      'low': 'low',
      'medium': 'medium',
      'high': 'high',
      'very-high': 'very_high'
    };
    return mapping[level] || 'medium';
  };

  const mapFatigueFrequency = (sleep: string): FatigueFrequency => {
    const mapping: Record<string, FatigueFrequency> = {
      'poor': 'constantly',
      'fair': 'often_after_rest',
      'good': 'sometimes_eod',
      'excellent': 'almost_never'
    };
    return mapping[sleep] || 'sometimes_eod';
  };

  const mapStressImpact = (stress: string): StressImpact => {
    const mapping: Record<string, StressImpact> = {
      'low': 'minimal',
      'moderate': 'occasional',
      'high': 'frequent',
      'very-high': 'severe'
    };
    return mapping[stress] || 'occasional';
  };

  const mapProcrastinationFrequency = (freq: string): ProcrastinationFrequency => {
    const mapping: Record<string, ProcrastinationFrequency> = {
      'never': 'almost_never',
      'sometimes': 'sometimes',
      'often': 'often',
      'constantly': 'constantly'
    };
    return mapping[freq] || 'sometimes';
  };

  const mapTaskApproach = (approach: string): TaskApproach => {
    const mapping: Record<string, TaskApproach> = {
      'all-at-once': 'all_at_once',
      'small-steps': 'small_steps',
      'deadline-pressure': 'last_minute',
      'planned': 'planned'
    };
    return mapping[approach] || 'small_steps';
  };

  const mapAnxietyFrequency = (freq: string): AnxietyFrequency => {
    const mapping: Record<string, AnxietyFrequency> = {
      'never': 'almost_never',
      'sometimes': 'sometimes_stress',
      'often': 'often',
      'constantly': 'constantly'
    };
    return mapping[freq] || 'sometimes_stress';
  };

  const mapRelationshipQuality = (quality: string): RelationshipQuality => {
    const mapping: Record<string, RelationshipQuality> = {
      'strong': 'strong_supportive',
      'good': 'good_not_always',
      'superficial': 'superficial',
      'lonely': 'lonely_among_people'
    };
    return mapping[quality] || 'good_not_always';
  };

  const mapLonelinessFrequency = (freq: string): LonelinessFrequency => {
    const mapping: Record<string, LonelinessFrequency> = {
      'never': 'almost_never',
      'sometimes': 'sometimes',
      'often': 'often',
      'always': 'constantly'
    };
    return mapping[freq] || 'sometimes';
  };

  const mapDailyPracticeTime = (time: string): DailyPracticeTime => {
    const mapping: Record<string, DailyPracticeTime> = {
      '5-10': '5-10',
      '15-20': '15-20',
      '30-45': '30-45',
      '60+': '60+'
    };
    return mapping[time] || '15-20';
  };

  const mapReminderFrequency = (freq: string): ReminderFrequency => {
    const mapping: Record<string, ReminderFrequency> = {
      'twice-daily': 'twice_daily',
      'three-four-times': 'three_four_times',
      'on-request': 'on_request',
      'minimal': 'minimal'
    };
    return mapping[freq] || 'twice_daily';
  };

  const mapRecommendationTime = (time: string): RecommendationTime => {
    const mapping: Record<string, RecommendationTime> = {
      'morning': '06:00-10:00',
      'lunch': '12:00-14:00',
      'evening': '18:00-21:00',
      'night': '21:00-23:00'
    };
    return mapping[time] || '18:00-21:00';
  };

  const mapDevelopmentApproach = (approach: string): DevelopmentApproach => {
    const mapping: Record<string, DevelopmentApproach> = {
      'structured': 'structured',
      'semi-structured': 'semi_structured',
      'flexible': 'flexible',
      'free': 'free'
    };
    return mapping[approach] || 'flexible';
  };

  const mapDayStructure = (structure: string): DayStructure => {
    const mapping: Record<string, DayStructure> = {
      'detailed-schedule': 'detailed_schedule',
      'task-list': 'task_list',
      'flexible-goals': 'general_goals',
      'minimal-planning': 'minimal_planning'
    };
    return mapping[structure] || 'task_list';
  };

  const mapSupportStyle = (style: string): SupportStyle => {
    const mapping: Record<string, SupportStyle> = {
      'gentle': 'gentle',
      'friendly': 'friendly',
      'structured': 'structured',
      'inspiring': 'inspiring'
    };
    return mapping[style] || 'friendly';
  };

  const mapFeedbackStyle = (style: string): FeedbackStyle => {
    const mapping: Record<string, FeedbackStyle> = {
      'progress-focused': 'progress_focused',
      'honest': 'honest_assessment',
      'effort-focused': 'effort_encouragement',
      'practical': 'practical_advice'
    };
    return mapping[style] || 'progress_focused';
  };

  const formatTime = (hour: number) => {
    if (hour > 24) hour -= 24;
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const handleBack = () => {
    const stepOrder: OnboardingStep[] = [
      'registration',
      'email-verification',
      'welcome',
      'basic-info',
      'natural-rhythms',
      'current-state',
      'challenges',
      'professional-help',
      'procrastination',
      'anxiety',
      'social-support',
      'goals',
      'preferences',
      'personalization',
      'confirmation'
    ];
    
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const renderCurrentStep = () => {
    const props = {
      userData,
      onNext: handleStepComplete,
      onBack: handleBack,
      canGoBack: currentStep !== 'registration',
      isLoading
    };

    switch (currentStep) {
      case 'registration':
        return <RegistrationForm {...props} />;
      case 'email-verification':
        return <EmailVerification {...props} />;
      case 'welcome':
        return <WelcomeScreen {...props} />;
      case 'basic-info':
        return <BasicInfo {...props} />;
      case 'natural-rhythms':
        return <NaturalRhythmsScreen {...props} />;
      case 'current-state':
        return <CurrentStateScreen {...props} />;
      case 'challenges':
        return <ChallengesScreen {...props} />;
      case 'professional-help':
        return <ProfessionalHelpScreen {...props} />;
      case 'procrastination':
        return <ProcrastinationScreen {...props} />;
      case 'anxiety':
        return <AnxietyScreen {...props} />;
      case 'social-support':
        return <SocialSupportScreen {...props} />;
      case 'goals':
        return <GoalsScreen {...props} />;
      case 'preferences':
        return <PreferencesScreen {...props} />;
      case 'personalization':
        return <PersonalizationScreen {...props} />;
      case 'confirmation':
        return <ConfirmationScreen {...props} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {renderCurrentStep()}
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingDialog;
