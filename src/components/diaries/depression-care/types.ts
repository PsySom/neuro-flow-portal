
export interface DepressionCareDiaryData {
  // Блок 1: Ежедневная забота о себе
  // Утреннее пробуждение
  bedtime: string;
  wakeupTime: string;
  nightWakeups: number;
  sleepQuality: number; // 1-10
  restedness: number; // 1-10
  morningMood: number; // -10 to +10
  moodWords: string[];
  bodyState: string[];
  bodyNeeds: string[];
  dailyIntentions: string[];
  dailyJoy: string;
  
  // Дневной чекин
  middayTime: string;
  middayMood: number; // -10 to +10
  emotionalWeather: string;
  currentActivity: string;
  activityFeeling: string;
  avoidanceBehaviors: string[];
  selfCareAction: string;
  
  // Вечернее подведение итогов
  overallDayRating: number; // -10 to +10
  mostDifficult: string;
  mostPleasant: string;
  selfPraise: string;
  smallJoys: string[];
  basicNeedsCovered: string[];
  sleepPreparation: string[];
  plannedBedtime: string;
  
  // Блок 2: Работа с эмоциональным состоянием
  // Углубленная рефлексия
  primaryMood: number; // -10 to +10
  difficultEmotions: { [key: string]: number };
  supportiveEmotions: { [key: string]: number };
  moodInfluences: string[];
  specificSituation: string;
  feelingsAttitude: string[];
  currentNeeds: string[];
  
  // Работа с тревогой
  anxietyLevel: number; // 1-10
  anxietyBodySensations: string[];
  groundingItems: {
    see: string[];
    touch: string[];
    hear: string[];
    smell: string[];
    taste: string;
  };
  anxietyAfterTechniques: number; // 1-10
  anxietySubject: string;
  anxietyType: string[];
  anxietyProbability: number; // 0-100
  copingCapability: string;
  
  // Блок 3: Работа с мыслями
  negativeThoughtsAboutSelf: string[];
  negativeThoughtsAboutFuture: string[];
  negativeThoughtsAboutWorld: string[];
  mostTroublingThought: string;
  thoughtBelief: number; // 0-100
  thoughtEmotions: string[];
  supportingFacts: string;
  contradictingFacts: string;
  friendAdvice: string;
  alternativeExplanation: string;
  balancedThought: string;
  newThoughtBelief: number; // 0-100
  emotionalChange: string;
  
  // Паттерны мышления
  thinkingPatterns: string[];
  stopSignalTechnique: boolean;
  delayedWorryThought: string;
  delayedWorryTime: string;
  
  // Блок 4: Базовые потребности
  needsAssessment: {
    sleepQuality: number;
    dailyRest: number;
    restoration: number;
    mealRegularity: number;
    nutritionQuality: number;
    eatingPleasure: number;
    physicalActivity: number;
    freshAir: number;
    bodyConnection: number;
    emotionalSafety: number;
    environmentStability: number;
    authenticitySpace: number;
    financialConfidence: number;
    coverBasicNeeds: number;
    relationshipQuality: number;
    understanding: number;
    emotionalSupport: number;
    communityBelonging: number;
    helpingOthers: number;
    learningNew: number;
    creativity: number;
    goalAchievement: number;
    situationClarity: number;
    decisionMaking: number;
    lifeMeaning: number;
    connectionToGreater: number;
    livingValues: number;
  };
  priorityNeeds: string[];
  needsActionPlan: {
    need: string;
    todayStep: string;
    weeklyStep: string;
    helper: string;
  }[];
  
  // Блок 5: Преодоление избегания
  avoidedTasks: string[];
  avoidedSocial: string[];
  avoidedEmotional: string[];
  avoidanceBehaviorsList: string[];
  avoidanceReasons: string[];
  commonAvoidanceThought: string;
  chosenTask: string;
  taskImportance: string;
  taskFears: string;
  microSteps: string[];
  firstSmallStep: string;
  supportStrategies: string[];
  duringSupport: string;
  completionCelebration: string;
  perfectionistThoughts: string[];
  goodEnoughTask: string;
  goodEnoughCriteria: string;
  goodEnoughConsequences: string;
  
  // Блок 6: Планирование восстановления
  quickJoys: {
    body: string[];
    soul: string[];
    mind: string[];
    connection: string[];
  };
  mediumJoys: {
    creativity: string[];
    entertainment: string[];
    activity: string[];
  };
  bigJoys: string[];
  weeklyJoys: { [key: string]: string };
  weeklySpecial: string;
  weeklyRestoration: string;
  challengingTimeOfDay: string[];
  challengingTimeSupport: string;
  
  // Блок 7: Кризисная поддержка
  crisisWarnings: string[];
  immediate5minActions: string[];
  immediate30minActions: string[];
  immediate2hourActions: string[];
  supportNetwork: {
    name: string;
    phone: string;
    bestTime: string;
  }[];
  professionalSupport: {
    name: string;
    phone: string;
    bookingMethod: string;
  };
  groundingTechnique: {
    see: string[];
    touch: string[];
    hear: string[];
    smell: string[];
    taste: string;
  };
  suicidalThoughts: boolean;
  crisis24hourPromise: boolean;
  
  // Блок 8: Долгосрочное наблюдение
  weeklyAverages: {
    mood: number;
    energy: number;
    anxiety: number;
    satisfaction: number;
  };
  weeklyMoodChart: number[];
  helpfulActivities: string;
  helpfulTechniques: string;
  supportivePeople: string;
  moodTriggers: string;
  avoidancePatterns: string;
  nextWeekChanges: string;
  
