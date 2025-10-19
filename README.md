# Mental Balance - Платформа психологической поддержки

## 📋 Общая информация

**Название проекта**: Mental Balance  
**Тип**: Fullstack веб-приложение для психологической поддержки  
**Технологии**: React 18, TypeScript, Vite, Tailwind CSS, Supabase  
**Статус**: Alpha (активная разработка)  
**Supabase Project**: `szvousyzsqdpubgfycdy`

### Описание
Mental Balance - это комплексная платформа для самопомощи в области ментального здоровья, включающая AI-ассистента, дневники настроения и сна, календарь активностей, практики и аналитику прогресса.

---

## 🎯 Основные возможности

### ✅ Реализовано

#### 🤖 AI Дневник (FreeChat)
- **Realtime чат** с AI-ассистентом для рефлексии и самоанализа
- **Управление сессиями**: создание, продолжение, завершение
- **История сообщений**: автоматическое сохранение и загрузка
- **Аналитика**: глобальная статистика, топ-темы, длительность сессий
- **Quick Suggestions**: быстрые ответы от AI с автоотправкой
- **Typing эффект**: плавное отображение AI ответов character-by-character
- **Копирование сообщений**: в буфер обмена
- **Автоскролл**: автоматическая прокрутка к новым сообщениям

#### 📝 Дневники
- **Дневник настроения**: 5-этапный процесс с эмоциями, триггерами, контекстом
- **Дневник сна**: отслеживание качества сна, пробуждений, дневного отдыха
- **Дневник мыслей**: работа с автоматическими мыслями и когнитивными искажениями
- **OCD дневник**: отслеживание навязчивых мыслей и компульсий
- **Дневник прокрастинации**: анализ откладывания задач
- **Дневник самооценки**: работа с самокритикой и поддержкой
- **Дневник депрессии**: комплексный мониторинг состояния

#### 📅 Календарь активностей
- **Три режима просмотра**: День, Неделя, Месяц
- **CRUD операции**: создание, редактирование, удаление активностей
- **Типы активностей**: работа, отдых, спорт, общение, хобби, терапия и др.
- **Повторяющиеся события**: поддержка рекуррентных активностей
- **Статусы**: planned, in_progress, completed, cancelled
- **Оценка влияния**: настроение и энергия до/после
- **Realtime синхронизация**: мгновенное обновление на всех устройствах

#### 📊 Аналитика и графики
- **График настроения**: день/неделя/месяц с детализацией по времени
- **График сна**: качество сна, продолжительность, пробуждения
- **Интерактивность**: клик по точкам для просмотра деталей
- **Демо-режим**: для неавторизованных пользователей

#### 🎓 Практики и упражнения
- **Каталог практик**: дыхательные техники, медитации, CBT упражнения
- **Фильтры**: по категориям, сложности, длительности
- **Создание активности**: прямо из практики в календарь
- **Тесты**: интерактивные психологические тесты
- **Инструкции**: пошаговые руководства

#### 👤 Профиль и персонализация
- **Онбординг**: многошаговый процесс знакомства (12+ экранов)
- **Персонализация**: цели, предпочтения, ритмы, хронотип
- **Профиль пользователя**: базовая информация, контакты, настройки
- **Админ-панель**: управление пользователями (для администраторов)

#### 🔐 Авторизация
- **Email + Password**: стандартная регистрация и вход
- **Magic Link** (опционально): вход по ссылке из email
- **Email верификация**: подтверждение почты (настраивается)
- **Управление сессией**: автоматическая очистка при выходе

### 🚧 В разработке

#### AI Дневник - структурированные сценарии
- **Утренний сценарий**: планирование дня, оценка сна, намерения
- **Дневной сценарий**: проверка состояния, корректировка планов
- **Вечерний сценарий**: рефлексия дня, благодарности, подготовка ко сну
- **Персонализированные нормы**: отклонения от базовых показателей
- **Рекомендации**: на основе ответов и истории

#### Расширенная аналитика
- **Balance Wheel**: визуализация жизненных областей
- **Insights**: AI-генерируемые инсайты на основе данных
- **Паттерны**: автоматическое обнаружение закономерностей

