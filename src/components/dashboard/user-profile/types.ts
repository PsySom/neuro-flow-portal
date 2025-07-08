export interface UserProfileData {
  basicInfo?: {
    name?: string;
    age?: number;
    gender?: string;
    timezone?: string;
  };
  naturalRhythms?: {
    activity_preference?: string;
    activityPreference?: string;
    wake_time?: string;
    wakeTime?: string;
    sleep_time?: string;
    sleepTime?: string;
    sleep_quality?: string;
    sleepQuality?: string;
  };
  currentState?: {
    mood_score?: number;
    moodScore?: number;
    energy_level?: string;
    energyLevel?: string;
    fatigue_frequency?: string;
    fatigueFrequency?: string;
    stress_impact?: string;
    stressImpact?: string;
    coping_strategies?: string[];
    copingStrategies?: string[];
  };
  challenges?: string[];
  medicalInfo?: {
    diagnosed_conditions?: string[];
    diagnosedConditions?: string[];
    working_with_therapist?: string;
    workingWithTherapist?: string;
    taking_medication?: boolean;
    takingMedication?: boolean;
  };
  procrastination?: {
    frequency?: string;
    barriers?: string[];
    task_approach?: string;
    taskApproach?: string;
  };
  anxiety?: {
    frequency?: string;
    triggers?: string[];
    manifestations?: string[];
    coping_methods?: string[];
    copingMethods?: string[];
  };
  socialSupport?: {
    relationship_quality?: string;
    relationshipQuality?: string;
    loneliness_frequency?: string;
    lonelinessFrequency?: string;
    support_sources?: string[];
    supportSources?: string[];
    barriers_to_support?: string[];
    barriers?: string[];
    loneliness_situations?: string[];
    lonelinessSituations?: string[];
  };
  goals?: string[];
  preferences?: {
    daily_practice_time?: string;
    dailyPracticeTime?: string;
    reminder_frequency?: string;
    reminderFrequency?: string;
    recommendation_time?: string;
    recommendationTime?: string;
    development_approach?: string;
    developmentApproach?: string;
    day_structure?: string;
    dayStructure?: string;
  };
  personalization?: {
    support_style?: string;
    supportStyle?: string;
    feedback_style?: string;
    feedbackStyle?: string;
  };
}

export interface UserProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}