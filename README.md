# Приложение психологической поддержки

Веб-приложение для ведения дневников настроения, планирования активностей и психологической поддержки с AI помощником.

## Основные возможности

- 📝 **Дневники**: Дневник настроения, мыслей, сна и других состояний
- 📅 **Календарь активностей**: Планирование и отслеживание деятельности
- 🤖 **AI помощник**: Интеллектуальный анализ и рекомендации
- 📊 **Аналитика**: Статистика и визуализация прогресса в виде интерактивных графиков
- 🎯 **Онбординг**: Персонализированная настройка под пользователя

## Дневник настроения и эмоций

### Процесс сохранения данных
1. **Сбор данных** через `MoodDiary.tsx` в 5 этапов:
   - Оценка настроения (-5 до +5)
   - Выбор эмоций из предустановленного списка
   - Добавление контекста и заметок
   - Указание триггеров и физических ощущений
   - Получение рекомендаций

2. **Отправка на бэкенд** через `/api/v1/diary/mood/frontend`:
   - Данные отправляются в формате фронтенда (-5/+5)
   - Бэкенд автоматически конвертирует в формат базы данных (-10/+10)
   - Эмоции категоризируются и структурируются

### Отображение графиков
1. **Загрузка данных** через `chartDataService.ts`:
   - Попытка загрузки реальных данных пользователя
   - Fallback на демо-данные для неавторизованных пользователей
   - Автообновление каждые 30 секунд

2. **Визуализация** в `MoodEmotionsChart.tsx`:
   - **День**: временная ось 00:00-24:00, точки записей по времени
   - **Неделя**: дни недели с датами, записи группируются по дням
   - **Месяц**: числа месяца 1-31, записи группируются по датам
   - Вертикальная ось: настроение от -5 до +5
   - Каждая запись отображается точкой, соединенной плавной линией

3. **Интерактивность**:
   - Клик по точке показывает подробную информацию
   - Детали включают: настроение, эмоции, контекст, триггеры, заметки

## Архитектура

### Frontend
- **React 18** с TypeScript
- **Vite** для сборки и разработки
- **Tailwind CSS** для стилизации
- **shadcn/ui** компоненты
- **React Query** для работы с API
- **React Router** для маршрутизации
- **Supabase** для аутентификации (опционально)

### Backend API
- **Базовый URL**: `http://localhost:8000/api/v1`
- **Аутентификация**: JWT токены (Bearer)
- **Документация**: OpenAPI/Swagger

## Настройка разработки

### Требования
- Node.js 18+ и npm
- Backend сервер (Python FastAPI) на порту 8000

### Установка

```bash
# Клонирование репозитория
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```

### Конфигурация Backend

Приложение настроено для работы с backend API. В файлах сервисов можно переключать режимы:

```typescript
// src/services/onboarding.service.ts
const USE_MOCK = true; // false для реального API

// src/services/api.client.ts  
const API_BASE_URL = 'http://localhost:8000/api/v1';
```

### Режимы работы

**Mock режим** (USE_MOCK = true):
- Работа с локальными mock данными
- Не требует backend сервера
- Подходит для разработки UI

**API режим** (USE_MOCK = false):
- Работа с реальным backend
- Требует запущенный сервер на localhost:8000
- Полная функциональность

## Основные API эндпоинты

### Аутентификация
- `POST /auth/login-json` - Вход (JSON)
- `POST /auth/login` - Вход (form-data)
- `POST /auth/register` - Регистрация
- `POST /auth/refresh-token` - Обновление токена

### Пользователи
- `GET /user/me` - Профиль пользователя
- `PUT /user/me` - Обновление профиля
- `GET /user/admin/users` - Список пользователей (админ)

### Активности
- `GET /activities/` - Список активностей
- `POST /activities/` - Создание активности
- `PUT /activities/{id}` - Обновление активности
- `DELETE /activities/{id}` - Удаление активности

### Дневники
- `POST /diary/mood/frontend` - Запись дневника настроения (формат фронтенда -5/+5)
- `POST /diary/mood/flexible` - Гибкое создание с автовалидацией
- `GET /diary/mood/flexible` - Данные настроения (реальные/демо)
- `GET /diary/mood/stats/public` - Публичная статистика (без авторизации)
- `GET /diary/mood/demo` - Демо-данные для графика
- `POST /diary/thought` - Запись дневника мыслей  
- `POST /diary/sleep` - Запись дневника сна

### Онбординг
- `POST /onboarding/start` - Начало онбординга
- `POST /onboarding/stage/{stage}` - Сохранение этапа
- `POST /onboarding/complete` - Завершение онбординга

## Структура проекта

