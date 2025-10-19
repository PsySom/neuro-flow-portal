# Backend Architecture - PsyBalans

## Общий обзор

Бэкэнд приложения построен на **Supabase** - платформе с открытым исходным кодом, которая предоставляет:
- PostgreSQL база данных
- Автоматическая генерация REST API
- Realtime подписки
- Аутентификация и авторизация
- Row Level Security (RLS)
- Edge Functions для серверной логики

### Ключевые компоненты бэкэнда

1. **Supabase PostgreSQL Database** - основное хранилище данных
2. **Supabase Auth** - система аутентификации
3. **Supabase Realtime** - WebSocket для реального времени
4. **Row Level Security (RLS)** - безопасность на уровне строк
5. **Database Functions** - серверные функции в PostgreSQL
6. **Database Triggers** - триггеры для автоматизации
7. **External Webhooks** - интеграция с n8n для AI обработки
8. **Frontend Services** - слой абстракции для работы с API

---

## 1. База данных (PostgreSQL)

### 1.1 Схема базы данных

#### Таблицы пользователей и аутентификации

**`profiles`** - профили пользователей
```sql
- id: uuid (PK, ref: auth.users)
- email: text
- full_name: text
- avatar_url: text
- telegram_handle: text
- whatsapp_number: text
- facebook_url: text
- role: text (deprecated, использовать user_roles)
- created_at: timestamp
- updated_at: timestamp
```

**`user_roles`** - роли пользователей (admin, moderator, user)
```sql
- id: uuid (PK)
- user_id: uuid (FK: auth.users, UNIQUE with role)
- role: app_role (ENUM)
- created_at: timestamp
```

**`profile_access_logs`** - логи доступа к профилям (для аудита)
```sql
- id: uuid (PK)
- admin_user_id: uuid
- accessed_user_id: uuid
- access_type: text
- accessed_fields: text[]
- reason: text
- ip_address: inet
- user_agent: text
- created_at: timestamp
```

#### Таблицы активностей и календаря

**`activity_types`** - типы активностей
```sql
- id: integer (PK, AUTO)
- name: text
- description: text
- icon: text (default: '📝')
- color: text (default: '#3B82F6')
- created_at: timestamp
- updated_at: timestamp
```

**`activities`** - активности пользователей
```sql
- id: uuid (PK)
- user_id: uuid (FK: auth.users)
- title: text
- description: text
- activity_type_id: integer (FK: activity_types)
- start_time: timestamp with time zone
- end_time: timestamp with time zone (nullable)
- status: text (default: 'planned')
- metadata: jsonb (default: {})
- created_at: timestamp
- updated_at: timestamp
```

**`activity_states`** - состояния и оценки активностей
```sql
- id: uuid (PK)
- activity_id: uuid (FK: activities)
- user_id: uuid (FK: auth.users)
- state: text (default: 'planned')
- mood_before: integer (nullable)
- mood_after: integer (nullable)
- energy_before: integer (nullable)
- energy_after: integer (nullable)
- notes: text (nullable)
- metadata: jsonb (default: {})
- created_at: timestamp
- updated_at: timestamp
```

#### Таблицы дневников

**`ai_diary_sessions`** - сессии AI дневника
```sql
- id: uuid (PK)
- user_id: uuid (FK: auth.users)
- session_id: varchar (уникальный идентификатор)
- started_at: timestamp (default: now())
- ended_at: timestamp (nullable)
- summary: text (nullable)
- emotional_state: jsonb (default: {})
- insights: jsonb (default: {})
- created_at: timestamp
```

**`ai_diary_messages`** - сообщения AI дневника
```sql
- id: uuid (PK)
- user_id: uuid (FK: auth.users)
- session_id: varchar (FK: ai_diary_sessions)
- content: text
- message_type: varchar ('user' | 'assistant')
- metadata: jsonb (default: {})
- created_at: timestamp
```

**`mood_diary_entries`** - записи дневника настроения
```sql
- id: uuid (PK)
- user_id: uuid (FK: auth.users)
- mood_score: integer
- emotions: jsonb (array)
- triggers: text[] (nullable)
- context: text (nullable)
- physical_sensations: text[] (nullable)
- body_areas: text[] (nullable)
- notes: text (nullable)
- created_at: timestamp
- updated_at: timestamp
```

**`sleep_diary_entries`** - записи дневника сна
```sql
- id: uuid (PK)
- user_id: uuid (FK: auth.users)
- bedtime: time
- wake_up_time: time
- sleep_duration: numeric
- sleep_quality: integer
- night_awakenings: integer (default: 0)
- sleep_disruptors: text[] (default: [])
- morning_feeling: integer
- has_day_rest: boolean (default: false)
- day_rest_type: text (nullable)
- day_rest_effectiveness: integer (nullable)
- rest_comment: text (nullable)
- overall_sleep_impact: integer
- sleep_comment: text (nullable)
- recommendations: text[] (default: [])
- created_at: timestamp
- updated_at: timestamp
```

#### Таблицы терапевтических сценариев

**`therapy_scenarios`** - терапевтические сценарии
```sql
- id: uuid (PK)
- scenario_code: varchar (уникальный)
- scenario_type: varchar (nullable)
- name: varchar (nullable)
- description: text (nullable)
- duration_minutes: integer (default: 10)
- priority: integer (default: 50)
- is_active: boolean (default: true)
- created_at: timestamp
- updated_at: timestamp
```