#### Интеграции
- **Calendar Sync**: синхронизация с Google Calendar, Apple Calendar
- **Export/Import**: экспорт данных в различных форматах

---

## 🏗️ Архитектура

### Frontend

```
React 18 (TypeScript)
├── Vite (dev server & build)
├── Tailwind CSS + shadcn/ui (стилизация)
├── React Router (маршрутизация)
├── React Query (кэширование API)
├── Supabase Client (БД, Auth, Realtime)
└── Context API (глобальное состояние)
```

**Основные контексты:**
- `SupabaseAuthContext` - управление авторизацией
- `PersonalizationContext` - персонализация пользователя
- `ActivitiesContext` - состояние активностей
- `DiaryStatusContext` - состояние дневников

### Backend (Supabase)

```
Supabase Backend
├── PostgreSQL Database
│   ├── 14 основных таблиц
│   ├── RLS policies (защита данных)
│   ├── 10+ DB functions
│   └── Triggers (auto-actions)
├── Auth (email/password, magic link)
├── Realtime (WebSocket subscriptions)
└── Webhooks (интеграция с n8n)
```

### Внешние сервисы

- **n8n** (mentalbalans.com): обработка AI запросов через OpenAI API
- **OpenAI API**: генерация AI ответов (через n8n)

---

## 📊 База данных

### Основные таблицы

#### Пользователи
- `profiles` - профили пользователей
- `user_roles` - роли (user, admin)
- `profile_access_logs` - логи доступа админов

#### AI Дневник
- `ai_diary_sessions` - сессии чата с AI
- `ai_diary_messages` - все сообщения (user/ai)

#### Дневники
- `mood_diary_entries` - записи настроения
- `sleep_diary_entries` - записи сна

#### Активности
- `activities` - активности пользователей
- `activity_types` - типы активностей (работа, отдых и т.д.)
- `activity_states` - состояния и оценки активностей

#### Контент
- `practices` - практики и упражнения
- `tests` - психологические тесты
- `strategies` - стратегии и техники

#### Терапевтические сценарии
- `therapy_scenarios` - сценарии (morning, midday, evening)
- `therapy_questions` - вопросы сценариев
- `therapy_transitions` - логика переходов между вопросами
- `user_therapy_progress` - прогресс пользователей

### Scenario Question Types & Keys

Система терапевтических сценариев использует унифицированный подход к типам вопросов и маппингу ответов в БД.

#### Типы вопросов (question_type)

- **scale** - числовая шкала (например, 0-10)
- **multiple_choice** - одиночный выбор из списка
- **chips** - множественный выбор (тэги)
- **time** - выбор времени (HH:mm)
- **number** - числовой ввод
- **text** - свободный текст

#### Metadata для вопросов

**scale:**
```json
{
  "min": 0,
  "max": 10,
  "step": 1,
  "labels": ["низко", "высоко"]
}
```

**multiple_choice / chips:**
```json
{
  "options": [
    {"id": "joy", "label": "Радость", "emoji": "😊"},
    {"id": "sad", "label": "Грусть", "emoji": "😢"}
  ],
  "maxSelect": 3
}
```

**time:**
```json
{
  "format": "HH:mm"
}
```

**number:**
```json
{
  "min": 0,
  "max": 24,
  "unit": "h"
}
```

#### Маппинг ответов в БД

- **scale / number** → `diary_entry_metrics` (key=question_code, value=ответ)
- **chips / multiple_choice** (эмоции) → `diary_entry_emotions` (label, intensity)
- **chips / multiple_choice** (триггеры, body) → `diary_entries.metadata`
- **text** → `diary_entries.context` или `metadata.extra_notes`

Нормы по умолчанию подтягиваются из `v_default_norms` если не указаны в UI.

### Database Functions

```sql
-- Управление пользователями
has_role(user_id, role) → boolean
get_user_profile_with_role() → profile
admin_get_user_profiles(limit, offset) → profiles[]
log_profile_access(...) → void

-- Активности
update_activity_status(activity_id, status, notes) → activity

-- AI Дневник
ensure_ai_session(session_id, user_id) → session_info

-- Утилиты
update_updated_at_column() → trigger
sync_user_profile() → trigger
handle_new_user_role() → trigger
```

