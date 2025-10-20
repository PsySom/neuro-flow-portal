-- Создаем сценарий для дневника сна
INSERT INTO therapy_scenarios (scenario_code, name, description, scenario_type, duration_minutes, priority, is_active)
VALUES (
  'sleep_diary_flow',
  'Дневник сна и отдыха',
  'Структурированный дневник для отслеживания качества сна, восстановления и факторов влияния',
  'diary',
  5,
  50,
  true
);

-- Создаем вопросы для сценария сна
INSERT INTO therapy_questions (scenario_id, sequence_number, question_code, question_text, question_type, metadata)
SELECT 
  s.id,
  1,
  'bedtime',
  'Во сколько ты лёг спать вчера?',
  'time',
  '{"format": "HH:mm"}'::jsonb
FROM therapy_scenarios s WHERE s.scenario_code = 'sleep_diary_flow';

INSERT INTO therapy_questions (scenario_id, sequence_number, question_code, question_text, question_type, metadata)
SELECT 
  s.id,
  2,
  'wake_up_time',
  'Во сколько проснулся сегодня?',
  'time',
  '{"format": "HH:mm"}'::jsonb
FROM therapy_scenarios s WHERE s.scenario_code = 'sleep_diary_flow';

INSERT INTO therapy_questions (scenario_id, sequence_number, question_code, question_text, question_type, metadata)
SELECT 
  s.id,
  3,
  'sleep_quality',
  'Как оценишь качество сна? (0 = очень плохо, 10 = отлично)',
  'scale',
  '{"min": 0, "max": 10, "step": 1}'::jsonb
FROM therapy_scenarios s WHERE s.scenario_code = 'sleep_diary_flow';

INSERT INTO therapy_questions (scenario_id, sequence_number, question_code, question_text, question_type, metadata)
SELECT 
  s.id,
  4,
  'night_awakenings',
  'Сколько раз просыпался ночью?',
  'number',
  '{"min": 0, "max": 20, "unit": "раз"}'::jsonb
FROM therapy_scenarios s WHERE s.scenario_code = 'sleep_diary_flow';

INSERT INTO therapy_questions (scenario_id, sequence_number, question_code, question_text, question_type, metadata)
SELECT 
  s.id,
  5,
  'morning_feeling',
  'Как чувствуешь себя утром? (0 = разбитый, 10 = бодрый)',
  'scale',
  '{"min": 0, "max": 10, "step": 1}'::jsonb
FROM therapy_scenarios s WHERE s.scenario_code = 'sleep_diary_flow';

INSERT INTO therapy_questions (scenario_id, sequence_number, question_code, question_text, question_type, metadata)
SELECT 
  s.id,
  6,
  'has_day_rest',
  'Был ли дневной отдых/сон?',
  'chips',
  '{"options": [{"id": "yes", "label": "Да"}, {"id": "no", "label": "Нет"}], "maxSelect": 1}'::jsonb
FROM therapy_scenarios s WHERE s.scenario_code = 'sleep_diary_flow';

INSERT INTO therapy_questions (scenario_id, sequence_number, question_code, question_text, question_type, metadata)
SELECT 
  s.id,
  7,
  'day_rest_type',
  'Какой был отдых?',
  'chips',
  '{"options": [{"id": "nap", "label": "Сон", "emoji": "😴"}, {"id": "meditation", "label": "Медитация", "emoji": "🧘"}, {"id": "relaxation", "label": "Отдых лёжа", "emoji": "🛋️"}, {"id": "walk", "label": "Прогулка", "emoji": "🚶"}], "maxSelect": 1}'::jsonb
FROM therapy_scenarios s WHERE s.scenario_code = 'sleep_diary_flow';

INSERT INTO therapy_questions (scenario_id, sequence_number, question_code, question_text, question_type, metadata)
SELECT 
  s.id,
  8,
  'day_rest_effectiveness',
  'Насколько эффективен был дневной отдых? (0 = не помог, 10 = очень помог)',
  'scale',
  '{"min": 0, "max": 10, "step": 1}'::jsonb
FROM therapy_scenarios s WHERE s.scenario_code = 'sleep_diary_flow';

INSERT INTO therapy_questions (scenario_id, sequence_number, question_code, question_text, question_type, metadata)
SELECT 
  s.id,
  9,
  'overall_sleep_impact',
  'Как сон повлиял на твой день? (0 = негативно, 10 = очень позитивно)',
  'scale',
  '{"min": 0, "max": 10, "step": 1}'::jsonb
FROM therapy_scenarios s WHERE s.scenario_code = 'sleep_diary_flow';

INSERT INTO therapy_questions (scenario_id, sequence_number, question_code, question_text, question_type, metadata)
SELECT 
  s.id,
  10,
  'sleep_disruptors',
  'Что мешало сну? (можно выбрать несколько)',
  'chips',
  '{"options": [
    {"id": "stress", "label": "Стресс", "emoji": "😰"}, 
    {"id": "noise", "label": "Шум", "emoji": "🔊"}, 
    {"id": "light", "label": "Свет", "emoji": "💡"}, 
    {"id": "temperature", "label": "Температура", "emoji": "🌡️"}, 
    {"id": "thoughts", "label": "Мысли", "emoji": "💭"}, 
    {"id": "pain", "label": "Боль/дискомфорт", "emoji": "😣"}, 
    {"id": "caffeine", "label": "Кофеин", "emoji": "☕"}, 
    {"id": "screen", "label": "Экраны", "emoji": "📱"},
    {"id": "none", "label": "Ничего", "emoji": "✅"}
  ], "maxSelect": 99}'::jsonb
FROM therapy_scenarios s WHERE s.scenario_code = 'sleep_diary_flow';

INSERT INTO therapy_questions (scenario_id, sequence_number, question_code, question_text, question_type, metadata)
SELECT 
  s.id,
  11,
  'sleep_comment',
  'Хочешь добавить заметку о сне? (необязательно)',
  'text',
  '{}'::jsonb
FROM therapy_scenarios s WHERE s.scenario_code = 'sleep_diary_flow';