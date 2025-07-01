
export interface DiarySession {
  id: string;
  type: 'morning' | 'midday' | 'evening';
  timestamp: Date;
  responses: Record<string, any>;
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
}

export interface QuestionOption {
  emoji?: string;
  label: string;
  value: string | number;
}

export interface Question {
  id: string;
  text: string;
  type: 'scale' | 'multiple-choice' | 'multi-select' | 'text' | 'emoji-scale';
  options?: QuestionOption[];
  scaleRange?: { min: number; max: number; step?: number };
  required?: boolean;
  followUpLogic?: (response: any, sessionData: any) => string | null;
}

export interface DiaryScenario {
  id: string;
  title: string;
  greeting: string;
  timeRange: string;
  questions: Question[];
  completionMessage: string;
}

export interface PersonalNorms {
  sleep: { quality: number; duration: number };
  energy: number;
  mood: number;
  anxiety: number;
  stress: number;
  selfCare: number;
  selfEsteem: number;
}
