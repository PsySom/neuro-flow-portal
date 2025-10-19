# Архитектура Frontend - PsyBalans

## Общий обзор

PsyBalans - это React-приложение для психологического самопомощи с интеграцией AI, построенное на современном технологическом стеке.

### Основные технологии

- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик и dev-сервер
- **React Router v6** - клиентский роутинг
- **Tailwind CSS** - утилитарные стили
- **shadcn/ui** - компонентная библиотека
- **TanStack Query (React Query)** - управление серверным состоянием
- **Supabase Client** - взаимодействие с backend
- **Recharts & ECharts** - визуализация данных
- **date-fns** - работа с датами
- **Lucide React** - иконки

---

## Архитектурная структура

### 1. Точка входа и провайдеры

```
main.tsx
  └─ QueryClientProvider (TanStack Query)
      └─ App.tsx
          └─ SupabaseAuthProvider
              └─ PersonalizationProvider
                  └─ ActivitiesProvider
                      └─ DiaryStatusProvider
                          └─ Router
```

**Иерархия контекстов:**
1. **QueryClientProvider** - управление кэшем и серверными запросами
2. **SupabaseAuthProvider** - аутентификация пользователя
3. **PersonalizationProvider** - темы, акцентные цвета, размеры шрифтов
4. **ActivitiesProvider** - глобальное состояние активностей
5. **DiaryStatusProvider** - статусы дневников

---

## 2. Система роутинга

### Публичные маршруты

| Путь | Компонент | Описание |
|------|-----------|----------|
| `/` | `Index` | Главная страница (landing) |
| `/auth` | `Auth` | Универсальная страница входа/регистрации |
| `/login` | `Login` | Страница входа (deprecated) |
| `/register` | `Register` | Страница регистрации (deprecated) |
| `/about` | `About` | О проекте |
| `/knowledge` | `KnowledgeBase` | База знаний |
| `/practices` | `Practices` | Упражнения и тесты |
| `/article/:id` | `ArticleView` | Просмотр статьи |
| `/diaries` | `Diaries` | Обзор дневников |

### Защищенные маршруты (требуют авторизации)

| Путь | Компонент | Описание |
|------|-----------|----------|
| `/dashboard` | `Dashboard` | Главный дашборд |
| `/calendar` | `Calendar` | Календарь активностей |
| `/onboarding` | `Onboarding` | Онбординг нового пользователя |

### Страницы дневников (полу-публичные)

| Путь | Компонент | Назначение |
|------|-----------|------------|
| `/mood-diary` | `MoodDiaryPage` | Дневник настроения |
| `/thoughts-diary` | `ThoughtsDiaryPage` | Дневник мыслей (КПТ) |
| `/self-esteem-diary` | `SelfEsteemDiaryPage` | Дневник самооценки |
| `/procrastination-diary` | `ProcrastinationDiaryPage` | Дневник прокрастинации |
| `/ocd-diary` | `OCDDiaryPage` | Дневник ОКР |
| `/depression-care-diary` | `DepressionCareDiaryPage` | Дневник заботы при депрессии |
| `/sleep-diary` | `SleepDiaryPage` | Дневник сна |

---

## 3. Структура компонентов

### Организация по функциональности

```
src/
├── components/
│   ├── ui/                    # shadcn/ui базовые компоненты
│   ├── auth/                  # Компоненты аутентификации
│   ├── calendar/              # Календарь активностей
│   │   ├── components/        # Вложенные компоненты календаря
│   │   ├── hooks/             # Хуки календаря
│   │   ├── utils/             # Утилиты календаря
│   │   └── types.ts           # Типы календаря
│   ├── dashboard/             # Компоненты дашборда
│   │   ├── ai-chat/           # AI чат компоненты
│   │   ├── ai-diary-scenarios/ # AI дневник
│   │   ├── activity-timeline/ # Таймлайн активностей
│   │   └── user-profile/      # Профиль пользователя
│   ├── diaries/               # Компоненты дневников
│   │   ├── mood/              # Дневник настроения
│   │   ├── thoughts/          # Дневник мыслей
│   │   ├── sleep/             # Дневник сна
│   │   ├── depression-care/   # Дневник депрессии
│   │   └── ...                # Другие дневники
│   ├── practices/             # Упражнения и практики
│   ├── statistics/            # Графики и статистика
│   ├── onboarding/            # Онбординг формы
│   ├── header/                # Компоненты хедера
│   ├── navigation/            # Навигационные компоненты
│   └── article/               # Компоненты статей
├── pages/                     # Страницы приложения
├── contexts/                  # React Contexts
├── hooks/                     # Кастомные хуки
├── services/                  # Сервисный слой
├── integrations/              # Интеграции (Supabase)
├── utils/                     # Утилиты
├── types/                     # TypeScript типы
└── data/                      # Статические данные
```

