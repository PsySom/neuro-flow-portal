# Полное описание проекта Mental Balance

## 📋 Общая информация

**Проект**: Mental Balance - платформа психологической поддержки  
**Тип**: Fullstack веб-приложение (React + Supabase)  
**URL проекта**: https://szvousyzsqdpubgfycdy.supabase.co  
**Технологии**: React 18, TypeScript, Vite, Tailwind CSS, Supabase, React Query

---

## 🏗️ Архитектура проекта

### Структура приложения

```
Frontend (React/Vite)
    ↓
Supabase Client
    ↓
┌─────────────────────────────────────────┐
│         Supabase Backend                │
│  ┌──────────────────────────────────┐  │
│  │ Database (PostgreSQL)            │  │
│  │ - Tables                         │  │
│  │ - RLS Policies                   │  │
│  │ - Functions & Triggers           │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ Auth (Supabase Auth)             │  │
│  │ - Email/Password                 │  │
│  │ - Session Management             │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ Realtime (WebSockets)            │  │
│  │ - Subscriptions                  │  │
│  │ - Broadcast                      │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ External Webhooks                │  │
│  │ - n8n (mentalbalans.com)         │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 📁 Структура файлов проекта

### Frontend структура

```
src/
├── components/           # React компоненты
│   ├── ui/              # shadcn/ui компоненты
│   ├── dashboard/       # Компоненты дашборда
│   │   ├── ai-diary-scenarios/  # AI Дневник
│   │   ├── ai-chat/            # AI Чат
│   │   ├── user-profile/       # Профиль пользователя
│   │   └── activity-timeline/  # Лента активностей
│   ├── calendar/        # Календарь активностей
│   ├── diaries/         # Дневники (Mood, Sleep, OCD и т.д.)
│   ├── practices/       # Практики и упражнения
│   ├── onboarding/      # Онбординг
│   ├── auth/            # Авторизация
│   └── statistics/      # Статистика и графики
│
├── contexts/            # React Context
│   ├── SupabaseAuthContext.tsx
│   ├── PersonalizationContext.tsx
│   ├── ActivitiesContext.tsx
│   └── DiaryStatusContext.tsx
│
├── hooks/               # Custom React Hooks
│   ├── api/            # API хуки
│   │   ├── useActivities.ts
│   │   ├── useActivitiesApi.ts
│   │   └── useActivitiesRealtime.ts
│   └── use-*.ts        # Другие хуки
│
├── services/            # Сервисы для работы с API
│   ├── ai-diary.service.ts
│   ├── activity.service.ts
│   ├── backend-auth.service.ts
│   └── unified-activity.service.ts
│
├── integrations/supabase/
│   ├── client.ts        # Supabase клиент
│   ├── types.ts         # Авто-генерируемые типы БД
│   ├── activities.repo.ts
│   ├── mood-diary.repo.ts
│   └── sleep-diary.repo.ts
│
├── pages/               # Страницы (роуты)
│   ├── Index.tsx
│   ├── Dashboard.tsx
│   ├── Calendar.tsx
│   ├── Auth.tsx
│   ├── Practices.tsx
│   └── Statistics.tsx
│
├── utils/               # Утилиты
├── types/               # TypeScript типы
└── data/                # Статические данные
```

---

## 🗄️ База данных (Supabase PostgreSQL)

### Таблицы и их назначение

#### 1. **profiles** - Профили пользователей
```sql
- id: uuid (PK, FK -> auth.users)
- email: text
- full_name: text
- avatar_url: text
- telegram_handle: text
- whatsapp_number: text
- facebook_url: text
- role: text
- created_at, updated_at: timestamp
```
**RLS Policies**:
- Пользователь видит/редактирует свой профиль
- Админы видят/редактируют все профили

---

#### 2. **activities** - Активности пользователя
```sql
- id: uuid (PK)
- user_id: uuid (FK -> profiles.id)
- activity_type_id: integer (FK -> activity_types.id)
- title: text
- description: text
- start_time: timestamp
- end_time: timestamp
- status: text (planned|in_progress|completed|cancelled)
- metadata: jsonb
- created_at, updated_at: timestamp
```
**RLS Policies**:
- Пользователь управляет только своими активностями

**Типы активностей** (activity_types):
- Работа, Отдых, Спорт, Общение, Хобби и т.д.
- Каждый тип имеет цвет и иконку

---

#### 3. **activity_states** - Состояния активностей
```sql
- id: uuid (PK)
- activity_id: uuid (FK -> activities.id)
- user_id: uuid
- state: text (planned|in_progress|completed|cancelled)
- mood_before: integer (1-10)
- mood_after: integer (1-10)
- energy_before: integer (1-10)
- energy_after: integer (1-10)
- notes: text
- metadata: jsonb
- created_at, updated_at: timestamp
```
**Назначение**: Отслеживание изменений настроения и энергии до/после активности

---

#### 4. **ai_diary_sessions** - Сессии AI дневника
```sql
- id: uuid (PK)
- user_id: uuid (FK -> profiles.id)
- session_id: varchar (уникальный идентификатор)
- started_at: timestamp
- ended_at: timestamp (nullable)
- summary: text
- insights: jsonb
- emotional_state: jsonb
- created_at: timestamp
```

---

#### 5. **ai_diary_messages** - Сообщения AI дневника
```sql
- id: uuid (PK)
- user_id: uuid (FK -> profiles.id)
- session_id: varchar (FK -> ai_diary_sessions.session_id)
- message_type: varchar ('user' | 'ai')
- content: text
- metadata: jsonb (может содержать suggestions, topics и т.д.)
- created_at: timestamp
```

**Realtime подписка**: Клиент подписывается на новые AI сообщения

---

#### 6. **mood_diary_entries** - Записи дневника настроения
```sql
- id: uuid (PK)
- user_id: uuid
- mood_score: integer (1-10)
- emotions: jsonb (массив эмоций с интенсивностью)
- triggers: text[] (триггеры)
- physical_sensations: text[]
- body_areas: text[]
- context: text
- notes: text
- created_at, updated_at: timestamp
```

---

#### 7. **sleep_diary_entries** - Записи дневника сна
```sql
- id: uuid (PK)
- user_id: uuid
- bedtime: time
- wake_up_time: time
- sleep_duration: numeric
- sleep_quality: integer (1-10)
- night_awakenings: integer
- morning_feeling: integer (1-10)
- has_day_rest: boolean
- day_rest_type: text
- day_rest_effectiveness: integer
- overall_sleep_impact: integer
- sleep_disruptors: text[]
- sleep_comment: text
- rest_comment: text
- recommendations: text[]
- created_at, updated_at: timestamp
```

---

#### 8. **practices** - Практики и упражнения
```sql
- id: bigint (PK)
- title: text
- description: text
- category: text
- duration_minutes: integer
- difficulty_level: enum (beginner|intermediate|advanced)
- instructions: text[]
- benefits: text[]
- status: enum (draft|published|archived)
- created_by: uuid
- metadata: jsonb
- created_at, updated_at: timestamp
```

**RLS Policies**:
- Все видят published практики
- Админы управляют всеми практиками

---

#### 9. **therapy_scenarios** - Терапевтические сценарии
```sql
- id: uuid (PK)
- scenario_code: varchar (уникальный код)
- scenario_type: varchar (morning|midday|evening)
- name: varchar
- description: text
- duration_minutes: integer
- priority: integer
- is_active: boolean
- created_at, updated_at: timestamp
```

---

#### 10. **therapy_questions** - Вопросы для терапии
```sql
- id: uuid (PK)
- scenario_id: uuid (FK -> therapy_scenarios.id)
- parent_question_id: uuid (nullable, для вложенности)
- question_code: varchar
- question_text: text
- question_type: varchar (scale|multiple-choice|multi-select|text|emoji-scale)
- sequence_number: integer
- metadata: jsonb (options, scaleRange и т.д.)
- created_at: timestamp
```

---

#### 11. **therapy_transitions** - Переходы между вопросами
```sql
- id: uuid (PK)
- from_question_id: uuid (FK -> therapy_questions.id)
- condition_type: varchar (exact_value|range|multi_contains и т.д.)
- condition_data: jsonb
- next_question_id: uuid (nullable)
- next_scenario_id: uuid (nullable)
- priority: integer
- created_at: timestamp
```

---

#### 12. **user_therapy_progress** - Прогресс пользователя
```sql
- id: uuid (PK)
- user_id: uuid
- session_id: varchar
- scenario_id: uuid
- current_question_id: uuid
- responses: jsonb
- metrics: jsonb (A, E, S, T scores)
- insights: jsonb
- completed_at: timestamp (nullable)
- created_at: timestamp
```

---

#### 13. **user_roles** - Роли пользователей
```sql
- id: uuid (PK)
- user_id: uuid (FK -> profiles.id)
- role: enum (user|admin)
- created_at: timestamp
```

**Constraint**: Уникальная пара (user_id, role)

---

#### 14. **profile_access_logs** - Логи доступа к профилям
```sql
- id: uuid (PK)
- admin_user_id: uuid
- accessed_user_id: uuid
- access_type: text (view|update|delete)
- accessed_fields: text[]
- reason: text
- ip_address: inet
- user_agent: text
- created_at: timestamp
```

---

### Database Functions

#### 1. `has_role(user_id, role)`
Проверяет наличие роли у пользователя
```sql
RETURNS boolean
```

#### 2. `get_user_profile_with_role()`
Возвращает профиль текущего пользователя с его ролью
```sql
RETURNS TABLE(id, email, full_name, ..., role)
SECURITY DEFINER
```

#### 3. `admin_get_user_profiles(limit, offset)`
Админская функция для получения списка пользователей
```sql
RETURNS TABLE(id, email, full_name, role, created_at, last_sign_in)
SECURITY DEFINER
```

#### 4. `update_activity_status(activity_id, new_status, user_notes)`
Обновляет статус активности и создает запись в activity_states
```sql
RETURNS TABLE(id, title, status, updated_at)
SECURITY DEFINER
```

#### 5. `ensure_ai_session(session_id, user_id)`
Создает или возвращает существующую AI сессию
```sql
RETURNS TABLE(session_id, is_new)
```

#### 6. `log_profile_access(accessed_user_id, access_type, accessed_fields, reason)`
Логирует доступ админа к профилю пользователя
```sql
RETURNS void
SECURITY DEFINER
```

#### 7. `sync_user_profile()`
Trigger function для синхронизации auth.users и profiles
```sql
RETURNS trigger
SECURITY DEFINER
```

#### 8. `handle_new_user_role()`
Trigger function для автоматического назначения роли при регистрации
```sql
RETURNS trigger
SECURITY DEFINER
```

#### 9. `notify_n8n_webhook()` / `simple_webhook_trigger()`
Trigger functions для отправки данных на внешний webhook (n8n)
```sql
RETURNS trigger
SECURITY DEFINER
```

#### 10. `update_updated_at_column()`
Универсальный trigger для обновления поля updated_at
```sql
RETURNS trigger
```

---

### Database Triggers

#### 1. На таблице `auth.users`
```sql
TRIGGER on_auth_user_created
AFTER INSERT
EXECUTE FUNCTION sync_user_profile()
```
Создает запись в profiles при регистрации

```sql
TRIGGER on_new_user_role
AFTER INSERT
EXECUTE FUNCTION handle_new_user_role()
```
Назначает дефолтную роль 'user'

#### 2. На таблице `ai_diary_messages`
```sql
TRIGGER ai_diary_messages_webhook
AFTER INSERT
EXECUTE FUNCTION simple_webhook_trigger()
```
Отправляет user сообщения на webhook n8n для обработки AI

#### 3. На всех таблицах с updated_at
```sql
TRIGGER update_[table]_updated_at
BEFORE UPDATE
EXECUTE FUNCTION update_updated_at_column()
```

---

## 🔐 Авторизация и безопасность

### Процесс авторизации

1. **Регистрация** (`/auth` - Register):
   - Email + Password + Full Name (опционально)
   - `supabase.auth.signUp()` с emailRedirectTo
   - Автоматическое создание profile через trigger
   - Назначение роли 'user'
   - Email верификация (опциональная)

2. **Вход** (`/auth` - Login):
   - Email + Password
   - `supabase.auth.signInWithPassword()`
   - Очистка предыдущих auth токенов
   - Редирект на `/dashboard`

3. **Выход**:
   - `supabase.auth.signOut({ scope: 'global' })`
   - Очистка localStorage (auth токены, onboarding данные)
   - Редирект на `/auth`

### Система ролей

**Роли**: 
- `user` - обычный пользователь (по умолчанию)
- `admin` - администратор

**Админские права**:
- Просмотр всех пользователей (`admin_get_user_profiles`)
- Управление контентом (practices, tests, strategies)
- Доступ к логам (`profile_access_logs`)

### RLS (Row Level Security)

Все таблицы защищены RLS политиками:
- Пользователи видят только свои данные
- Админы имеют расширенный доступ
- Публичный контент (practices) доступен всем при статусе 'published'

---

## 🔄 Realtime подписки

### 1. AI Diary Messages
```typescript
// В AIDiaryService
supabase
  .channel(`ai_diary_${sessionId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'ai_diary_messages',
    filter: `session_id=eq.${sessionId}`
  }, (payload) => {
    if (payload.new.message_type === 'ai') {
      onNewMessage(payload.new);
    }
  })
  .subscribe();
```

### 2. Activities Realtime
```typescript
// В useActivitiesRealtime
supabase
  .channel('activities_changes')
  .on('postgres_changes', {
    event: '*', // INSERT, UPDATE, DELETE
    schema: 'public',
    table: 'activities',
    filter: `user_id=eq.${userId}`
  }, handleChange)
  .subscribe();
```

---

## 🤖 AI Дневник - Полный процесс

### Архитектура AI Дневника

```
User (Frontend)
    ↓ 1. Отправка сообщения
AIDiaryService.sendMessage()
    ↓ 2. Сохранение в БД
Supabase: ai_diary_messages (type: 'user')
    ↓ 3. Database Trigger
simple_webhook_trigger() → HTTP POST
    ↓ 4. Внешний webhook
n8n (https://mentalbalans.com/webhook/ai-diary-supabase)
    ↓ 5. AI обработка (OpenAI/другие модели)
n8n обрабатывает и возвращает ответ
    ↓ 6. Сохранение AI ответа
Supabase: ai_diary_messages (type: 'ai')
    ↓ 7. Realtime событие
Supabase Realtime → Frontend
    ↓ 8. Отображение в UI
useAIDiaryChat обновляет messages
```

### Компоненты AI Дневника

**Путь**: `src/components/dashboard/ai-diary-scenarios/`

1. **FreeChat.tsx** - Главный компонент свободного общения
2. **FreeChatMessages.tsx** - Отображение истории сообщений
3. **FreeChatInput.tsx** - Поле ввода сообщения
4. **FreeChatHeader.tsx** - Заголовок с управлением сессиями

**Hooks**:
- `useAIDiaryChat.ts` - Основная логика чата, отправка/получение сообщений
- `useAIDiaryAnalytics.ts` - Статистика по сессиям и темам
- `useDiaryState.ts` - Управление состоянием дневника

**Services**:
- `ai-diary.service.ts` - Сервис для работы с БД и Realtime
- `ai-diary-analytics.service.ts` - Анализ сообщений и топиков

### Процесс отправки сообщения

```typescript
// 1. Пользователь вводит текст и нажимает Enter
const sendMessage = async (messageText: string) => {
  // 2. Добавляем сообщение пользователя в UI
  const userMsg = {
    id: generateId(),
    type: 'user',
    content: messageText,
    timestamp: new Date()
  };
  setMessages(prev => [...prev, userMsg]);

  // 3. Добавляем placeholder "AI печатает..."
  setMessages(prev => [...prev, {
    id: 'typing',
    type: 'ai',
    content: '',
    isTyping: true
  }]);

  // 4. Отправляем в БД через AIDiaryService
  await AIDiaryService.sendMessage(messageText, sessionId);
  
  // 5. Ждем Realtime событие с AI ответом
  // (обработка в handleNewAIMessage)
};

// 6. Получение AI ответа через Realtime
const handleNewAIMessage = (message: any) => {
  // Убираем placeholder
  setMessages(prev => prev.filter(m => m.id !== 'typing'));
  
  // Добавляем AI сообщение с эффектом печати
  typeMessage(message.content, message.id, message.metadata?.suggestions);
};
```

### Формат AI ответа

```json
{
  "id": "uuid",
  "message_type": "ai",
  "content": "Текст ответа AI...",
  "metadata": {
    "suggestions": ["Вариант 1", "Вариант 2", "Вариант 3"],
    "topics": ["anxiety", "stress"],
    "sentiment": "positive",
    "processed": true
  }
}
```

### Сессии AI Дневника

**Создание новой сессии**:
```typescript
const startNewSession = async () => {
  const newSessionId = `ai_diary_${Date.now()}_${randomString}`;
  await AIDiaryService.startNewSession();
  localStorage.setItem('ai_diary_session_id', newSessionId);
};
```

**Загрузка истории**:
```typescript
const loadHistory = async (sessionId: string) => {
  const messages = await AIDiaryService.loadSessionHistory(sessionId);
  setMessages(messages.map(formatMessage));
};
```

**Завершение сессии**:
```typescript
const endSession = async () => {
  await AIDiaryService.endSession(sessionId);
  localStorage.removeItem('ai_diary_session_id');
};
```

### Аналитика AI Дневника

**Компонент**: `AIDiaryStats.tsx`

**Метрики**:
1. **Глобальная статистика пользователя**:
   - Общее количество сессий
   - Среднее сообщений на сессию
   - Всего сообщений

2. **Статистика текущей сессии**:
   - Длительность сессии
   - Количество сообщений
   - Средняя длина сообщений

3. **Топ темы**:
   - Частотный анализ ключевых слов
   - Топ-5 обсуждаемых тем

**Сервис**: `ai-diary-analytics.service.ts`

---

## 📅 Календарь активностей

### Структура календаря

**Путь**: `src/components/calendar/`

**Виды**:
1. **MonthView** - Месячный вид
2. **WeekView** - Недельный вид
3. **DayView** - Дневной вид (детальный)

### Компоненты календаря

```
Calendar/
├── CalendarHeader.tsx       # Навигация и переключение видов
├── CalendarControls.tsx     # Кнопки управления
├── MonthView.tsx            # Месячная сетка
├── WeekView.tsx             # Недельная сетка
├── DayView.tsx              # Детальный дневной вид
├── components/
│   ├── ActivityCard.tsx     # Карточка активности
│   ├── DayActivityCard.tsx  # Карточка для дневного вида
│   ├── WeekActivityCard.tsx # Карточка для недельного вида
│   ├── CreateActivityDialog.tsx  # Диалог создания
│   ├── EditActivityDialog.tsx    # Диалог редактирования
│   ├── DeleteRecurringDialog.tsx # Удаление повторяющихся
│   ├── CurrentTimeIndicator.tsx  # Индикатор текущего времени
│   └── TimeColumn.tsx            # Колонка времени
└── utils/
    ├── timeUtils.tsx        # Утилиты работы со временем
    ├── recurringUtils.ts    # Обработка повторений
    └── recurrenceExpansion.ts # Развертка повторений
```

### Типы активностей

**Таблица**: `activity_types`

| ID | Название | Цвет | Иконка |
|----|----------|------|--------|
| 1 | Работа | #3B82F6 | 💼 |
| 2 | Отдых | #10B981 | 🌴 |
| 3 | Спорт | #F59E0B | 🏃 |
| 4 | Общение | #8B5CF6 | 👥 |
| 5 | Хобби | #EC4899 | 🎨 |
| ... | ... | ... | ... |

### Статусы активности

- `planned` - Запланировано
- `in_progress` - В процессе
- `completed` - Завершено
- `cancelled` - Отменено

### Recurring (повторяющиеся) активности

**Metadata формат**:
```json
{
  "isRecurring": true,
  "recurrencePattern": {
    "frequency": "daily" | "weekly" | "monthly",
    "interval": 1,
    "daysOfWeek": [1, 3, 5], // Пн, Ср, Пт
    "endDate": "2024-12-31"
  },
  "recurringGroupId": "uuid"
}
```

**Логика**:
1. Создается родительская активность с `isRecurring: true`
2. Генерируются экземпляры на основе паттерна
3. При редактировании - диалог выбора: "Только эту" или "Все в серии"
4. При удалении - аналогично

### Hooks для календаря

```typescript
// Основной хук календаря
useCalendarView(view: 'month'|'week'|'day')

// Получение активностей
useActivities(startDate, endDate)

// Realtime обновления
useActivitiesRealtime(userId)

// Навигация по календарю
useCalendarNavigation(currentDate, view)
```

### Операции с активностями

**Создание**:
```typescript
const createActivity = async (data: ActivityData) => {
  const { data: activity, error } = await supabase
    .from('activities')
    .insert({
      user_id: userId,
      activity_type_id: data.typeId,
      title: data.title,
      start_time: data.startTime,
      end_time: data.endTime,
      status: 'planned',
      metadata: data.metadata
    })
    .select()
    .single();
  
  return activity;
};
```

**Обновление статуса**:
```typescript
const updateStatus = async (activityId: string, newStatus: string) => {
  // Использует database function
  const { data } = await supabase.rpc('update_activity_status', {
    activity_id: activityId,
    new_status: newStatus,
    user_notes: 'Завершено успешно'
  });
};
```

**Удаление**:
```typescript
const deleteActivity = async (activityId: string) => {
  await supabase
    .from('activities')
    .delete()
    .eq('id', activityId);
};
```

---

## 📔 Дневники (Diaries)

### Типы дневников

**Путь**: `src/components/diaries/`

1. **MoodDiary** - Дневник настроения
2. **SleepDiary** - Дневник сна
3. **ThoughtsDiary** - Дневник мыслей
4. **OCDDiary** - Дневник ОКР
5. **ProcrastinationDiary** - Дневник прокрастинации
6. **SelfEsteemDiary** - Дневник самооценки
7. **DepressionCareDiary** - Дневник заботы при депрессии

### Структура Mood Diary

**Шаги**:
1. **MoodStep** - Оценка настроения (1-10)
2. **EmotionsStep** - Выбор эмоций с интенсивностью
3. **ClarifyingQuestionsStep** - Уточняющие вопросы
4. **SelfEvaluationStep** - Самооценка ситуации
5. **RecommendationsStep** - Рекомендации

**Компоненты**:
```
diaries/mood/
├── MoodStep.tsx
├── EmotionsStep.tsx
├── ClarifyingQuestionsStep.tsx
├── SelfEvaluationStep.tsx
├── RecommendationsStep.tsx
├── constants.ts    # Списки эмоций, триггеров
└── types.ts        # TypeScript типы
```

**Данные эмоций** (constants.ts):
```typescript
export const EMOTIONS = [
  { value: 'радость', label: 'Радость', emoji: '😊', color: 'yellow' },
  { value: 'грусть', label: 'Грусть', emoji: '😢', color: 'blue' },
  { value: 'тревога', label: 'Тревога', emoji: '😰', color: 'orange' },
  { value: 'гнев', label: 'Гнев', emoji: '😠', color: 'red' },
  // ... и т.д.
];

export const TRIGGERS = [
  'Работа', 'Отношения', 'Здоровье', 'Финансы',
  'Семья', 'Друзья', 'Одиночество', 'Будущее'
];
```

**Сохранение**:
```typescript
const saveMoodEntry = async (data: MoodDiaryData) => {
  await supabase.from('mood_diary_entries').insert({
    user_id: userId,
    mood_score: data.moodScore,
    emotions: data.emotions, // jsonb
    triggers: data.triggers,
    physical_sensations: data.sensations,
    body_areas: data.bodyAreas,
    context: data.context,
    notes: data.notes
  });
};
```

### Структура Sleep Diary

**Шаги**:
1. **Step1Sleep** - Время сна и пробуждения
2. **Step2Quality** - Качество сна
3. **Step3Factors** - Факторы влияния
4. **Step4Rest** - Дневной отдых
5. **Step5Impact** - Общее влияние на день

**Данные**:
```typescript
interface SleepDiaryData {
  bedtime: string;           // "23:30"
  wakeUpTime: string;        // "07:00"
  sleepDuration: number;     // в часах
  sleepQuality: number;      // 1-10
  nightAwakenings: number;
  morningFeeling: number;    // 1-10
  hasDayRest: boolean;
  dayRestType?: string;
  dayRestEffectiveness?: number;
  overallSleepImpact: number;
  sleepDisruptors: string[];
  sleepComment?: string;
  recommendations: string[];
}
```

### Hook для дневников

```typescript
// Для Mood Diary
const useMoodDiary = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MoodDiaryData>({});
  
  const saveEntry = async () => {
    await supabase.from('mood_diary_entries').insert(formData);
  };
  
  return { currentStep, formData, setFormData, saveEntry };
};

// Для Sleep Diary
const useSleepDiary = () => {
  // Аналогично
};
```

---

## 🧘 Практики (Practices)

### Структура практик

**Путь**: `src/components/practices/`

**Компоненты**:
```
practices/
├── PracticeDetailModal.tsx     # Детальный просмотр
├── PracticeContentCard.tsx     # Карточка практики
├── PracticesSearchFilters.tsx  # Поиск и фильтры
├── CreatePracticeDialog.tsx    # Создание (админ)
├── CreateActivityFromPracticeDialog.tsx  # Планирование
└── detail/
    ├── PracticeInfo.tsx        # Основная информация
    ├── PracticeActions.tsx     # Кнопки действий
    ├── TestSection.tsx         # Раздел тестов
    └── useTestLogic.ts         # Логика тестирования
```

### Категории практик

- Дыхательные упражнения
- Медитация
- Релаксация
- Когнитивные техники
- Физические упражнения
- Mindfulness

### Уровни сложности

```typescript
enum DifficultyLevel {
  beginner = 'Начальный',
  intermediate = 'Средний',
  advanced = 'Продвинутый'
}
```

### Статусы практик

```typescript
enum ContentStatus {
  draft = 'Черновик',
  published = 'Опубликовано',
  archived = 'Архивировано'
}
```

### Создание активности из практики

```typescript
const createActivityFromPractice = async (
  practice: Practice,
  scheduledTime: Date
) => {
  await supabase.from('activities').insert({
    user_id: userId,
    activity_type_id: PRACTICE_ACTIVITY_TYPE_ID,
    title: practice.title,
    description: practice.description,
    start_time: scheduledTime,
    end_time: addMinutes(scheduledTime, practice.duration_minutes),
    status: 'planned',
    metadata: {
      practiceId: practice.id,
      instructions: practice.instructions,
      benefits: practice.benefits
    }
  });
};
```

---

## 📊 Статистика (Statistics)

### Компоненты статистики

**Путь**: `src/components/statistics/`

```
statistics/
├── MoodEmotionsChart.tsx   # График настроения и эмоций
├── SleepChart.tsx          # График сна
├── MockDataInspector.tsx   # Инспектор данных (dev)
└── chart-utils/
    ├── chartComponents.tsx     # Переиспользуемые компоненты
    ├── chartDataConverters.ts  # Конвертеры данных
    └── chartDataService.ts     # Сервис получения данных
```

### Типы графиков

1. **Mood Chart** - Линейный график настроения
   - Ось X: Дата
   - Ось Y: Оценка настроения (1-10)
   - Фильтры: День, Неделя, Месяц

2. **Emotions Chart** - Столбчатая диаграмма эмоций
   - Частота каждой эмоции
   - Группировка по периодам

3. **Sleep Chart** - Комбинированный график
   - Длительность сна (bars)
   - Качество сна (line)
   - Пробуждения ночью (scatter)

### Получение данных для графиков

```typescript
const getChartData = async (
  userId: string,
  type: 'mood' | 'sleep',
  period: 'day' | 'week' | 'month'
) => {
  const { startDate, endDate } = calculatePeriod(period);
  
  if (type === 'mood') {
    const { data } = await supabase
      .from('mood_diary_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at');
    
    return convertToChartFormat(data);
  }
  
  // Аналогично для sleep
};
```

---

## 🎯 Онбординг (Onboarding)

### Процесс онбординга

**Путь**: `src/components/onboarding/`

**Шаги**:
1. WelcomeScreen - Приветствие
2. BasicInfo - Базовая информация
3. GoalsScreen - Цели пользователя
4. ChallengesScreen - Текущие трудности
5. CurrentStateScreen - Текущее состояние
6. AnxietyScreen - Уровень тревожности
7. ProcrastinationScreen - Прокрастинация
8. ChronotypeScreen - Хронотип
9. NaturalRhythmsScreen - Естественные ритмы
10. PreferencesScreen - Предпочтения
11. PersonalizationScreen - Персонализация
12. SocialSupportScreen - Социальная поддержка
13. ProfessionalHelpScreen - Профессиональная помощь
14. EmailVerification - Верификация email
15. ConfirmationScreen - Подтверждение
16. WelcomeComplete - Завершение

### Хранение данных онбординга

**localStorage**:
```typescript
localStorage.setItem('onboarding-data', JSON.stringify(data));
localStorage.setItem('onboarding-completed', 'true');
```

**Отправка на сервер** (при завершении):
```typescript
const submitOnboarding = async (data: OnboardingData) => {
  // Обновление профиля
  await supabase.from('profiles').update({
    full_name: data.fullName,
    // ... другие поля
  }).eq('id', userId);
  
  // Можно сохранить в отдельную таблицу или в metadata профиля
};
```

---

## 🔗 Роутинг

### Основные маршруты

**Файл**: `src/App.tsx`

```typescript
<Routes>
  {/* Публичные маршруты */}
  <Route path="/" element={<Index />} />
  <Route path="/auth" element={<Auth />} />
  <Route path="/about" element={<About />} />
  <Route path="/for-professionals" element={<ForProfessionals />} />
  <Route path="/knowledge-base" element={<KnowledgeBase />} />
  <Route path="/article/:slug" element={<ArticleView />} />
  
  {/* Защищенные маршруты (требуют авторизации) */}
  <Route path="/dashboard" element={
    <ProtectedRoute><Dashboard /></ProtectedRoute>
  } />
  <Route path="/calendar" element={
    <ProtectedRoute><Calendar /></ProtectedRoute>
  } />
  <Route path="/practices" element={
    <ProtectedRoute><DashboardPractices /></ProtectedRoute>
  } />
  <Route path="/diaries" element={
    <ProtectedRoute><Diaries /></ProtectedRoute>
  } />
  <Route path="/statistics" element={
    <ProtectedRoute><Statistics /></ProtectedRoute>
  } />
  
  {/* Отдельные страницы дневников */}
  <Route path="/mood-diary" element={
    <ProtectedRoute><MoodDiaryPage /></ProtectedRoute>
  } />
  <Route path="/sleep-diary" element={
    <ProtectedRoute><SleepDiaryPage /></ProtectedRoute>
  } />
  <Route path="/thoughts-diary" element={
    <ProtectedRoute><ThoughtsDiaryPage /></ProtectedRoute>
  } />
  <Route path="/ocd-diary" element={
    <ProtectedRoute><OCDDiaryPage /></ProtectedRoute>
  } />
  <Route path="/procrastination-diary" element={
    <ProtectedRoute><ProcrastinationDiaryPage /></ProtectedRoute>
  } />
  <Route path="/self-esteem-diary" element={
    <ProtectedRoute><SelfEsteemDiaryPage /></ProtectedRoute>
  } />
  <Route path="/depression-care-diary" element={
    <ProtectedRoute><DepressionCareDiaryPage /></ProtectedRoute>
  } />
  
  {/* 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### ProtectedRoute компонент

```typescript
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useSupabaseAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};
```

---

## 🌐 Внешние интеграции

### n8n Webhook

**URL**: `https://mentalbalans.com/webhook/ai-diary-supabase`