  // Месячный обзор
  monthComparison: {
    generalState: string;
    copingAbility: string;
    lifeQuality: string;
  };
  monthlyAchievements: string[];
  personalTriggers: string;
  helpfulStrategies: string;
  strengthsShown: string;
  areasNeedingSupport: string;
  nextMonthGoals: {
    newTechnique: string;
    newActivity: string;
    newCareWay: string;
    habitToStrengthen: string;
    relationshipToStrengthen: string;
    skillToDevelop: string;
  };
  
  // Письмо себе в будущее
  futureLetterFeeling: string;
  futureLetterSupport: string;
  futureLetterPride: string;
  futureLetterAdvice: string;
  futureLetterBelief: string;
  futureLetterDate: string;
}

export const getInitialDepressionCareData = (): DepressionCareDiaryData => ({
  bedtime: '',
  wakeupTime: '',
  nightWakeups: 0,
  sleepQuality: 5,
  restedness: 5,
  morningMood: 0,
  moodWords: [],
  bodyState: [],
  bodyNeeds: [],
  dailyIntentions: [],
  dailyJoy: '',
  
  middayTime: '',
  middayMood: 0,
  emotionalWeather: '',
  currentActivity: '',
  activityFeeling: '',
  avoidanceBehaviors: [],
  selfCareAction: '',
  
  overallDayRating: 0,
  mostDifficult: '',
  mostPleasant: '',
  selfPraise: '',
  smallJoys: [],
  basicNeedsCovered: [],
  sleepPreparation: [],
  plannedBedtime: '',
  
  primaryMood: 0,
  difficultEmotions: {},
  supportiveEmotions: {},
  moodInfluences: [],
  specificSituation: '',
  feelingsAttitude: [],
  currentNeeds: [],
  
  anxietyLevel: 1,
  anxietyBodySensations: [],
  groundingItems: {
    see: [],
    touch: [],
    hear: [],
    smell: [],
    taste: ''
  },
  anxietyAfterTechniques: 1,
  anxietySubject: '',
  anxietyType: [],
  anxietyProbability: 0,
  copingCapability: '',
  
  negativeThoughtsAboutSelf: [],
  negativeThoughtsAboutFuture: [],
  negativeThoughtsAboutWorld: [],
  mostTroublingThought: '',
  thoughtBelief: 0,
  thoughtEmotions: [],
  supportingFacts: '',
  contradictingFacts: '',
  friendAdvice: '',
  alternativeExplanation: '',
  balancedThought: '',
  newThoughtBelief: 0,
  emotionalChange: '',
  
  thinkingPatterns: [],
  stopSignalTechnique: false,
  delayedWorryThought: '',
  delayedWorryTime: '',
  
  needsAssessment: {
    sleepQuality: 5, dailyRest: 5, restoration: 5,
    mealRegularity: 5, nutritionQuality: 5, eatingPleasure: 5,
    physicalActivity: 5, freshAir: 5, bodyConnection: 5,
    emotionalSafety: 5, environmentStability: 5, authenticitySpace: 5,
    financialConfidence: 5, coverBasicNeeds: 5,
    relationshipQuality: 5, understanding: 5, emotionalSupport: 5,
    communityBelonging: 5, helpingOthers: 5,
    learningNew: 5, creativity: 5, goalAchievement: 5,
    situationClarity: 5, decisionMaking: 5,
    lifeMeaning: 5, connectionToGreater: 5, livingValues: 5
  },
  priorityNeeds: [],
  needsActionPlan: [],
  
  avoidedTasks: [],
  avoidedSocial: [],
  avoidedEmotional: [],
  avoidanceBehaviorsList: [],
  avoidanceReasons: [],
  commonAvoidanceThought: '',
  chosenTask: '',
  taskImportance: '',
  taskFears: '',
  microSteps: [],
  firstSmallStep: '',
  supportStrategies: [],
  duringSupport: '',
  completionCelebration: '',
  perfectionistThoughts: [],
  goodEnoughTask: '',
  goodEnoughCriteria: '',
  goodEnoughConsequences: '',
  
  quickJoys: {
    body: [],
    soul: [],
    mind: [],
    connection: []
  },
  mediumJoys: {
    creativity: [],
    entertainment: [],
    activity: []
  },
  bigJoys: [],
  weeklyJoys: {},
  weeklySpecial: '',
  weeklyRestoration: '',
  challengingTimeOfDay: [],
  challengingTimeSupport: '',
  
  crisisWarnings: [],
  immediate5minActions: [],
  immediate30minActions: [],
  immediate2hourActions: [],
  supportNetwork: [],
  professionalSupport: {
    name: '',
    phone: '',
    bookingMethod: ''
  },
  groundingTechnique: {
    see: [],
    touch: [],
    hear: [],
    smell: [],
    taste: ''
  },
  suicidalThoughts: false,
  crisis24hourPromise: false,
  
  weeklyAverages: {
    mood: 0,
    energy: 0,
    anxiety: 0,
    satisfaction: 0
  },
  weeklyMoodChart: [],
  helpfulActivities: '',
  helpfulTechniques: '',
  supportivePeople: '',
  moodTriggers: '',
  avoidancePatterns: '',
  nextWeekChanges: '',
  
  monthComparison: {
    generalState: '',
    copingAbility: '',
    lifeQuality: ''
  },
  monthlyAchievements: [],
  personalTriggers: '',
  helpfulStrategies: '',
  strengthsShown: '',
  areasNeedingSupport: '',
  nextMonthGoals: {
    newTechnique: '',
    newActivity: '',
    newCareWay: '',
    habitToStrengthen: '',
    relationshipToStrengthen: '',
    skillToDevelop: ''
  },
  
  futureLetterFeeling: '',
  futureLetterSupport: '',
  futureLetterPride: '',
  futureLetterAdvice: '',
  futureLetterBelief: '',
  futureLetterDate: ''
});
