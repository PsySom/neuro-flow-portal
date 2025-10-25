
import { DiaryScenario } from './types';

export const middayScenario: DiaryScenario = {
  id: 'midday',
  title: 'Дневной дневник',
  greeting: 'Привет! Как проходит день? 🌞 Время небольшой паузы для проверки самочувствия. Как вы сейчас?',
  timeRange: '12:00-15:00',
  questions: [
    {
      id: 'current_mood',
      text: 'Пожалуйста, прислушайся к себе и оцени, какое у тебя сейчас настроение',
      type: 'scale',
      scaleRange: { min: -5, max: 5, step: 1 },
      required: true
    },
    {
      id: 'mood_comment',
      text: 'Можешь коротко описать, что особенно влияет на твое настроение сейчас?',
      type: 'text',
      required: false
    },
    {
      id: 'emotions',
      text: 'Попробуй теперь описать, какие эмоции и чувства преобладали сегодня?',
      type: 'multi-select',
      options: [
        // Позитивные эмоции
        { emoji: '😊', label: 'Радость', value: 'joy' },
        { emoji: '🤔', label: 'Интерес', value: 'interest' },
        { emoji: '✨', label: 'Вдохновение', value: 'inspiration' },
        { emoji: '💪', label: 'Уверенность', value: 'confidence' },
        { emoji: '😌', label: 'Спокойствие', value: 'calmness' },
        { emoji: '🙏', label: 'Благодарность', value: 'gratitude' },
        // Нейтральные эмоции
        { emoji: '😲', label: 'Удивление', value: 'surprise' },
        { emoji: '😐', label: 'Скука', value: 'boredom' },
        { emoji: '🤷', label: 'Растерянность', value: 'confusion' },
        { emoji: '🙂', label: 'Спокойное принятие', value: 'acceptance' },
        // Негативные эмоции
        { emoji: '😢', label: 'Грусть', value: 'sadness' },
        { emoji: '😰', label: 'Тревога', value: 'anxiety' },
        { emoji: '😔', label: 'Обида', value: 'resentment' },
        { emoji: '😤', label: 'Раздражение', value: 'irritation' },
        { emoji: '😠', label: 'Злость', value: 'anger' },
        { emoji: '😑', label: 'Апатия', value: 'apathy' },
        { emoji: '😴', label: 'Усталость', value: 'fatigue' },
        { emoji: '😨', label: 'Страх', value: 'fear' }
      ],
      required: false
    },
    {
      id: 'emotion_intensity',
      text: 'Оцени интенсивность выбранных эмоций',
      type: 'scale',
      scaleRange: { min: 1, max: 10, step: 1 },
      required: false
    },
    {
      id: 'emotion_trigger',
      text: 'Если хочется, опиши, как это проявлялось или что этому способствовало:',
      type: 'text',
      required: false
    },
    {
      id: 'body_state',
      text: 'Как это влияло на твое состояние тела?',
      type: 'text',
      required: false
    },
    {
      id: 'mood_comparison',
      text: 'По сравнению с утром настроение:',
      type: 'multiple-choice',
      options: [
        { emoji: '📈', label: 'Лучше', value: 'better' },
        { emoji: '➡️', label: 'Так же', value: 'same' },
        { emoji: '📉', label: 'Хуже', value: 'worse' }
      ],
      followUpLogic: (response, sessionData) => {
        if (response === 'better') return 'mood_improved_followup';
        if (response === 'worse') return 'mood_declined_followup';
        return 'mood_stable_followup';
      }
    },
    {
      id: 'mood_improved_followup',
      text: 'Заметно, что настроение поднялось! Что помогло?',
      type: 'multi-select',
      options: [
        { emoji: '✅', label: 'Успешно сделанные дела', value: 'achievements' },
        { emoji: '👥', label: 'Приятное общение', value: 'social_interaction' },
        { emoji: '🏃', label: 'Физическая активность', value: 'physical_activity' },
        { emoji: '😌', label: 'Отдых', value: 'rest' },
        { emoji: '📰', label: 'Хорошие новости', value: 'good_news' },
        { emoji: '⏰', label: 'Просто время', value: 'time_passing' },
        { emoji: '🌟', label: 'Другое', value: 'other' }
      ]
    },
    {
      id: 'mood_declined_followup',
      text: 'Чувствую, что день дается непросто. Что повлияло на изменение настроения?',
      type: 'multi-select',
      options: [
        { emoji: '😰', label: 'Стрессовые ситуации', value: 'stressful_situations' },
        { emoji: '😴', label: 'Усталость', value: 'fatigue' },
        { emoji: '⚡', label: 'Конфликты', value: 'conflicts' },
        { emoji: '❌', label: 'Неудачи', value: 'failures' },
        { emoji: '🤒', label: 'Физическое самочувствие', value: 'physical_state' },
        { emoji: '💭', label: 'Тревожные мысли', value: 'anxious_thoughts' },
        { emoji: '❓', label: 'Другое', value: 'other' }
      ]
    },
    {
      id: 'energy_level',
      text: 'Как ваш энергетический уровень?',
      type: 'scale',
      scaleRange: { min: 1, max: 10, step: 1 },
      required: true,
      followUpLogic: (response, sessionData) => {
        if (response <= 3) return 'low_energy_followup';
        return null;
      }
    },
    {
      id: 'low_energy_followup',
      text: 'Энергия на исходе. Это нормально для середины дня. Что обычно помогает восстановиться?',
      type: 'multi-select',
      options: [
        { emoji: '😴', label: 'Короткий отдых', value: 'short_rest' },
        { emoji: '🍎', label: 'Перекус', value: 'snack' },
        { emoji: '🚶', label: 'Прогулка', value: 'walk' },
        { emoji: '🔄', label: 'Смена деятельности', value: 'change_activity' },
        { emoji: '👥', label: 'Общение', value: 'social_interaction' },
        { emoji: '🌟', label: 'Другое', value: 'other' }
      ]
    },
    {
      id: 'stress_level',
      text: 'Какой уровень стресса сейчас?',
      type: 'scale',
      scaleRange: { min: 0, max: 10, step: 1 },
      required: true,
      followUpLogic: (response, sessionData) => {
        if (response >= 6) return 'high_stress_followup';
        return null;
      }
    },
    {
      id: 'high_stress_followup',
      text: 'Довольно высокий уровень стресса. С чем это связано?',
      type: 'multi-select',
      options: [
        { emoji: '💼', label: 'Рабочие задачи', value: 'work_tasks' },
        { emoji: '⏰', label: 'Нехватка времени', value: 'time_pressure' },
        { emoji: '⚡', label: 'Конфликты', value: 'conflicts' },
        { emoji: '❓', label: 'Неопределенность', value: 'uncertainty' },
        { emoji: '💪', label: 'Физическое напряжение', value: 'physical_tension' },
        { emoji: '🌟', label: 'Другое', value: 'other' }
      ]
    },
    {
      id: 'first_half_satisfaction',
      text: 'Насколько вы удовлетворены тем, что успели сделать в первой половине дня?',
      type: 'scale',
      scaleRange: { min: 1, max: 10, step: 1 },
      required: true
    },
    {
      id: 'process_satisfaction',
      text: 'Насколько вы удовлетворены тем, КАК проходил день — ритмом, подходом к делам?',
      type: 'scale',
      scaleRange: { min: 1, max: 10, step: 1 },
      required: true
    },
    {
      id: 'second_half_plans',
      text: 'Что будет важно сделать во второй половине дня?',
      type: 'text',
      required: false
    },
    {
      id: 'current_needs',
      text: 'Чего не хватает сейчас? Что нужно вашему организму и душе?',
      type: 'multi-select',
      options: [
        { emoji: '😴', label: 'Отдых, сон', value: 'rest_sleep' },
        { emoji: '🍎', label: 'Еда, вода', value: 'food_water' },
        { emoji: '🏃', label: 'Движение, активность', value: 'movement' },
        { emoji: '🌬️', label: 'Свежий воздух', value: 'fresh_air' },
        { emoji: '😌', label: 'Спокойствие', value: 'calmness' },
        { emoji: '😊', label: 'Радость, удовольствие', value: 'joy' },
        { emoji: '🤗', label: 'Поддержка, понимание', value: 'support' },
        { emoji: '👥', label: 'Общение', value: 'social_connection' },
        { emoji: '🎨', label: 'Творчество', value: 'creativity' },
        { emoji: '📚', label: 'Новая информация', value: 'learning' }
      ]
    }
  ],
  completionMessage: 'Спасибо за честность в ответах! 🌟 Увидимся вечером для подведения итогов дня!'
};