```
src/
├── components/          # React компоненты
│   ├── dashboard/      # Главная панель
│   ├── calendar/       # Календарь активностей
│   ├── diaries/        # Дневники
│   ├── onboarding/     # Процесс знакомства
│   └── ui/            # UI компоненты
├── services/           # API сервисы
├── contexts/           # React контексты
├── hooks/             # Пользовательские хуки
├── types/             # TypeScript типы
└── utils/             # Утилиты
```

## Технологии

- **Vite** - Инструмент сборки
- **TypeScript** - Типизация
- **React 18** - UI библиотека
- **shadcn/ui** - Компоненты интерфейса
- **Tailwind CSS** - CSS фреймворк
- **React Query** - Управление состоянием сервера
- **React Router** - Маршрутизация
- **Axios** - HTTP клиент
- **Supabase** - База данных и аутентификация

## Разработка

### Отладка
- Консоль браузера для логов
- React Query DevTools для API запросов
- Network tab для мониторинга запросов

### Переключение между Mock и API
Для тестирования без backend измените в соответствующих сервисах:
```typescript
const USE_MOCK = true; // включить mock режим
```

### Основные команды
```bash
npm run dev          # Разработка
npm run build        # Сборка для продакшена
npm run preview      # Предпросмотр сборки
npm run lint         # Проверка кода
```

## Деплой

Simply open [Lovable](https://lovable.dev/projects/e5a4ef70-f531-4e5a-8dfd-61e42cd7f2c0) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

# Аутентификация и онбординг — логика и архитектура

Эта секция описывает текущий порядок регистрации/входа, запуск онбординга и переходы.

## Задействованные файлы
- src/pages/Auth.tsx — экран входа/регистрации (email+пароль, опциональная «магическая ссылка»)
- src/contexts/SupabaseAuthContext.tsx — управление сессией, signIn/signUp/signOut, очистка состояния
- src/pages/Dashboard.tsx — показ OnboardingDialog на основе флагов
- src/components/onboarding/OnboardingDialog.tsx — мастер онбординга

## Основные флаги в localStorage
- onboarding-completed: 'true' | 'false' — признак завершения онбординга
- onboarding-force: 'true' — принудительно показать онбординг при следующем заходе на /dashboard

## Потоки
1) Регистрация (кнопка «Зарегистрироваться» в Auth.tsx):
   - Выполняется supabase.auth.signUp с emailRedirectTo = `${origin}/dashboard`.
   - Устанавливаются флаги: onboarding-completed='false', onboarding-force='true'.
   - Пользователь перенаправляется на /dashboard. После подтверждения email (по письму) он автоматически войдёт и окажется на /dashboard.
   - Dashboard.tsx обнаружит флаг onboarding-force и откроет OnboardingDialog.
   - По закрытию онбординга: onboarding-completed='true', onboarding-force удаляется; пользователь остаётся на /dashboard (аккаунт).

2) Вход по паролю (кнопка «Войти»):
   - Выполняется supabase.auth.signInWithPassword.
   - Успешный вход ведёт напрямую на /dashboard. Онбординг не показывается, если он уже завершён либо пользователь «старый» (>1 минуты с момента created_at).

3) «Войти по ссылке на email» (магическая ссылка):
   - Опция в режиме Вход, НЕ обязательная для использования.
   - Кнопка активна только если введён email; при нажатии отправляется magic link с redirect на /dashboard.

Примечание: HTML required для полей email/пароль отключён, валидация выполняется в обработчиках действия (вход/регистрация), чтобы «магическая ссылка» была действительно опциональной.

## Логика показа онбординга (Dashboard.tsx)
- Определяется shouldShowOnboarding = onboarding-force === true ИЛИ (onboarding-completed !== true И пользователь «новый», т.е. создан < 1 минуты назад).
- При закрытии онбординга выставляется onboarding-completed='true' и удаляется onboarding-force.
- Для «старых» пользователей без принудительного показа онбординг не показывается, а флаг completion выставляется в 'true'.

## Очистка при выходе (signOut)
- Удаляются ключи Supabase (supabase.auth.*, sb-*) из localStorage/sessionStorage.
- Сбрасываются флаги онбординга (onboarding-completed, onboarding-force, onboarding-data).
- Выполняется глобический signOut и редирект на /auth.

## Настройки Supabase (обязательно проверить)
- Authentication → URL Configuration: укажите корректные Site URL и Redirect URLs (включая URL превью/продакшена).
- Подтверждение email: по умолчанию требуется. Для ускорения тестирования можно временно отключить «Confirm email» в настройках провайдера Email.
- В логах Supabase возможна ошибка 400: Email not confirmed при попытке входа до подтверждения письма — это ожидаемо.

