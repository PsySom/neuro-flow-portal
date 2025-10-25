
export interface MoodDiaryData {
  mood: number;
  moodComment: string;
  selectedEmotions: Array<{
    name: string;
    intensity: number;
  }>;
  emotionComment: string;
  emotionConnection?: string;
  bodyStateInfluence?: string;
  bodyStateCustom?: string;
}

export interface MoodStepProps {
  form: any;
  onNext?: () => void;
  onPrev?: () => void;
}