---

## 4. Управление состоянием

### 4.1 React Context API

#### SupabaseAuthContext
```typescript
interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

**Назначение:** Управление аутентификацией, сессией пользователя

#### PersonalizationContext
```typescript
interface PersonalizationSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: 'emerald' | 'blue' | 'purple' | 'orange' | 'pink';
  fontSize: 'small' | 'medium' | 'large';
}
```

**Назначение:** Персонализация интерфейса (тема, цвета, шрифты)

#### ActivitiesContext
```typescript
interface ActivitiesContextType {
  activities: Activity[];
  isLoading: boolean;
  error: Error | null;
  addActivity: (activity: Partial<Activity>) => Promise<void>;
  updateActivity: (id: string, updates: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  refetch: () => void;
}
```

**Назначение:** Глобальное управление активностями в календаре

#### DiaryStatusContext
```typescript
interface DiaryStatusContextType {
  statuses: Record<string, DiaryStatus>;
  updateStatus: (diaryId: string, status: DiaryStatus) => void;
  getStatus: (diaryId: string) => DiaryStatus;
}
```

**Назначение:** Отслеживание состояния различных дневников

### 4.2 TanStack Query (React Query)

**Используется для:**
- Кэширование серверных данных
- Оптимистичные обновления
- Фоновая синхронизация
- Retry логика
- Invalidation кэша

**Примеры использования:**
```typescript
// Получение активностей
const { data: activities } = useQuery({
  queryKey: ['activities', userId],
  queryFn: () => activityService.getActivities()
});

// Создание активности с мутацией
const mutation = useMutation({
  mutationFn: activityService.createActivity,
  onSuccess: () => {
    queryClient.invalidateQueries(['activities']);
  }
});
```

### 4.3 Local Component State

Для изолированного состояния компонентов используются:
- `useState` - простое состояние
- `useReducer` - сложная логика состояния
- `useRef` - мутабельные значения без ререндера

---

## 5. Слой данных (Data Layer)

### 5.1 Сервисы

Сервисы инкапсулируют бизнес-логику и взаимодействие с API:

```
services/
├── api.client.ts              # Базовый API клиент
├── backend-auth.service.ts     # Аутентификация через Supabase
├── backend-user.service.ts     # Управление пользователями
├── backend-activity.service.ts # CRUD активностей
├── backend-diary.service.ts    # CRUD дневников
├── activity.service.ts         # Основной сервис активностей
├── ai-diary.service.ts         # AI дневник
├── ai-diary-analytics.service.ts # Аналитика AI дневника
├── calendar.service.ts         # Календарь
├── calendar-sync.service.ts    # Синхронизация календаря
├── unified-activity.service.ts # Унифицированный сервис активностей
├── unified-activity-sync.service.ts # Синхронизация
└── onboarding.service.ts       # Онбординг
```

**Архитектура сервисов:**
```typescript
// Пример структуры сервиса
class ActivityService {
  constructor(private supabase: SupabaseClient) {}
  
  async getActivities(): Promise<Activity[]> {
    // Логика получения
  }
  
  async createActivity(data: CreateActivityDto): Promise<Activity> {
    // Логика создания
  }
  
