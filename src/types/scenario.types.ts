export interface TherapyScenario {
  id: string;
  scenario_code: string;
  name: string;
  description?: string;
  scenario_type?: string;
  duration_minutes?: number;
  priority?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TherapyQuestion {
  id: string;
  scenario_id: string;
  sequence_number: number;
  question_code: string;
  question_text: string;
  question_type: 'scale' | 'chips' | 'multiple_choice' | 'time' | 'number' | 'text';
  metadata: QuestionMetadata;
  created_at?: string;
}

export interface QuestionMetadata {
  min?: number;
  max?: number;
  step?: number;
  labels?: string[];
  options?: QuestionOption[];
  maxSelect?: number;
  format?: string;
  unit?: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  emoji?: string;
}

export interface TherapyTransition {
  id: string;
  from_question_id: string;
  next_question_id?: string;
  next_scenario_id?: string;
  condition_type?: string;
  condition_data?: any;
  priority?: number;
  created_at?: string;
}

export interface ScenarioProgress {
  currentQuestionIndex: number;
  responses: Record<string, any>;
  completedAt?: Date;
}

export interface DiaryEntry {
  id: string;
  user_id: string;
  topic: string;
  context?: string;
  ai_summary?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface DiaryMetric {
  id: number;
  entry_id: string;
  key: string;
  value: number;
  norm_min?: number;
  norm_max?: number;
}

export interface DiaryEmotion {
  id: number;
  entry_id: string;
  label: string;
  intensity?: number;
}
