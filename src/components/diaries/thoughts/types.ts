
export interface ThoughtsDiaryData {
  hasDisturbingThought: boolean;
  thoughtText: string;
  trigger: string;
  triggerOther?: string;
  categories: string[];
  categoryOther?: string;
  cognitiveDistortions: string[];
  distortionOther?: string;
  abcAnalysis: {
    activatingEvent: string;
    belief: string;
    consequence: string;
  };
  emotions: string[];
  emotionOther?: string;
  reactions: string[];
  reactionOther?: string;
  evidenceFor: string;
  evidenceAgainst: string;
  alternativeThought: string;
  selfCompassion: string;
  supportivePhrase: string;
  alternativeActions: string[];
  actionOther?: string;
  copingStrategies: string[];
  copingOther?: string;
  currentFeeling: string;
  selfCareAction?: string;
}
