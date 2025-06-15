export const contentTypes = [
  { id: 'all', label: 'Все типы' },
  { id: 'exercises', label: 'Упражнения' },
  { id: 'practices', label: 'Практики' },
  { id: 'tests', label: 'Тесты' }
];

export const therapyMethods = [
  { id: 'cbt', label: 'КПТ (Когнитивно-поведенческая терапия)' },
  { id: 'act', label: 'ACT (Терапия принятия и ответственности)' },
  { id: 'dbt', label: 'DBT (Диалектическая поведенческая терапия)' },
  { id: 'mindfulness', label: 'Mindfulness (Осознанность)' },
  { id: 'compassion', label: 'SFT Терапия сфокусированная на сострадании' },
  { id: 'gestalt', label: 'Гештальт-терапия' },
  { id: 'psychodynamic', label: 'Психодинамическая терапия' },
  { id: 'humanistic', label: 'Гуманистическая терапия' },
  { id: 'other', label: 'Другое' }
];

export const problems = [
  { id: 'anxiety', label: 'Тревога и беспокойство' },
  { id: 'depression', label: 'Депрессия и подавленность' },
  { id: 'stress', label: 'Стресс и выгорание' },
  { id: 'self-criticism', label: 'Самокритика и низкая самооценка' },
  { id: 'motivation', label: 'Прокрастинация и мотивация' },
  { id: 'relationships', label: 'Отношения' },
  { id: 'trauma', label: 'Травма и ПТСР' },
  { id: 'sleep', label: 'Проблемы со сном' },
  { id: 'anger', label: 'Гнев и агрессия' },
  { id: 'addiction', label: 'Зависимости' }
];

export const objects = [
  { id: 'thoughts', label: 'Мысли' },
  { id: 'self-esteem', label: 'Самооценка' },
  { id: 'self-criticism', label: 'Самокритика' },
  { id: 'emotions', label: 'Эмоции и чувства' },
  { id: 'states', label: 'Состояния' },
  { id: 'behavior', label: 'Поведение' },
  { id: 'diagnostic-tests', label: 'Диагностические тесты' },
  { id: 'typological-tests', label: 'Типологические тесты' }
];

export const subObjects = {
  thoughts: [
    { id: 'self-esteem-thoughts', label: 'Самооценка' },
    { id: 'self-criticism-thoughts', label: 'Самокритика' },
    { id: 'anxious-thoughts', label: 'Тревожные мысли' },
    { id: 'intrusive-thoughts', label: 'Навязчивые мысли' },
    { id: 'self-support', label: 'Самоподдержка' },
    { id: 'beliefs', label: 'Убеждения' },
    { id: 'rumination', label: 'Руминация' },
    { id: 'catastrophizing', label: 'Катастрофизация' }
  ],
  emotions: [
    { id: 'fear', label: 'Страх' },
    { id: 'anxiety', label: 'Тревога' },
    { id: 'worry', label: 'Беспокойство' },
    { id: 'euphoria', label: 'Эйфория' },
    { id: 'sadness', label: 'Грусть' },
    { id: 'anger', label: 'Гнев' },
    { id: 'shame', label: 'Стыд' },
    { id: 'guilt', label: 'Вина' },
    { id: 'joy', label: 'Радость' },
    { id: 'loneliness', label: 'Одиночество' }
  ],
  states: [
    { id: 'stress', label: 'Стресс' },
    { id: 'anxiety-state', label: 'Тревога' },
    { id: 'apathy', label: 'Апатия' },
    { id: 'frustration', label: 'Фрустрация' },
    { id: 'disorientation', label: 'Дезориентация' },
    { id: 'affect', label: 'Аффект' },
    { id: 'panic', label: 'Паника' },
    { id: 'tension', label: 'Напряжение' },
    { id: 'burnout', label: 'Выгорание' },
    { id: 'overwhelm', label: 'Перегрузка' }
  ],
  behavior: [
    { id: 'avoidance', label: 'Избегание' },
    { id: 'procrastination', label: 'Прокрастинация' },
    { id: 'compulsions', label: 'Компульсии' },
    { id: 'addictive-behavior', label: 'Аддиктивное поведение' },
    { id: 'aggression', label: 'Агрессия' },
    { id: 'self-harm', label: 'Самоповреждение' },
    { id: 'social-withdrawal', label: 'Социальная изоляция' },
    { id: 'perfectionism', label: 'Перфекционизм' }
  ],
  'self-esteem': [],
  'self-criticism': [],
  'diagnostic-tests': [],
  'typological-tests': []
};