### Triggers

1. **on_auth_user_created** → `sync_user_profile()`
   - Создает profile при регистрации

2. **on_new_user_role** → `handle_new_user_role()`
   - Назначает роль 'user' новым пользователям

3. **ai_diary_messages_webhook** → `simple_webhook_trigger()`
   - Отправляет user сообщения на n8n webhook

4. **update_*_updated_at** → `update_updated_at_column()`
   - Автоматически обновляет updated_at

---

## 🤖 AI Дневник - Детальная архитектура

### Поток данных

```
┌─────────────┐
│   FreeChat  │ (Пользователь вводит сообщение)
└──────┬──────┘
       │
       ├─ 1. Добавляет сообщение в UI
       │
       ├─ 2. INSERT в ai_diary_messages (message_type='user')
       │      ↓
       │   Database Trigger срабатывает
       │      ↓
       │   simple_webhook_trigger()
       │      ↓
       │   HTTP POST → https://mentalbalans.com/webhook/ai-diary-chat
       │
       ├─ 3. n8n получает webhook
       │      ↓
       │   Обрабатывает через OpenAI API
       │      ↓
       │   INSERT в ai_diary_messages (message_type='ai')
       │
       └─ 4. Realtime подписка получает новое AI сообщение
              ↓
           onNewMessage() callback
              ↓
           Обновление UI с typing эффектом
```

### Компоненты

```
AIDiaryScenarios (entry point)
  └─> AIDiaryContainer
      └─> FreeChat (main component)
          ├─> FreeChatHeader (кнопки сессий)
          ├─> AIDiaryStats (статистика)
          ├─> FreeChatMessages (список сообщений)
          │   └─> ChatMessage (отдельное сообщение)
          └─> FreeChatInput (поле ввода)
```

### Хуки

**useAIDiaryChat** - основной хук управления чатом
```typescript
const {
  chatMessages,          // Массив сообщений
  chatInput,             // Текущий ввод
  setChatInput,          // Setter для ввода
  isAITyping,            // AI печатает?
  isLoading,             // Загрузка
  currentSessionId,      // ID текущей сессии
  handleSendMessage,     // Отправка сообщения
  handleNewSession,      // Новая сессия
  handleEndSession,      // Завершить сессию
  handleSuggestionClick, // Клик по suggestion
  isUserAuthenticated,   // Проверка авторизации
  loadingHistory         // Загрузка истории
} = useAIDiaryChat();
```

**useAIDiaryAnalytics** - аналитика сессий
```typescript
const {
  globalStats,        // Общая статистика пользователя
  currentSessionStats,// Статистика текущей сессии
  topTopics,          // Топ 5 тем
  isLoadingStats,     // Загрузка статистики
  refreshStats        // Обновить статистику
} = useAIDiaryAnalytics();
```

### Сервисы

**AIDiaryService** (`src/services/ai-diary.service.ts`)
```typescript
class AIDiaryService {
  // Убедиться что сессия существует в БД
  ensureSessionExists(sessionId: string): Promise<void>
  
  // Подписка на новые AI сообщения
  subscribeToMessages(sessionId: string, onNewMessage: callback): RealtimeChannel
  
  // Отправить сообщение
  sendMessage(message: string, sessionId: string): Promise<response>
  
  // Загрузить историю
  loadSessionHistory(sessionId: string): Promise<messages[]>
  
  // Новая сессия
  startNewSession(): Promise<sessionId>
  
  // Завершить сессию
  endSession(sessionId: string): Promise<void>
  
  // Отписаться от Realtime
  unsubscribe(): void
}
```

**AIDiaryAnalyticsService** (`src/services/ai-diary-analytics.service.ts`)
```typescript
class AIDiaryAnalyticsService {
  // Статистика пользователя
  getUserStats(userId: string): Promise<SessionStats>
  
  // Статистика текущей сессии
  getCurrentSessionStats(sessionId, userId, messages): Promise<SessionStats>
  
  // Топ темы
  getTopTopics(userId: string, limit: number): Promise<TopicFrequency[]>
}
```