**`therapy_questions`** - вопросы терапевтических сценариев
```sql
- id: uuid (PK)
- scenario_id: uuid (FK: therapy_scenarios, nullable)
- parent_question_id: uuid (FK: therapy_questions, nullable)
- question_code: varchar (уникальный)
- question_type: varchar (nullable)
- question_text: text
- sequence_number: integer (nullable)
- metadata: jsonb (default: {})
- created_at: timestamp
```

**`therapy_transitions`** - переходы между вопросами
```sql
- id: uuid (PK)
- from_question_id: uuid (FK: therapy_questions, nullable)
- next_question_id: uuid (FK: therapy_questions, nullable)
- next_scenario_id: uuid (FK: therapy_scenarios, nullable)
- condition_type: varchar (nullable)
- condition_data: jsonb (nullable)
- priority: integer (default: 50)
- created_at: timestamp
```

**`user_therapy_progress`** - прогресс пользователя в терапии
```sql
- id: uuid (PK)
- user_id: uuid (FK: auth.users, nullable)
- session_id: varchar (nullable)
- scenario_id: uuid (FK: therapy_scenarios, nullable)
- current_question_id: uuid (FK: therapy_questions, nullable)
- responses: jsonb (default: {})
- metrics: jsonb (default: {"A": 5, "E": 5, "S": 5, "T": 5})
- insights: jsonb (default: [])
- created_at: timestamp
- completed_at: timestamp (nullable)
```

#### Таблицы контента

**`practices`** - практики и упражнения
```sql
- id: bigint (PK, AUTO)
- created_by: uuid (FK: auth.users)
- title: text
- description: text (nullable)
- category: text (nullable)
- duration_minutes: integer (nullable)
- difficulty_level: difficulty_level (ENUM: 'beginner', 'intermediate', 'advanced')
- instructions: text[] (array)
- benefits: text[] (array)
- metadata: jsonb (default: {})
- status: content_status (ENUM: 'draft', 'published', 'archived')
- created_at: timestamp
- updated_at: timestamp
```

**`strategies`** - стратегии преодоления
```sql
- id: bigint (PK, AUTO)
- created_by: uuid (FK: auth.users)
- title: text
- description: text (nullable)
- category: text (nullable)
- content: jsonb (default: {})
- metadata: jsonb (default: {})
- status: content_status (ENUM)
- created_at: timestamp
- updated_at: timestamp
```

**`tests`** - психологические тесты
```sql
- id: bigint (PK, AUTO)
- created_by: uuid (FK: auth.users)
- title: text
- description: text (nullable)
- category: text (nullable)
- content: jsonb (default: {})
- metadata: jsonb (default: {})
- status: content_status (ENUM)
- created_at: timestamp
- updated_at: timestamp
```

### 1.2 ENUM Types

```sql
-- Роли пользователей
CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'user');

-- Статус контента
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');

-- Уровень сложности
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
```

---

## 2. Row Level Security (RLS)

Все таблицы имеют включенный RLS для обеспечения безопасности на уровне строк.

### 2.1 Политики безопасности для пользовательских данных

#### Таблица `profiles`
```sql
-- Пользователи могут просматривать свой профиль
POLICY "Users can view their own profile"
  FOR SELECT USING (auth.uid() = id)

-- Пользователи могут вставлять свой профиль
POLICY "Users can insert their own profile"
  FOR INSERT WITH CHECK (auth.uid() = id)

-- Пользователи могут обновлять свой профиль
POLICY "Users can update their own profile"
  FOR UPDATE USING (auth.uid() = id)

-- Пользователи могут удалять свой профиль
POLICY "Users can delete their own profile"
  FOR DELETE USING (auth.uid() = id)

-- Админы могут просматривать все профили
POLICY "Admins can view all profiles for moderation"
  FOR SELECT USING (has_role(auth.uid(), 'admin'))

-- Админы могут обновлять профили
POLICY "Admins can update profiles for moderation"
  FOR UPDATE USING (has_role(auth.uid(), 'admin'))

-- Админы могут удалять профили
POLICY "Admins can delete profiles for security"
  FOR DELETE USING (has_role(auth.uid(), 'admin'))
```

#### Таблица `activities`
```sql
-- Пользователи видят только свои активности
POLICY "Users can view their own activities"
  FOR SELECT USING (auth.uid() = user_id)

-- Пользователи создают только свои активности
POLICY "Users can create their own activities"
  FOR INSERT WITH CHECK (auth.uid() = user_id)

-- Пользователи обновляют только свои активности
POLICY "Users can update their own activities"
  FOR UPDATE USING (auth.uid() = user_id)

-- Пользователи удаляют только свои активности
POLICY "Users can delete their own activities"
  FOR DELETE USING (auth.uid() = user_id)
```

#### Таблица `ai_diary_messages`
```sql
-- Аналогичные политики для всех пользовательских таблиц
POLICY "Users can view their own diary messages"
  FOR SELECT USING (auth.uid() = user_id)

POLICY "Users can create their own diary messages"
  FOR INSERT WITH CHECK (auth.uid() = user_id)

POLICY "Users can update their own diary messages"
  FOR UPDATE USING (auth.uid() = user_id)

POLICY "Users can delete their own diary messages"
  FOR DELETE USING (auth.uid() = user_id)
```

