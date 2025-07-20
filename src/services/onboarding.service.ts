import { apiClient } from './api.client';
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

// Switch to mock service when backend is not available
const USE_MOCK = true;

class OnboardingService {
  private baseUrl = '/onboarding';

  // Управление процессом
  async startOnboarding() {
    if (USE_MOCK) return mockOnboardingService.startOnboarding();
    return apiClient.post(`${this.baseUrl}/start`);
  }

  async getProgress() {
    if (USE_MOCK) return mockOnboardingService.getProgress();
    return apiClient.get(`${this.baseUrl}/progress`);
  }

  async getProfile() {
    if (USE_MOCK) return mockOnboardingService.getProfile();
    return apiClient.get(`${this.baseUrl}/profile`);
  }

  async getSummary() {
    if (USE_MOCK) return mockOnboardingService.getSummary();
    return apiClient.get(`${this.baseUrl}/summary`);
  }

  async exportData() {
    if (USE_MOCK) return mockOnboardingService.exportData();
    return apiClient.get(`${this.baseUrl}/export`);
  }

  async completeOnboarding() {
    if (USE_MOCK) return mockOnboardingService.completeOnboarding();
    return apiClient.post(`${this.baseUrl}/complete`);
  }

  // Отправка данных по этапам
  async saveIntroduction(data: IntroductionData) {
    if (USE_MOCK) return mockOnboardingService.saveIntroduction(data);
    return this.saveStageData('introduction', 100, data);
  }

  async saveNaturalRhythms(data: NaturalRhythmsData) {
    if (USE_MOCK) return mockOnboardingService.saveNaturalRhythms(data);
    return this.saveStageData('natural_rhythms', 100, data);
  }

  async saveCurrentState(data: CurrentStateData) {
    if (USE_MOCK) return mockOnboardingService.saveCurrentState(data);
    return this.saveStageData('current_state', 100, data);
  }

  async saveMainChallenges(data: MainChallengesData) {
    if (USE_MOCK) return mockOnboardingService.saveMainChallenges(data);
    return this.saveStageData('main_challenges', 100, data);
  }

  async saveMedicalInfo(data: MedicalInfoData) {
    if (USE_MOCK) return mockOnboardingService.saveMedicalInfo(data);
    return this.saveStageData('medical_info', 100, data);
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
    return this.saveStageData('social_support', 100, data);
  }

  async saveGoalsPriorities(data: GoalsPrioritiesData) {
    if (USE_MOCK) return mockOnboardingService.saveGoalsPriorities(data);
    return this.saveStageData('goals_priorities', 100, data);
  }

  async saveAppPreferences(data: AppPreferencesData) {
    if (USE_MOCK) return mockOnboardingService.saveAppPreferences(data);
    return this.saveStageData('app_preferences', 100, data);
  }

  async savePersonalization(data: PersonalizationData) {
    if (USE_MOCK) return mockOnboardingService.savePersonalization(data);
    return this.saveStageData('personalization', 100, data);
  }

  private async saveStageData(stage: string, progress: number, data: any) {
    // Отправляем только data, без обертки
    return apiClient.post(`${this.baseUrl}/stage/${stage.replace('_', '-')}`, data);
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