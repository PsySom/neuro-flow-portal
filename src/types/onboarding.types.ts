// Типы для системы онбординга согласно API бэкенда

export type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';
export type ActivityPreference = 'morning' | 'afternoon' | 'evening' | 'varies';
export type SleepQuality = 'poor_interrupted' | 'light_tired' | 'normal' | 'deep_restorative';
export type EnergyLevel = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
export type FatigueFrequency = 'almost_never' | 'sometimes_eod' | 'often_after_rest' | 'constantly';
export type StressImpact = 'minimal' | 'occasional' | 'frequent' | 'severe';
export type ProcrastinationFrequency = 'almost_never' | 'sometimes' | 'often' | 'constantly';
export type TaskApproach = 'all_at_once' | 'small_steps' | 'last_minute' | 'planned';
export type AnxietyFrequency = 'almost_never' | 'sometimes_stress' | 'often' | 'constantly';
export type RelationshipQuality = 'strong_supportive' | 'good_not_always' | 'superficial' | 'lonely_among_people';
export type LonelinessFrequency = 'almost_never' | 'sometimes' | 'often' | 'constantly';
export type DailyPracticeTime = '5-10' | '15-20' | '30-45' | '60+';
export type ReminderFrequency = 'twice_daily' | 'three_four_times' | 'on_request' | 'minimal';
export type RecommendationTime = '06:00-10:00' | '12:00-14:00' | '18:00-21:00' | '21:00-23:00';
export type DevelopmentApproach = 'structured' | 'semi_structured' | 'flexible' | 'free';
export type DayStructure = 'detailed_schedule' | 'task_list' | 'general_goals' | 'minimal_planning';
export type SupportStyle = 'gentle' | 'friendly' | 'structured' | 'inspiring';
export type FeedbackStyle = 'progress_focused' | 'honest_assessment' | 'effort_encouragement' | 'practical_advice';
export type TherapistWork = 'Нет' | 'Да, регулярно' | 'Да, иногда' | 'Планирую обратиться';

export interface OnboardingStageData {
  stage: string;
  progress: number;
  data: any;
}

// Данные этапов
export interface IntroductionData {
  name: string;
  age: number;
  gender: Gender;
  timezone: string;
}

export interface NaturalRhythmsData {
  activity_preference: ActivityPreference;
  wake_time: string; // HH:MM
  sleep_time: string; // HH:MM
  sleep_quality: SleepQuality;
}

export interface CurrentStateData {
  mood_score: number; // 1-10
  energy_level: EnergyLevel;
  fatigue_frequency: FatigueFrequency;
  stress_impact: StressImpact;
  coping_strategies: string[];
}

export interface MainChallengesData {
  challenges: string[];
  other_description?: string;
}

export interface MedicalInfoData {
  diagnosed_conditions: string[];
  working_with_therapist: TherapistWork;
  taking_medication: boolean;
}

export interface ProcrastinationData {
  frequency: ProcrastinationFrequency;
  barriers: string[];
  task_approach: TaskApproach;
}

export interface AnxietyData {
  frequency: AnxietyFrequency;
  triggers: string[];
  manifestations: string[];
  coping_methods: string[];
}

export interface SocialSupportData {
  relationship_quality: RelationshipQuality;
  loneliness_frequency: LonelinessFrequency;
  support_sources: string[];
  barriers_to_support: string[];
  loneliness_situations: string[];
}

export interface GoalsPrioritiesData {
  selected_goals: string[];
}

export interface AppPreferencesData {
  daily_practice_time: DailyPracticeTime;
  reminder_frequency: ReminderFrequency;
  recommendation_time: RecommendationTime;
  development_approach: DevelopmentApproach;
  day_structure: DayStructure;
}

export interface PersonalizationData {
  support_style: SupportStyle;
  feedback_style: FeedbackStyle;
}

// Опции для выбора
export interface OnboardingOptions {
  goals: string[];
  challenges: string[];
  conditions: string[];
  coping_strategies: string[];
  procrastination_barriers: string[];
  anxiety_triggers: string[];
  anxiety_manifestations: string[];
  support_sources: string[];
  support_barriers: string[];
  loneliness_situations: string[];
}