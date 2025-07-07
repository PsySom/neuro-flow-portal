import type { 
  Gender, ActivityPreference, SleepQuality, EnergyLevel, 
  FatigueFrequency, StressImpact, ProcrastinationFrequency, 
  TaskApproach, AnxietyFrequency, RelationshipQuality, 
  LonelinessFrequency, DailyPracticeTime, ReminderFrequency, 
  RecommendationTime, DevelopmentApproach, DayStructure, 
  SupportStyle, FeedbackStyle 
} from '@/types/onboarding.types';

export const mapGender = (gender: string): Gender => {
  const mapping: Record<string, Gender> = {
    'male': 'male',
    'female': 'female', 
    'other': 'non_binary',
    'prefer-not-to-say': 'prefer_not_to_say'
  };
  return mapping[gender] || 'prefer_not_to_say';
};

export const mapActivityPreference = (time: string): ActivityPreference => {
  const mapping: Record<string, ActivityPreference> = {
    'morning': 'morning',
    'day': 'afternoon',
    'evening': 'evening',
    'varies': 'varies'
  };
  return mapping[time] || 'varies';
};

export const mapSleepQuality = (quality: string): SleepQuality => {
  const mapping: Record<string, SleepQuality> = {
    'poor': 'poor_interrupted',
    'light': 'light_tired',
    'normal': 'normal',
    'good': 'deep_restorative'
  };
  return mapping[quality] || 'normal';
};

export const mapEnergyLevel = (level: string): EnergyLevel => {
  const mapping: Record<string, EnergyLevel> = {
    'very-low': 'very_low',
    'low': 'low',
    'medium': 'medium',
    'high': 'high',
    'very-high': 'very_high'
  };
  return mapping[level] || 'medium';
};

export const mapFatigueFrequency = (sleep: string): FatigueFrequency => {
  const mapping: Record<string, FatigueFrequency> = {
    'poor': 'constantly',
    'fair': 'often_after_rest',
    'good': 'sometimes_eod',
    'excellent': 'almost_never'
  };
  return mapping[sleep] || 'sometimes_eod';
};

export const mapStressImpact = (stress: string): StressImpact => {
  const mapping: Record<string, StressImpact> = {
    'low': 'minimal',
    'moderate': 'occasional',
    'high': 'frequent',
    'very-high': 'severe'
  };
  return mapping[stress] || 'occasional';
};

export const mapProcrastinationFrequency = (freq: string): ProcrastinationFrequency => {
  const mapping: Record<string, ProcrastinationFrequency> = {
    'never': 'almost_never',
    'sometimes': 'sometimes',
    'often': 'often',
    'constantly': 'constantly'
  };
  return mapping[freq] || 'sometimes';
};

export const mapTaskApproach = (approach: string): TaskApproach => {
  const mapping: Record<string, TaskApproach> = {
    'all-at-once': 'all_at_once',
    'small-steps': 'small_steps',
    'deadline-pressure': 'last_minute',
    'planned': 'planned'
  };
  return mapping[approach] || 'small_steps';
};

export const mapAnxietyFrequency = (freq: string): AnxietyFrequency => {
  const mapping: Record<string, AnxietyFrequency> = {
    'never': 'almost_never',
    'sometimes': 'sometimes_stress',
    'often': 'often',
    'constantly': 'constantly'
  };
  return mapping[freq] || 'sometimes_stress';
};

export const mapRelationshipQuality = (quality: string): RelationshipQuality => {
  const mapping: Record<string, RelationshipQuality> = {
    'strong': 'strong_supportive',
    'good': 'good_not_always',
    'superficial': 'superficial',
    'lonely': 'lonely_among_people'
  };
  return mapping[quality] || 'good_not_always';
};

export const mapLonelinessFrequency = (freq: string): LonelinessFrequency => {
  const mapping: Record<string, LonelinessFrequency> = {
    'never': 'almost_never',
    'sometimes': 'sometimes',
    'often': 'often',
    'always': 'constantly'
  };
  return mapping[freq] || 'sometimes';
};

export const mapDailyPracticeTime = (time: string): DailyPracticeTime => {
  const mapping: Record<string, DailyPracticeTime> = {
    '5-10': '5-10',
    '15-20': '15-20',
    '30-45': '30-45',
    '60+': '60+'
  };
  return mapping[time] || '15-20';
};

export const mapReminderFrequency = (freq: string): ReminderFrequency => {
  const mapping: Record<string, ReminderFrequency> = {
    'twice-daily': 'twice_daily',
    'three-four-times': 'three_four_times',
    'on-request': 'on_request',
    'minimal': 'minimal'
  };
  return mapping[freq] || 'twice_daily';
};

export const mapRecommendationTime = (time: string): RecommendationTime => {
  const mapping: Record<string, RecommendationTime> = {
    'morning': '06:00-10:00',
    'lunch': '12:00-14:00',
    'evening': '18:00-21:00',
    'night': '21:00-23:00'
  };
  return mapping[time] || '18:00-21:00';
};

export const mapDevelopmentApproach = (approach: string): DevelopmentApproach => {
  const mapping: Record<string, DevelopmentApproach> = {
    'structured': 'structured',
    'semi-structured': 'semi_structured',
    'flexible': 'flexible',
    'free': 'free'
  };
  return mapping[approach] || 'flexible';
};

export const mapDayStructure = (structure: string): DayStructure => {
  const mapping: Record<string, DayStructure> = {
    'detailed-schedule': 'detailed_schedule',
    'task-list': 'task_list',
    'flexible-goals': 'general_goals',
    'minimal-planning': 'minimal_planning'
  };
  return mapping[structure] || 'task_list';
};

export const mapSupportStyle = (style: string): SupportStyle => {
  const mapping: Record<string, SupportStyle> = {
    'gentle': 'gentle',
    'friendly': 'friendly',
    'structured': 'structured',
    'inspiring': 'inspiring'
  };
  return mapping[style] || 'friendly';
};

export const mapFeedbackStyle = (style: string): FeedbackStyle => {
  const mapping: Record<string, FeedbackStyle> = {
    'progress-focused': 'progress_focused',
    'honest': 'honest_assessment',
    'effort-focused': 'effort_encouragement',
    'practical': 'practical_advice'
  };
  return mapping[style] || 'progress_focused';
};

export const formatTime = (hour: number): string => {
  if (hour > 24) hour -= 24;
  return `${hour.toString().padStart(2, '0')}:00`;
};