**Назначение**: Обработка AI запросов от пользователей

**Процесс**:
1. User отправляет сообщение → `ai_diary_messages` (type: 'user')
2. Database trigger вызывает `simple_webhook_trigger()`
3. Функция отправляет POST запрос на webhook
4. n8n получает данные, обрабатывает через AI модель
5. n8n сохраняет ответ → `ai_diary_messages` (type: 'ai')
6. Realtime событие доставляет ответ клиенту

**Payload формат**:
```json
{
  "record": {
    "id": "uuid",
    "user_id": "uuid",
    "session_id": "varchar",
    "message_type": "user",
    "content": "Текст сообщения пользователя",
    "metadata": {},
    "created_at": "timestamp"
  },
  "table": "ai_diary_messages"
}
```

---

## 🎨 Design System

### Цветовая палитра (index.css)

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  /* ... и т.д. */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... темная тема */
}
```

### Компоненты UI (shadcn/ui)

**Путь**: `src/components/ui/`

- Button, Card, Dialog, Dropdown, Input
- Select, Tabs, Toast, Tooltip
- Sheet, Popover, Calendar и т.д.

**Использование**:
```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
```

---

## 📦 Контексты (Contexts)

### 1. SupabaseAuthContext
```typescript
interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email, password) => Promise<void>;
  signUp: (email, password, fullName?) => Promise<void>;
  signOut: () => Promise<void>;
}
```

### 2. PersonalizationContext
Хранит настройки персонализации пользователя

### 3. ActivitiesContext
Глобальное состояние активностей

### 4. DiaryStatusContext
Статусы заполнения дневников

---

## 🔧 Сервисы (Services)

### 1. ai-diary.service.ts
```typescript
class AIDiaryService {
  // Отправка сообщения
  sendMessage(message: string, sessionId: string): Promise<any>
  