### 2.2 Политики для публичного контента

#### Таблица `activity_types`
```sql
-- Все могут просматривать типы активностей
POLICY "Activity types are viewable by everyone"
  FOR SELECT USING (true)
```

#### Таблица `practices`
```sql
-- Опубликованные практики видны всем, черновики только автору и админам
POLICY "Practices: select published or own or admin"
  FOR SELECT USING (
    status = 'published' 
    OR created_by = auth.uid() 
    OR has_role(auth.uid(), 'admin')
  )

-- Только админы могут создавать практики
POLICY "Practices: admin insert"
  FOR INSERT WITH CHECK (
    has_role(auth.uid(), 'admin') AND created_by = auth.uid()
  )

-- Только админы могут обновлять практики
POLICY "Practices: admin update"
  FOR UPDATE USING (has_role(auth.uid(), 'admin'))

-- Только админы могут удалять практики
POLICY "Practices: admin delete"
  FOR DELETE USING (has_role(auth.uid(), 'admin'))
```

### 2.3 Политики для ролей

#### Таблица `user_roles`
```sql
-- Пользователи видят свои роли, админы видят все
POLICY "Users can view their own roles or admins all"
  FOR SELECT USING (
    user_id = auth.uid() OR has_role(auth.uid(), 'admin')
  )

-- Только админы управляют ролями
POLICY "Admins can insert roles"
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'))

POLICY "Admins can update roles"
  FOR UPDATE USING (has_role(auth.uid(), 'admin'))

POLICY "Admins can delete roles"
  FOR DELETE USING (has_role(auth.uid(), 'admin'))
```

---

## 3. Database Functions

### 3.1 Функции для работы с ролями

**`has_role(_user_id uuid, _role app_role)`**
```sql
-- Проверяет наличие роли у пользователя
-- SECURITY DEFINER для избежания рекурсии RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id AND ur.role = _role
  );
$$;
```

### 3.2 Функции для работы с профилями

**`get_user_profile_with_role()`**
```sql
-- Возвращает профиль текущего пользователя с его ролями
CREATE OR REPLACE FUNCTION public.get_user_profile_with_role()
RETURNS TABLE(
  id uuid, email text, full_name text, avatar_url text,
  telegram_handle text, whatsapp_number text, facebook_url text,
  role text, created_at timestamp, updated_at timestamp
)
LANGUAGE sql SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    p.id, p.email, p.full_name, p.avatar_url,
    p.telegram_handle, p.whatsapp_number, p.facebook_url,
    COALESCE(
      (SELECT string_agg(ur.role::text, ',') 
       FROM public.user_roles ur 
       WHERE ur.user_id = p.id), 
      'user'
    ) as role,
    p.created_at, p.updated_at
  FROM public.profiles p
  WHERE p.id = auth.uid();
$$;
```

**`get_my_profile()`**
```sql
-- Простой способ получить свой профиль
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS profiles
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $$
  SELECT * FROM public.profiles WHERE id = auth.uid();
$$;
```

**`admin_get_user_profiles(limit_count int, offset_count int)`**
```sql
-- Админская функция для получения списка пользователей
CREATE OR REPLACE FUNCTION public.admin_get_user_profiles(
  limit_count integer DEFAULT 100,
  offset_count integer DEFAULT 0
)
RETURNS TABLE(
  id uuid, email text, full_name text,
  role text, created_at timestamp, last_sign_in timestamp
)
LANGUAGE sql SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $$
  SELECT 
    p.id, p.email, p.full_name,
    COALESCE(
      (SELECT string_agg(ur.role::text, ',') 
       FROM public.user_roles ur 
       WHERE ur.user_id = p.id), 
      'user'
    ) as role,
    p.created_at,
    u.last_sign_in_at
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  WHERE public.has_role(auth.uid(), 'admin')
  ORDER BY p.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
$$;
```

**`log_profile_access(accessed_user_id uuid, access_type text, ...)`**
```sql
-- Логирует доступ админа к профилям пользователей
CREATE OR REPLACE FUNCTION public.log_profile_access(
  accessed_user_id uuid,
  access_type text,
  accessed_fields text[] DEFAULT NULL,
  reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    INSERT INTO public.profile_access_logs (
      admin_user_id, accessed_user_id, access_type,
      accessed_fields, reason, ip_address, user_agent
    ) VALUES (
      auth.uid(), accessed_user_id, access_type,
      accessed_fields, reason,
      inet_client_addr(),
      current_setting('request.headers', true)::json->>'user-agent'
    );
  END IF;
END;
$$;
```

### 3.3 Функции для работы с активностями

