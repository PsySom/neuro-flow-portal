-- Обновление сценария дневника настроения для соответствия упрощенной структуре

-- Удаляем старые переходы
DELETE FROM therapy_transitions 
WHERE from_question_id IN (
  SELECT q.id FROM therapy_questions q
  JOIN therapy_scenarios s ON s.id = q.scenario_id
  WHERE s.scenario_code = 'mood_diary_flow'
);

-- Удаляем старые вопросы
DELETE FROM therapy_questions 
WHERE scenario_id IN (
  SELECT id FROM therapy_scenarios WHERE scenario_code = 'mood_diary_flow'
);

-- Обновляем описание сценария
UPDATE therapy_scenarios 
SET description = 'Упрощенный дневник для отслеживания настроения, эмоций и телесных ощущений',
    duration_minutes = 3
WHERE scenario_code = 'mood_diary_flow';

-- Вставляем обновленные вопросы

-- Вопрос 1: Настроение (шкала от -5 до +5)
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
  'Пожалуйста, прислушайся к себе и оцени, какое у тебя сейчас настроение',
  'scale',
  '{"min":-5,"max":5,"step":1,"labels":["😞 -5","🤩 +5"]}'::jsonb
FROM scenario;

-- Вопрос 2: Эмоции (множественный выбор с интенсивностью)
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
  'Попробуй теперь описать, какие эмоции и чувства преобладали сегодня? (выбери до 3)',
  'chips',
  '{
    "options":[
      {"id":"joy","label":"Радость","emoji":"😊"},
      {"id":"interest","label":"Интерес","emoji":"🤔"},
      {"id":"inspiration","label":"Вдохновение","emoji":"✨"},
      {"id":"confidence","label":"Уверенность","emoji":"💪"},
      {"id":"calm","label":"Спокойствие","emoji":"😌"},
      {"id":"gratitude","label":"Благодарность","emoji":"🙏"},
      {"id":"pride","label":"Гордость","emoji":"🎉"},
      {"id":"enthusiasm","label":"Воодушевление","emoji":"🚀"},
      {"id":"peace","label":"Умиротворение","emoji":"🕊️"},
      {"id":"love","label":"Любовь","emoji":"❤️"},
      {"id":"tenderness","label":"Нежность","emoji":"🤗"},
      {"id":"surprise","label":"Удивление","emoji":"😲"},
      {"id":"boredom","label":"Скука","emoji":"😐"},
      {"id":"expectation","label":"Ожидание","emoji":"⏳"},
      {"id":"confusion","label":"Растерянность","emoji":"🤷"},
      {"id":"acceptance","label":"Спокойное принятие","emoji":"🙂"},
      {"id":"nostalgia","label":"Ностальгия","emoji":"💭"},
      {"id":"sadness","label":"Грусть","emoji":"😢"},
      {"id":"anxiety","label":"Тревога","emoji":"😰"},
      {"id":"resentment","label":"Обида","emoji":"😔"},
      {"id":"irritation","label":"Раздражение","emoji":"😤"},
      {"id":"anger","label":"Злость","emoji":"😠"},
      {"id":"apathy","label":"Апатия","emoji":"😑"},
      {"id":"worry","label":"Беспокойство","emoji":"😟"},
      {"id":"frustration","label":"Фрустрация","emoji":"😣"},
      {"id":"disappointment","label":"Разочарование","emoji":"😞"},
      {"id":"fatigue","label":"Усталость","emoji":"😴"},
      {"id":"guilt","label":"Вина","emoji":"😳"},
      {"id":"shame","label":"Стыд","emoji":"😓"},
      {"id":"fear","label":"Страх","emoji":"😨"},
      {"id":"loneliness","label":"Одиночество","emoji":"😶"},
      {"id":"helplessness","label":"Беспомощность","emoji":"😵"}
    ],
    "maxSelect":3
  }'::jsonb
FROM scenario;

-- Вопрос 3: С чем связано чувство
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
  'emotion_connection',
  'С чем связано это чувство?',
  'text',
  '{}'::jsonb
FROM scenario;

-- Вопрос 4: Как это проявлялось
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
  'emotion_description',
  'Если хочется, опиши, как это проявлялось или что этому способствовало:',
  'text',
  '{}'::jsonb