  // Подписка на новые сообщения
  subscribeToMessages(sessionId: string, onNewMessage: Function)
  
  // Загрузка истории
  loadSessionHistory(sessionId: string): Promise<Message[]>
  
  // Создание сессии
  startNewSession(): Promise<string>
  
  // Завершение сессии
  endSession(sessionId: string): Promise<void>
}
```

### 2. activity.service.ts
```typescript
class ActivityService {
  // CRUD операции
  createActivity(data: ActivityData): Promise<Activity>
  updateActivity(id: string, data: Partial<ActivityData>): Promise<Activity>
  deleteActivity(id: string): Promise<void>
  
  // Получение активностей
  getActivities(userId: string, startDate: Date, endDate: Date): Promise<Activity[]>
  
  // Обновление статуса
  updateStatus(id: string, status: string): Promise<Activity>
}
```

### 3. unified-activity.service.ts
Унифицированный сервис для работы с активностями (Supabase + localStorage fallback)

---

## 🎯 Ключевые хуки (Hooks)

### API Hooks

```typescript
// Получение активностей с React Query
useActivities(startDate: Date, endDate: Date)

// Realtime обновления активностей
useActivitiesRealtime(userId: string)

// Мутации активностей
useActivitiesApi()
  .createActivity.mutate(data)
  .updateActivity.mutate({ id, data })
  .deleteActivity.mutate(id)

