import { apiClient } from './api.client';
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

class OnboardingService {
  private baseUrl = '/api/v1/onboarding';

  // Управление процессом
  async startOnboarding() {
    return apiClient.post(`${this.baseUrl}/start`);
  }

  async getProgress() {
    return apiClient.get(`${this.baseUrl}/progress`);
  }

  async getProfile() {
    return apiClient.get(`${this.baseUrl}/profile`);
  }

  async getSummary() {
    return apiClient.get(`${this.baseUrl}/summary`);
  }

  async exportData() {
    return apiClient.get(`${this.baseUrl}/export`);
  }

  async completeOnboarding() {
    return apiClient.post(`${this.baseUrl}/complete`);
  }

  // Отправка данных по этапам
  async saveIntroduction(data: IntroductionData) {
    return this.saveStageData('introduction', 100, data);
  }

  async saveNaturalRhythms(data: NaturalRhythmsData) {
    return this.saveStageData('natural_rhythms', 100, data);
  }

  async saveCurrentState(data: CurrentStateData) {
    return this.saveStageData('current_state', 100, data);
  }

  async saveMainChallenges(data: MainChallengesData) {
    return this.saveStageData('main_challenges', 100, data);
  }

  async saveMedicalInfo(data: MedicalInfoData) {
    return this.saveStageData('medical_info', 100, data);
  }

  async saveProcrastination(data: ProcrastinationData) {
    return this.saveStageData('procrastination', 100, data);
  }

  async saveAnxiety(data: AnxietyData) {
    return this.saveStageData('anxiety', 100, data);
  }

  async saveSocialSupport(data: SocialSupportData) {
    return this.saveStageData('social_support', 100, data);
  }

  async saveGoalsPriorities(data: GoalsPrioritiesData) {
    return this.saveStageData('goals_priorities', 100, data);
  }

  async saveAppPreferences(data: AppPreferencesData) {
    return this.saveStageData('app_preferences', 100, data);
  }

  async savePersonalization(data: PersonalizationData) {
    return this.saveStageData('personalization', 100, data);
  }

  private async saveStageData(stage: string, progress: number, data: any) {
    const payload: OnboardingStageData = {
      stage,
      progress,
      data
    };
    return apiClient.post(`${this.baseUrl}/stage/${stage.replace('_', '-')}`, payload);
  }

  // Получение опций для форм
  async getGoals(): Promise<string[]> {
    const response = await apiClient.get(`${this.baseUrl}/options/goals`);
    return response.data;
  }

  async getChallenges(): Promise<string[]> {
    const response = await apiClient.get(`${this.baseUrl}/options/challenges`);
    return response.data;
  }

  async getConditions(): Promise<string[]> {
    const response = await apiClient.get(`${this.baseUrl}/options/conditions`);
    return response.data;
  }

  async getCopingStrategies(): Promise<string[]> {
    const response = await apiClient.get(`${this.baseUrl}/options/coping-strategies`);
    return response.data;
  }

  async getProcrastinationBarriers(): Promise<string[]> {
    const response = await apiClient.get(`${this.baseUrl}/options/procrastination-barriers`);
    return response.data;
  }

  async getAnxietyTriggers(): Promise<string[]> {
    const response = await apiClient.get(`${this.baseUrl}/options/anxiety-triggers`);
    return response.data;
  }

  async getAnxietyManifestations(): Promise<string[]> {
    const response = await apiClient.get(`${this.baseUrl}/options/anxiety-manifestations`);
    return response.data;
  }

  async getSupportSources(): Promise<string[]> {
    const response = await apiClient.get(`${this.baseUrl}/options/support-sources`);
    return response.data;
  }

  async getSupportBarriers(): Promise<string[]> {
    const response = await apiClient.get(`${this.baseUrl}/options/support-barriers`);
    return response.data;
  }

  async getLonelinessSituations(): Promise<string[]> {
    const response = await apiClient.get(`${this.baseUrl}/options/loneliness-situations`);
    return response.data;
  }

  async getAllOptions(): Promise<OnboardingOptions> {
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