  // ... другие методы
}
```

### 5.2 Интеграция с Supabase

```typescript
// src/integrations/supabase/client.ts
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Репозитории для работы с таблицами
// src/integrations/supabase/activities.repo.ts
export const activitiesRepo = {
  getAll: () => supabase.from('activities').select('*'),
  getById: (id: string) => supabase.from('activities').select('*').eq('id', id),
  create: (data: InsertActivity) => supabase.from('activities').insert(data),
  update: (id: string, data: UpdateActivity) => 
    supabase.from('activities').update(data).eq('id', id),
  delete: (id: string) => supabase.from('activities').delete().eq('id', id)
};
```

### 5.3 Realtime подписки

```typescript
// Пример подписки на изменения
useEffect(() => {
  const channel = supabase
    .channel('activities-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'activities'
      },
      (payload) => {
        // Обработка изменений
        queryClient.invalidateQueries(['activities']);
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

---

## 6. Кастомные хуки

### Основные хуки проекта

```typescript
// hooks/
├── useActivityState.ts          // Состояние активности
├── useActivityTimelineLogic.ts  // Логика таймлайна
├── useCalendarNavigation.ts     // Навигация календаря
├── useCalendarView.ts           // Виды календаря
├── useDashboardScroll.ts        // Скролл дашборда
├── useMoodDiary.ts              // Дневник настроения
├── useSleepDiary.ts             // Дневник сна
├── useStateMetrics.ts           // Метрики состояния
├── useUnifiedActivityOperations.ts // Операции с активностями
├── useOnboardingOptions.ts      // Опции онбординга
├── useOnboardingSubmission.ts   // Отправка онбординга
└── use-mobile.tsx               // Детект мобильных устройств
```

### Хуки API (hooks/api/)

```typescript
├── useActivities.ts             // Получение активностей
├── useActivitiesApi.ts          // API операции
├── useActivitiesInvalidation.ts // Инвалидация кэша
├── useActivitiesRealtime.ts     // Realtime обновления
├── useGlobalActivitySync.ts     // Глобальная синхронизация
└── useSyncMonitor.ts            // Мониторинг синхронизации
```

**Пример архитектуры хука:**
```typescript
export const useActivities = (date?: Date) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Запрос данных
  const { data, isLoading, error } = useQuery({
    queryKey: ['activities', user?.id, date],
    queryFn: () => activityService.getActivities(date),
    enabled: !!user
  });
  
  // Realtime подписка
  useActivitiesRealtime(user?.id);
  
  // Мутации
  const createMutation = useMutation({
    mutationFn: activityService.createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries(['activities']);
    }
  });
  
  return {
    activities: data ?? [],
    isLoading,
    error,
    createActivity: createMutation.mutate
  };
};
```

---

## 7. Компонентная архитектура

### 7.1 Базовые UI компоненты (shadcn/ui)

Проект использует библиотеку shadcn/ui - набор переиспользуемых компонентов:

```
components/ui/
├── button.tsx        # Кнопки
├── input.tsx         # Поля ввода
├── dialog.tsx        # Модальные окна
├── card.tsx          # Карточки
├── form.tsx          # Формы
├── calendar.tsx      # Календарь выбора даты
├── select.tsx        # Селекты
├── checkbox.tsx      # Чекбоксы
├── tabs.tsx          # Табы
├── toast.tsx         # Уведомления
├── dropdown-menu.tsx # Выпадающие меню
├── popover.tsx       # Поповеры
├── sheet.tsx         # Боковые панели
├── scroll-area.tsx   # Скролл области
└── ...               # И другие
```

**Особенности:**
- Все компоненты типизированы TypeScript
- Поддержка тем (light/dark)
- Accessibility из коробки
- Полностью кастомизируемые через Tailwind

### 7.2 Композитные компоненты

#### Dashboard Components

**DashboardContent** - главный layout дашборда:
```
DashboardContent
├── AIChatComponent           # AI чат (правая колонка)
├── ActiveDiariesComponent    # Активные дневники
├── ActivityTimelineComponent # Таймлайн активностей
├── RemindersComponent        # Напоминания
├── BalanceWheelComponent     # Колесо баланса
├── QuickStatsComponent       # Быстрая статистика
└── RecommendationsComponent  # Рекомендации
```

#### Calendar Components

**Структура календаря:**
```
Calendar (Page)
├── CalendarHeader           # Хедер с навигацией
├── CalendarNavigation       # Основная навигация
├── CalendarControls         # Управление (день/неделя/месяц)
└── [View Component]         # Текущий вид
    ├── DayView
    │   ├── DayViewHeader
    │   ├── DayViewSidebar
    │   ├── DayViewCalendar
    │   │   ├── TimeColumn
    │   │   ├── TimeMarkers
    │   │   ├── CurrentTimeIndicator
    │   │   └── DayActivityCard[]
    │   └── DayViewFilters
    ├── WeekView
    │   ├── WeekViewHeader
    │   └── WeekViewDay[]
    │       └── WeekActivityCard[]
    └── MonthView
        └── ActivityCard[]
```

#### AI Diary Components

```
AIDiaryScenarios (Dashboard)
└── AIDiaryContainer
    └── FreeChat
        ├── FreeChatHeader
        ├── FreeChatMessages
        │   └── ChatMessage[]
        ├── FreeChatInput
        └── SessionSelector
```

### 7.3 Паттерны компонентов

#### Compound Components Pattern

```typescript
// Пример: Dialog с подкомпонентами
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Render Props Pattern

```typescript
// Пример: Calendar с render prop
<Calendar
  activities={activities}
  renderActivity={(activity) => (
    <ActivityCard activity={activity} onEdit={handleEdit} />
  )}
/>
```

#### Container/Presenter Pattern

```typescript
// Container (логика)
const ActivityTimelineContainer = () => {
  const { activities, isLoading } = useActivities();
  const { handleCreate, handleUpdate } = useActivityOperations();
  
  return (
    <ActivityTimelinePresenter
      activities={activities}
      isLoading={isLoading}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
    />
  );
};

// Presenter (UI)
const ActivityTimelinePresenter = ({ activities, onCreate, onUpdate }) => {
  return (
    <div>
      {activities.map(activity => (
        <ActivityCard key={activity.id} {...activity} />
      ))}
    </div>
  );
};
```

---

## 8. Дизайн-система

### 8.1 Цветовая схема (HSL)

**Определение в index.css:**

```css
:root {
  /* Primary colors */
  --psybalans-primary: 158 84% 44%;      /* #14b8a6 - Teal */
  --psybalans-secondary: 166 76% 37%;    /* #0d9488 - Dark teal */
  
  /* Background */
  --background: 0 0% 100%;               /* White */
  --foreground: 222 47% 11%;             /* Dark gray */
  
  /* Muted */
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  
  /* Accent */
  --accent: 210 40% 96%;
  --accent-foreground: 222 47% 11%;
  
  /* Destructive */
  --destructive: 0 84% 60%;
  
  /* Border */
  --border: 214 32% 91%;
  --radius: 0.5rem;
}

.dark {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  /* ... остальные переменные для темной темы */
}
```

### 8.2 Типография

**Размеры шрифтов:**
```typescript
fontSize: {
  'small': ['14px', { lineHeight: '1.5' }],
  'medium': ['16px', { lineHeight: '1.5' }],
  'large': ['18px', { lineHeight: '1.5' }]
}
```

**Семейства шрифтов:**
- Sans: Inter, system-ui, sans-serif
- Mono: 'Fira Code', monospace

### 8.3 Spacing & Layout

**Tailwind spacing scale:**
```typescript
spacing: {
  '0': '0px',
  '1': '0.25rem',  // 4px
  '2': '0.5rem',   // 8px
  '4': '1rem',     // 16px
  '6': '1.5rem',   // 24px
  '8': '2rem',     // 32px
  // ...
}
```

**Breakpoints:**
```typescript
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px'
}
```

### 8.4 Анимации

**Кастомные анимации (tailwind.config.ts):**
```typescript
keyframes: {
  "fade-in": {
    "0%": { opacity: "0", transform: "translateY(10px)" },
    "100%": { opacity: "1", transform: "translateY(0)" }
  },
  "slide-in-right": {
    "0%": { transform: "translateX(100%)" },
    "100%": { transform: "translateX(0)" }
  }
}
```

---

## 9. Типизация (TypeScript)

### 9.1 Основные типы

```typescript
// src/types/api.types.ts
export interface Activity {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  activity_type: ActivityType;
  status: ActivityStatus;
  recurrence_rule?: RecurrenceRule;
  created_at: string;
  updated_at: string;
}

export type ActivityType = 
  | 'work' 
  | 'exercise' 
  | 'meditation' 
  | 'therapy' 
  | 'social' 
  | 'hobby' 
  | 'rest';

export type ActivityStatus = 
  | 'planned' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';
```

### 9.2 Типы компонентов

```typescript
// Пропсы компонента
interface ActivityCardProps {
  activity: Activity;
  onEdit?: (activity: Activity) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: ActivityStatus) => void;
  className?: string;
}

// Состояние компонента
interface ActivityFormState {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  activityType: ActivityType;
  errors: Record<string, string>;
}
```

### 9.3 Generic типы

```typescript
// Утилитарные типы
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type AsyncData<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};

// Пример использования
const activities: AsyncData<Activity[]> = useActivities();
```

---

## 10. Производительность

### 10.1 Оптимизации

**Code Splitting:**
```typescript
// Lazy loading страниц
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Calendar = lazy(() => import('./pages/Calendar'));

// Использование с Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

**Memo и useMemo:**
```typescript
// Мемоизация компонента
export const ActivityCard = React.memo(({ activity, onEdit }) => {
  return <Card>{/* ... */}</Card>;
});

// Мемоизация вычислений
const sortedActivities = useMemo(() => {
  return activities.sort((a, b) => 
    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );
}, [activities]);
```

**useCallback:**
```typescript
const handleCreate = useCallback((data: CreateActivityDto) => {
  return activityService.createActivity(data);
}, []);
```

### 10.2 Virtualization

Для длинных списков используется виртуализация (планируется):
```typescript
// Пример с react-window
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={activities.length}
  itemSize={80}
>
  {({ index, style }) => (
    <div style={style}>
      <ActivityCard activity={activities[index]} />
    </div>
  )}
</FixedSizeList>
```

### 10.3 Image Optimization

- Lazy loading изображений
- Responsive images
- WebP формат с fallback

```typescript
<img 
  src={imageUrl} 
  loading="lazy"
  srcSet={`${imageUrl}?w=400 400w, ${imageUrl}?w=800 800w`}
  sizes="(max-width: 600px) 400px, 800px"
/>
```

---

## 11. Обработка ошибок

### 11.1 Error Boundaries

```typescript
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Отправка в Sentry/LogRocket
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### 11.2 Обработка API ошибок

```typescript
// В сервисах
try {
  const { data, error } = await supabase
    .from('activities')
    .select('*');
    
  if (error) throw new ApiError(error.message, error.code);
  return data;
} catch (error) {
  console.error('Failed to fetch activities:', error);
  throw error;
}

// В компонентах с React Query
const { data, error, isError } = useQuery({
  queryKey: ['activities'],
  queryFn: activityService.getActivities,
  retry: 3,
  onError: (error) => {
    toast.error(`Ошибка загрузки: ${error.message}`);
  }
});

if (isError) {
  return <ErrorMessage error={error} />;
}
```

### 11.3 Toast уведомления

```typescript
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

// Успех
toast({
  title: 'Активность создана',
  description: 'Новая активность успешно добавлена в календарь'
});

// Ошибка
toast({
  title: 'Ошибка',
  description: 'Не удалось создать активность',
  variant: 'destructive'
});
```

---

## 12. Тестирование (в планах)

### 12.1 Unit тесты

```typescript
// components/__tests__/ActivityCard.test.tsx
describe('ActivityCard', () => {
  it('should render activity title', () => {
    const activity = createMockActivity();
    render(<ActivityCard activity={activity} />);
    expect(screen.getByText(activity.title)).toBeInTheDocument();
  });
  
  it('should call onEdit when edit button clicked', () => {
    const onEdit = jest.fn();
    const activity = createMockActivity();
    render(<ActivityCard activity={activity} onEdit={onEdit} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(activity);
  });
});
```

### 12.2 Integration тесты

```typescript
// hooks/__tests__/useActivities.test.tsx
describe('useActivities', () => {
  it('should fetch activities on mount', async () => {
    const { result, waitFor } = renderHook(() => useActivities(), {
      wrapper: createTestWrapper()
    });
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.activities).toHaveLength(3);
  });
});
```

---

## 13. Accessibility (A11y)

### 13.1 Keyboard Navigation

- Все интерактивные элементы доступны с клавиатуры
- Логический порядок табуляции
- Shortcuts для частых действий

### 13.2 ARIA атрибуты

```typescript
<button
  aria-label="Создать новую активность"
  aria-expanded={isOpen}
  aria-controls="activity-form"
>
  <Plus className="w-4 h-4" />
</button>
```

### 13.3 Семантический HTML

```typescript
<main>
  <header>
    <nav aria-label="Основная навигация">
      {/* ... */}
    </nav>
  </header>
  
