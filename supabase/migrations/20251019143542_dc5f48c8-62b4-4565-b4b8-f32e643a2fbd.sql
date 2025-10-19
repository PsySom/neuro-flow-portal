-- Идемпотентный сидинг сценария "Дневник настроения" (mood_diary_flow)
-- Создание сценария и линейного флоу вопросов

-- 1) Вставка сценария
INSERT INTO therapy_scenarios (
  scenario_code, 
  name, 
  description,
  scenario_type,
  duration_minutes,
  priority,
  is_active
) VALUES (
  'mood_diary_flow',
  'Дневник настроения',
  'Структурированный дневник для отслеживания настроения, эмоций, триггеров и телесных ощущений',
  'diary',
  5,
  100,
  true
)
ON CONFLICT (scenario_code) DO NOTHING;

-- 2) Вставка вопросов (используем CTE для получения scenario_id)
WITH scenario AS (
  SELECT id FROM therapy_scenarios WHERE scenario_code = 'mood_diary_flow'
)
INSERT INTO therapy_questions (
  scenario_id,
  sequence_number,
  question_code,
  question_text,
  question_type,
  metadata
)
SELECT 
  scenario.id,
  1,
  'mood',
  'Оцени своё настроение по шкале 0–10',
  'scale',
  '{"min":0,"max":10,"step":1,"labels":["очень плохо","отлично"]}'::jsonb
FROM scenario
WHERE NOT EXISTS (
  SELECT 1 FROM therapy_questions 
  WHERE scenario_id = scenario.id AND question_code = 'mood'
);

WITH scenario AS (
  SELECT id FROM therapy_scenarios WHERE scenario_code = 'mood_diary_flow'
)
INSERT INTO therapy_questions (
  scenario_id,
  sequence_number,
  question_code,
  question_text,
  question_type,
  metadata
)
SELECT 
  scenario.id,
  2,
  'emotions',
  'Какие эмоции ты чувствуешь? (можно несколько)',
  'chips',
  '{
    "options":[
      {"id":"joy","label":"Радость","emoji":"😊"},
      {"id":"sad","label":"Грусть","emoji":"😢"},
      {"id":"anger","label":"Злость","emoji":"😠"},
      {"id":"anxiety","label":"Тревога","emoji":"😟"},
      {"id":"calm","label":"Спокойствие","emoji":"😌"},
      {"id":"excitement","label":"Возбуждение","emoji":"🤩"},
      {"id":"fear","label":"Страх","emoji":"😨"},
      {"id":"guilt","label":"Вина","emoji":"😔"}
    ],
    "maxSelect":4
  }'::jsonb
FROM scenario
WHERE NOT EXISTS (
  SELECT 1 FROM therapy_questions 
  WHERE scenario_id = scenario.id AND question_code = 'emotions'
);

WITH scenario AS (
  SELECT id FROM therapy_scenarios WHERE scenario_code = 'mood_diary_flow'
)
INSERT INTO therapy_questions (
  scenario_id,
  sequence_number,
  question_code,
  question_text,
  question_type,
  metadata
)
SELECT 
  scenario.id,
  3,
  'triggers',
  'Что могло повлиять? (триггеры)',
  'chips',
  '{
    "options":[
      {"id":"work","label":"Работа","emoji":"💼"},
      {"id":"family","label":"Семья","emoji":"👨‍👩‍👧"},
      {"id":"health","label":"Здоровье","emoji":"🏥"},
      {"id":"finance","label":"Финансы","emoji":"💰"},
      {"id":"sleep","label":"Недосып","emoji":"😴"},
      {"id":"conflict","label":"Конфликт","emoji":"💥"},
      {"id":"loneliness","label":"Одиночество","emoji":"🚶"}
    ],
    "maxSelect":3
  }'::jsonb
FROM scenario
WHERE NOT EXISTS (
  SELECT 1 FROM therapy_questions 
  WHERE scenario_id = scenario.id AND question_code = 'triggers'
);

WITH scenario AS (
  SELECT id FROM therapy_scenarios WHERE scenario_code = 'mood_diary_flow'
)
INSERT INTO therapy_questions (
  scenario_id,
  sequence_number,
  question_code,
  question_text,
  question_type,
  metadata
)
SELECT 
  scenario.id,
  4,
  'body',
  'Есть телесные ощущения? (можно несколько)',
  'chips',
  '{
    "options":[
      {"id":"tight_chest","label":"Сжатие в груди","emoji":"🫁"},
      {"id":"headache","label":"Головная боль","emoji":"🤕"},
      {"id":"neck","label":"Напряжение в шее","emoji":"😣"},
      {"id":"stomach","label":"Дискомфорт в животе","emoji":"🤢"},
      {"id":"fatigue","label":"Усталость","emoji":"😪"},
      {"id":"trembling","label":"Дрожь","emoji":"🥶"}
    ],
    "maxSelect":3
  }'::jsonb
