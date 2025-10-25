import { apiClient, handleApiError } from './api.client';
import { mockOnboardingService } from './mock-onboarding.service';
import type { 
  OnboardingStageData, 
  OnboardingOptions,
  IntroductionData,
  NaturalRhythmsData,
  CurrentStateData,
  MainChallengesData,
  MedicalInfoData,
  ProcrastinationData,
  AnxietyData,
  SocialSupportData,
  GoalsPrioritiesData,
  AppPreferencesData,
  PersonalizationData
} from '@/types/onboarding.types';

// Switch to real backend API
const USE_MOCK = false;

class OnboardingService {
  private baseUrl = '/onboarding';

  // Управление процессом

  async getProgress() {
    if (USE_MOCK) return mockOnboardingService.getProgress();
    return apiClient.get(`${this.baseUrl}/progress`);
  }

  async getProfile() {
    if (USE_MOCK) return mockOnboardingService.getProfile();
    
    // Get onboarding data from profiles table
    const { onboardingSaveService } = await import('./onboarding-save.service');
    const onboardingData = await onboardingSaveService.getOnboardingData();
    
    if (!onboardingData) {
      return { data: null, success: false };
    }
    
    // Helper function to map energy level
    const mapEnergyLevel = (energy: string) => {
      const mapping: Record<string, string> = {
        'very-low': 'Очень низкий',
        'low': 'Низкий',
        'medium': 'Средний',
        'high': 'Высокий',
        'very-high': 'Очень высокий'
      };
      return mapping[energy] || energy;
    };
    
    // Helper function to map stress/anxiety level
    const mapStressLevel = (level: string) => {
      const mapping: Record<string, string> = {
        'none': 'Отсутствует',
        'low': 'Низкий',
        'medium': 'Умеренный',
        'high': 'Высокий',
        'very-high': 'Очень высокий'
      };
      return mapping[level] || level;
    };
    
    // Helper function to map sleep quality
    const mapSleepQuality = (quality: number) => {
      if (quality <= 3) return 'Плохое';
      if (quality <= 5) return 'Среднее';
      if (quality <= 7) return 'Хорошее';
      return 'Отличное';
    };
    
    // Transform OnboardingData to UserProfileData format
    return {
      data: {
        basicInfo: {
          name: onboardingData.name,
          age: onboardingData.age,
          timezone: onboardingData.timezone
        },
        naturalRhythms: {
          chronotype: onboardingData.chronotype,
          sleepTime: onboardingData.bedTime,
          wakeTime: onboardingData.wakeTime,
          sleepQuality: mapSleepQuality(onboardingData.sleepQuality)
        },
        currentState: {
          moodScore: onboardingData.mood,
          energyLevel: mapEnergyLevel(onboardingData.energy),
          stressImpact: mapStressLevel(onboardingData.stress)
        },
        challenges: onboardingData.challenges,
        goals: [onboardingData.primaryGoal],
        preferences: {
          dailyPracticeTime: onboardingData.timeCommitment,
          reminderFrequency: onboardingData.reminders
        }
      },
      success: true
    };
  }

  async getSummary() {
    if (USE_MOCK) return mockOnboardingService.getSummary();
    return apiClient.get(`${this.baseUrl}/summary`);
  }

  async exportData() {
    if (USE_MOCK) return mockOnboardingService.exportData();
    return apiClient.get(`${this.baseUrl}/export`);
  }


  // Отправка данных по этапам
  async saveIntroduction(data: IntroductionData) {
    if (USE_MOCK) return mockOnboardingService.saveIntroduction(data);
    return this.saveStageData('introduction', 100, data);
  }

  async saveNaturalRhythms(data: NaturalRhythmsData) {
    if (USE_MOCK) return mockOnboardingService.saveNaturalRhythms(data);
    return this.saveStageData('natural-rhythms', 100, data);
  }

  async saveCurrentState(data: CurrentStateData) {
    if (USE_MOCK) return mockOnboardingService.saveCurrentState(data);
    return this.saveStageData('current-state', 100, data);
  }

  async saveMainChallenges(data: MainChallengesData) {
    if (USE_MOCK) return mockOnboardingService.saveMainChallenges(data);
    return this.saveStageData('main-challenges', 100, data);
  }

  async saveMedicalInfo(data: MedicalInfoData) {
    if (USE_MOCK) return mockOnboardingService.saveMedicalInfo(data);
    return this.saveStageData('medical-info', 100, data);
  }

  async saveProcrastination(data: ProcrastinationData) {
    if (USE_MOCK) return mockOnboardingService.saveProcrastination(data);
    return this.saveStageData('procrastination', 100, data);
  }

  async saveAnxiety(data: AnxietyData) {
    if (USE_MOCK) return mockOnboardingService.saveAnxiety(data);
    return this.saveStageData('anxiety', 100, data);
  }

  async saveSocialSupport(data: SocialSupportData) {
    if (USE_MOCK) return mockOnboardingService.saveSocialSupport(data);
    return this.saveStageData('social-support', 100, data);
  }

  async saveGoalsPriorities(data: GoalsPrioritiesData) {
    if (USE_MOCK) return mockOnboardingService.saveGoalsPriorities(data);
    return this.saveStageData('goals-priorities', 100, data);
  }

  async saveAppPreferences(data: AppPreferencesData) {
    if (USE_MOCK) return mockOnboardingService.saveAppPreferences(data);
    return this.saveStageData('app-preferences', 100, data);
  }

  async savePersonalization(data: PersonalizationData) {
    if (USE_MOCK) return mockOnboardingService.savePersonalization(data);
    return this.saveStageData('personalization', 100, data);
  }

