
export interface SelfEsteemDiaryData {
  // I. Базовая самооценка дня
  selfSatisfaction: number; // -10 to +10
  processSatisfaction: number; // -10 to +10
  
  // II. Главное событие
  mainEvent: string;
  
  // III. Самооценка: моменты недовольства
  dissatisfactionMoments: string;
  
  // IV. Критикующие мысли
  selfCriticizingThoughts: string;
  othersCriticizingThoughts: string;
  thoughtsConfirmation: string;
  thoughtsRefutation: string;
  selfCriticismHelp: string;
  alternativeEvaluationMethods: string;
  
  // V. Переосмысление и поддержка
  alternativePerspective: string;
  whatWouldOthersDo: string;
  supportForFriend: string;
  innerCriticVoice: string;
  friendAdvocateVoice: string;
  alternativeEvaluation: string;
  
  // VI. Принятие
  canAcceptFeelings: string;
  selfCareStrategies: string;
  preparationStrategies: string;
  selfSupportStrategies: string;
  
  // VII. Самоподдержка
  positiveAspects: string;
  positiveEvaluationOfOthers: string;
  
  // VIII. Самосострадание
  currentFeelings: string;
  acceptUniversalFeelings: string;
  selfCareActions: string;
  supportiveMessage: string;
  
  // IX. Альтернативные вопросы (для позитивных/нейтральных дней)
  whatWentWell: string;
  qualitiesKeep: string;
  howToPraiseSelf: string;
  gratitudeTarget: string;
  balanceFactors: string;
  stableProcesses: string;
  tomorrowBase: string;
  moreSelfSupport: string;
  
  // X. Итоговая самооценка
  attitudeChange: string;
  takeAwayFromDay: string;
}

export const getInitialSelfEsteemData = (): SelfEsteemDiaryData => ({
  selfSatisfaction: 0,
  processSatisfaction: 0,
  mainEvent: '',
  dissatisfactionMoments: '',
  selfCriticizingThoughts: '',
  othersCriticizingThoughts: '',
  thoughtsConfirmation: '',
  thoughtsRefutation: '',
  selfCriticismHelp: '',
  alternativeEvaluationMethods: '',
  alternativePerspective: '',
  whatWouldOthersDo: '',
  supportForFriend: '',
  innerCriticVoice: '',
  friendAdvocateVoice: '',
  alternativeEvaluation: '',
  canAcceptFeelings: '',
  selfCareStrategies: '',
  preparationStrategies: '',
  selfSupportStrategies: '',
  positiveAspects: '',
  positiveEvaluationOfOthers: '',
  currentFeelings: '',
  acceptUniversalFeelings: '',
  selfCareActions: '',
  supportiveMessage: '',
  whatWentWell: '',
  qualitiesKeep: '',
  howToPraiseSelf: '',
  gratitudeTarget: '',
  balanceFactors: '',
  stableProcesses: '',
  tomorrowBase: '',
  moreSelfSupport: '',
  attitudeChange: '',
  takeAwayFromDay: ''
});
