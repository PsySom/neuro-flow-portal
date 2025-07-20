# Приложение психологической поддержки

Веб-приложение для ведения дневников настроения, планирования активностей и психологической поддержки с AI помощником.

## Основные возможности

- 📝 **Дневники**: Дневник настроения, мыслей, сна и других состояний
- 📅 **Календарь активностей**: Планирование и отслеживание деятельности
- 🤖 **AI помощник**: Интеллектуальный анализ и рекомендации
- 📊 **Аналитика**: Статистика и визуализация прогресса
- 🎯 **Онбординг**: Персонализированная настройка под пользователя

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
- **Базовый URL**: `http://localhost:8001/api/v1`
- **Аутентификация**: JWT токены (Bearer)
- **Документация**: OpenAPI/Swagger

## Настройка разработки

### Требования
- Node.js 18+ и npm
- Backend сервер (Python FastAPI) на порту 8001

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
const API_BASE_URL = 'http://localhost:8001/api/v1';
```

### Режимы работы

**Mock режим** (USE_MOCK = true):
- Работа с локальными mock данными
- Не требует backend сервера
- Подходит для разработки UI

**API режим** (USE_MOCK = false):
- Работа с реальным backend
- Требует запущенный сервер на localhost:8001
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
- `POST /diary/mood` - Запись дневника настроения
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
