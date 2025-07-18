export interface SleepDiaryData {
  bedtime: string;
  wakeUpTime: string;
  sleepDuration: number;
  sleepQuality: number;
  nightAwakenings: number;
  morningFeeling: number;
  hasDayRest: boolean;
  dayRestType?: string;
  dayRestEffectiveness?: number;
  overallSleepImpact: number;
  sleepDisruptors?: string[];
  sleepComment?: string;
  restComment?: string;
}

export interface SleepFactors {
  anxiousThoughts: boolean;
  physicalDiscomfort: boolean;
  lateScreen: boolean;
  noiseLight: boolean;
  lateMeal: boolean;
  stress: boolean;
  lateWakeUp: boolean;
  other: string;
}

export const sleepQualityLabels = {
  '-5': '😵 Очень плохо',
  '-4': '😔 Плохо',
  '-3': '😕 Ниже среднего',
  '-2': '😐 Немного хуже',
  '-1': '😐 Чуть хуже',
  '0': '😐 Средне',
  '1': '😊 Чуть лучше',
  '2': '😊 Немного лучше',
  '3': '😌 Выше среднего',
  '4': '😴 Хорошо',
  '5': '😴 Отлично'
};

export const dayRestTypes = [
  'Короткий сон (дрема)',
  'Прогулка',
  'Медитация',
  'Разминка',
  'Просто полежать',
  'Другое'
];

export const sleepDisruptorOptions = [
  'Тревожные или навязчивые мысли',
  'Физический дискомфорт',
  'Поздний экран/телефон',
  'Шум, свет',
  'Поздний приём пищи',
  'Стресс или беспокойство',
  'Поздний подъём',
  'Другое'
];