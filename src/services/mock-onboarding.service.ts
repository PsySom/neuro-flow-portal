import type { 
  OnboardingStageData,
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

// Mock API response wrapper
const mockApiResponse = <T>(data: T) => ({
  data,
  message: 'Success',
  success: true
});

// Mock delay to simulate network request
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

class MockOnboardingService {
  private baseUrl = '/api/v1/onboarding';
  private savedData: any = {}; // Храним данные онбординга

  // Управление процессом
  async startOnboarding() {
    await mockDelay();
    return mockApiResponse({ started: true });
  }

  async getProgress() {
    await mockDelay();
    return mockApiResponse({ progress: 25 });
  }

  async getProfile() {
    await mockDelay();
    console.log('Mock: Получение профиля, сохраненные данные:', this.savedData);
    
    // Возвращаем все сохраненные данные онбординга
    return mockApiResponse({ 
      basicInfo: this.savedData.introduction,
      naturalRhythms: this.savedData.natural_rhythms,
      currentState: this.savedData.current_state,
      challenges: this.savedData.main_challenges?.challenges || [],
      medicalInfo: this.savedData.medical_info,
      procrastination: this.savedData.procrastination,
      anxiety: this.savedData.anxiety,
      socialSupport: this.savedData.social_support,
      goals: this.savedData.goals_priorities?.selected_goals || [],
      preferences: this.savedData.app_preferences,
      personalization: this.savedData.personalization
    });
  }

  async getSummary() {
    await mockDelay();
    return mockApiResponse({ summary: {} });
  }

  async exportData() {
    await mockDelay();
    return mockApiResponse({ data: {} });
  }

  async completeOnboarding() {
    await mockDelay();
    console.log('Mock: Onboarding completed successfully');
    return mockApiResponse({ completed: true });
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
    await mockDelay();
    console.log(`Mock: Saving ${stage} data:`, data);
    
    // Сохраняем данные в память
    this.savedData[stage] = data;
    
    const payload: OnboardingStageData = {
      stage,
      progress,
      data
    };
    
    return mockApiResponse({ saved: true, payload });
  }

  // Получение опций для форм
  async getGoals(): Promise<string[]> {
    await mockDelay();
    return [
      'Научиться справляться с тревогой и стрессом',
      'Нормализовать сон',
      'Повысить продуктивность и фокус',
      'Развить осознанность и самопонимание',
      'Улучшить отношения с близкими',
      'Повысить самооценку и уверенность',
      'Найти баланс между работой и личной жизнью',
      'Развить эмоциональную устойчивость'
    ];
  }

  async getChallenges(): Promise<string[]> {
    await mockDelay();
    return [
      'Тревога и беспокойство',
      'Стресс и напряжение',
      'Проблемы со сном',
      'Прокрастинация',
      'Низкая самооценка',
      'Проблемы в отношениях',
      'Перфекционизм',
      'Депрессивное настроение'
    ];
  }

  async getConditions(): Promise<string[]> {
    await mockDelay();
    return [
      'Депрессия',
      'Тревожное расстройство',
      'Биполярное расстройство',
      'ПТСР',
      'ОКР',
      'Панические атаки',
      'Фобии',
      'Расстройства пищевого поведения'
    ];
  }

  async getCopingStrategies(): Promise<string[]> {
    await mockDelay();
    return [
      'Дыхательные техники',
      'Физическая активность',
      'Разговор с близкими людьми',
      'Медитация и осознанность',
      'Ведение дневника',
      'Творческая деятельность',
      'Прогулки на природе',
      'Музыка и релаксация'
    ];
  }

  async getProcrastinationBarriers(): Promise<string[]> {
    await mockDelay();
    return [
      'Страх сделать неидеально',
      'Задача кажется слишком большой',
      'Не знаю, с чего начать',
      'Отвлекаюсь на телефон/интернет',
      'Недостаток мотивации',
      'Усталость и апатия'
    ];
  }

  async getAnxietyTriggers(): Promise<string[]> {
    await mockDelay();
    return [
      'Утром, думая о предстоящем дне',
      'При принятии решений',
      'В социальных ситуациях',
      'Когда много дел и спешка',
      'Перед важными событиями',
      'При конфликтах с людьми'
    ];
  }

  async getAnxietyManifestations(): Promise<string[]> {
    await mockDelay();
    return [
      'Навязчивые мысли и переживания',
      'Проблемы с засыпанием',
      'Физическое напряжение (головная боль, зажимы)',
      'Учащенное сердцебиение',
      'Избегание ситуаций',
      'Раздражительность'
    ];
  }

  async getSupportSources(): Promise<string[]> {
    await mockDelay();
    return [
      'Семья (родители, партнер, дети)',
      'Близкие друзья',
      'Коллеги',
      'Психолог/психотерапевт',
      'Группы поддержки',
      'Онлайн-сообщества'
    ];
  }

  async getSupportBarriers(): Promise<string[]> {
    await mockDelay();
    return [
      'Стыжусь своих проблем',
      'Не умею просить о помощи',
      'Боюсь быть непонятым',
      'Не хочу расстраивать близких',
      'Считаю, что должен справляться сам',
      'Нет подходящих людей в окружении'
    ];
  }

  async getLonelinessSituations(): Promise<string[]> {
    await mockDelay();
    return [
      'Вечером или перед сном',
      'Когда переживаю трудности',
      'В выходные дни',
      'Среди большого количества людей',
      'После конфликтов',
      'Когда достигаю успехов, но не с кем поделиться'
    ];
  }

  async getAllOptions() {
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

export const mockOnboardingService = new MockOnboardingService();