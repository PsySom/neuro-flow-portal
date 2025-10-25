
export const lifeSpheres = [
  { emoji: '💼', label: 'Работа/учеба', value: 'work' },
  { emoji: '👨‍👩‍👧‍👦', label: 'Семья', value: 'family' },
  { emoji: '❤️', label: 'Отношения', value: 'relationships' },
  { emoji: '🏥', label: 'Здоровье', value: 'health' },
  { emoji: '💰', label: 'Финансы', value: 'money' },
  { emoji: '👥', label: 'Друзья', value: 'friends' },
  { emoji: '🎯', label: 'Цели', value: 'goals' },
  { emoji: '🏠', label: 'Дом/быт', value: 'home' },
  { emoji: '🎨', label: 'Творчество', value: 'creativity' },
  { emoji: '⚡', label: 'Энергия/состояние', value: 'energy' },
  { emoji: '🌍', label: 'Внешние события', value: 'external' },
  { emoji: '🧠', label: 'Мысли', value: 'thoughts' }
];

export const bodyStates = [
  // Негативные состояния (больше)
  { emoji: '😴', label: 'Усталость', value: 'tired', type: 'negative' },
  { emoji: '😰', label: 'Напряжение', value: 'tense', type: 'negative' },
  { emoji: '🤕', label: 'Боль/дискомфорт', value: 'pain', type: 'negative' },
  { emoji: '😵‍💫', label: 'Головокружение', value: 'dizzy', type: 'negative' },
  { emoji: '🫨', label: 'Тревожность в теле', value: 'anxious_body', type: 'negative' },
  { emoji: '🤒', label: 'Болезненность', value: 'sick', type: 'negative' },
  { emoji: '😣', label: 'Дискомфорт', value: 'discomfort', type: 'negative' },
  { emoji: '😖', label: 'Стеснение в груди', value: 'chest_tightness', type: 'negative' },
  { emoji: '🥵', label: 'Жар/лихорадка', value: 'fever', type: 'negative' },
  { emoji: '🥶', label: 'Озноб', value: 'chills', type: 'negative' },
  { emoji: '😷', label: 'Недомогание', value: 'malaise', type: 'negative' },
  { emoji: '🤢', label: 'Тошнота', value: 'nausea', type: 'negative' },
  { emoji: '😵', label: 'Слабость', value: 'weakness', type: 'negative' },
  { emoji: '🫠', label: 'Истощение', value: 'exhaustion', type: 'negative' },
  
  // Нейтральные состояния
  { emoji: '😶', label: 'Онемение', value: 'numb', type: 'neutral' },
  { emoji: '😐', label: 'Обычное состояние', value: 'normal', type: 'neutral' },
  { emoji: '🙂', label: 'Спокойствие', value: 'calm', type: 'neutral' },
  
  // Позитивные состояния (меньше)
  { emoji: '💪', label: 'Энергичность', value: 'energetic', type: 'positive' },
  { emoji: '😌', label: 'Расслабленность', value: 'relaxed', type: 'positive' },
  { emoji: '✨', label: 'Легкость', value: 'light', type: 'positive' },
  { emoji: '🔥', label: 'Жизненная сила', value: 'vital', type: 'positive' },
  
  // Опция для своего ответа
  { emoji: '✍️', label: 'Другое', value: 'custom', type: 'neutral' }
];