  <section aria-labelledby="activities-heading">
    <h2 id="activities-heading">Мои активности</h2>
    {/* ... */}
  </section>
</main>
```

---

## 14. Интернационализация (i18n)

> **Статус:** Не реализовано (планируется)

Планируется использование:
- `react-i18next`
- Поддержка русского и английского языков
- Динамическое переключение языка

---

## 15. DevTools и отладка

### 15.1 React DevTools

- Инспекция дерева компонентов
- Profiler для анализа производительности

### 15.2 React Query DevTools

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### 15.3 Console логирование

```typescript
// Логирование в dev режиме
if (import.meta.env.DEV) {
  console.log('Activity created:', activity);
}

// Structured logging
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
  }
};
```

---

## 16. Безопасность

### 16.1 XSS защита

- React автоматически экранирует контент
- Осторожность с `dangerouslySetInnerHTML`
- Санитизация пользовательского ввода

### 16.2 CSRF защита

- Supabase JWT токены в httpOnly cookies
- Автоматическая валидация токенов

### 16.3 Валидация данных

```typescript
import { z } from 'zod';

const activitySchema = z.object({
  title: z.string().min(1, 'Название обязательно').max(100),
  description: z.string().max(500).optional(),
  start_time: z.date(),
  end_time: z.date(),
  activity_type: z.enum(['work', 'exercise', 'meditation', ...])
});

