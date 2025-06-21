
export interface ProcrastinationDiaryData {
  hadProcrastination: boolean;
  tasks: ProcrastinationTask[];
}

export interface ProcrastinationTask {
  id: string;
  description: string;
  sphere: string;
  sphereOther?: string;
  reasons: string[];
  reasonOther?: string;
  emotions: string[];
  emotionOther?: string;
  thoughts: string;
  hasCategoricalThoughts: boolean;
  impactLevel: number;
  missingResources: string[];
  missingResourceOther?: string;
  helpStrategies: string[];
  helpStrategyOther?: string;
  smallStep?: string;
  willDoSmallStep: boolean;
}