FROM scenario;

-- Вопрос 5: Состояние тела
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
  'body_state',
  'Как сейчас твоё тело?',
  'chips',
  '{
    "options":[
      {"id":"tired","label":"Усталость","emoji":"😴"},
      {"id":"tense","label":"Напряжение","emoji":"😰"},
      {"id":"pain","label":"Боль/дискомфорт","emoji":"🤕"},
      {"id":"dizzy","label":"Головокружение","emoji":"😵‍💫"},
      {"id":"anxious_body","label":"Тревожность в теле","emoji":"🫨"},
      {"id":"sick","label":"Болезненность","emoji":"🤒"},
      {"id":"discomfort","label":"Дискомфорт","emoji":"😣"},
      {"id":"chest_tightness","label":"Стеснение в груди","emoji":"😖"},
      {"id":"fever","label":"Жар/лихорадка","emoji":"🥵"},
      {"id":"chills","label":"Озноб","emoji":"🥶"},
      {"id":"malaise","label":"Недомогание","emoji":"😷"},
      {"id":"nausea","label":"Тошнота","emoji":"🤢"},
      {"id":"weakness","label":"Слабость","emoji":"😵"},
      {"id":"exhaustion","label":"Истощение","emoji":"🫠"},
      {"id":"numb","label":"Онемение","emoji":"😶"},
      {"id":"normal","label":"Обычное состояние","emoji":"😐"},
      {"id":"calm_body","label":"Спокойствие","emoji":"🙂"},
      {"id":"energetic","label":"Энергичность","emoji":"💪"},
      {"id":"relaxed","label":"Расслабленность","emoji":"😌"},
      {"id":"light","label":"Легкость","emoji":"✨"},
      {"id":"vital","label":"Жизненная сила","emoji":"🔥"},
      {"id":"custom","label":"Другое","emoji":"✍️"}
    ],
    "maxSelect":3
  }'::jsonb
FROM scenario;

-- Создаем переходы между вопросами (линейный флоу)
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
INSERT INTO therapy_transitions (from_question_id, next_question_id, condition_type, priority)
SELECT q1.id, q2.id, 'always', 100 FROM q1, q2;

-- Переход 2 → 3
WITH q2 AS (
  SELECT q.id FROM therapy_questions q
  JOIN therapy_scenarios s ON s.id = q.scenario_id
  WHERE s.scenario_code = 'mood_diary_flow' AND q.question_code = 'emotions'
),
q3 AS (
  SELECT q.id FROM therapy_questions q
  JOIN therapy_scenarios s ON s.id = q.scenario_id
  WHERE s.scenario_code = 'mood_diary_flow' AND q.question_code = 'emotion_connection'
)
INSERT INTO therapy_transitions (from_question_id, next_question_id, condition_type, priority)
SELECT q2.id, q3.id, 'always', 100 FROM q2, q3;

-- Переход 3 → 4
WITH q3 AS (
  SELECT q.id FROM therapy_questions q
  JOIN therapy_scenarios s ON s.id = q.scenario_id
  WHERE s.scenario_code = 'mood_diary_flow' AND q.question_code = 'emotion_connection'
),
q4 AS (
  SELECT q.id FROM therapy_questions q
  JOIN therapy_scenarios s ON s.id = q.scenario_id
  WHERE s.scenario_code = 'mood_diary_flow' AND q.question_code = 'emotion_description'
)
INSERT INTO therapy_transitions (from_question_id, next_question_id, condition_type, priority)
SELECT q3.id, q4.id, 'always', 100 FROM q3, q4;

-- Переход 4 → 5
WITH q4 AS (
  SELECT q.id FROM therapy_questions q
  JOIN therapy_scenarios s ON s.id = q.scenario_id
  WHERE s.scenario_code = 'mood_diary_flow' AND q.question_code = 'emotion_description'
),
q5 AS (
  SELECT q.id FROM therapy_questions q
  JOIN therapy_scenarios s ON s.id = q.scenario_id
  WHERE s.scenario_code = 'mood_diary_flow' AND q.question_code = 'body_state'
)
INSERT INTO therapy_transitions (from_question_id, next_question_id, condition_type, priority)
SELECT q4.id, q5.id, 'always', 100 FROM q4, q5;