### Сценарии использования

#### 1. Новый пользователь (первый визит)
```
1. Пользователь открывает AI Дневник
2. Проверка localStorage → sessionId нет
3. Показ welcome сообщения от AI
4. При первой отправке:
   - Генерируется новый sessionId
   - Сохраняется в localStorage
   - Создается запись в ai_diary_sessions
   - Подписка на Realtime
```

#### 2. Возвращающийся пользователь
```
1. Открытие AI Дневника
2. Чтение sessionId из localStorage
3. Загрузка истории из ai_diary_messages
4. Отображение всех сообщений
5. Подписка на Realtime для новых AI ответов
6. Пользователь продолжает разговор
```

#### 3. Создание новой сессии
```
1. Клик на "Новая сессия"
2. Завершение текущей (ended_at в ai_diary_sessions)
3. Отписка от Realtime
4. Генерация нового sessionId
5. Сохранение в localStorage
6. Создание новой записи в ai_diary_sessions
7. Очистка chatMessages
8. Показ welcome сообщения
```

#### 4. Завершение сессии
```
1. Клик на "Завершить сессию"
2. UPDATE ai_diary_sessions SET ended_at = NOW()
3. Отписка от Realtime
4. Удаление sessionId из localStorage
5. Сброс currentSessionId state
6. Показ финального сообщения
```

#### 5. Отправка и получение сообщения
```
User -> UI:
  1. Пользователь вводит текст
  2. Нажимает Enter или кнопку Send
  3. handleSendMessage() вызывается

UI -> Supabase:
  4. Сообщение добавляется в chatMessages (UI)
  5. INSERT в ai_diary_messages (type='user')
  6. Показывается typing indicator

Supabase -> n8n:
  7. Trigger срабатывает
  8. HTTP POST на webhook
  9. n8n обрабатывает с OpenAI

n8n -> Supabase:
  10. INSERT в ai_diary_messages (type='ai')

Supabase -> UI:
  11. Realtime subscription получает event
  12. onNewMessage() callback срабатывает
  13. Убирается typing indicator
  14. AI сообщение добавляется в chatMessages
  15. Typing effect (character-by-character)
  16. Парсинг suggestions (если есть)
```

#### 6. Quick Suggestions
```
1. AI отправляет сообщение с suggestions в metadata
2. FreeChatMessages парсит suggestions
3. Отображаются как кнопки под сообщением
4. Клик по suggestion:
   - handleSuggestionClick(text)
   - Автоматически отправляется как user message
   - Процесс как в п.5
```

### Storage

**localStorage:**
```javascript
'ai_diary_session_id': string // UUID сессии
```

**Supabase (ai_diary_sessions):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "session_id": "ai_diary_1234567890_xyz",
  "started_at": "2024-01-15T10:00:00Z",
  "ended_at": null,
  "summary": null,
  "insights": {},
  "emotional_state": {}
}
```

**Supabase (ai_diary_messages):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "session_id": "ai_diary_1234567890_xyz",
  "message_type": "user" | "ai",
  "content": "Текст сообщения",
  "metadata": {
    "timestamp": "2024-01-15T10:05:00Z",
    "source": "free_chat",
    "suggestions": ["Вариант 1", "Вариант 2"]
  },
  "created_at": "2024-01-15T10:05:00Z"
}
```

---

## 📅 Календарь активностей

### Структура

- **DayView** - почасовой вид (00:00 - 24:00)
- **WeekView** - 7 дней с колонками
- **MonthView** - календарная сетка

### Функции

- Создание активности с датой/временем
- Drag & drop (в разработке)
- Фильтры по типам
- Поиск
- Recurring events (ежедневно, еженедельно, ежемесячно)

### Realtime синхронизация

```typescript
// useActivitiesRealtime.ts
supabase
  .channel('activities-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'activities',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Обновление UI
  })
  .subscribe()
```

---

## 🎨 Дизайн система

### Цвета (HSL)

Все цвета определены в `src/index.css` как CSS variables:

