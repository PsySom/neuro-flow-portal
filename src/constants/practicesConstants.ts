export const contentTypes = [
  { id: 'all', label: 'Все типы' },
  { id: 'breathing', label: 'Дыхательные практики' },
  { id: 'relaxation', label: 'Релаксация' },
  { id: 'cognitive', label: 'Когнитивные техники' },
  { id: 'tests', label: 'Тесты' },
  { id: 'meditation', label: 'Медитации' },
  { id: 'grounding', label: 'Техники заземления' },
];

export const therapyMethods = [
  { id: 'cbt', label: 'Когнитивно-поведенческая терапия (КПТ)' },
  { id: 'mindfulness', label: 'Майндфулнесс' },
  { id: 'relaxation', label: 'Релаксационные техники' },
  { id: 'body_work', label: 'Телесно-ориентированная терапия' },
  { id: 'cognitive_restructuring', label: 'Когнитивная реструктуризация' },
  { id: 'assessment', label: 'Оценка и диагностика' },
  { id: 'meditation', label: 'Медитация' },
  { id: 'grounding', label: 'Техники заземления' },
];

export const problems = [
  { id: 'anxiety', label: 'Тревожность' },
  { id: 'stress', label: 'Стресс' },
  { id: 'sleep', label: 'Проблемы со сном' },
  { id: 'tension', label: 'Напряжение' },
  { id: 'depression', label: 'Депрессия' },
  { id: 'negative_thoughts', label: 'Негативные мысли' },
  { id: 'concentration', label: 'Проблемы с концентрацией' },
  { id: 'panic', label: 'Панические атаки' },
  { id: 'dissociation', label: 'Диссоциация' },
];

export const objects = [
  { id: 'emotions', label: 'Эмоции' },
  { id: 'thoughts', label: 'Мысли' },
  { id: 'behavior', label: 'Поведение' },
  { id: 'state', label: 'Состояние' },
];

export const subObjects = {
  emotions: [
    { id: 'fear', label: 'Страх' },
    { id: 'anger', label: 'Гнев' },
    { id: 'sadness', label: 'Грусть' },
    { id: 'joy', label: 'Радость' },
  ],
  thoughts: [
    { id: 'automatic_thoughts', label: 'Автоматические мысли' },
    { id: 'cognitive_distortions', label: 'Когнитивные искажения' },
    { id: 'beliefs', label: 'Убеждения' },
  ],
  behavior: [
    { id: 'avoidance', label: 'Избегание' },
    { id: 'compulsions', label: 'Компульсии' },
    { id: 'rituals', label: 'Ритуалы' },
  ],
  state: [
    { id: 'physical_sensations', label: 'Физические ощущения' },
    { id: 'energy_levels', label: 'Уровень энергии' },
    { id: 'alertness', label: 'Бодрость' },
  ],
};

export const practiceCategories = [
  { id: 'all', label: 'Все категории' },
  { id: 'relaxation', label: 'Релаксация' },
  { id: 'cognitive', label: 'Когнитивные' },
  { id: 'mindfulness', label: 'Осознанность' },
  { id: 'assessment', label: 'Оценка' },
  { id: 'crisis', label: 'Кризисные ситуации' },
];

