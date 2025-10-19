# Архитектура базы данных Supabase и интеграция с n8n

## Содержание
1. [Общая структура БД](#общая-структура-бд)
2. [Основные таблицы](#основные-таблицы)
3. [Row Level Security (RLS)](#row-level-security-rls)
4. [Функции базы данных](#функции-базы-данных)
5. [Триггеры](#триггеры)
6. [Интеграция с n8n](#интеграция-с-n8n)
7. [Потоки данных](#потоки-данных)
8. [Диаграммы взаимодействий](#диаграммы-взаимодействий)

---

## Общая структура БД

База данных построена на PostgreSQL через Supabase и включает следующие основные модули:

### 1. **Аутентификация и профили пользователей**
- `profiles` - профили пользователей
- `user_roles` - роли пользователей (admin, moderator, user)
- `profile_access_logs` - логи доступа к профилям (аудит)

### 2. **Активности и календарь**
- `activities` - основная таблица активностей
- `activity_types` - справочник типов активностей
- `activity_states` - состояния активностей с оценками

### 3. **AI Дневник**
- `ai_diary_sessions` - сессии AI дневника
- `ai_diary_messages` - сообщения пользователя и AI

### 4. **Дневники самонаблюдения**
- `mood_diary_entries` - дневник настроения
- `sleep_diary_entries` - дневник сна

### 5. **Терапевтические сценарии**
- `therapy_scenarios` - сценарии терапии
- `therapy_questions` - вопросы сценариев
- `therapy_transitions` - переходы между вопросами
- `user_therapy_progress` - прогресс пользователя

### 6. **Контент для специалистов**
- `practices` - практики и упражнения
- `strategies` - стратегии работы
- `tests` - психологические тесты

---

## Основные таблицы

### 1. profiles

**Назначение:** Расширенная информация о пользователе (дополняет `auth.users`)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  telegram_handle TEXT,
  whatsapp_number TEXT,
  facebook_url TEXT,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Особенности:**
- Автоматически создается через триггер при регистрации пользователя
- Синхронизируется с `auth.users` через функцию `sync_user_profile()`
- RLS: пользователь видит только свой профиль, админы видят все

---

### 2. user_roles

**Назначение:** Управление ролями пользователей (безопасность)

```sql
CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);
```

**Особенности:**
- Роли хранятся отдельно от профиля (безопасность)
- Используется функция `has_role()` для проверки прав
- Автоматическое назначение роли 'user' при регистрации
- Специальное правило для admin email: `somov50@gmail.com`

---

### 3. activities

**Назначение:** Основная таблица активностей пользователя

```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  activity_type_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planned',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Статусы активностей:**
- `planned` - запланирована
- `in_progress` - в процессе
- `completed` - завершена
- `cancelled` - отменена

**metadata поля:**
```json
{
  "recurring": {
    "enabled": true,
    "frequency": "daily|weekly|monthly",
    "end_date": "2024-12-31",
    "days_of_week": [1, 3, 5]
  },
  "reminders": [...],
  "notes": "..."
}
```

---

### 4. activity_states

**Назначение:** Оценки и состояния активностей

```sql
CREATE TABLE activity_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  state TEXT NOT NULL DEFAULT 'planned',
  mood_before INTEGER,
  mood_after INTEGER,
  energy_before INTEGER,
  energy_after INTEGER,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(activity_id, user_id)
);
```

**Шкалы оценки (1-10):**
1. `mood_before/after` - Удовлетворенность процессом
2. `energy_before/after` - Затраты энергии (насколько это было трудно)
3. `metadata.process_satisfaction` - Удовлетворенность результатом
4. `metadata.stress_level` - Уровень стресса

---

### 5. ai_diary_sessions

**Назначение:** Сессии взаимодействия с AI дневником

```sql
CREATE TABLE ai_diary_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  session_id VARCHAR NOT NULL UNIQUE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  summary TEXT,
  emotional_state JSONB DEFAULT '{}'::jsonb,
  insights JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**emotional_state структура:**
```json
{
  "dominant_emotion": "тревога",
  "intensity": 7,
  "triggers": ["работа", "дедлайн"],
  "patterns": ["вечернее ухудшение"]
}
```

**insights структура:**
```json
{
  "recommendations": [...],
  "patterns_detected": [...],
  "progress_notes": "..."
}
```

---

### 6. ai_diary_messages

**Назначение:** Сообщения в AI дневнике (основная таблица для n8n интеграции)

```sql
CREATE TABLE ai_diary_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  session_id VARCHAR,
  message_type VARCHAR, -- 'user' | 'ai'
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**metadata поля:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "source": "free_chat",
  "processed": false, // для отслеживания обработки n8n
  "ai_model": "gpt-4",
  "tokens_used": 150
}
```

**🔴 ВАЖНО:** На эту таблицу установлен триггер для отправки в n8n!

---

### 7. mood_diary_entries

**Назначение:** Записи дневника настроения

```sql
CREATE TABLE mood_diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  mood_score INTEGER NOT NULL, -- 1-10
  emotions JSONB NOT NULL DEFAULT '[]'::jsonb,
  triggers TEXT[],
  physical_sensations TEXT[],
  body_areas TEXT[],
  context TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**emotions структура:**
```json
[
  "Радость",
  "Спокойствие",
  "Тревога"
]
```

---

### 8. sleep_diary_entries

**Назначение:** Дневник сна

```sql
CREATE TABLE sleep_diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  bedtime TIME NOT NULL,
  wake_up_time TIME NOT NULL,
  sleep_duration NUMERIC NOT NULL,
  sleep_quality INTEGER NOT NULL, -- 1-10
  night_awakenings INTEGER DEFAULT 0,
  morning_feeling INTEGER NOT NULL, -- 1-10
  has_day_rest BOOLEAN DEFAULT FALSE,
  day_rest_type TEXT,
  day_rest_effectiveness INTEGER,
  sleep_disruptors TEXT[],
  overall_sleep_impact INTEGER NOT NULL, -- 1-10
  sleep_comment TEXT,
  rest_comment TEXT,
  recommendations TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 9. therapy_scenarios, therapy_questions, therapy_transitions

**Назначение:** Структурированные терапевтические сценарии

```sql
-- Сценарии (утренний, дневной, вечерний)
CREATE TABLE therapy_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_code VARCHAR NOT NULL UNIQUE,
  scenario_type VARCHAR,
  name VARCHAR,
  description TEXT,
  duration_minutes INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Вопросы сценария
CREATE TABLE therapy_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID REFERENCES therapy_scenarios(id),
  parent_question_id UUID REFERENCES therapy_questions(id),
  question_code VARCHAR NOT NULL UNIQUE,
  question_type VARCHAR, -- 'scale', 'multiple_choice', 'text', etc.
  question_text TEXT NOT NULL,
  sequence_number INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Переходы между вопросами
CREATE TABLE therapy_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_question_id UUID REFERENCES therapy_questions(id),
  next_question_id UUID REFERENCES therapy_questions(id),
  next_scenario_id UUID REFERENCES therapy_scenarios(id),
  condition_type VARCHAR, -- 'score_threshold', 'answer_equals', etc.
  condition_data JSONB,
  priority INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Пример логики:**
```
Вопрос: "Как вы себя чувствуете?" (scale 1-10)
  ├─ Ответ <= 3 → Переход к сценарию кризисной поддержки
  ├─ Ответ 4-7 → Следующий вопрос в текущем сценарии
  └─ Ответ >= 8 → Пропуск дополнительных вопросов
```

---

### 10. practices, strategies, tests

**Назначение:** Контент для специалистов и пользователей

```sql
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Практики
CREATE TABLE practices (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  instructions TEXT[] NOT NULL DEFAULT '{}',
  benefits TEXT[] NOT NULL DEFAULT '{}',
  duration_minutes INTEGER,
  difficulty_level difficulty_level DEFAULT 'beginner',
  status content_status DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS политика:** Только админы могут создавать/редактировать, все видят опубликованное.

---

## Row Level Security (RLS)

### Принципы безопасности

1. **Изоляция данных пользователей:** Каждый пользователь видит только свои данные
2. **Проверка через функции:** Использование `SECURITY DEFINER` функций для избежания рекурсии
3. **Роль-ориентированный доступ:** Админы имеют расширенные права

### Ключевая функция безопасности

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id AND ur.role = _role
  );
$$;
```

**Важность `SECURITY DEFINER`:**
- Выполняется с правами владельца функции, а не вызывающего
- Предотвращает бесконечную рекурсию RLS политик
- Безопасно обращается к `user_roles` минуя RLS

### Примеры RLS политик

**1. Пользовательские данные (activities):**
```sql
-- Просмотр
CREATE POLICY "Users can view their own activities"
ON activities FOR SELECT
USING (auth.uid() = user_id);

-- Создание
CREATE POLICY "Users can create their own activities"
ON activities FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Обновление
CREATE POLICY "Users can update their own activities"
ON activities FOR UPDATE
USING (auth.uid() = user_id);

-- Удаление
CREATE POLICY "Users can delete their own activities"
ON activities FOR DELETE
USING (auth.uid() = user_id);
```

**2. Профили (с админским доступом):**
```sql
-- Обычный пользователь видит свой профиль
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Админы видят все профили
CREATE POLICY "Admins can view all profiles for moderation"
ON profiles FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Админы могут редактировать любые профили
CREATE POLICY "Admins can update profiles for moderation"
ON profiles FOR UPDATE
USING (has_role(auth.uid(), 'admin'));
```

**3. Публичный контент (practices):**
```sql
-- Все видят опубликованный контент, админы видят всё
CREATE POLICY "Practices: select published or own or admin"
ON practices FOR SELECT
USING (
  status = 'published' 
  OR created_by = auth.uid() 
  OR has_role(auth.uid(), 'admin')
);

-- Только админы могут создавать
CREATE POLICY "Practices: admin insert"
ON practices FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin') 
  AND created_by = auth.uid()
);
```

**4. Роли (критично для безопасности):**
```sql
-- Пользователь видит свои роли, админы видят все
CREATE POLICY "Users can view their own roles or admins all"
ON user_roles FOR SELECT
USING (
  user_id = auth.uid() 
  OR has_role(auth.uid(), 'admin')
);

-- Только админы могут управлять ролями
CREATE POLICY "Admins can insert roles"
ON user_roles FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));
```

---

## Функции базы данных

### 1. has_role() - Проверка роли

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS BOOLEAN
```

**Назначение:** Безопасная проверка наличия роли у пользователя

**Использование:**
```sql
SELECT has_role(auth.uid(), 'admin'); -- true/false
```

---

### 2. sync_user_profile() - Синхронизация профиля

```sql
CREATE OR REPLACE FUNCTION public.sync_user_profile()
RETURNS TRIGGER
```

**Назначение:** Автоматическое создание/обновление профиля при изменении `auth.users`

**Логика:**
1. Срабатывает после INSERT на `auth.users`
2. Извлекает `full_name` из `raw_user_meta_data`
3. Создает запись в `profiles` или обновляет существующую

---

### 3. handle_new_user_role() - Назначение ролей

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
```

**Назначение:** Автоматическое назначение ролей новым пользователям

**Логика:**
1. Назначает роль `user` всем новым пользователям
2. Если email = `somov50@gmail.com`, добавляет роль `admin`

---

### 4. get_user_profile_with_role() - Получение профиля с ролями

```sql
CREATE OR REPLACE FUNCTION public.get_user_profile_with_role()
RETURNS TABLE(id uuid, email text, full_name text, ..., role text)
```

**Назначение:** Безопасное получение текущего профиля пользователя со всеми ролями

**Возвращает:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "Иван Иванов",
  "role": "user,admin" // строка через запятую
}
```

---

### 5. admin_get_user_profiles() - Админский список пользователей

```sql
CREATE OR REPLACE FUNCTION public.admin_get_user_profiles(
  limit_count INTEGER DEFAULT 100,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(id uuid, email text, full_name text, role text, ...)
```

**Назначение:** Получение списка пользователей (только для админов)

**Безопасность:**
- Проверка `has_role(auth.uid(), 'admin')` внутри функции
- Автоматическое логирование через `log_profile_access()`

---

### 6. log_profile_access() - Логирование доступа

```sql
CREATE OR REPLACE FUNCTION public.log_profile_access(
  accessed_user_id uuid,
  access_type text,
  accessed_fields text[] DEFAULT NULL,
  reason text DEFAULT NULL
)
RETURNS VOID
```

**Назначение:** Аудит доступа админов к профилям пользователей

**Записывает:**
- Кто получил доступ (admin_user_id)
- К чьему профилю (accessed_user_id)
- Тип доступа (SELECT, UPDATE)
- Какие поля (accessed_fields)
- IP адрес и User-Agent

---

### 7. update_activity_status() - Обновление статуса активности

```sql
CREATE OR REPLACE FUNCTION public.update_activity_status(
  activity_id uuid,
  new_status text,
  user_notes text DEFAULT NULL
)
RETURNS TABLE(id uuid, title text, status text, updated_at timestamptz)
```

**Назначение:** Атомарное обновление статуса активности и её состояния

**Логика:**
1. Обновляет `activities.status`
2. Создает/обновляет запись в `activity_states`
3. Возвращает обновленную активность

---

### 8. ensure_ai_session() - Обеспечение сессии AI

```sql
CREATE OR REPLACE FUNCTION public.ensure_ai_session(
  p_session_id text,
  p_user_id uuid
)
RETURNS TABLE(session_id varchar, is_new boolean)
```

**Назначение:** Гарантирует существование сессии AI дневника

**Логика:**
1. Если `p_session_id` NULL → создает новую сессию
2. Если сессия существует → возвращает её
3. Если сессия не найдена → создает с переданным ID

---

### 9. update_updated_at_column() - Автообновление timestamp

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
```

**Назначение:** Автоматическое обновление поля `updated_at` при изменении записи

**Используется на таблицах:**
- activities
- activity_states
- mood_diary_entries
- sleep_diary_entries
- profiles
- и др.

---

## Триггеры

### 1. on_auth_user_created (auth.users)

**Таблица:** `auth.users`  
**Событие:** AFTER INSERT  
**Функция:** `sync_user_profile()`

**Назначение:** Создание профиля при регистрации пользователя

---

### 2. assign_user_role (auth.users)

**Таблица:** `auth.users`  
**Событие:** AFTER INSERT  
**Функция:** `handle_new_user_role()`

**Назначение:** Автоматическое назначение ролей новым пользователям

---

### 3. update_*_updated_at (multiple tables)

**Таблицы:** activities, profiles, mood_diary_entries, и др.  
**Событие:** BEFORE UPDATE  
**Функция:** `update_updated_at_column()`

**Назначение:** Автоматическое обновление `updated_at`

---

### 4. 🔴 ai_diary_messages_webhook_trigger (ai_diary_messages)

**Таблица:** `ai_diary_messages`  
**Событие:** AFTER INSERT  
**Функция:** `simple_webhook_trigger()`

**Назначение:** Отправка сообщения пользователя в n8n для обработки AI

**⚠️ КРИТИЧЕСКИ ВАЖНЫЙ ТРИГГЕР для интеграции с n8n!**

```sql
CREATE OR REPLACE FUNCTION public.simple_webhook_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.message_type = 'user' THEN
    PERFORM net.http_post(
      url := 'https://mentalbalans.com/webhook/ai-diary-supabase',
      body := jsonb_build_object(
        'record', row_to_json(NEW),
        'table', 'ai_diary_messages'
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER ai_diary_messages_webhook
AFTER INSERT ON ai_diary_messages
FOR EACH ROW
EXECUTE FUNCTION simple_webhook_trigger();
```

---

## Интеграция с n8n

### Общая схема

```
┌─────────────┐      ┌──────────────┐      ┌─────────┐      ┌──────────────┐      ┌─────────────┐
│   Frontend  │─────>│   Supabase   │─────>│   n8n   │─────>│    OpenAI    │      │  Supabase   │
│             │      │  (trigger)   │      │ Webhook │      │  (GPT-4)     │      │  Realtime   │
└─────────────┘      └──────────────┘      └─────────┘      └──────────────┘      └─────────────┘
                                                  │                  │                      │
                                                  └──────────────────┴──────────────────────┘
                                                              ↓
                                                    Ответ AI записывается
                                                    обратно в Supabase
                                                              ↓
                                                    Frontend получает через
                                                    Realtime subscription
```

### Подробный поток данных

#### 1. **Пользователь отправляет сообщение**

```typescript
// Frontend: src/services/ai-diary.service.ts
async sendMessage(message: string, sessionId: string) {
  const { data, error } = await supabase
    .from('ai_diary_messages')
    .insert({
      user_id: this.userId,
      session_id: sessionId,
      message_type: 'user',
      content: message,
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'free_chat',
        processed: false // 🔴 Важно для n8n
      }
    });
}
```

#### 2. **Триггер Supabase срабатывает**

После INSERT в `ai_diary_messages`:

```sql
-- Проверяется, что message_type = 'user'
-- Отправляется POST запрос в n8n
POST https://mentalbalans.com/webhook/ai-diary-supabase
Content-Type: application/json

{
  "record": {
    "id": "uuid",
    "user_id": "uuid",
    "session_id": "ai_diary_1234567890",
    "message_type": "user",
    "content": "Сегодня я чувствую тревогу...",
    "metadata": {
      "timestamp": "2024-01-15T10:30:00Z",
      "source": "free_chat",
      "processed": false
    },
    "created_at": "2024-01-15T10:30:00Z"
  },
  "table": "ai_diary_messages"
}
```

#### 3. **n8n обрабатывает webhook**

**Workflow в n8n:**

```
Webhook Trigger
    ↓
Извлечение данных из payload
    ↓
Проверка: metadata.processed === false
    ↓
Получение истории сообщений сессии (из Supabase)
    ↓
Формирование промпта для OpenAI
    ↓
Вызов OpenAI API (GPT-4)
    ↓
Получение ответа AI
    ↓
Сохранение ответа в Supabase
    ↓
Обновление metadata.processed = true
```

**Пример n8n workflow (псевдокод):**

```javascript
// 1. Webhook Node - получает данные
const { record } = $input.all()[0].json;

// 2. IF Node - проверка processed
if (record.metadata.processed === false) {
  
  // 3. Supabase Node - получение истории
  const messages = await supabase
    .from('ai_diary_messages')
    .select('*')
    .eq('session_id', record.session_id)
    .order('created_at', { ascending: true });
  
  // 4. Function Node - формирование промпта
  const conversation = messages.map(msg => ({
    role: msg.message_type === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));
  
  // 5. OpenAI Node - вызов GPT-4
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'Вы - эмпатичный психолог-помощник...'
      },
      ...conversation
    ],
    temperature: 0.7,
    max_tokens: 500
  });
  
  const aiMessage = response.choices[0].message.content;
  
  // 6. Supabase Node - сохранение ответа AI
  await supabase
    .from('ai_diary_messages')
    .insert({
      user_id: record.user_id,
      session_id: record.session_id,
      message_type: 'ai',
      content: aiMessage,
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'openai',
        model: 'gpt-4',
        tokens_used: response.usage.total_tokens
      }
    });
  
  // 7. Supabase Node - обновление processed flag
  await supabase
    .from('ai_diary_messages')
    .update({ 
      metadata: { 
        ...record.metadata, 
        processed: true 
      } 
    })
    .eq('id', record.id);
}
```

#### 4. **Supabase Realtime отправляет обновление**

Когда n8n записывает ответ AI в `ai_diary_messages`, Supabase Realtime автоматически отправляет событие всем подписанным клиентам.

#### 5. **Frontend получает ответ через Realtime**

```typescript
// Frontend: src/services/ai-diary.service.ts
subscribeToMessages(sessionId: string, onNewMessage: (message: any) => void) {
  this.realtimeChannel = supabase
    .channel(`ai_diary_${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'ai_diary_messages',
        filter: `session_id=eq.${sessionId}`
      },
      (payload) => {
        if (payload.new.message_type === 'ai') {
          onNewMessage(payload.new); // 🔴 Отображаем сообщение AI
        }
      }
    )
    .subscribe();
}
```

### Преимущества архитектуры

✅ **Безопасность:** API ключи OpenAI хранятся в n8n, не в клиенте  
✅ **Масштабируемость:** n8n может обрабатывать очереди, ретраи, rate limiting  
✅ **Гибкость:** Легко менять логику обработки без деплоя кода  
✅ **Мониторинг:** n8n предоставляет визуальный интерфейс для отслеживания выполнения  
✅ **Изоляция:** Падение n8n не влияет на остальной функционал приложения  

### Тестирование интеграции

**Функция для тестирования webhook:**

```sql
CREATE OR REPLACE FUNCTION public.test_webhook_connection()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://mentalbalans.com/webhook/ai-diary-supabase',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"test": true, "timestamp": "' || NOW()::text || '"}'
  );
  
  RETURN 'Test request sent to webhook';
END;
$$;

-- Вызов:
SELECT test_webhook_connection();
```

### Обработка ошибок

**В n8n:**
- Retry механизм (3 попытки с экспоненциальной задержкой)
- Error notification (Slack/Email при критических ошибках)
- Fallback ответы при недоступности OpenAI

**В Frontend:**
- Timeout (30 секунд ожидания ответа)
- Показ статуса "AI обрабатывает сообщение..."
- Возможность отправить повторный запрос

---

## Потоки данных

### 1. Создание и оценка активности

```
Пользователь создает активность
    ↓
INSERT в activities (status='planned')
    ↓
[Выполнение активности]
    ↓
Пользователь открывает оценку
    ↓
UPSERT в activity_states (с оценками)
    ↓
UPDATE activities.status = 'completed'
    ↓
Realtime уведомление
    ↓
Обновление UI
```

### 2. Работа с дневником настроения

```
Пользователь открывает дневник
    ↓
SELECT последняя запись за сегодня
    ↓
Пользователь вводит данные
    ↓
INSERT в mood_diary_entries
    ↓
[Опционально] Анализ паттернов
    ↓
Генерация рекомендаций
    ↓
Отображение статистики
```

### 3. Терапевтический сценарий (утренний, вечерний)

```
Пользователь выбирает сценарий
    ↓
SELECT therapy_scenarios WHERE scenario_code='morning'
    ↓
SELECT первый вопрос сценария
    ↓
Пользователь отвечает
    ↓
INSERT/UPDATE user_therapy_progress
    ↓
SELECT therapy_transitions для определения следующего вопроса
    ↓
[Повторяется до конца сценария]
    ↓
Подсчет метрик (A, E, S, T)
    ↓
Генерация insights
    ↓
UPDATE ai_diary_sessions.insights
```

### 4. Синхронизация активностей (Realtime)

```
Пользователь A создает активность
    ↓
INSERT в activities
    ↓
Supabase Realtime broadcast
    ↓
Пользователь A (другая вкладка) получает уведомление
    ↓
React Query invalidateQueries(['activities'])
    ↓
Автоматический рефетч
    ↓
UI обновляется без перезагрузки
```

---

## Диаграммы взаимодействий

### AI Дневник: Полный цикл обработки сообщения

```mermaid
sequenceDiagram
    participant U as User (Frontend)
    participant S as Supabase DB
    participant T as Trigger
    participant N as n8n Workflow
    participant O as OpenAI API
    participant R as Supabase Realtime

    U->>S: INSERT ai_diary_messages (type='user')
    S->>T: Активация триггера simple_webhook_trigger()
    T->>N: POST /webhook/ai-diary-supabase
    
    N->>S: SELECT история сообщений сессии
    S-->>N: Возврат истории
    
    N->>N: Формирование промпта
    N->>O: POST /v1/chat/completions
    O-->>N: Ответ GPT-4
    
    N->>S: INSERT ai_diary_messages (type='ai')
    N->>S: UPDATE metadata.processed=true
    
    S->>R: Broadcast INSERT event
    R-->>U: Realtime уведомление
    U->>U: Отображение ответа AI в чате
```

### Аутентификация и создание профиля

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Supabase Auth
    participant D as Supabase DB
    participant T1 as Trigger: sync_user_profile
    participant T2 as Trigger: handle_new_user_role

    U->>F: Заполняет форму регистрации
    F->>A: signUp(email, password, metadata)
    A->>A: Создает запись в auth.users
    
    A->>T1: Активация триггера on_auth_user_created
    T1->>D: INSERT в profiles (sync данных)
    
    A->>T2: Активация триггера assign_user_role
    T2->>D: INSERT user_roles (role='user')
    T2->>D: IF admin email → INSERT user_roles (role='admin')
    
    A-->>F: Возврат user object + JWT
    F->>D: SELECT get_user_profile_with_role()
    D-->>F: Профиль с ролями
    F-->>U: Перенаправление в Dashboard
```

### Создание и оценка активности с Realtime

```mermaid
sequenceDiagram
    participant U as User
    participant C as Calendar/Timeline UI
    participant Q as React Query
    participant S as Supabase DB
    participant R as Realtime Channel

    U->>C: Создает активность
    C->>Q: useMutation(createActivity)
    Q->>S: INSERT activities
    S-->>Q: Success
    Q->>Q: invalidateQueries(['activities'])
    Q->>S: Автоматический refetch
    
    S->>R: Broadcast INSERT event
    R-->>C: Realtime subscription
    C->>C: Обновление UI без полного refetch
    
    Note over U,C: [Время проходит...]
    
    U->>C: Оценивает активность
    C->>Q: useMutation(evaluateActivity)
    Q->>S: UPSERT activity_states
    Q->>S: UPDATE activities.status='completed'
    S-->>Q: Success
    Q->>Q: invalidateQueries(['activities', 'activity-states'])
    C->>C: Показ аналитики
```

---

## Мониторинг и отладка

### Логи Supabase

**Postgres logs:**
```sql
-- Просмотр последних ошибок
SELECT * FROM postgres_logs 
WHERE error_severity = 'ERROR' 
ORDER BY timestamp DESC 
LIMIT 20;
```

**Просмотр в Supabase Dashboard:**
- https://supabase.com/dashboard/project/{project_id}/logs/postgres-logs

### Отладка триггера webhook

```sql
-- Проверка, срабатывает ли триггер
SELECT * FROM ai_diary_messages 
WHERE message_type = 'user' 
  AND metadata->>'processed' = 'false'
ORDER BY created_at DESC;

-- Если есть необработанные сообщения - триггер не срабатывает
```

### Тестирование n8n

```bash
# Ручная отправка тестового webhook
curl -X POST https://mentalbalans.com/webhook/ai-diary-supabase \
  -H "Content-Type: application/json" \
  -d '{
    "test": true,
    "record": {
      "id": "test-uuid",
      "user_id": "test-user",
      "session_id": "test-session",
      "message_type": "user",
      "content": "Тестовое сообщение",
      "metadata": {"processed": false}
    }
  }'
```

---

## Безопасность

### Ключевые моменты

1. **Роли хранятся отдельно** - невозможно повышение привилегий через профиль
2. **SECURITY DEFINER функции** - предотвращение рекурсии RLS
3. **Аудит доступа** - логирование всех админских действий
4. **Изоляция данных** - RLS на всех пользовательских таблицах
5. **Безопасные API ключи** - OpenAI ключи в n8n, не в клиенте

### Потенциальные уязвимости

❌ **JWT подделка** - Защита: Supabase использует собственные секретные ключи  
❌ **SQL Injection** - Защита: Prepared statements везде  
❌ **IDOR атаки** - Защита: RLS проверяет auth.uid() на каждом запросе  
❌ **Privilege escalation** - Защита: Роли в отдельной таблице + has_role()  

---

## Оптимизация производительности

### Индексы

```sql
-- Критичные индексы для производительности
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_start_time ON activities(start_time);
CREATE INDEX idx_ai_diary_messages_session_id ON ai_diary_messages(session_id);
CREATE INDEX idx_ai_diary_messages_user_id ON ai_diary_messages(user_id);
CREATE INDEX idx_mood_diary_entries_user_id_date ON mood_diary_entries(user_id, created_at);
```

### Connection pooling

Supabase использует PgBouncer в режиме `transaction`:
- Максимум соединений: настраивается в проекте
- Timeout: 30 секунд по умолчанию

### Кэширование на клиенте

React Query кэширует запросы:
```typescript
queryClient.setQueryDefaults(['activities'], {
  staleTime: 5 * 60 * 1000, // 5 минут
  cacheTime: 10 * 60 * 1000, // 10 минут
});
```

---

## Резервное копирование

### Автоматические бэкапы Supabase

- **Частота:** Ежедневно (для платных планов)
- **Хранение:** 7 дней
- **Доступ:** Supabase Dashboard → Backups

### Ручной экспорт

```bash
# Экспорт всей БД
pg_dump "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres" > backup.sql

# Экспорт только схемы
pg_dump --schema-only [...] > schema.sql

# Экспорт только данных
pg_dump --data-only [...] > data.sql
```

---

## Миграции

### Структура миграций

```
supabase/migrations/
  ├── 20240101000000_initial_schema.sql
  ├── 20240115000000_add_ai_diary_tables.sql
  ├── 20240120000000_add_therapy_scenarios.sql
  └── ...
```

### Применение миграций

```bash
# Локально (через Supabase CLI)
supabase db push

# Продакшн (автоматически через Lovable)
# Миграции применяются при деплое
```

---

## Полезные ссылки

- [Supabase Dashboard](https://supabase.com/dashboard/project/szvousyzsqdpubgfycdy)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/triggers.html)
- [n8n Documentation](https://docs.n8n.io/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)

---

## Контакты для поддержки

**Webhook endpoint:** https://mentalbalans.com/webhook/ai-diary-supabase  
**Admin email:** somov50@gmail.com  
**Project ID:** szvousyzsqdpubgfycdy
