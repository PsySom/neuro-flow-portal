
export interface DepressionCareDiaryData {
  // Step 1 - Daily Care
  bedTime?: string;
  wakeTime?: string;
  nightWakeups?: number;
  sleepQuality?: number;
  restfulness?: number;
  currentMood?: number;
  moodWords?: string[];
  bodyFeeling?: string[];
  bodyNeeds?: string[];
  dailyIntentions?: string[];
  dailyJoy?: string;
  middayMood?: number;
  middayActivity?: string;
  middayDifficulty?: string;
  avoidanceBehaviors?: string[];
  selfCareAction?: string;
  eveningMood?: number;
  dayDifficult?: string;
  dayPleasant?: string;
  selfPraise?: string;
  smallJoys?: string[];
  basicCareChecks?: string[];
  sleepPreparation?: string[];
  plannedBedtime?: string;

  // Step 2 - Emotional State
  emotions?: { [key: string]: number };
  moodTriggers?: string[];
  specificSituation?: string;
  anxietyLevel?: number;
  anxietySymptoms?: string[];
  grounding?: {
    see?: string;
    touch?: string;
    hear?: string;
    smell?: string;
    taste?: string;
  };
  anxietySubject?: string;

  // Step 3 - Thoughts Work
  negativeThoughtsAboutSelf?: string[];
  otherNegativeThoughtsAboutSelf?: string;
  negativeThoughtsAboutFuture?: string[];
  negativeThoughtsAboutWorld?: string[];
  mostDistressingThought?: string;
  beliefInThought?: number;
  thoughtEmotions?: string[];
  supportingEvidence?: string;
  contradictingEvidence?: string;
  friendAdvice?: string;
  balancedThought?: string;
  beliefInNewThought?: number;
  thinkingPatterns?: string[];

  // Step 4 - Basic Needs
  basicNeeds?: {
    sleep?: { [key: string]: number };
    nutrition?: { [key: string]: number };
    movement?: { [key: string]: number };
    safety?: { [key: string]: number };
    financial?: { [key: string]: number };
    social?: { [key: string]: number };
    belonging?: { [key: string]: number };
  };
  needsImprovement?: { [key: string]: string };
  priorityNeeds?: { [key: string]: string };

  // Step 5 - Overcoming Avoidance
  avoidedTasks?: string[];
  avoidedSocial?: string[];
  avoidedEmotional?: string[];
  avoidanceManifestations?: string[];
  avoidanceReasons?: string[];
  mainAvoidedTask?: string;
  taskImportance?: string;
  taskFears?: string;
  taskSteps?: string[];
  smallestStep?: string;
  supportStrategies?: string[];
  perfectionistThoughts?: string[];
  goodEnoughTask?: string;
  goodEnoughCriteria?: string;

  // Step 6 - Recovery Planning
  quickJoys?: { [category: string]: string[] };
  mediumJoys?: { [category: string]: string[] };
  bigJoys?: string[];
  weeklyPlan?: { [day: string]: string };
  recoveryTime?: string;
  recoveryPlan?: string;

  // Step 7 - Crisis Support
  crisisSignals?: string[];
  immediateHelp?: {
    first5min?: string[];
    first30min?: string[];
    first2hours?: string[];
  };
  supportNetwork?: {
    person1?: { name?: string; phone?: string; bestTime?: string };
    person2?: { name?: string; phone?: string; bestTime?: string };
    professional?: { name?: string; phone?: string; bookingInfo?: string };
  };

  // Step 8 - Long-term Observation
  weeklyAverages?: {
    mood?: number;
    energy?: number;
    anxiety?: number;
    satisfaction?: number;
  };
  effectiveActivities?: string;
  helpfulTechniques?: string;
  supportivePeople?: string;
  majorTriggers?: string;
  avoidancePatterns?: string;
  nextWeekChanges?: string;
  monthlyProgress?: {
    overallState?: string;
    copingAbility?: string;
    lifeQuality?: string;
  };
  monthlyAchievements?: string[];
  personalTriggers?: string;
  whatHelps?: string;
  strengths?: string;
  supportAreas?: string;
  futureGoals?: {
    newTechnique?: string;
    newActivity?: string;
    newCare?: string;
    strengthenHabit?: string;
    strengthenRelation?: string;
    strengthenSkill?: string;
  };
  letterToFuture?: string;
}

export const getInitialDepressionCareData = (): DepressionCareDiaryData => ({
  currentMood: 0,
  sleepQuality: 5,
  restfulness: 5,
  moodWords: [],
  bodyFeeling: [],
  bodyNeeds: [],
  dailyIntentions: [],
  dailyJoy: '',
  middayMood: 0,
  middayActivity: '',
  middayDifficulty: '',
  avoidanceBehaviors: [],
  selfCareAction: '',
  eveningMood: 0,
  dayDifficult: '',
  dayPleasant: '',
  selfPraise: '',
  smallJoys: [],
  basicCareChecks: [],
  sleepPreparation: [],
  plannedBedtime: '',
  emotions: {},
  moodTriggers: [],
  specificSituation: '',
  anxietyLevel: 1,
  anxietySymptoms: [],
  grounding: {},
  anxietySubject: '',
  negativeThoughtsAboutSelf: [],
  negativeThoughtsAboutFuture: [],
  negativeThoughtsAboutWorld: [],
  mostDistressingThought: '',
  beliefInThought: 50,
  thoughtEmotions: [],
  supportingEvidence: '',
  contradictingEvidence: '',
  friendAdvice: '',
  balancedThought: '',
  beliefInNewThought: 50,
  thinkingPatterns: [],
  basicNeeds: {},
  needsImprovement: {},
  priorityNeeds: {},
  avoidedTasks: [],
  avoidedSocial: [],
  avoidedEmotional: [],
  avoidanceManifestations: [],
  avoidanceReasons: [],
  mainAvoidedTask: '',
  taskImportance: '',
  taskFears: '',
  taskSteps: [],
  smallestStep: '',
  supportStrategies: [],
  perfectionistThoughts: [],
  goodEnoughTask: '',
  goodEnoughCriteria: '',
  quickJoys: {},
  mediumJoys: {},
  bigJoys: [],
  weeklyPlan: {},
  recoveryTime: '',
  recoveryPlan: '',
  crisisSignals: [],
  immediateHelp: {},
  supportNetwork: {},
  weeklyAverages: {},
  effectiveActivities: '',
  helpfulTechniques: '',
  supportivePeople: '',
  majorTriggers: '',
  avoidancePatterns: '',
  nextWeekChanges: '',
  monthlyProgress: {},
  monthlyAchievements: [],
  personalTriggers: '',
  whatHelps: '',
  strengths: '',
  supportAreas: '',
  futureGoals: {},
  letterToFuture: ''
});