// Инвалидация кеша
useActivitiesInvalidation()
```

### Feature Hooks

```typescript
// Логика календаря
useCalendarView(view: 'month' | 'week' | 'day')
useCalendarNavigation(currentDate: Date, view: string)

// Дневники
useMoodDiary()
useSleepDiary()

// AI Чат
useAIDiaryChat()
useAIDiaryAnalytics(sessionId: string, messages: Message[])

// Dashboard
useDashboardScroll()
useActivityTimelineLogic()
```

---

## 📝 Типы (Types)

### Activity Types

```typescript
interface Activity {
  id: string;
  user_id: string;
  activity_type_id: number;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  metadata?: {
    isRecurring?: boolean;
    recurrencePattern?: RecurrencePattern;
    recurringGroupId?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  daysOfWeek?: number[];
  endDate?: string;
}
```

### Diary Types

```typescript
interface MoodDiaryEntry {
  id: string;
  user_id: string;
  mood_score: number;
  emotions: Array<{
    emotion: string;
    intensity: number;
  }>;
  triggers: string[];
  physical_sensations: string[];
  body_areas: string[];
  context?: string;
  notes?: string;
  created_at: string;
}

interface SleepDiaryEntry {
  id: string;
  user_id: string;
  bedtime: string;
  wake_up_time: string;
  sleep_duration: number;
  sleep_quality: number;
  night_awakenings: number;
  morning_feeling: number;
  has_day_rest: boolean;
  day_rest_type?: string;
  day_rest_effectiveness?: number;
  overall_sleep_impact: number;
  sleep_disruptors: string[];
  sleep_comment?: string;
  recommendations: string[];
  created_at: string;
}
```

### AI Diary Types

```typescript
interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  session_id?: string;
  isTyping?: boolean;
  suggestions?: string[];
}