// Использование
const result = activitySchema.safeParse(formData);
if (!result.success) {
  // Обработка ошибок валидации
}
```

---

## 17. Deployment & Build

### 17.1 Vite конфигурация

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), componentTagger()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'query-vendor': ['@tanstack/react-query']
        }
      }
    }
  }
});
```

### 17.2 Environment переменные

```typescript
// .env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

// Доступ в коде
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
```

---

## 18. Лучшие практики

### 18.1 Структура файлов компонента

```
ActivityCard/
├── ActivityCard.tsx      # Основной компонент
├── ActivityCard.test.tsx # Тесты
├── ActivityCard.types.ts # Типы
├── ActivityCard.styles.ts # Стили (если нужно)
└── index.ts              # Public API
```

### 18.2 Naming conventions

- **Компоненты:** PascalCase (`ActivityCard.tsx`)
- **Хуки:** camelCase с префиксом `use` (`useActivities.ts`)
- **Утилиты:** camelCase (`formatDate.ts`)
- **Константы:** UPPER_SNAKE_CASE (`MAX_ACTIVITIES`)
- **Типы:** PascalCase (`Activity`, `ActivityType`)

### 18.3 Комментарии и документация

```typescript
/**
 * Компонент карточки активности
 * 
 * @param activity - Объект активности
 * @param onEdit - Callback для редактирования
 * @param onDelete - Callback для удаления
 * @returns React компонент
 * 
 * @example
 * <ActivityCard 
 *   activity={activity} 
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 */
export const ActivityCard: React.FC<ActivityCardProps> = ({ ... }) => {
  // ...
};
```