```css
:root {
  --primary: 221 83% 53%;
  --secondary: 210 40% 96%;
  --accent: 217 91% 60%;
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  /* ... */
}

.dark {
  --primary: 217 91% 60%;
  --background: 224 71% 4%;
  --foreground: 213 31% 91%;
  /* ... */
}
```

### Компоненты (shadcn/ui)

Все UI компоненты находятся в `src/components/ui/` и настроены через `tailwind.config.ts`:

- Buttons (variants: default, destructive, outline, ghost, link)
- Cards, Dialogs, Sheets
- Forms (Input, Textarea, Select, Checkbox, etc.)
- Data Display (Table, Badge, Avatar)
- Navigation (Tabs, Breadcrumb, Pagination)
- Feedback (Toast, Alert, Progress)

### Адаптивность

- Mobile-first подход
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Bottom Navigation на мобильных
- Responsive календарь (день на мобильных, неделя/месяц на десктопах)

---

## 🔧 Установка и настройка

### Требования

- Node.js 18+
- npm или yarn
- Supabase проект (уже настроен)

### Установка

```bash
# Клонирование
git clone <repository_url>
cd mental-balance

# Установка зависимостей
npm install

# Настройка окружения
cp .env.example .env
```

### Конфигурация .env

```env
# Supabase (уже настроено в проекте)
VITE_SUPABASE_URL=https://szvousyzsqdpubgfycdy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# AI Diary Webhook (для n8n)
VITE_AI_DIARY_WEBHOOK_URL=https://mentalbalans.com/webhook/ai-diary-chat
```

### Запуск

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

### Структура проекта

```
src/
├── components/
│   ├── ui/                    # shadcn/ui компоненты
│   ├── dashboard/             # Дашборд
│   │   ├── ai-diary-scenarios/  # AI Дневник
│   │   ├── user-profile/        # Профиль
│   │   └── activity-timeline/   # Timeline активностей
│   ├── calendar/              # Календарь
│   ├── diaries/               # Дневники (mood, sleep, etc.)
│   ├── practices/             # Практики
│   ├── onboarding/            # Онбординг
│   └── statistics/            # Графики и статистика
│
├── contexts/                  # React Context
│   ├── SupabaseAuthContext.tsx
│   ├── PersonalizationContext.tsx
│   ├── ActivitiesContext.tsx
│   └── DiaryStatusContext.tsx
│
├── hooks/                     # Custom hooks
│   ├── api/                   # API хуки
│   └── use-*.ts
│
├── services/                  # API сервисы
│   ├── ai-diary.service.ts
│   ├── ai-diary-analytics.service.ts
│   ├── activity.service.ts
│   ├── unified-activity.service.ts
│   └── backend-auth.service.ts
│
├── integrations/supabase/     # Supabase
│   ├── client.ts
│   ├── types.ts (read-only, авто-генерация)
│   └── *.repo.ts
│
├── pages/                     # Страницы (routes)
├── utils/                     # Утилиты
├── types/                     # TypeScript типы
└── data/                      # Статические данные
```

---

## 🚨 Известные проблемы и ограничения

### Критические

1. **AI Дневник структурированные сценарии не реализованы**
   - Есть только FreeChat
   - Нет утреннего/дневного/вечернего сценариев
   - Таблицы therapy_* созданы, но не используются

2. **Webhook может быть недоступен**
   - Зависимость от внешнего сервиса (n8n на mentalbalans.com)
   - Нет fallback механизма
   - Нет retry логики

### Важные

3. **Realtime подписка не всегда стабильна**
   - Иногда не отключается при unmount
   - Может дублировать сообщения при быстрой отправке

4. **Календарь - нет drag & drop**
   - Только через диалоги создания/редактирования

5. **Графики - нет глубокой аналитики**
   - Простое отображение данных
   - Нет корреляций, паттернов, инсайтов

6. **Мобильная версия требует доработки**
   - Некоторые компоненты не полностью адаптивны
   - Bottom nav может перекрывать контент

### Некритические

7. **Нет экспорта/импорта данных**
8. **Нет интеграции с внешними календарями**
9. **Онбординг слишком длинный** (12+ экранов)
10. **Нет темной темы** (есть переключатель, но не везде работает)

---

## 📈 Планы развития