FROM scenario
WHERE NOT EXISTS (
  SELECT 1 FROM therapy_questions 
  WHERE scenario_id = scenario.id AND question_code = 'body'
);

WITH scenario AS (
  SELECT id FROM therapy_scenarios WHERE scenario_code = 'mood_diary_flow'
)
INSERT INTO therapy_questions (
  scenario_id,
  sequence_number,
  question_code,
  question_text,
  question_type,
  metadata
)
SELECT 
  scenario.id,
  5,
  'context',
  'Хочешь добавить контекст или заметку?',
  'text',
  '{}'::jsonb
FROM scenario
WHERE NOT EXISTS (
  SELECT 1 FROM therapy_questions 
  WHERE scenario_id = scenario.id AND question_code = 'context'
);

-- 3) Создание прямых переходов между вопросами (линейный флоу)
-- Переход 1 → 2
WITH q1 AS (
  SELECT q.id FROM therapy_questions q
  JOIN therapy_scenarios s ON s.id = q.scenario_id
  WHERE s.scenario_code = 'mood_diary_flow' AND q.question_code = 'mood'
),
q2 AS (
  SELECT q.id FROM therapy_questions q
  JOIN therapy_scenarios s ON s.id = q.scenario_id
  WHERE s.scenario_code = 'mood_diary_flow' AND q.question_code = 'emotions'
)
INSERT INTO therapy_transitions (
  from_question_id,
  next_question_id,
  condition_type,
  priority
)
SELECT q1.id, q2.id, 'always', 100
FROM q1, q2
WHERE NOT EXISTS (
  SELECT 1 FROM therapy_transitions 
  WHERE from_question_id = q1.id AND next_question_id = q2.id
);

-- Переход 2 → 3
WITH q2 AS (
  SELECT q.id FROM therapy_questions q
  JOIN therapy_scenarios s ON s.id = q.scenario_id
  WHERE s.scenario_code = 'mood_diary_flow' AND q.question_code = 'emotions'
),
q3 AS (
  SELECT q.id FROM therapy_questions q
  JOIN therapy_scenarios s ON s.id = q.scenario_id
  WHERE s.scenario_code = 'mood_diary_flow' AND q.question_code = 'triggers'
)
INSERT INTO therapy_transitions (
  from_question_id,
  next_question_id,
  condition_type,
  priority
)
SELECT q2.id, q3.id, 'always', 100
FROM q2, q3
WHERE NOT EXISTS (
  SELECT 1 FROM therapy_transitions 
  WHERE from_question_id = q2.id AND next_question_id = q3.id
);

-- Переход 3 → 4
WITH q3 AS (
  SELECT q.id FROM therapy_questions q
  JOIN therapy_scenarios s ON s.id = q.scenario_id
  WHERE s.scenario_code = 'mood_diary_flow' AND q.question_code = 'triggers'
),
q4 AS (
  SELECT q.id FROM therapy_questions q
  JOIN therapy_scenarios s ON s.id = q.scenario_id
  WHERE s.scenario_code = 'mood_diary_flow' AND q.question_code = 'body'
)
INSERT INTO therapy_transitions (
  from_question_id,
  next_question_id,
  condition_type,
  priority
)
SELECT q3.id, q4.id, 'always', 100
FROM q3, q4
WHERE NOT EXISTS (
  SELECT 1 FROM therapy_transitions 
  WHERE from_question_id = q3.id AND next_question_id = q4.id
);

-- Переход 4 → 5
WITH q4 AS (
  SELECT q.id FROM therapy_questions q
  JOIN therapy_scenarios s ON s.id = q.scenario_id
  WHERE s.scenario_code = 'mood_diary_flow' AND q.question_code = 'body'
),
q5 AS (
  SELECT q.id FROM therapy_questions q
  JOIN therapy_scenarios s ON s.id = q.scenario_id
  WHERE s.scenario_code = 'mood_diary_flow' AND q.question_code = 'context'
)
INSERT INTO therapy_transitions (
  from_question_id,
  next_question_id,
  condition_type,
  priority
)
SELECT q4.id, q5.id, 'always', 100
FROM q4, q5
WHERE NOT EXISTS (
  SELECT 1 FROM therapy_transitions 
  WHERE from_question_id = q4.id AND next_question_id = q5.id
);

-- Вывод статистики
SELECT 
  'Сценарий создан' as status,
  COUNT(*) as count
FROM therapy_scenarios 
WHERE scenario_code = 'mood_diary_flow'

UNION ALL

SELECT 
  'Вопросов создано' as status,
  COUNT(*) as count
FROM therapy_questions q
JOIN therapy_scenarios s ON s.id = q.scenario_id
WHERE s.scenario_code = 'mood_diary_flow'

UNION ALL

SELECT 
  'Переходов создано' as status,
  COUNT(*) as count
FROM therapy_transitions t
JOIN therapy_questions q ON q.id = t.from_question_id
JOIN therapy_scenarios s ON s.id = q.scenario_id
WHERE s.scenario_code = 'mood_diary_flow';