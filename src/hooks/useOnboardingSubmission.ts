import { useState } from 'react';
import { onboardingService } from '@/services/onboarding.service';
import { useToast } from '@/hooks/use-toast';
import type { OnboardingStep } from '@/components/onboarding/OnboardingDialog';
import {
  mapGender,
  mapActivityPreference,
  mapSleepQuality,
  mapEnergyLevel,
  mapFatigueFrequency,
  mapStressImpact,
  mapProcrastinationFrequency,
  mapTaskApproach,
  mapAnxietyFrequency,
  mapRelationshipQuality,
  mapLonelinessFrequency,
  mapDailyPracticeTime,
  mapReminderFrequency,
  mapRecommendationTime,
  mapDevelopmentApproach,
  mapDayStructure,
  mapSupportStyle,
  mapFeedbackStyle,
  formatTime
} from '@/utils/onboardingDataMapper';

export const useOnboardingSubmission = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveStepData = async (step: OnboardingStep, data: any) => {
    console.log(`Saving onboarding step: ${step}`, data);
    
    switch (step) {
      case 'registration':
      case 'email-verification':
      case 'welcome':
        // Эти этапы не отправляем на бэкенд, только UI навигация
        console.log(`Skipping backend submission for step: ${step}`);
        return;
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
      case 'confirmation':
        // Финальный этап, данные уже сохранены
        console.log(`Skipping backend submission for final step: ${step}`);
        return;
    }
  };

  const submitStepData = async (step: OnboardingStep, stepData: any) => {
    setIsLoading(true);
    
    try {
      await saveStepData(step, stepData);
      
      console.log(`✅ Onboarding step ${step} saved successfully`);
      
      toast({
        title: "Данные сохранены",
        description: "Переходим к следующему этапу",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('❌ Ошибка сохранения данных:', error);
      console.error('Error details:', error.response?.data);
      
      const errorMessage = error.response?.data?.detail || error.message || "Не удалось сохранить данные";
      
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await onboardingService.completeOnboarding();
      console.log('✅ Onboarding completed successfully');
      
      toast({
        title: "Онбординг завершен!",
        description: "Добро пожаловать в PsyBalans!",
      });
      return { success: true };
    } catch (error: any) {
      console.error('❌ Ошибка завершения онбординга:', error);
      console.error('Error details:', error.response?.data);
      
      const errorMessage = error.response?.data?.detail || error.message || "Не удалось завершить онбординг";
      
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false };
    }
  };

  return {
    isLoading,
    submitStepData,
    completeOnboarding
  };
};