### Краткосрочные (1-2 месяца)

1. **Доработка AI Дневника**
   - Реализация структурированных сценариев (morning, midday, evening)
   - Интеграция с therapy_* таблицами
   - Персонализированные рекомендации на основе истории

2. **Улучшение стабильности**
   - Fallback для webhook
   - Retry механизм
   - Исправление Realtime подписок

3. **Календарь**
   - Drag & drop активностей
   - Bulk operations (массовое редактирование)
   - Export в Google Calendar

4. **Мобильная оптимизация**
   - Полная адаптивность всех компонентов
   - PWA функционал
   - Офлайн режим (limited)

### Среднесрочные (3-6 месяцев)

5. **Расширенная аналитика**
   - AI-инсайты на основе данных
   - Обнаружение паттернов
   - Balance Wheel визуализация
   - Корреляции между настроением, сном, активностями

6. **Интеграции**
   - Apple Health / Google Fit
   - Wearables (для сна и активности)
   - Экспорт/импорт в различных форматах

7. **Социальные функции**
   - Sharing прогресса
   - Группы поддержки (опционально)
   - Профессиональный модуль (для терапевтов)

### Долгосрочные (6+ месяцев)

8. **Платформенные улучшения**
   - Нативные мобильные приложения (React Native)
   - Desktop приложение (Electron)
   - API для сторонних разработчиков

9. **AI улучшения**
   - Voice input/output
   - Мультимодальность (анализ изображений)
   - Персонализированные модели

10. **Монетизация**
    - Freemium модель
    - Premium функции
    - Подписки для профессионалов

---

## 🤝 Contribution

### Процесс разработки

1. Создать feature branch от `main`
2. Внести изменения
3. Протестировать локально
4. Создать Pull Request
5. Code review
6. Merge в `main`

### Code Style

- TypeScript strict mode
- ESLint + Prettier
- Semantic commit messages
- Component naming: PascalCase
- Files: kebab-case

### Тестирование

```bash
# Unit tests (когда будут добавлены)
npm run test

# E2E tests (планируется)
npm run test:e2e
```

---

## 📚 Полезные ссылки

### Документация
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/docs)
- [React Query](https://tanstack.com/query/latest)

### Внутренние документы
- `AI_DIARY_ARCHITECTURE.md` - детальная архитектура AI Дневника
- `PROJECT_ARCHITECTURE.md` - полная архитектура проекта
- `.env.example` - пример конфигурации

### Supabase Dashboard
- [Project Dashboard](https://supabase.com/dashboard/project/szvousyzsqdpubgfycdy)
- [Database](https://supabase.com/dashboard/project/szvousyzsqdpubgfycdy/editor)
- [Auth](https://supabase.com/dashboard/project/szvousyzsqdpubgfycdy/auth/users)
- [Logs](https://supabase.com/dashboard/project/szvousyzsqdpubgfycdy/logs/postgres-logs)

---

## 📝 Changelog

### [Current] - Alpha v0.3.0 (2024-01)

#### Добавлено
- AI Дневник (FreeChat) с Realtime
- Аналитика AI сессий
- Quick suggestions
- Typing эффект для AI ответов

#### Улучшено
- Календарь - повторяющиеся события
- Дневники - расширенная функциональность
- Профиль - больше полей персонализации

#### Исправлено
- Realtime подписки не всегда отключались
- Графики - проблемы с timezone
- Мобильная навигация перекрывала контент

### [0.2.0] - Alpha (2023-12)
- Базовый функционал дневников
- Календарь активностей
- Онбординг

### [0.1.0] - Alpha (2023-11)
- Начальная версия
- Авторизация
- Базовый UI

---

## 📞 Контакты и поддержка

**Developer**: [Ваше имя]  
**Email**: [Ваш email]  
**Supabase Project**: `szvousyzsqdpubgfycdy`  
**Admin User**: `somov50@gmail.com` (автоматически получает admin роль)

---

## 📄 Лицензия

[Укажите лицензию проекта]

---

**Последнее обновление**: Январь 2025  
**Версия документа**: 2.0  
**Статус проекта**: 🟡 Alpha - активная разработка