interface DiarySession {
  id: string;
  session_id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  summary?: string;
  insights?: any;
  emotional_state?: any;
}
```

---

## 🚀 Деплой и окружение

### Environment Variables

```bash
# НЕ используются VITE_* переменные!
# URL встроен напрямую в код для безопасности
SUPABASE_URL=https://szvousyzsqdpubgfycdy.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
```

### Build & Deploy

```bash
# Сборка
npm run build

# Preview
npm run preview

# Deploy (через Lovable автоматически)
```

---

## 🔒 Безопасность

### Меры безопасности

1. **RLS Policies** на всех таблицах
2. **SECURITY DEFINER** для функций
3. **Логирование доступа** (profile_access_logs)
4. **Валидация входных данных** (Zod schemas)
5. **Очистка auth токенов** при logout
6. **HTTP-only cookies** (через Supabase Auth)

### Логирование

**Файл**: `src/utils/securityLogger.ts`

```typescript
class SecurityLogger {
  logAuthSuccess(email: string, userId: string)
  logAuthFailure(email: string, reason: string, metadata?: any)
  logSuspiciousActivity(userId: string, activity: string, metadata?: any)
}
```

---

## 📊 Мониторинг и отладка

### React Query DevTools

Включены в development mode:
```typescript
<ReactQueryDevtools initialIsOpen={false} />
```

### Console Logging

Все сервисы логируют операции:
```typescript
console.log('Auth state change:', event, session?.user?.email);
console.log('Activity created:', activity.id);
console.log('AI message received:', message.id);
```

### Error Handling

```typescript
try {
  await operation();
} catch (error) {
  console.error('Operation failed:', error);
  toast.error('Произошла ошибка');
  securityLogger.logError(error);
}
```

---

## 📚 Дополнительная документация

### Файлы документации

- `README.md` - Основной README
- `PROJECT_ARCHITECTURE.md` - Этот файл (полная архитектура)
- `supabase/migrations/` - SQL миграции БД

### Полезные ссылки

- **Supabase Dashboard**: https://supabase.com/dashboard/project/szvousyzsqdpubgfycdy
- **Auth Settings**: https://supabase.com/dashboard/project/szvousyzsqdpubgfycdy/auth/providers
- **Database Editor**: https://supabase.com/dashboard/project/szvousyzsqdpubgfycdy/editor
- **SQL Editor**: https://supabase.com/dashboard/project/szvousyzsqdpubgfycdy/sql/new

---

## 🎓 Сценарии использования

### Сценарий 1: Регистрация нового пользователя

1. User открывает `/auth`
2. Выбирает "Регистрация"
3. Заполняет email, password, full name
4. Клик "Зарегистрироваться"
5. `supabase.auth.signUp()` создает пользователя в auth.users
6. Trigger `on_auth_user_created` создает запись в profiles
7. Trigger `on_new_user_role` назначает роль 'user'
8. Отправляется email верификации (опционально)
9. User авторизован и перенаправлен на `/dashboard`

### Сценарий 2: Заполнение дневника настроения

1. User на `/dashboard` кликает "Дневник настроения"
2. Открывается `MoodDiaryModal`
3. **Шаг 1**: Оценивает настроение (1-10)
4. **Шаг 2**: Выбирает эмоции и их интенсивность
5. **Шаг 3**: Отвечает на уточняющие вопросы
6. **Шаг 4**: Проводит самооценку
7. **Шаг 5**: Получает рекомендации
8. Клик "Сохранить"
9. `supabase.from('mood_diary_entries').insert(data)`
10. Запись сохранена в БД
11. Realtime обновляет UI (если нужно)

### Сценарий 3: Создание активности в календаре

1. User на `/calendar`
2. Клик "Создать активность"
3. Открывается `CreateActivityDialog`
4. Заполняет: название, тип, время начала/конца
5. (Опционально) Настраивает повторение
6. Клик "Создать"
7. `ActivityService.createActivity(data)`
8. Запись добавлена в `activities`
9. Realtime уведомляет о новой активности
10. Календарь перерисовывается с новой активностью

### Сценарий 4: Общение с AI дневником

1. User на `/dashboard`, вкладка "AI Чат"
2. Вводит сообщение: "Сегодня чувствую тревогу"
3. Клик "Отправить"
4. `AIDiaryService.sendMessage()` сохраняет в `ai_diary_messages` (type: 'user')
5. Database trigger отправляет на n8n webhook
6. n8n обрабатывает через AI модель (OpenAI/другие)
7. n8n сохраняет ответ в `ai_diary_messages` (type: 'ai')
8. Realtime событие доставляет ответ клиенту
9. `useAIDiaryChat` получает сообщение
10. Показывает эффект печати
11. Отображает AI ответ и suggestions (если есть)

### Сценарий 5: Просмотр статистики настроения

1. User на `/statistics`
2. Выбирает "Дневник настроения"
3. Выбирает период: "Неделя"
4. `chartDataService.getMoodData(userId, 'week')`
5. Запрос к `mood_diary_entries` за последнюю неделю
6. Данные конвертируются в формат графика
7. Отрисовывается линейный график настроения
8. Показываются дополнительные метрики (среднее, тренд)

---

## 🎯 Заключение

Это полное техническое описание проекта Mental Balance. Проект использует современный стек технологий и архитектуру, обеспечивающую:

- ✅ Безопасность данных пользователей (RLS, SECURITY DEFINER)
- ✅ Realtime обновления (Supabase Realtime)
- ✅ AI интеграцию (через webhook к n8n)
- ✅ Масштабируемость (React Query, оптимизированные запросы)
- ✅ Удобство разработки (TypeScript, shadcn/ui)
- ✅ Производительность (Vite, lazy loading)

Все компоненты хорошо структурированы и следуют best practices React и Supabase.
