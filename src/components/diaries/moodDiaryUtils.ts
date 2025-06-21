
export const emotionsData = {
  positive: [
    { name: 'радость', emoji: '😊' },
    { name: 'интерес', emoji: '🤔' },
    { name: 'вдохновение', emoji: '✨' },
    { name: 'уверенность', emoji: '💪' },
    { name: 'спокойствие', emoji: '😌' },
    { name: 'благодарность', emoji: '🙏' },
    { name: 'гордость', emoji: '🎉' },
    { name: 'воодушевление', emoji: '🚀' },
    { name: 'умиротворение', emoji: '🕊️' },
    { name: 'любовь', emoji: '❤️' },
    { name: 'нежность', emoji: '🤗' },
  ],
  neutral: [
    { name: 'удивление', emoji: '😲' },
    { name: 'скука', emoji: '😐' },
    { name: 'ожидание', emoji: '⏳' },
    { name: 'растерянность', emoji: '🤷' },
    { name: 'спокойное принятие', emoji: '🙂' },
    { name: 'ностальгия', emoji: '💭' },
  ],
  negative: [
    { name: 'грусть', emoji: '😢' },
    { name: 'тревога', emoji: '😰' },
    { name: 'обида', emoji: '😔' },
    { name: 'раздражение', emoji: '😤' },
    { name: 'злость', emoji: '😠' },
    { name: 'апатия', emoji: '😑' },
    { name: 'беспокойство', emoji: '😟' },
    { name: 'фрустрация', emoji: '😣' },
    { name: 'разочарование', emoji: '😞' },
    { name: 'усталость', emoji: '😴' },
    { name: 'вина', emoji: '😳' },
    { name: 'стыд', emoji: '😓' },
    { name: 'страх', emoji: '😨' },
    { name: 'одиночество', emoji: '😶' },
    { name: 'беспомощность', emoji: '😵' },
  ],
};

export const getMoodEmoji = (mood: number): string => {
  if (mood <= -4) return '😞';
  if (mood === -3) return '😔';
  if (mood === -2) return '😕';
  if (mood === -1) return '😐';
  if (mood === 0) return '🙂';
  if (mood === 1) return '😊';
  if (mood === 2) return '😃';
  if (mood === 3) return '😄';
  if (mood === 4) return '😁';
  if (mood >= 5) return '🤩';
  return '🙂';
};

export const getMoodZone = (mood: number) => {
  if (mood <= -2) {
    return {
      description: 'Негативное настроение',
      color: 'bg-blue-100 border border-blue-300',
      zone: 'negative'
    };
  }
  if (mood >= 2) {
    return {
      description: 'Позитивное настроение',
      color: 'bg-yellow-100 border border-yellow-300',
      zone: 'positive'
    };
  }
  return {
    description: 'Нейтральное настроение',
    color: 'bg-gray-100 border border-gray-300',
    zone: 'neutral'
  };
};

export const getRecommendations = (data: any): string[] => {
  const recommendations: string[] = [];
  
  // Рекомендации на основе настроения
  if (data.mood <= -3) {
    recommendations.push('🫁 Попробуй дыхательную паузу - 4 вдоха на 4 счета, задержка на 4, выдох на 6.');
    recommendations.push('🌱 Практика самосострадания: обратись к себе так же ласково, как к лучшему другу.');
  }
  
  if (data.mood >= 4) {
    recommendations.push('✨ Отличное настроение! Зафиксируй этот момент - запиши, что тебя радует.');
    recommendations.push('🙏 Практика благодарности: назови 3 вещи, за которые ты благодарен сегодня.');
  }

  // Рекомендации на основе интенсивных негативных эмоций
  const hasHighNegativeEmotions = data.selectedEmotions?.some((emotion: any) => {
    const emotionData = emotionsData.negative.find(e => e.name === emotion.name);
    return emotionData && emotion.intensity >= 7;
  });

  if (hasHighNegativeEmotions) {
    recommendations.push('🧠 Упражнение "5-4-3-2-1": найди 5 вещей, которые видишь, 4 - которые слышишь, 3 - которые чувствуешь.');
    recommendations.push('📝 Попробуй записать свои мысли на бумаге - это поможет их структурировать.');
  }

  // Рекомендации на основе когнитивных искажений
  if (data.hasCognitiveBias) {
    recommendations.push('💭 Отличная работа с переформулированием мыслей! Продолжай практиковать гибкое мышление.');
    recommendations.push('🔍 Упражнение "Детектив": найди доказательства "за" и "против" своей негативной мысли.');
  }

  // Рекомендации на основе самооценки
  if (data.selfEvaluation <= -1) {
    recommendations.push('🤗 Будь добрее к себе. Ты делаешь все, что можешь в текущих обстоятельствах.');
    recommendations.push('🌟 Вспомни одну маленькую вещь, которую ты сегодня сделал хорошо.');
  }

  // Базовые рекомендации для заботы о себе
  if (recommendations.length === 0) {
    recommendations.push('💚 Сегодня ты был честен с собой, заполнив дневник. Это уже большой шаг!');
    recommendations.push('🌸 Сделай что-то приятное для себя: выпей любимый чай или послушай музыку.');
  }

  return recommendations;
};

export const analyzeMoodTrend = (entries: any[]) => {
  // Функция для анализа трендов настроения
  if (entries.length === 0) return null;
  
  const recent = entries.slice(-7); // Последние 7 записей
  const avgMood = recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length;
  
  return {
    averageMood: avgMood,
    trend: avgMood > 0 ? 'positive' : avgMood < 0 ? 'negative' : 'neutral',
    recommendation: avgMood < -2 ? 'Рекомендуем обратиться к специалисту' : 'Продолжай заботиться о себе'
  };
};