**`update_activity_status(activity_id uuid, new_status text, user_notes text)`**
```sql
-- Обновляет статус активности и создает запись состояния
CREATE OR REPLACE FUNCTION public.update_activity_status(
  activity_id uuid,
  new_status text,
  user_notes text DEFAULT NULL
)
RETURNS TABLE(id uuid, title text, status text, updated_at timestamp)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $$
BEGIN
  -- Обновить статус активности
  UPDATE public.activities 
  SET status = new_status, updated_at = NOW()
  WHERE activities.id = activity_id 
    AND activities.user_id = auth.uid();
  
  -- Создать или обновить состояние активности
  INSERT INTO public.activity_states (
    activity_id, user_id, state, notes, created_at, updated_at
  ) VALUES (
    activity_id, auth.uid(), new_status, user_notes, NOW(), NOW()
  )
  ON CONFLICT (activity_id, user_id) 
  DO UPDATE SET
    state = EXCLUDED.state,
    notes = EXCLUDED.notes,
    updated_at = NOW();
  
  -- Вернуть обновленную активность
  RETURN QUERY
  SELECT a.id, a.title, a.status, a.updated_at
  FROM public.activities a
  WHERE a.id = activity_id AND a.user_id = auth.uid();
END;
$$;
```

### 3.4 Функции для AI дневника

**`ensure_ai_session(p_session_id text, p_user_id uuid)`**
```sql
-- Создает или получает существующую сессию AI дневника
CREATE OR REPLACE FUNCTION public.ensure_ai_session(
  p_session_id text,
  p_user_id uuid
)
RETURNS TABLE(session_id varchar, is_new boolean)
LANGUAGE plpgsql
AS $$
DECLARE
  v_session_id VARCHAR(255);
  v_is_new BOOLEAN := false;
BEGIN
  IF p_session_id IS NULL OR p_session_id = '' THEN
    v_session_id := gen_random_uuid()::text;
    v_is_new := true;
    INSERT INTO ai_diary_sessions (user_id, session_id)
    VALUES (p_user_id, v_session_id);
  ELSE
    SELECT s.session_id INTO v_session_id
    FROM ai_diary_sessions s
    WHERE s.session_id = p_session_id
    LIMIT 1;
    
    IF v_session_id IS NULL THEN
      v_session_id := p_session_id;
      v_is_new := true;
      INSERT INTO ai_diary_sessions (user_id, session_id)
      VALUES (p_user_id, v_session_id);
    END IF;
  END IF;
  
  RETURN QUERY SELECT v_session_id, v_is_new;
END;
$$;
```

### 3.5 Утилитарные функции

**`update_updated_at_column()`**
```sql
-- Автоматически обновляет поле updated_at (используется в триггерах)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
```

**`insert_test_mood_entries()`**
```sql
-- Вставляет тестовые записи настроения для разработки
CREATE OR REPLACE FUNCTION public.insert_test_mood_entries()
RETURNS TABLE(inserted_count integer)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_count integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO mood_diary_entries (
    user_id, mood_score, emotions, created_at, updated_at
  ) VALUES 
    (auth.uid(), 7, '["Бодрость", "Оптимизм"]'::jsonb, 
     date_trunc('day', CURRENT_TIMESTAMP) + INTERVAL '8 hours',
     date_trunc('day', CURRENT_TIMESTAMP) + INTERVAL '8 hours'),
    (auth.uid(), 5, '["Спокойствие", "Концентрация"]'::jsonb,
     date_trunc('day', CURRENT_TIMESTAMP) + INTERVAL '11 hours 30 minutes',
     date_trunc('day', CURRENT_TIMESTAMP) + INTERVAL '11 hours 30 minutes'),
    (auth.uid(), 8, '["Удовлетворённость", "Энергичность"]'::jsonb,
     date_trunc('day', CURRENT_TIMESTAMP) + INTERVAL '15 hours',
     date_trunc('day', CURRENT_TIMESTAMP) + INTERVAL '15 hours');

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN QUERY SELECT v_count;
END;
$$;
```

---

## 4. Database Triggers

### 4.1 Триггер синхронизации профиля

**`sync_user_profile()`**
```sql
-- Автоматически создает/обновляет профиль при регистрации
CREATE OR REPLACE FUNCTION public.sync_user_profile()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, full_name, created_at, updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name'
    ),
    NOW(), NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- Триггер на вставку пользователя
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_profile();
```

### 4.2 Триггер назначения ролей

**`handle_new_user_role()`**
```sql
-- Автоматически назначает роль 'user' всем новым пользователям
-- Также назначает роль 'admin' для определенного email
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $$
BEGIN
  -- Назначить роль 'user' по умолчанию
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Назначить роль 'admin' для конкретного email
  IF lower(NEW.email) = lower('somov50@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Триггер на вставку пользователя
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();
```

### 4.3 Триггеры обновления updated_at

```sql
-- Для каждой таблицы с полем updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- И так далее для всех таблиц с updated_at
```

### 4.4 Триггеры для webhooks

**`notify_n8n_webhook()` и `simple_webhook_trigger()`**
```sql
-- Отправляет webhook на n8n при новых сообщениях AI дневника
CREATE OR REPLACE FUNCTION public.simple_webhook_trigger()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
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

-- Триггер на вставку сообщений
CREATE TRIGGER ai_diary_webhook_trigger
  AFTER INSERT ON public.ai_diary_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.simple_webhook_trigger();
```

---

## 5. Внешние интеграции

### 5.1 n8n Webhook для AI Дневника

**URL:** `https://mentalbalans.com/webhook/ai-diary-supabase`

