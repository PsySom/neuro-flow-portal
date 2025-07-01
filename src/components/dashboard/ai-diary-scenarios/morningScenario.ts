
import { DiaryScenario, Question } from './types';

export const morningScenario: DiaryScenario = {
  id: 'morning',
  title: 'Утренний дневник',
  greeting: 'Доброе утро! ☀️ Рада вас видеть. Как начинается ваш день? Давайте вместе посмотрим, как вы себя чувствуете и что важно для вашего дня.',
  timeRange: '7:00-10:00',
  questions: [
    {
      id: 'sleep_quality',
      text: 'Как вам спалось этой ночью?',
      type: 'emoji-scale',
      scaleRange: { min: 1, max: 10 },
      options: [
        { emoji: '😴', label: 'Очень плохо', value: 1 },
        { emoji: '😞', label: 'Плохо', value: 3 },
        { emoji: '😐', label: 'Средне', value: 5 },
        { emoji: '🙂', label: 'Хорошо', value: 7 },
        { emoji: '😊', label: 'Отлично', value: 10 }
      ],
      required: true,
      followUpLogic: (response, sessionData) => {
        if (response >= 8) return 'sleep_good_followup';
        if (response >= 5) return 'sleep_medium_followup';
        return 'sleep_bad_followup';
      }
    },
    {
      id: 'sleep_good_followup',
      text: 'Замечательно! Качественный сон — это отличная основа для дня. Чувствуете ли вы себя отдохнувшим?',
      type: 'multiple-choice',
      options: [
        { emoji: '✨', label: 'Да, полон энергии', value: 'rested' },
        { emoji: '😊', label: 'В целом да', value: 'mostly_rested' },
        { emoji: '😐', label: 'Не совсем', value: 'not_fully_rested' }
      ]
    },
    {
      id: 'sleep_medium_followup',
      text: 'Сон был не идеальным, но неплохой. Что могло на это повлиять?',
      type: 'multi-select',
      options: [
        { label: 'Стресс', value: 'stress' },
        { label: 'Поздно лег/легла', value: 'late_bedtime' },
        { label: 'Беспокойные мысли', value: 'anxious_thoughts' },
        { label: 'Внешние факторы', value: 'external_factors' },
        { label: 'Физический дискомфорт', value: 'physical_discomfort' },
        { label: 'Другое', value: 'other' }
      ]
    },
    {
      id: 'sleep_bad_followup',
      text: 'Понимаю, что ночь была тяжелой. Это влияет на настроение с утра?',
      type: 'multiple-choice',
      options: [
        { emoji: '😔', label: 'Да, настроение низкое', value: 'affects_mood' },
        { emoji: '😐', label: 'Немного влияет', value: 'slightly_affects' },
        { emoji: '💪', label: 'Стараюсь не дать этому повлиять', value: 'fighting_it' }
      ]
    },
    {
      id: 'morning_mood',
      text: 'Как ваше настроение прямо сейчас?',
      type: 'scale',
      scaleRange: { min: -10, max: 10, step: 1 },
      required: true,
      followUpLogic: (response, sessionData) => {
        if (response >= 6) return 'mood_high_followup';
        if (response >= 1) return 'mood_good_followup';
        if (response >= -1) return 'mood_neutral_followup';
        if (response >= -5) return 'mood_low_followup';
        return 'mood_very_low_followup';
      }
    },
    {
      id: 'mood_high_followup',
      text: 'Какое прекрасное начало дня! Что способствует такому хорошему настроению?',
      type: 'multi-select',
      options: [
        { emoji: '😴', label: 'Хорошо выспался/лась', value: 'good_sleep' },
        { emoji: '🎯', label: 'Приятные планы', value: 'nice_plans' },
        { emoji: '💪', label: 'Хорошее самочувствие', value: 'good_health' },
        { emoji: '✨', label: 'Позитивные мысли', value: 'positive_thoughts' },
        { emoji: '🌟', label: 'Другое', value: 'other' }
      ]
    },
    {
      id: 'mood_low_followup',
      text: 'Чувствую, что утро началось не очень легко. Что больше всего влияет на настроение сейчас?',
      type: 'multi-select',
      options: [
        { emoji: '😴', label: 'Плохо спал/а', value: 'bad_sleep' },
        { emoji: '💭', label: 'Тревожные мысли', value: 'anxious_thoughts' },
        { emoji: '📋', label: 'Предстоящие дела', value: 'upcoming_tasks' },
        { emoji: '🤒', label: 'Физическое самочувствие', value: 'physical_state' },
        { emoji: '😔', label: 'Одиночество', value: 'loneliness' },
        { emoji: '❓', label: 'Другое', value: 'other' }
      ]
    },
    {
      id: 'physical_state',
      text: 'Как ваше физическое состояние и энергия?',
      type: 'multiple-choice',
      options: [
        { emoji: '⚡', label: 'Полон сил', value: 'high_energy' },
        { emoji: '🔋', label: 'Заряжен', value: 'good_energy' },
        { emoji: '🔄', label: 'Средне', value: 'medium_energy' },
        { emoji: '🪫', label: 'Устал', value: 'low_energy' },
        { emoji: '😴', label: 'Очень устал', value: 'exhausted' }
      ],
      required: true
    },
    {
      id: 'anxiety_level',
      text: 'Какой уровень тревоги или напряжения?',
      type: 'scale',
      scaleRange: { min: 0, max: 10, step: 1 },
      required: true,
      followUpLogic: (response, sessionData) => {
        if (response >= 7) return 'high_anxiety_followup';
        return null;
      }
    },
    {
      id: 'high_anxiety_followup',
      text: 'Тревога довольно высокая с утра. Хотели бы попробовать технику для снижения тревоги?',
      type: 'multiple-choice',
      options: [
        { emoji: '🫁', label: 'Да, дыхательное упражнение', value: 'breathing_exercise' },
        { emoji: '🌱', label: 'Да, технику заземления', value: 'grounding_technique' },
        { emoji: '⏰', label: 'Не сейчас, но запланировать', value: 'schedule_later' },
        { emoji: '💬', label: 'Поговорить о причинах', value: 'discuss_causes' }
      ]
    },
    {
      id: 'daily_plans',
      text: 'Что сегодня будет важно сделать из дел?',
      type: 'text',
      required: false
    },
    {
      id: 'self_care_plans',
      text: 'Как сегодня важно позаботиться о себе и своих потребностях?',
      type: 'multi-select',
      options: [
        { emoji: '🚶', label: 'Движение, прогулка', value: 'movement' },
        { emoji: '🥗', label: 'Качественное питание', value: 'nutrition' },
        { emoji: '💧', label: 'Достаточно воды', value: 'hydration' },
        { emoji: '😌', label: 'Отдых, перерывы', value: 'rest' },
        { emoji: '🛁', label: 'Гигиена, уход за собой', value: 'hygiene' },
        { emoji: '💚', label: 'Что-то приятное для себя', value: 'pleasant_activity' },
        { emoji: '👥', label: 'Общение с близкими', value: 'social_connection' },
        { emoji: '🎨', label: 'Творчество', value: 'creativity' }
      ]
    },
    {
      id: 'potential_difficulties',
      text: 'Что сегодня может быть трудным или вызвать стресс?',
      type: 'multi-select',
      options: [
        { emoji: '💼', label: 'Рабочие задачи', value: 'work_tasks' },
        { emoji: '💬', label: 'Сложные разговоры', value: 'difficult_conversations' },
        { emoji: '⏰', label: 'Недостаток времени', value: 'time_pressure' },
        { emoji: '😴', label: 'Усталость', value: 'fatigue' },
        { emoji: '💭', label: 'Тревожные мысли', value: 'anxious_thoughts' },
        { emoji: '⚡', label: 'Конфликты', value: 'conflicts' },
        { emoji: '❓', label: 'Неопределенность', value: 'uncertainty' },
        { emoji: '🌟', label: 'Другое', value: 'other' }
      ]
    },
    {
      id: 'coping_strategies',
      text: 'Что поможет вам справиться с трудностями сегодня?',
      type: 'multi-select',
      options: [
        { emoji: '🤝', label: 'Обратиться за помощью к близким', value: 'seek_help' },
        { emoji: '⏸️', label: 'Сделать перерыв в трудный момент', value: 'take_breaks' },
        { emoji: '💬', label: 'Поговорить с кем-то о чувствах', value: 'talk_feelings' },
        { emoji: '🎵', label: 'Заняться чем-то приятным', value: 'pleasant_activity' },
        { emoji: '🫁', label: 'Использовать дыхательную технику', value: 'breathing_technique' },
        { emoji: '💪', label: 'Напомнить себе о своих сильных сторонах', value: 'remind_strengths' },
        { emoji: '📝', label: 'Разбить сложное на мелкие шаги', value: 'break_down_tasks' },
        { emoji: '🤲', label: 'Принять то, что не могу контролировать', value: 'accept_uncontrollable' }
      ]
    }
  ],
  completionMessage: 'Спасибо, что поделились своими планами и чувствами! 🌟 Желаю вам доброго дня! Увидимся в середине дня, чтобы посмотреть, как идут дела.'
};
