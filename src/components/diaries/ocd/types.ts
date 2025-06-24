
export interface OCDDiaryData {
  // Step 1: Awareness
  hasObsessions: boolean;
  obsessionNote: string;
  obsessionDescription: string;
  obsessionThemes: string[];
  obsessionThemeOther: string;
  obsessionDuration: string;
  anxietyLevel: number;
  obsessionSituations: string;

  // Step 2: Compulsions
  hasCompulsions: boolean;
  compulsionDescription: string;
  compulsionTypes: string[];
  compulsionTypeOther: string;
  compulsionDuration: string;
  anxietyBefore: number;
  anxietyDuring: number;
  anxietyAfter: number;
  resistanceLevel: string;
  resistanceDescription: string;

  // Step 3: Mindfulness
  usedMindfulness: boolean;
  mindfulnessThought: string;
  mindfulnessLabel: string;
  mindfulnessLabelOther: string;
  resistanceDuration: string;
  mindfulnessEmotions: string;

  // Step 4: Breathing
  usedBreathing: boolean;
  breathingDuration: string;
  anxietyBeforeBreathing: number;
  anxietyAfterBreathing: number;
  breathingSensations: string;

  // Step 5: Ritual hierarchy
  hasRitualList: boolean;
  easiestRitual: string;
  mediumRitual: string;
  hardestRitual: string;
  ritualProgress: boolean;
  ritualProgressDescription: string;

  // Step 6: Self-support
  supportLetter: string;
  saveLetter: boolean;

  // Step 7: Reflection
  mostDifficult: string;
  bestAchievement: string;
  discussWithOthers: boolean;
  tomorrowSteps: string;

  // Step 8: Crisis support
  crisisSeverity: boolean;
  crisisHelp: string;
  seekProfessionalHelp: string;
}

export const getInitialOCDData = (): OCDDiaryData => ({
  hasObsessions: false,
  obsessionNote: '',
  obsessionDescription: '',
  obsessionThemes: [],
  obsessionThemeOther: '',
  obsessionDuration: '',
  anxietyLevel: 0,
  obsessionSituations: '',
  
  hasCompulsions: false,
  compulsionDescription: '',
  compulsionTypes: [],
  compulsionTypeOther: '',
  compulsionDuration: '',
  anxietyBefore: 0,
  anxietyDuring: 0,
  anxietyAfter: 0,
  resistanceLevel: '',
  resistanceDescription: '',
  
  usedMindfulness: false,
  mindfulnessThought: '',
  mindfulnessLabel: '',
  mindfulnessLabelOther: '',
  resistanceDuration: '',
  mindfulnessEmotions: '',
  
  usedBreathing: false,
  breathingDuration: '',
  anxietyBeforeBreathing: 0,
  anxietyAfterBreathing: 0,
  breathingSensations: '',
  
  hasRitualList: false,
  easiestRitual: '',
  mediumRitual: '',
  hardestRitual: '',
  ritualProgress: false,
  ritualProgressDescription: '',
  
  supportLetter: '',
  saveLetter: false,
  
  mostDifficult: '',
  bestAchievement: '',
  discussWithOthers: false,
  tomorrowSteps: '',
  
  crisisSeverity: false,
  crisisHelp: '',
  seekProfessionalHelp: ''
});