---

## 19. Проблемы и технический долг

### Текущие проблемы:

1. **Нет Code Splitting** - все компоненты загружаются сразу
2. **Отсутствие виртуализации** для длинных списков
3. **Дублирование логики** между сервисами активностей
4. **Нет централизованной обработки ошибок**
5. **Отсутствие тестов**
6. **Мобильная адаптация** требует доработки
7. **Performance issues** на медленных устройствах

### Планы по рефакторингу:

- [ ] Внедрить lazy loading для страниц
- [ ] Добавить Error Boundary на уровне роутов
- [ ] Унифицировать сервисы активностей
- [ ] Написать unit тесты для критичных компонентов
- [ ] Оптимизировать ререндеры через React.memo
- [ ] Добавить виртуализацию списков
- [ ] Улучшить типизацию (убрать `any`)

---

## 20. Полезные ссылки

### Документация используемых технологий

- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [React Router v6](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/docs)
- [Lucide Icons](https://lucide.dev/)

### Внутренняя документация

- [README.md](./README.md) - общая информация о проекте
- [AI_DIARY_ARCHITECTURE.md](./AI_DIARY_ARCHITECTURE.md) - архитектура AI дневника
- [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md) - общая архитектура проекта

---

## Заключение

Frontend PsyBalans - это современное React-приложение с акцентом на производительность, типобезопасность и user experience. Архитектура построена по модульному принципу с четким разделением ответственности между слоями.

**Ключевые преимущества:**
- Масштабируемая структура компонентов
- Типобезопасность на всех уровнях
- Эффективное управление состоянием
- Оптимизированная работа с данными через React Query
- Realtime обновления через Supabase
- Гибкая система дизайна

**Версия документации:** 1.0  
**Дата последнего обновления:** 2025-01-19