**Назначение:** Обработка сообщений пользователя AI дневника через OpenAI API

**Процесс:**
1. Пользователь отправляет сообщение → вставка в `ai_diary_messages`
2. Триггер `simple_webhook_trigger()` отправляет POST на webhook
3. n8n получает сообщение и отправляет в OpenAI API
4. n8n получает ответ от OpenAI
5. n8n вставляет ответ обратно в `ai_diary_messages`
6. Realtime подписка отправляет ответ клиенту

**Формат данных:**
```json
{
  "record": {
    "id": "uuid",
    "user_id": "uuid",
    "session_id": "string",
    "content": "текст сообщения",
    "message_type": "user",
    "metadata": {},
    "created_at": "timestamp"
  },
  "table": "ai_diary_messages"
}
```

### 5.2 Тестовая функция webhook

**`test_webhook_connection()`**
```sql
-- Отправляет тестовый запрос на webhook для проверки соединения
CREATE OR REPLACE FUNCTION public.test_webhook_connection()
RETURNS text
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
```

---

## 6. Frontend Services (слой абстракции)

### 6.1 Структура сервисов

```
src/services/
├── api.client.ts              # Axios клиент с перехватчиками
├── backend-auth.service.ts    # Аутентификация через внешний API
├── backend-activity.service.ts # Активности через внешний API
├── backend-diary.service.ts   # Дневники через внешний API
├── backend-user.service.ts    # Пользователи через внешний API
├── ai-diary.service.ts        # AI дневник через Supabase
├── activity.service.ts        # Активности через Supabase
├── calendar.service.ts        # Календарь через Supabase
├── onboarding.service.ts      # Онбординг через Supabase
├── unified-activity.service.ts # Унифицированный сервис активностей
└── mock-*.service.ts          # Mock сервисы для разработки
```

### 6.2 API Client (api.client.ts)

**Назначение:** Базовый Axios клиент для работы с внешним REST API

```typescript
const API_BASE_URL = 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - добавляет токен авторизации
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor - обновляет токен при 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Попытка обновить токен
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        // Логика обновления токена
      } else {
        // Перенаправление на логин
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### 6.3 Backend Auth Service (backend-auth.service.ts)

**Интерфейсы:**
```typescript
interface LoginCredentials {
  username: string; // email
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  confirm_password: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  privacy_consent: boolean;
  terms_consent: boolean;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  is_active: boolean;
  privacy_consent: boolean;
  terms_consent: boolean;
  created_at: string;
  updated_at: string;
}
```

**Методы:**
```typescript
class BackendAuthService {
  async checkServerHealth(): Promise<boolean>
  async register(userData: RegisterData): Promise<User>
  async login(credentials: LoginCredentials): Promise<AuthResponse>
  async getCurrentUser(): Promise<User>
  async updateProfile(userData: Partial<User>): Promise<User>
  async logout(): Promise<void>
  
  storeAuthTokens(authResponse: AuthResponse): void
  storeUserData(user: User): void
  getStoredUser(): User | null
  getStoredTokens(): { accessToken: string | null; refreshToken: string | null }
  clearAuthData(): void
  isAuthenticated(): boolean
}
```

### 6.4 Backend Activity Service (backend-activity.service.ts)

**Интерфейсы:**
```typescript
interface Activity {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  activity_type_id: number;
  start_time: string; // ISO timestamp
  end_time?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'skipped';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface ActivityEvaluation {
  id: string;
  activity_id: number;
  user_id: number;
  process_satisfaction?: number;  // 1-10
  result_satisfaction?: number;   // 1-10
  energy_expenditure?: number;    // 1-10
  stress_level?: number;          // 1-10
  notes?: string;
  created_at: string;
}

interface StateSnapshot {
  id: string;
  user_id: number;
  mood: number;      // 1-10
  energy: number;    // 1-10
  stress: number;    // 1-10
  anxiety: number;   // 1-10
  timestamp: string;
  metadata?: Record<string, any>;
}
```

**Методы:**
```typescript
class BackendActivityService {
  // Activities CRUD
  async createActivity(activity: CreateActivityRequest): Promise<Activity>
  async getActivities(params?: ActivityQueryParams): Promise<Activity[]>
  async getActivity(activityId: number): Promise<Activity>
  async updateActivity(activityId: number, updates: UpdateActivityRequest): Promise<Activity>
  async deleteActivity(activityId: number): Promise<void>
  async getActivitiesCalendar(startDate: string, endDate: string): Promise<Activity[]>
  
  // Activity Evaluations
  async createEvaluation(evaluation: CreateEvaluationRequest): Promise<ActivityEvaluation>
  async getEvaluations(activityId?: number): Promise<ActivityEvaluation[]>
  async updateEvaluation(evaluationId: string, updates: Partial<ActivityEvaluation>): Promise<ActivityEvaluation>
  async getEvaluationStats(): Promise<EvaluationStats>
  
