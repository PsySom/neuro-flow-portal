
import { DiaryScenario } from './types';

export const eveningScenario: DiaryScenario = {
  id: 'evening',
  title: 'Вечерний дневник',
  greeting: 'Добрый вечер! 🌙 День подходит к концу. Время подвести итоги и позаботиться о себе. Как прошел ваш день?',
  timeRange: '19:00-22:00',
  questions: [
    {
      id: 'evening_mood',
      text: 'Как ваше настроение сейчас?',
      type: 'scale',
      scaleRange: { min: -10, max: 10, step: 1 },
      required: true
    },
    {
      id: 'current_emotions',
      text: 'Что вы чувствуете прямо сейчас? Выберите до 3 эмоций:',
      type: 'multi-select',
      options: [
        { emoji: '😊', label: 'Радость', value: 'joy' },
        { emoji: '😌', label: 'Удовлетворение', value: 'satisfaction' },
        { emoji: '😌', label: 'Спокойствие', value: 'calmness' },
        { emoji: '🙏', label: 'Благодарность', value: 'gratitude' },
        { emoji: '😊', label: 'Гордость', value: 'pride' },
        { emoji: '❤️', label: 'Любовь', value: 'love' },
        { emoji: '😴', label: 'Усталость', value: 'fatigue' },
        { emoji: '🤔', label: 'Задумчивость', value: 'thoughtfulness' },
        { emoji: '😔', label: 'Грусть', value: 'sadness' },
        { emoji: '😰', label: 'Тревога', value: 'anxiety' },
        { emoji: '😤', label: 'Раздражение', value: 'irritation' },
        { emoji: '😞', label: 'Вина', value: 'guilt' },
        { emoji: '😔', label: 'Одиночество', value: 'loneliness' },
        { emoji: '😞', label: 'Разочарование', value: 'disappointment' }
      ]
    },
    {
      id: 'energy_level_evening',
      text: 'Как ваш энергетический уровень?',
      type: 'multiple-choice',
      options: [
        { emoji: '⚡', label: 'Полон энергии', value: 'high' },
        { emoji: '🔋', label: 'Есть силы', value: 'good' },
        { emoji: '🔄', label: 'Средне', value: 'medium' },
        { emoji: '🪫', label: 'Устал', value: 'low' },
        { emoji: '😴', label: 'Очень устал', value: 'exhausted' }
      ],
      required: true
    },
    {
      id: 'positive_moments',
      text: 'Вспомните три вещи или момента дня, которые были приятными:',
      type: 'text',
      required: true
    },
    {
      id: 'day_satisfaction_results',
      text: 'Насколько вы удовлетворены результатами дня — тем, что успели сделать?',
      type: 'scale',
      scaleRange: { min: 1, max: 10, step: 1 },
      required: true
    },
    {
      id: 'day_satisfaction_selfcare',
      text: 'Насколько вы удовлетворены заботой о себе сегодня?',
      type: 'scale',
      scaleRange: { min: 1, max: 10, step: 1 },
      required: true
    },
    {
      id: 'self_criticism',
      text: 'Критиковали ли вы себя сегодня?',
      type: 'multiple-choice',
      options: [
        { emoji: '😔', label: 'Да, часто', value: 'often' },
        { emoji: '😐', label: 'Немного', value: 'little' },
        { emoji: '😊', label: 'Нет, не критиковал/а', value: 'none' }
      ],
      followUpLogic: (response, sessionData) => {
        if (response === 'often' || response === 'little') return 'self_criticism_followup';
        return null;
      }
    },
    {
      id: 'self_criticism_followup',
      text: 'За что именно критиковали себя?',
      type: 'multi-select',
      options: [
        { emoji: '💼', label: 'Работа', value: 'work' },
        { emoji: '👀', label: 'Внешность', value: 'appearance' },
        { emoji: '👥', label: 'Отношения', value: 'relationships' },
        { emoji: '💭', label: 'Личные качества', value: 'personal_qualities' },
        { emoji: '⏰', label: 'Прошлые решения', value: 'past_decisions' },
        { emoji: '❓', label: 'Другое', value: 'other' }
      ]
    },
    {
      id: 'achievements',
      text: 'В чем вы были сегодня достаточно хороши? За что можете себя похвалить?',
      type: 'text',
      required: false
    },
    {
      id: 'difficulties',
      text: 'С чем было труднее всего справиться сегодня?',
      type: 'text',
      required: false
    },
    {
      id: 'avoidance',
      text: 'Чего вы избегали сегодня?',
      type: 'multi-select',
      options: [
        { emoji: '💬', label: 'Сложных разговоров', value: 'difficult_conversations' },
        { emoji: '📋', label: 'Трудных задач', value: 'difficult_tasks' },
        { emoji: '💭', label: 'Эмоций', value: 'emotions' },
        { emoji: '👥', label: 'Людей', value: 'people' },
        { emoji: '🤔', label: 'Принятия решений', value: 'decision_making' },
        { emoji: '✅', label: 'Ничего не избегал/а', value: 'nothing' },
        { emoji: '❓', label: 'Другое', value: 'other' }
      ]
    },
    {
      id: 'anxious_thoughts',
      text: 'Были ли у вас сегодня навязчивые или тревожные мысли?',
      type: 'multiple-choice',
      options: [
        { emoji: '😰', label: 'Да, довольно часто', value: 'yes_often' },
        { emoji: '😐', label: 'Немного', value: 'yes_little' },
        { emoji: '😊', label: 'Нет', value: 'no' }
      ],
      followUpLogic: (response, sessionData) => {
        if (response === 'yes_often' || response === 'yes_little') return 'anxious_thoughts_followup';
        return null;
      }
    },
    {
      id: 'anxious_thoughts_followup',
      text: 'О чем были эти мысли?',
      type: 'multi-select',
      options: [
        { emoji: '🔮', label: 'Будущее', value: 'future' },
        { emoji: '⏪', label: 'Прошлое', value: 'past' },
        { emoji: '🏥', label: 'Здоровье', value: 'health' },
        { emoji: '👥', label: 'Отношения', value: 'relationships' },
        { emoji: '💼', label: 'Работа', value: 'work' },
        { emoji: '💭', label: 'Самооценка', value: 'self_esteem' },
        { emoji: '❓', label: 'Другое', value: 'other' }
      ]
    },
    {
      id: 'sleep_readiness',
      text: 'Как вы себя чувствуете сейчас? Готовы ли к отдыху?',
      type: 'multiple-choice',
      options: [
        { emoji: '😴', label: 'Готов/а ко сну', value: 'ready_for_sleep' },
        { emoji: '😌', label: 'Нужно еще расслабиться', value: 'need_to_relax' },
        { emoji: '😰', label: 'Слишком взволнован/а', value: 'too_anxious' },
        { emoji: '💭', label: 'Мысли не дают покоя', value: 'racing_thoughts' }
      ]
    },
    {
      id: 'evening_rituals',
      text: 'Что поможет хорошо завершить день?',
      type: 'multi-select',
      options: [
        { emoji: '🎵', label: 'Расслабляющая музыка', value: 'relaxing_music' },
        { emoji: '📚', label: 'Чтение', value: 'reading' },
        { emoji: '🛁', label: 'Теплая ванна', value: 'warm_bath' },
        { emoji: '🧘', label: 'Медитация', value: 'meditation' },
        { emoji: '🙏', label: 'Благодарность', value: 'gratitude' },
        { emoji: '📝', label: 'Планирование завтра', value: 'planning_tomorrow' },
        { emoji: '🌟', label: 'Другое', value: 'other' }
      ]
    },
    {
      id: 'tomorrow_support',
      text: 'О чем важно напомнить себе завтра? Какая поддержка нужна?',
      type: 'multi-select',
      options: [
        { emoji: '💚', label: 'Быть добрее к себе', value: 'be_kinder' },
        { emoji: '⏸️', label: 'Помнить о перерывах', value: 'remember_breaks' },
        { emoji: '🎯', label: 'Не браться за все сразу', value: 'not_everything_at_once' },
        { emoji: '🤝', label: 'Обратиться за помощью', value: 'ask_for_help' },
        { emoji: '😊', label: 'Сделать что-то приятное', value: 'do_something_nice' },
        { emoji: '🍎', label: 'Позаботиться о базовых потребностях', value: 'basic_needs' }
      ]
    }
  ],
  completionMessage: 'Спасибо за откровенность и внимание к себе сегодня! 🌟 Доброй ночи! Завтра новый день, новые возможности. 💫'
};