export const practiceCategories = [
  { id: 'all', label: 'Все категории' },
  { id: 'clinical', label: 'Клинические (научно обоснованные)' },
  { id: 'therapeutic', label: 'Терапевтические' },
  { id: 'other', label: 'Другие' }
];

export const allContent = [
  {
    id: 1,
    title: 'Дыхание 4-7-8',
    description: 'Техника для быстрого снижения тревожности и засыпания',
    type: 'exercises',
    duration: '5 мин',
    level: 'Легко',
    participants: '12.5k',
    category: 'clinical',
    therapyMethods: ['cbt', 'mindfulness'],
    problems: ['anxiety', 'sleep', 'stress'],
    objects: ['states', 'emotions'],
    tags: ['Дыхание', 'Тревога', 'Релаксация'],
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 2,
    title: 'Сканирование тела',
    description: 'Практика осознанности для расслабления и снятия напряжения',
    type: 'practices',
    duration: '15 мин',
    level: 'Средне',
    participants: '8.3k',
    category: 'clinical',
    therapyMethods: ['mindfulness', 'gestalt'],
    problems: ['stress', 'anxiety'],
    objects: ['states', 'emotions'],
    tags: ['Медитация', 'Расслабление', 'Осознанность'],
    color: 'from-green-400 to-emerald-600'
  },
  {
    id: 3,
    title: 'Колесо эмоций',
    description: 'Интерактивный тест для определения и осознания текущих эмоций',
    type: 'tests',
    duration: '3 мин',
    level: 'Легко',
    participants: '15.7k',
    category: 'diagnostic-tests',
    therapyMethods: ['cbt', 'dbt'],
    problems: ['emotions'],
    objects: ['emotions', 'diagnostic-tests'],
    tags: ['Эмоции', 'Тест', 'Диагностика'],
    color: 'from-purple-400 to-purple-600'
  },
  {
    id: 4,
    title: 'Шкала самосострадания',
    description: 'Оценка уровня самосострадания и доброты к себе',
    type: 'tests',
    duration: '10 мин',
    level: 'Средне',
    participants: '9.2k',
    category: 'diagnostic-tests',
    therapyMethods: ['compassion', 'act'],
    problems: ['self-criticism', 'depression'],
    objects: ['self-esteem', 'self-criticism', 'diagnostic-tests'],
    tags: ['Самосострадание', 'Самооценка', 'Тест'],
    color: 'from-pink-400 to-rose-600'
  },
  {
    id: 5,
    title: 'Техника STOP',
    description: 'Быстрая техника остановки негативных мыслительных циклов',
    type: 'exercises',
    duration: '2 мин',
    level: 'Легко',
    participants: '18.1k',
    category: 'clinical',
    therapyMethods: ['cbt', 'mindfulness'],
    problems: ['anxiety', 'stress', 'anger'],
    objects: ['thoughts', 'emotions'],
    tags: ['КПТ', 'Мысли', 'Стоп-техника'],
    color: 'from-red-400 to-orange-500'
  },
  {
    id: 6,
    title: 'Большая Пятерка личности',
    description: 'Научно обоснованный тест личностных черт',
    type: 'tests',
    duration: '15 мин',
    level: 'Средне',
    participants: '25.3k',
    category: 'typological-tests',
    therapyMethods: ['psychodynamic', 'humanistic'],
    problems: [],
    objects: ['typological-tests'],
    tags: ['Личность', 'Типология', 'Тест'],
    color: 'from-indigo-400 to-purple-600'
  }
];