  // State Snapshots
  async createStateSnapshot(snapshot: CreateStateSnapshotRequest): Promise<StateSnapshot>
  async getStateSnapshots(params?: StateSnapshotQueryParams): Promise<StateSnapshot[]>
  async getStateTrends(startDate: string, endDate: string): Promise<StateTrends>
  async getStateAnalysis(): Promise<StateAnalysis>
}
```

### 6.5 AI Diary Service (ai-diary.service.ts)

**Назначение:** Работа с AI дневником через Supabase

```typescript
class AIDiaryService {
  // Session Management
  async ensureSession(sessionId: string | null, userId: string): Promise<{
    session_id: string;
    is_new: boolean;
  }>
  
  async getOrCreateSession(userId: string, sessionId?: string): Promise<string>
  
  async getSessions(userId: string, limit?: number): Promise<AISession[]>
  
  async getSession(sessionId: string): Promise<AISession | null>
  
  async updateSession(sessionId: string, updates: Partial<AISession>): Promise<void>
  
  async endSession(sessionId: string): Promise<void>
  
  // Message Management
  async getMessages(sessionId: string): Promise<AIMessage[]>
  
  async addMessage(
    userId: string,
    sessionId: string,
    content: string,
    messageType: 'user' | 'assistant',
    metadata?: Record<string, any>
  ): Promise<AIMessage>
  
  async updateMessageMetadata(
    messageId: string,
    metadata: Record<string, any>
  ): Promise<void>
  
  // Realtime Subscription
  subscribeToMessages(
    sessionId: string,
    onMessage: (message: AIMessage) => void
  ): RealtimeChannel
}
```

### 6.6 Activity Service (activity.service.ts)

**Назначение:** Работа с активностями через Supabase

```typescript
class ActivityService {
  async getActivities(userId: string, date?: string): Promise<Activity[]>
  
  async getActivitiesRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Activity[]>
  
  async createActivity(activity: CreateActivityData): Promise<Activity>
  
  async updateActivity(
    activityId: string,
    updates: UpdateActivityData
  ): Promise<Activity>
  
  async deleteActivity(activityId: string): Promise<void>
  
  async toggleActivityStatus(activityId: string): Promise<Activity>
  
  // Activity States
  async getActivityState(activityId: string): Promise<ActivityState | null>
  
  async createOrUpdateActivityState(
    activityId: string,
    userId: string,
    state: Partial<ActivityState>
  ): Promise<ActivityState>
  
  // Activity Types
  async getActivityTypes(): Promise<ActivityType[]>
}
```

### 6.7 Unified Activity Service (unified-activity.service.ts)

**Назначение:** Унифицированный интерфейс для работы с активностями из разных источников

```typescript
class UnifiedActivityService {
  constructor(
    private supabaseService: ActivityService,
    private backendService: BackendActivityService
  ) {}
  
  async getActivities(
    date?: string,
    source: 'supabase' | 'backend' = 'supabase'
  ): Promise<Activity[]>
  
  async createActivity(
    activity: CreateActivityData,
    source: 'supabase' | 'backend' = 'supabase'
  ): Promise<Activity>
  
  async syncActivities(
    userId: string,
    from: 'supabase' | 'backend',
    to: 'supabase' | 'backend'
  ): Promise<void>
}
```

---

## 7. Realtime Subscriptions

### 7.1 Подписка на сообщения AI дневника

```typescript
// В компоненте
useEffect(() => {
  const channel = supabase
    .channel('ai-diary-messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'ai_diary_messages',
        filter: `session_id=eq.${sessionId}`
      },
      (payload) => {
        const newMessage = payload.new as AIMessage;
        if (newMessage.message_type === 'assistant') {
          setMessages(prev => [...prev, newMessage]);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [sessionId]);
```

### 7.2 Подписка на активности

```typescript
// В useActivitiesRealtime hook
const channel = supabase
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'activities'
    },
    (payload) => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Новая активность добавлена');
    }
  )
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'activities'
    },
    (payload) => {
      queryClient.invalidateQueries({ 
        queryKey: ['activities', payload.new.id] 
      });
      toast.info('Активность обновлена');
    }
  )
  .subscribe();
```

---

## 8. Аутентификация и авторизация

### 8.1 Supabase Auth

**Провайдеры:**
- Email/Password (основной)
- Планируется: Google OAuth, Facebook OAuth

**Процесс регистрации:**
1. Пользователь заполняет форму регистрации
2. Frontend отправляет запрос в `supabase.auth.signUp()`
3. Supabase создает запись в `auth.users`
4. Триггер `sync_user_profile()` создает профиль в `public.profiles`
5. Триггер `handle_new_user_role()` назначает роль 'user'
6. Пользователь получает email с подтверждением (опционально)
7. После подтверждения email пользователь может войти

**Процесс входа:**
1. Пользователь вводит email/password
2. Frontend отправляет запрос в `supabase.auth.signInWithPassword()`
3. Supabase возвращает JWT токен и refresh token
4. Токены сохраняются в localStorage (Supabase SDK делает это автоматически)
5. Frontend загружает профиль пользователя

**Процесс выхода:**
1. Frontend вызывает `supabase.auth.signOut()`
2. Токены удаляются из localStorage
3. Пользователь перенаправляется на страницу входа

### 8.2 Backend API Auth (альтернативный вариант)

**Используется для интеграции с внешним FastAPI бэкэндом**

**Процесс:**
1. Регистрация через `POST /api/v1/auth/register`
2. Вход через `POST /api/v1/auth/login-json` (возвращает JWT)
3. Токены сохраняются в localStorage
4. При каждом запросе токен добавляется в заголовок `Authorization: Bearer <token>`
5. При 401 ошибке происходит попытка обновить токен через refresh token

### 8.3 Проверка прав доступа

**На клиенте:**
```typescript
// Проверка аутентификации
const isAuthenticated = !!supabase.auth.getUser();