export const allContent = [
  {
    id: 1,
    title: "Дыхательная техника 4-7-8",
    description: "Простая техника дыхания для снижения тревоги и улучшения сна",
    type: "breathing",
    duration: "5 мин",
    level: "Легко",
    participants: "Индивидуально",
    category: "relaxation",
    therapyMethods: ["cbt", "mindfulness"],
    problems: ["anxiety", "stress", "sleep"],
    objects: ["emotions", "state"],
    tags: ["дыхание", "релаксация", "сон"],
    color: "from-blue-400 to-blue-600",
    instructions: "Найдите удобное положение сидя или лежа. Расслабьтесь и начните медленно дышать.",
    questions: [],
    keys: "",
    responseFormat: ""
  },
  {
    id: 2,
    title: "Прогрессивная мышечная релаксация",
    description: "Техника последовательного напряжения и расслабления мышц",
    type: "relaxation",
    duration: "15 мин",
    level: "Средне",
    participants: "Индивидуально",
    category: "relaxation",
    therapyMethods: ["relaxation", "body_work"],
    problems: ["stress", "tension", "anxiety"],
    objects: ["behavior", "state"],
    tags: ["релаксация", "мышцы", "напряжение"],
    color: "from-green-400 to-green-600",
    instructions: "Ложитесь удобно и начните с напряжения мышц ног на 5 секунд, затем полностью расслабьте их.",
    questions: [],
    keys: "",
    responseFormat: ""
  },
  {
    id: 3,
    title: "Дневник мыслей",
    description: "Структурированная запись негативных мыслей и их альтернатив",
    type: "cognitive",
    duration: "10 мин",
    level: "Средне",
    participants: "Индивидуально",
    category: "cognitive",
    therapyMethods: ["cbt", "cognitive_restructuring"],
    problems: ["negative_thoughts", "anxiety", "depression"],
    objects: ["thoughts"],
    tags: ["мысли", "дневник", "КПТ"],
    color: "from-purple-400 to-purple-600",
    instructions: "Запишите негативную мысль, оцените её реалистичность и найдите более сбалансированную альтернативу.",
    questions: [],
    keys: "",
    responseFormat: ""
  },
  {
    id: 4,
    title: "Тест на уровень тревоги",
    description: "Оценка текущего уровня тревожности по стандартизированной шкале",
    type: "tests",
    duration: "5 мин",
    level: "Легко",
    participants: "Индивидуально",
    category: "assessment",
    therapyMethods: ["assessment"],
    problems: ["anxiety"],
    objects: ["emotions", "state"],
    tags: ["тест", "тревога", "диагностика"],
    color: "from-orange-400 to-orange-600",
    instructions: "Ответьте честно на все вопросы, выбирая наиболее подходящий вариант ответа.",
    questions: [
      "Чувствуете ли вы напряжение или беспокойство?",
      "Трудно ли вам расслабиться?",
      "Беспокоитесь ли вы о будущем?",
      "Испытываете ли вы страх без видимой причины?",
      "Мешает ли тревога вашей повседневной деятельности?"
    ],
    keys: "Подсчет: Да=2 балла, Иногда=1 балл, Нет=0 баллов. 0-3: низкий уровень, 4-7: средний уровень, 8-10: высокий уровень тревоги",
    responseFormat: "Выберите один из вариантов: Да, Нет, Иногда"
  },
  {
    id: 5,
    title: "Медитация осознанности",
    description: "Базовая практика медитации для развития внимательности",
    type: "meditation",
    duration: "10 мин",
    level: "Легко",
    participants: "Индивидуально или группа",
    category: "mindfulness",
    therapyMethods: ["mindfulness", "meditation"],
    problems: ["stress", "anxiety", "concentration"],
    objects: ["thoughts", "emotions", "state"],
    tags: ["медитация", "осознанность", "внимание"],
    color: "from-teal-400 to-teal-600",
    instructions: "Сядьте удобно, закройте глаза и сосредоточьтесь на своем дыхании. Когда ум блуждает, мягко верните внимание к дыханию.",
    questions: [],
    keys: "",
    responseFormat: ""
  },
  {
    id: 6,
    title: "Техника заземления 5-4-3-2-1",
    description: "Быстрая техника для возвращения в настоящий момент через органы чувств",
    type: "grounding",
    duration: "3 мин",
    level: "Легко",
    participants: "Индивидуально",
    category: "crisis",
    therapyMethods: ["mindfulness", "grounding"],
    problems: ["panic", "dissociation", "anxiety"],
    objects: ["state", "emotions"],
    tags: ["заземление", "паника", "чувства"],
    color: "from-red-400 to-red-600",
    instructions: "Назовите 5 вещей, которые видите, 4 - которые можете потрогать, 3 - которые слышите, 2 - которые чувствуете запах, 1 - которую можете попробовать на вкус.",
    questions: [],
    keys: "",
    responseFormat: ""
  }
];