  async startOnboarding() {
    if (USE_MOCK) return { success: true };
    try {
      const response = await apiClient.post('/onboarding/start');
      console.log('✅ Onboarding started');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to start onboarding:', error);
      throw handleApiError(error);
    }
  }

  async completeOnboarding() {
    if (USE_MOCK) return { success: true };
    try {
      const response = await apiClient.post('/onboarding/complete');
      console.log('✅ Onboarding completed');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to complete onboarding:', error);
      throw handleApiError(error);
    }
  }

  private async saveStageData(stage: string, progress: number, data: any) {
    // Конвертируем данные под формат API
    const convertedData = this.convertDataForBackend(stage, data);
    
    return apiClient.post(`${this.baseUrl}/stage/${stage}`, {
      stage,
      progress,
      data: convertedData
    });
  }

  private convertDataForBackend(stage: string, data: any) {
    switch (stage) {
      case 'natural-rhythms':
        return {
          ...data,
          // Конвертируем sleep_quality из enum в int
          sleep_quality: this.mapSleepQualityToNumber(data.sleep_quality)
        };
      
      case 'current-state':
        return {
          ...data,
          // Убеждаемся что mood_score это число 1-10
          mood_score: typeof data.mood_score === 'number' ? data.mood_score : 5
        };
      
      case 'app-preferences':
        return {
          ...data,
          // Конвертируем daily_practice_time из строки в число минут
          daily_practice_time: this.mapPracticeTimeToMinutes(data.daily_practice_time)
        };
      
      default:
        return data;
    }
  }

  private mapSleepQualityToNumber(quality: string): number {
    const mapping: Record<string, number> = {
      'poor_interrupted': 1,
      'light_tired': 3,
      'normal': 5,
      'deep_restorative': 8
    };
    return mapping[quality] || 5;
  }

  private mapPracticeTimeToMinutes(timeRange: string): number {
    const mapping: Record<string, number> = {
      '5-10': 7,
      '15-20': 17,
      '30-45': 37,
      '60+': 60
    };
    return mapping[timeRange] || 17;
  }

  // Получение опций для форм
  async getGoals(): Promise<string[]> {
    if (USE_MOCK) return mockOnboardingService.getGoals();
    const response = await apiClient.get(`${this.baseUrl}/options/goals`);
    return response.data;
  }

  async getChallenges(): Promise<string[]> {
    if (USE_MOCK) return mockOnboardingService.getChallenges();
    const response = await apiClient.get(`${this.baseUrl}/options/challenges`);
    return response.data;
  }

  async getConditions(): Promise<string[]> {
    if (USE_MOCK) return mockOnboardingService.getConditions();
    const response = await apiClient.get(`${this.baseUrl}/options/conditions`);
    return response.data;
  }

  async getCopingStrategies(): Promise<string[]> {
    if (USE_MOCK) return mockOnboardingService.getCopingStrategies();
    const response = await apiClient.get(`${this.baseUrl}/options/coping-strategies`);
    return response.data;
  }

  async getProcrastinationBarriers(): Promise<string[]> {
    if (USE_MOCK) return mockOnboardingService.getProcrastinationBarriers();
    const response = await apiClient.get(`${this.baseUrl}/options/procrastination-barriers`);
    return response.data;
  }

  async getAnxietyTriggers(): Promise<string[]> {
    if (USE_MOCK) return mockOnboardingService.getAnxietyTriggers();
    const response = await apiClient.get(`${this.baseUrl}/options/anxiety-triggers`);
    return response.data;
  }

  async getAnxietyManifestations(): Promise<string[]> {
    if (USE_MOCK) return mockOnboardingService.getAnxietyManifestations();
    const response = await apiClient.get(`${this.baseUrl}/options/anxiety-manifestations`);
    return response.data;
  }

  async getSupportSources(): Promise<string[]> {
    if (USE_MOCK) return mockOnboardingService.getSupportSources();
    const response = await apiClient.get(`${this.baseUrl}/options/support-sources`);
    return response.data;
  }

  async getSupportBarriers(): Promise<string[]> {
    if (USE_MOCK) return mockOnboardingService.getSupportBarriers();
    const response = await apiClient.get(`${this.baseUrl}/options/support-barriers`);
    return response.data;
  }

  async getLonelinessSituations(): Promise<string[]> {
    if (USE_MOCK) return mockOnboardingService.getLonelinessSituations();
    const response = await apiClient.get(`${this.baseUrl}/options/loneliness-situations`);
    return response.data;
  }

  async getAllOptions(): Promise<OnboardingOptions> {
    if (USE_MOCK) return mockOnboardingService.getAllOptions();
    
    const [
      goals,
      challenges, 
      conditions,
      coping_strategies,
      procrastination_barriers,
      anxiety_triggers,
      anxiety_manifestations,
      support_sources,
      support_barriers,
      loneliness_situations
    ] = await Promise.all([
      this.getGoals(),
      this.getChallenges(),
      this.getConditions(),
      this.getCopingStrategies(),
      this.getProcrastinationBarriers(),
      this.getAnxietyTriggers(),
      this.getAnxietyManifestations(),
      this.getSupportSources(),
      this.getSupportBarriers(),
      this.getLonelinessSituations()
    ]);

    return {
      goals,
      challenges,
      conditions,
      coping_strategies,
      procrastination_barriers,
      anxiety_triggers,
      anxiety_manifestations,
      support_sources,
      support_barriers,
      loneliness_situations
    };
  }
}

export const onboardingService = new OnboardingService();