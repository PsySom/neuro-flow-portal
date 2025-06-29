
export interface MoodDiaryData {
  mood: number;
  moodComment: string;
  selectedEmotions: Array<{
    name: string;
    intensity: number;
  }>;
  emotionTrigger?: string;
  emotionComment: string;
  bodyStateInfluence?: string;
  bodyStateCustom?: string;
  relatedThoughts?: string;
  triggerSource?: string;
  triggerThought?: string;
  hasCognitiveBias: boolean;
  reframedThought?: string;
  positiveSource?: string;
  selfEvaluation: number;
  gratitude: string;
  emotionConnection?: string;
  emotionImpact?: string;
}

export interface MoodStepProps {
  form: any;
  onNext?: () => void;
  onPrev?: () => void;
}