// Проверка роли (загружается из профиля)
const hasRole = (role: string) => {
  return user?.role?.includes(role);
};
```

**На сервере (RLS):**
```sql
-- Проверка через функцию has_role()
WHERE has_role(auth.uid(), 'admin')
```

---

## 9. API Endpoints (внешний REST API)

### 9.1 Authentication

```
POST   /api/v1/auth/register         - Регистрация
POST   /api/v1/auth/login-json       - Вход
POST   /api/v1/auth/logout           - Выход
POST   /api/v1/auth/refresh          - Обновление токена
GET    /api/v1/auth/verify           - Проверка токена
```

### 9.2 User Profile

```
GET    /api/v1/user/me               - Получить свой профиль
PUT    /api/v1/user/me               - Обновить свой профиль
DELETE /api/v1/user/me               - Удалить свой профиль
GET    /api/v1/user/{id}             - Получить профиль пользователя (admin)
```

### 9.3 Activities

```
GET    /api/v1/activities            - Список активностей
POST   /api/v1/activities            - Создать активность
GET    /api/v1/activities/{id}       - Получить активность
PUT    /api/v1/activities/{id}       - Обновить активность
DELETE /api/v1/activities/{id}       - Удалить активность
GET    /api/v1/activities/calendar   - Календарь активностей
```

### 9.4 Activity Evaluations

```
GET    /api/v1/evaluations                    - Список оценок
POST   /api/v1/evaluations                    - Создать оценку
GET    /api/v1/evaluations/{id}               - Получить оценку
PUT    /api/v1/evaluations/{id}               - Обновить оценку
DELETE /api/v1/evaluations/{id}               - Удалить оценку
GET    /api/v1/evaluations/activity/{id}      - Оценки активности
GET    /api/v1/evaluations/stats              - Статистика оценок
```

### 9.5 State Snapshots

```
GET    /api/v1/state/snapshots       - Список снимков состояния
POST   /api/v1/state/snapshots       - Создать снимок
GET    /api/v1/state/trends          - Тренды состояния
GET    /api/v1/state/analysis        - Анализ состояния
```

---

## 10. Безопасность

### 10.1 Основные принципы

1. **Row Level Security (RLS)** - все таблицы защищены RLS
2. **Функции SECURITY DEFINER** - используются для избежания рекурсии RLS
3. **Раздельное хранение ролей** - роли в отдельной таблице `user_roles`
4. **Аудит доступа** - логирование доступа админов к профилям
5. **JWT токены** - короткий срок жизни access token, refresh token для обновления
6. **HTTPS** - все запросы по HTTPS (в продакшене)

### 10.2 Защита от атак

**SQL Injection:**
- Использование параметризованных запросов
- Supabase SDK автоматически экранирует параметры

**XSS:**
- React автоматически экранирует вывод
- Валидация и санитизация пользовательского ввода

**CSRF:**
- JWT токены вместо cookies
- SameSite cookie flags (если используются)

**Privilege Escalation:**
- Роли в отдельной таблице
- Функция `has_role()` для проверки прав
- RLS политики для каждой таблицы

### 10.3 Аудит и логирование

**Логи доступа к профилям:**
```sql
SELECT * FROM profile_access_logs
WHERE admin_user_id = 'uuid'
ORDER BY created_at DESC;
```

**Логи изменений в базе данных:**
- Supabase предоставляет встроенное логирование всех операций
- Доступно через Dashboard → Database → Logs

---

## 11. Производительность

### 11.1 Индексы

```sql
-- Индексы на внешние ключи
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_start_time ON activities(start_time);
CREATE INDEX idx_ai_diary_messages_session_id ON ai_diary_messages(session_id);
CREATE INDEX idx_ai_diary_messages_user_id ON ai_diary_messages(user_id);

-- Составные индексы
CREATE INDEX idx_activities_user_date 
ON activities(user_id, start_time);
```

### 11.2 Оптимизация запросов

**Использование select():**
```typescript
// Выбирать только нужные поля
const { data } = await supabase
  .from('activities')
  .select('id, title, start_time, status')
  .eq('user_id', userId);
```

**Пагинация:**
```typescript
// Использовать limit и offset
const { data } = await supabase
  .from('activities')
  .select('*')
  .range(0, 9); // Первые 10 записей
```

**Кэширование:**
```typescript
// TanStack Query автоматически кэширует данные
const { data } = useQuery({
  queryKey: ['activities', date],
  queryFn: () => activityService.getActivities(userId, date),
  staleTime: 5 * 60 * 1000, // 5 минут
});
```

### 11.3 Connection Pooling

Supabase автоматически управляет пулом соединений с PostgreSQL.

**Рекомендации:**
- Не создавать новый Supabase клиент для каждого запроса
- Использовать singleton паттерн для Supabase клиента
- Закрывать Realtime подписки при размонтировании компонентов

---

## 12. Мониторинг и отладка

### 12.1 Supabase Dashboard

**Database → Logs:**
- Query performance
- Slow queries
- Error logs

**Database → API:**
- API usage statistics
- Request counts
- Error rates

**Auth → Users:**
- User management
- Authentication logs
- User activity

### 12.2 Frontend Debugging

**React Query DevTools:**
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

**Console Logging:**
```typescript
// В сервисах
console.log('[ActivityService] Creating activity:', activity);
console.log('[AIDiaryService] Message received:', message);
```

### 12.3 Error Tracking

**Обработка ошибок в сервисах:**
```typescript
try {
  const { data, error } = await supabase
    .from('activities')
    .insert(activity);
  
  if (error) throw error;
  return data;
} catch (error) {
  console.error('[ActivityService] Error creating activity:', error);
  throw new Error('Failed to create activity');
}
```

**Показ ошибок пользователю:**
```typescript
import { toast } from 'sonner';

try {
  await activityService.createActivity(activity);
  toast.success('Активность создана');
} catch (error) {
  toast.error('Не удалось создать активность');
}
```

---

## 13. Deployment и Environment Variables

### 13.1 Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# External API (если используется)
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 13.2 Supabase Project Settings

**Database Settings:**
- Connection Pooling: Enabled
- Statement Timeout: 60s
- Max Connections: 100

**Auth Settings:**
- JWT Expiry: 3600s (1 hour)
- Refresh Token Expiry: 604800s (7 days)
- Email Confirmation: Optional (можно отключить для разработки)

**API Settings:**
- CORS: Enabled для домена приложения
- Rate Limiting: Enabled

### 13.3 Backup и восстановление

**Автоматические бэкапы:**
- Supabase делает ежедневные бэкапы БД
- Хранятся 7 дней для Free tier, 30+ для Pro

**Ручные бэкапы:**
```bash
# Через Supabase Dashboard
Database → Backups → Create Backup

# Через pg_dump (если есть доступ)
pg_dump -h db.your-project.supabase.co -U postgres > backup.sql
```

---

## 14. Будущие улучшения

### 14.1 Планируемые функции

1. **Edge Functions:**
   - Обработка AI запросов напрямую через Edge Functions
   - Интеграция с OpenAI API без внешнего webhook
   - Scheduled functions для автоматических задач

2. **Расширенная аналитика:**
   - Материализованные представления для быстрой аналитики
   - Агрегированные таблицы для статистики
   - Real-time дашборды

3. **Уведомления:**
   - Push-уведомления через Firebase
   - Email-уведомления через Resend
   - In-app уведомления через Realtime

4. **Файловое хранилище:**
   - Supabase Storage для аватаров
   - Storage для вложений в дневниках
   - Оптимизация изображений

### 14.2 Оптимизации

1. **Database:**
   - Партиционирование больших таблиц
   - Архивирование старых данных
   - Оптимизация индексов

2. **API:**
   - GraphQL API через PostgREST
   - Batch operations
   - Caching layer

3. **Security:**
   - Rate limiting на уровне RLS
   - API key rotation
   - Advanced audit logging

---

## 15. Troubleshooting

### 15.1 Частые проблемы

**Ошибка: "new row violates row-level security policy"**
```
Причина: user_id не установлен или не соответствует auth.uid()
Решение: Убедиться, что user_id = auth.uid() при вставке
```

**Ошибка: "infinite recursion detected in policy"**
```
Причина: RLS политика обращается к той же таблице
Решение: Использовать SECURITY DEFINER функцию
```

**Ошибка: "JWT expired"**
```
Причина: Access token истек
Решение: Использовать refresh token для обновления
```

**Webhook не срабатывает:**
```
Причина: Триггер не активен или URL неверен
Решение: Проверить триггер и протестировать через test_webhook_connection()
```

### 15.2 Диагностика

**Проверка RLS политик:**
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'activities';
```

**Проверка триггеров:**
```sql
SELECT * FROM pg_trigger 
WHERE tgname LIKE '%ai_diary%';
```

**Проверка функций:**
```sql
SELECT * FROM pg_proc 
WHERE proname LIKE '%has_role%';
```

---

## 16. Полезные ссылки

- **Supabase Documentation:** https://supabase.com/docs
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **PostgREST API Documentation:** https://postgrest.org/
- **Supabase JS Client:** https://supabase.com/docs/reference/javascript
- **Row Level Security:** https://supabase.com/docs/guides/auth/row-level-security

---

## Заключение

Бэкэнд приложения построен на современном стеке технологий с акцентом на безопасность, производительность и масштабируемость. Использование Supabase позволяет быстро разрабатывать функционал без необходимости создания отдельного backend сервера, при этом обеспечивая все необходимые возможности для полноценного приложения.

Ключевые преимущества архитектуры:
- **Безопасность:** RLS, SECURITY DEFINER функции, раздельное хранение ролей
- **Производительность:** Индексы, кэширование, connection pooling
- **Масштабируемость:** Горизонтальное масштабирование PostgreSQL, Edge Functions
- **Realtime:** WebSocket подписки для мгновенного обновления данных
- **Простота:** Автоматическая генерация API, TypeScript типы, простая интеграция
