# AI Дневник - Техническая Документация

## Оглавление
1. [Обзор](#обзор)
2. [Архитектура](#архитектура)
3. [База данных](#база-данных)
4. [Компоненты](#компоненты)
5. [Сервисы](#сервисы)
6. [Хуки](#хуки)
7. [Типы данных](#типы-данных)
8. [Realtime Architecture](#realtime-architecture)
9. [Интеграции](#интеграции)
10. [Сценарии использования](#сценарии-использования)
11. [Безопасность](#безопасность)

---

## Обзор

AI Дневник - это интерактивная система для ведения терапевтического дневника с использованием искусственного интеллекта. Система работает через Realtime архитектуру Supabase без прямых вызовов к внешним AI API.

### Ключевые особенности:
- 🤖 **AI-ассистент**: Интеллектуальный помощник для рефлексии и самоанализа
- 💬 **Realtime чат**: Мгновенное получение ответов через WebSocket
- 📊 **Аналитика**: Статистика сессий, топики, длительность
- 🔒 **Безопасность**: RLS политики, шифрование данных
- 📱 **Адаптивность**: Работает на всех устройствах

---

## Архитектура

### Общая схема

```
┌─────────────────┐
│  React Frontend │
│   (FreeChat)    │
└────────┬────────┘
         │
         ├─── Отправка сообщения
         │    └─> Supabase: INSERT ai_diary_messages (user message)
         │
         ├─── Database Trigger
         │    └─> send_ai_diary_to_n8n() 
         │        └─> Webhook: https://mentalbalans.com/webhook/ai-diary-chat
         │
         ├─── n8n обработка
         │    ├─> OpenAI API
         │    └─> INSERT ai_diary_messages (AI response)
         │
         └─── Realtime подписка
              └─> onNewMessage() → обновление UI
```

### Технологический стек

**Frontend:**
- React 18.3
- TypeScript
- Tailwind CSS
- Radix UI компоненты
- React Query для кэширования

**Backend:**
- Supabase PostgreSQL
- Supabase Realtime (WebSockets)
- Database Triggers
- Row Level Security

**External:**
- n8n workflow automation
- OpenAI API (через n8n)

---

## База данных

### Таблица: `ai_diary_sessions`

Хранит информацию о сессиях пользователя.

**Структура:**
```sql
CREATE TABLE ai_diary_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_id VARCHAR NOT NULL DEFAULT gen_random_uuid()::text,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  summary TEXT,
  insights JSONB DEFAULT '{}',
  emotional_state JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Поля:**
- `id` - Уникальный идентификатор записи
- `user_id` - ID пользователя (связь с auth.users)
- `session_id` - Уникальный идентификатор сессии (строка)
- `started_at` - Время начала сессии
- `ended_at` - Время завершения сессии (NULL если активна)
- `summary` - Краткое описание сессии
- `insights` - Инсайты и выводы (JSON)
- `emotional_state` - Эмоциональное состояние (JSON)

**RLS Политики:**
```sql
-- Пользователи видят только свои сессии
CREATE POLICY "Users can view their own diary sessions"
  ON ai_diary_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Пользователи создают только свои сессии
CREATE POLICY "Users can create their own diary sessions"
  ON ai_diary_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Пользователи обновляют только свои сессии
CREATE POLICY "Users can update their own diary sessions"
  ON ai_diary_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Пользователи удаляют только свои сессии
CREATE POLICY "Users can delete their own diary sessions"
  ON ai_diary_sessions FOR DELETE
  USING (auth.uid() = user_id);
```

**Индексы:**
```sql
CREATE INDEX idx_ai_diary_sessions_user_id ON ai_diary_sessions(user_id);
CREATE INDEX idx_ai_diary_sessions_session_id ON ai_diary_sessions(session_id);
CREATE INDEX idx_ai_diary_sessions_started_at ON ai_diary_sessions(started_at DESC);
```

---

### Таблица: `ai_diary_messages`

Хранит все сообщения пользователя и AI.

**Структура:**
```sql
CREATE TABLE ai_diary_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_id VARCHAR,
  message_type VARCHAR, -- 'user' | 'ai'
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Поля:**
- `id` - Уникальный идентификатор сообщения
- `user_id` - ID пользователя
- `session_id` - ID сессии (связь с ai_diary_sessions)
- `message_type` - Тип сообщения: 'user' или 'ai'
- `content` - Текст сообщения
- `metadata` - Дополнительные данные (timestamp, source, suggestions)
- `created_at` - Время создания

**RLS Политики:**
```sql
-- Пользователи видят только свои сообщения
CREATE POLICY "Users can view their own diary messages"
  ON ai_diary_messages FOR SELECT
  USING (auth.uid() = user_id);

-- Пользователи создают только свои сообщения
CREATE POLICY "Users can create their own diary messages"
  ON ai_diary_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Пользователи обновляют только свои сообщения
CREATE POLICY "Users can update their own diary messages"
  ON ai_diary_messages FOR UPDATE
  USING (auth.uid() = user_id);

-- Пользователи удаляют только свои сообщения
CREATE POLICY "Users can delete their own diary messages"
  ON ai_diary_messages FOR DELETE
  USING (auth.uid() = user_id);
```

**Индексы:**
```sql
CREATE INDEX idx_ai_diary_messages_user_id ON ai_diary_messages(user_id);
CREATE INDEX idx_ai_diary_messages_session_id ON ai_diary_messages(session_id);
CREATE INDEX idx_ai_diary_messages_created_at ON ai_diary_messages(created_at DESC);
CREATE INDEX idx_ai_diary_messages_type ON ai_diary_messages(message_type);
```

---

### Database Triggers

**Trigger: Отправка в n8n**

При создании нового сообщения от пользователя, триггер автоматически отправляет данные в n8n webhook.

```sql
CREATE OR REPLACE FUNCTION send_ai_diary_to_n8n()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.message_type = 'user' THEN
    PERFORM net.http_post(
      url := 'https://mentalbalans.com/webhook/ai-diary-chat',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := jsonb_build_object(
        'user_id', NEW.user_id,
        'session_id', NEW.session_id,
        'message', NEW.content,
        'message_id', NEW.id,
        'timestamp', NEW.created_at
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_send_ai_diary_to_n8n
  AFTER INSERT ON ai_diary_messages
  FOR EACH ROW
  EXECUTE FUNCTION send_ai_diary_to_n8n();
```

**Что происходит:**
1. Пользователь отправляет сообщение
2. INSERT в `ai_diary_messages` с `message_type = 'user'`
3. Триггер срабатывает AFTER INSERT
4. Функция отправляет HTTP POST на webhook
5. n8n получает данные и обрабатывает их

---

## Компоненты

### Иерархия компонентов

```
AIDiaryScenarios (src/components/dashboard/AIDiaryScenarios.tsx)
  └─> AIDiaryContainer (ai-diary-scenarios/AIDiaryContainer.tsx)
      └─> FreeChat (ai-diary-scenarios/FreeChat.tsx)
          ├─> FreeChatHeader (ai-diary-scenarios/FreeChatHeader.tsx)
          ├─> AIDiaryStats (ai-diary-scenarios/AIDiaryStats.tsx)
          ├─> FreeChatMessages (ai-diary-scenarios/FreeChatMessages.tsx)
          │   └─> ChatMessage (ai-diary-scenarios/ChatMessage.tsx)
          └─> FreeChatInput (ai-diary-scenarios/FreeChatInput.tsx)
```

---

### FreeChat.tsx

**Расположение:** `src/components/dashboard/ai-diary-scenarios/FreeChat.tsx`

**Назначение:** Главный компонент AI дневника, управляет всем состоянием и UI.

**Основные функции:**
```typescript
const FreeChat = () => {
  // Хук для управления чатом
  const {
    chatMessages,
    chatInput,
    setChatInput,
    isAITyping,
    isLoading,
    currentSessionId,
    handleSendMessage,
    handleNewSession,
    handleEndSession,
    handleSuggestionClick,
    isUserAuthenticated,
    loadingHistory
  } = useAIDiaryChat();

  // Хук для аналитики
  const { stats, topics, isLoadingStats } = useAIDiaryAnalytics();

  // Проверка авторизации
  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);
  
  useEffect(() => {
    isUserAuthenticated().then(setIsAuthenticated);
  }, [isUserAuthenticated]);

  // Рендер UI
  return (
    <Card>
      <FreeChatHeader 
        onNewSession={handleNewSession}
        onEndSession={handleEndSession}
        currentSessionId={currentSessionId}
      />
      <AIDiaryStats stats={stats} topics={topics} />
      <FreeChatMessages 
        messages={chatMessages}
        isLoading={isLoading}
        isAITyping={isAITyping}
        onSuggestionClick={handleSuggestionClick}
      />
      <FreeChatInput 
        value={chatInput}
        onChange={setChatInput}
        onSend={handleSendMessage}
        disabled={isLoading || isAITyping}
      />
    </Card>
  );
};
```

**State управление:**
- `chatMessages` - массив сообщений чата
- `chatInput` - текущий ввод пользователя
- `isAITyping` - флаг печатания AI
- `isLoading` - флаг загрузки
- `currentSessionId` - ID текущей сессии

---

### FreeChatMessages.tsx

**Расположение:** `src/components/dashboard/ai-diary-scenarios/FreeChatMessages.tsx`

**Назначение:** Отображает список сообщений с автоскроллом.

**Ключевые особенности:**
```typescript
const FreeChatMessages: React.FC<FreeChatMessagesProps> = ({
  messages,
  isLoading,
  isAITyping,
  onSuggestionClick
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Автоскролл при новых сообщениях
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      ) as HTMLElement;
      
      if (viewport) {
        requestAnimationFrame(() => {
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: 'smooth'
          });
        });
      }
    }
  }, []);

  // Скролл при изменении сообщений
  useEffect(() => {
    scrollToBottom();
  }, [messages, isAITyping, scrollToBottom]);

  // Копирование в буфер обмена
  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      toast.success('Скопировано в буфер обмена');
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      toast.error('Не удалось скопировать');
    }
  };

  return (
    <ScrollArea ref={scrollAreaRef}>
      {messages.map((message) => (
        <div key={message.id} className="message-container">
          <Avatar>
            {message.type === 'user' ? <User /> : <Bot />}
          </Avatar>
          <div className="message-content">
            <Markdown>{message.content}</Markdown>
            {message.suggestions && (
              <div className="suggestions">
                {message.suggestions.map((suggestion, idx) => (
                  <Button 
                    key={idx}
                    onClick={() => onSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <Button onClick={() => copyToClipboard(message.content, message.id)}>
            <Copy />
          </Button>
        </div>
      ))}
      
      {isAITyping && <TypingIndicator />}
    </ScrollArea>
  );
};
```

---

### FreeChatInput.tsx

**Расположение:** `src/components/dashboard/ai-diary-scenarios/FreeChatInput.tsx`

**Назначение:** Поле ввода сообщений с автоматическим изменением размера.

**Функциональность:**
```typescript
const FreeChatInput: React.FC<FreeChatInputProps> = ({
  value,
  onChange,
  onSend,
  disabled
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Автоматическое изменение высоты
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = 
        `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  // Обработка Enter (с Shift для новой строки)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  return (
    <div className="input-container">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Напишите ваше сообщение..."
        disabled={disabled}
        rows={1}
      />
      <Button 
        onClick={onSend}
        disabled={!value.trim() || disabled}
      >
        <Send />
      </Button>
    </div>
  );
};
```

---

### FreeChatHeader.tsx

**Расположение:** `src/components/dashboard/ai-diary-scenarios/FreeChatHeader.tsx`

**Назначение:** Заголовок чата с кнопками управления сессией.

```typescript
const FreeChatHeader: React.FC<FreeChatHeaderProps> = ({
  onNewSession,
  onEndSession,
  currentSessionId
}) => {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle>AI Дневник</CardTitle>
          <CardDescription>
            Общайтесь с AI-ассистентом для рефлексии
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {currentSessionId && (
            <Button variant="outline" onClick={onEndSession}>
              Завершить сессию
            </Button>
          )}
          <Button onClick={onNewSession}>
            Новая сессия
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};
```

---

### AIDiaryStats.tsx

**Расположение:** `src/components/dashboard/ai-diary-scenarios/AIDiaryStats.tsx`

**Назначение:** Отображение статистики использования дневника.

```typescript
interface AIDiaryStatsProps {
  stats: SessionStats | null;
  topics: TopicFrequency[];
  isLoading?: boolean;
}

const AIDiaryStats: React.FC<AIDiaryStatsProps> = ({
  stats,
  topics,
  isLoading
}) => {
  if (isLoading) return <Skeleton />;
  if (!stats) return null;

  return (
    <div className="stats-container">
      <div className="stat-card">
        <span>Всего сессий</span>
        <span>{stats.totalSessions}</span>
      </div>
      <div className="stat-card">
        <span>Сообщений за сессию</span>
        <span>{stats.averageMessagesPerSession.toFixed(1)}</span>
      </div>
      <div className="stat-card">
        <span>Всего сообщений</span>
        <span>{stats.totalMessages}</span>
      </div>
      
      {topics.length > 0 && (
        <div className="topics">
          <h4>Популярные темы:</h4>
          {topics.map(topic => (
            <Badge key={topic.topic}>
              {topic.topic} ({topic.count})
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## Сервисы

### AIDiaryService

**Расположение:** `src/services/ai-diary.service.ts`

**Назначение:** Основной сервис для работы с AI дневником.

**Методы:**

#### `ensureSessionExists(sessionId: string): Promise<void>`
Проверяет существование сессии и создает если нужно.

```typescript
async ensureSessionExists(sessionId: string): Promise<void> {
  if (!this.userId) return;
  
  const { data: existing } = await supabase
    .from('ai_diary_sessions')
    .select('id')
    .eq('session_id', sessionId)
    .single();
    
  if (!existing) {
    await supabase.from('ai_diary_sessions').insert({
      user_id: this.userId,
      session_id: sessionId,
      started_at: new Date().toISOString()
    });
  }
}
```

#### `getCurrentSessionId(): string | null`
Получает ID текущей сессии из localStorage.

```typescript
getCurrentSessionId(): string | null {
  return localStorage.getItem('ai_diary_session_id');
}
```

#### `subscribeToMessages(sessionId, onNewMessage): RealtimeChannel`
Подписывается на новые AI сообщения через Realtime.

```typescript
subscribeToMessages(sessionId: string, onNewMessage: (message: any) => void) {
  if (this.realtimeChannel) {
    this.realtimeChannel.unsubscribe();
  }
  
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
          onNewMessage(payload.new);
        }
      }
    )
    .subscribe();
    
  return this.realtimeChannel;
}
```

#### `sendMessage(message: string, sessionId: string): Promise<any>`
Отправляет сообщение пользователя.

```typescript
async sendMessage(message: string, sessionId: string): Promise<any> {
  if (!this.userId) {
    const { data: { user } } = await supabase.auth.getUser();
    this.userId = user?.id || null;
  }
  
  if (!this.userId) {
    throw new Error('User not authenticated');
  }
  
  try {
    await this.ensureSessionExists(sessionId);
    
    const { data, error } = await supabase
      .from('ai_diary_messages')
      .insert({
        user_id: this.userId,
        session_id: sessionId,
        message_type: 'user',
        content: message,
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'free_chat'
        }
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return { 
      success: true, 
      messageId: data.id,
      ai_response: 'AI обрабатывает ваше сообщение...',
      session_id: sessionId 
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return { 
      success: false, 
      error: error.message,
      ai_response: 'Произошла ошибка при отправке сообщения'
    };
  }
}
```

#### `loadSessionHistory(sessionId: string): Promise<any[]>`
Загружает историю сообщений сессии.

```typescript
async loadSessionHistory(sessionId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('ai_diary_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error('Error loading history:', error);
    return [];
  }
  
  return data || [];
}
```

#### `startNewSession(): Promise<string>`
Создает новую сессию.

```typescript
async startNewSession(): Promise<string> {
  const newSessionId = `ai_diary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('ai_diary_session_id', newSessionId);
  
  if (this.userId) {
    await supabase.from('ai_diary_sessions').insert({
      user_id: this.userId,
      session_id: newSessionId,
      started_at: new Date().toISOString()
    });
  }
  
  return newSessionId;
}
```

#### `endSession(sessionId: string): Promise<void>`
Завершает текущую сессию.

```typescript
async endSession(sessionId: string): Promise<void> {
  if (this.userId && sessionId) {
    await supabase
      .from('ai_diary_sessions')
      .update({ ended_at: new Date().toISOString() })
      .eq('session_id', sessionId);
  }
  
  localStorage.removeItem('ai_diary_session_id');
  this.unsubscribe();
}
```

#### `unsubscribe(): void`
Отписывается от Realtime канала.

```typescript
unsubscribe() {
  if (this.realtimeChannel) {
    this.realtimeChannel.unsubscribe();
    this.realtimeChannel = null;
  }
}
```

---

### AIDiaryAnalyticsService

**Расположение:** `src/services/ai-diary-analytics.service.ts`

**Назначение:** Сервис для аналитики использования дневника.

**Интерфейсы:**

```typescript
interface SessionStats {
  totalSessions: number;
  averageMessagesPerSession: number;
  totalMessages: number;
  currentSession?: {
    duration: string;
    messageCount: number;
    averageMessageLength: number;
  };
}

interface TopicFrequency {
  topic: string;
  count: number;
}
```

**Методы:**

#### `getUserStats(userId: string): Promise<SessionStats | null>`
Получает общую статистику пользователя.

```typescript
async getUserStats(userId: string): Promise<SessionStats | null> {
  try {
    // Получаем все сессии
    const { data: sessions } = await supabase
      .from('ai_diary_sessions')
      .select('id, session_id')
      .eq('user_id', userId);
    
    if (!sessions || sessions.length === 0) {
      return {
        totalSessions: 0,
        averageMessagesPerSession: 0,
        totalMessages: 0
      };
    }
    
    // Получаем все сообщения
    const { data: messages } = await supabase
      .from('ai_diary_messages')
      .select('id')
      .eq('user_id', userId);
    
    const totalMessages = messages?.length || 0;
    const totalSessions = sessions.length;
    const averageMessagesPerSession = totalSessions > 0 
      ? totalMessages / totalSessions 
      : 0;
    
    return {
      totalSessions,
      averageMessagesPerSession,
      totalMessages
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
}
```

#### `getCurrentSessionStats(sessionId, userId, currentMessages): Promise<Partial<SessionStats>>`
Получает статистику текущей сессии.

```typescript
async getCurrentSessionStats(
  sessionId: string, 
  userId: string, 
  currentMessages: any[]
): Promise<Partial<SessionStats>> {
  try {
    const { data: session } = await supabase
      .from('ai_diary_sessions')
      .select('started_at')
      .eq('session_id', sessionId)
      .eq('user_id', userId)
      .single();
    
    if (!session) return {};
    
    const startTime = new Date(session.started_at);
    const now = new Date();
    const durationMinutes = Math.floor((now.getTime() - startTime.getTime()) / 60000);
    
    const userMessages = currentMessages.filter(m => m.type === 'user');
    const totalLength = userMessages.reduce((sum, m) => sum + m.content.length, 0);
    const averageLength = userMessages.length > 0 
      ? Math.round(totalLength / userMessages.length) 
      : 0;
    
    return {
      currentSession: {
        duration: this.formatDuration(durationMinutes),
        messageCount: currentMessages.length,
        averageMessageLength: averageLength
      }
    };
  } catch (error) {
    console.error('Error getting current session stats:', error);
    return {};
  }
}
```

#### `getTopTopics(userId: string, limit: number = 5): Promise<TopicFrequency[]>`
Получает наиболее обсуждаемые темы.

```typescript
async getTopTopics(userId: string, limit: number = 5): Promise<TopicFrequency[]> {
  try {
    const { data: messages } = await supabase
      .from('ai_diary_messages')
      .select('content')
      .eq('user_id', userId)
      .eq('message_type', 'user');
    
    if (!messages) return [];
    
    // Список ключевых слов для анализа
    const keywords = [
      'тревога', 'стресс', 'сон', 'настроение', 'депрессия',
      'энергия', 'мотивация', 'отношения', 'работа', 'самооценка',
      'страх', 'злость', 'грусть', 'радость', 'беспокойство'
    ];
    
    const topicCounts: Record<string, number> = {};
    
    // Подсчет упоминаний
    messages.forEach(message => {
      const content = message.content.toLowerCase();
      keywords.forEach(keyword => {
        if (content.includes(keyword)) {
          topicCounts[keyword] = (topicCounts[keyword] || 0) + 1;
        }
      });
    });
    
    // Сортировка и ограничение
    return Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting top topics:', error);
    return [];
  }
}
```

#### `formatDuration(minutes: number): string`
Форматирует длительность в читаемый вид.

```typescript
private formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} мин`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} ч ${mins} мин`;
}
```

---

## Хуки

### useAIDiaryChat

**Расположение:** `src/components/dashboard/ai-diary-scenarios/hooks/useAIDiaryChat.ts`

**Назначение:** Главный хук для управления чатом.

**Возвращаемые значения:**

```typescript
interface UseAIDiaryChatReturn {
  // Состояние
  chatMessages: Message[];
  chatInput: string;
  isAITyping: boolean;
  isLoading: boolean;
  loadingHistory: boolean;
  currentSessionId: string | null;
  
  // Действия
  setChatInput: (value: string) => void;
  handleSendMessage: () => Promise<void>;
  handleNewSession: () => Promise<void>;
  handleEndSession: () => Promise<void>;
  handleSuggestionClick: (suggestion: string) => void;
  isUserAuthenticated: () => Promise<boolean>;
}
```

**Реализация:**

```typescript
export const useAIDiaryChat = (): UseAIDiaryChatReturn => {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const aiDiaryService = useMemo(() => new AIDiaryService(), []);

  // Инициализация: загрузка сессии и истории
  useEffect(() => {
    const initializeChat = async () => {
      setLoadingHistory(true);
      
      let sessionId = aiDiaryService.getCurrentSessionId();
      
      if (!sessionId) {
        sessionId = await aiDiaryService.startNewSession();
      }
      
      setCurrentSessionId(sessionId);
      
      // Загрузка истории
      const history = await aiDiaryService.loadSessionHistory(sessionId);
      const formattedMessages = history.map(msg => ({
        id: msg.id,
        type: msg.message_type,
        content: msg.content,
        timestamp: new Date(msg.created_at),
        suggestions: msg.metadata?.suggestions
      }));
      
      setChatMessages(formattedMessages);
      setLoadingHistory(false);
    };
    
    initializeChat();
  }, [aiDiaryService]);

  // Подписка на Realtime
  useEffect(() => {
    if (!currentSessionId) return;
    
    const channel = aiDiaryService.subscribeToMessages(
      currentSessionId,
      (newMessage) => {
        setIsAITyping(true);
        
        // Эффект печатания
        let currentText = '';
        const fullText = newMessage.content;
        const typingSpeed = 20;
        
        const typingInterval = setInterval(() => {
          if (currentText.length < fullText.length) {
            currentText = fullText.slice(0, currentText.length + 1);
            
            setChatMessages(prev => {
              const filtered = prev.filter(m => m.id !== 'typing');
              return [
                ...filtered,
                {
                  id: 'typing',
                  type: 'ai',
                  content: currentText,
                  timestamp: new Date(),
                  suggestions: newMessage.metadata?.suggestions
                }
              ];
            });
          } else {
            clearInterval(typingInterval);
            setIsAITyping(false);
            
            // Финальное сообщение
            setChatMessages(prev => {
              const filtered = prev.filter(m => m.id !== 'typing');
              return [
                ...filtered,
                {
                  id: newMessage.id,
                  type: 'ai',
                  content: fullText,
                  timestamp: new Date(newMessage.created_at),
                  suggestions: newMessage.metadata?.suggestions
                }
              ];
            });
          }
        }, typingSpeed);
      }
    );
    
    return () => {
      aiDiaryService.unsubscribe();
    };
  }, [currentSessionId, aiDiaryService]);

  // Отправка сообщения
  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim() || !currentSessionId || isLoading) return;
    
    const userMessage = chatInput.trim();
    setChatInput('');
    setIsLoading(true);
    
    // Добавляем сообщение пользователя
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    
    try {
      await aiDiaryService.sendMessage(userMessage, currentSessionId);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Ошибка отправки сообщения');
    } finally {
      setIsLoading(false);
    }
  }, [chatInput, currentSessionId, isLoading, aiDiaryService]);

  // Новая сессия
  const handleNewSession = useCallback(async () => {
    if (currentSessionId) {
      await aiDiaryService.endSession(currentSessionId);
    }
    
    const newSessionId = await aiDiaryService.startNewSession();
    setCurrentSessionId(newSessionId);
    setChatMessages([]);
    toast.success('Начата новая сессия');
  }, [currentSessionId, aiDiaryService]);

  // Завершить сессию
  const handleEndSession = useCallback(async () => {
    if (!currentSessionId) return;
    
    await aiDiaryService.endSession(currentSessionId);
    setCurrentSessionId(null);
    setChatMessages([]);
    toast.success('Сессия завершена');
  }, [currentSessionId, aiDiaryService]);

  // Клик по suggestion
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setChatInput(suggestion);
  }, []);

  // Проверка авторизации
  const isUserAuthenticated = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  }, []);

  return {
    chatMessages,
    chatInput,
    isAITyping,
    isLoading,
    loadingHistory,
    currentSessionId,
    setChatInput,
    handleSendMessage,
    handleNewSession,
    handleEndSession,
    handleSuggestionClick,
    isUserAuthenticated
  };
};
```

---

### useAIDiaryAnalytics

**Расположение:** `src/components/dashboard/ai-diary-scenarios/hooks/useAIDiaryAnalytics.ts`

**Назначение:** Хук для загрузки аналитики.

```typescript
interface UseAIDiaryAnalyticsReturn {
  stats: SessionStats | null;
  topics: TopicFrequency[];
  isLoadingStats: boolean;
}

export const useAIDiaryAnalytics = (): UseAIDiaryAnalyticsReturn => {
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [topics, setTopics] = useState<TopicFrequency[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  const analyticsService = useMemo(() => new AIDiaryAnalyticsService(), []);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoadingStats(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoadingStats(false);
        return;
      }
      
      try {
        const [userStats, userTopics] = await Promise.all([
          analyticsService.getUserStats(user.id),
          analyticsService.getTopTopics(user.id, 5)
        ]);
        
        setStats(userStats);
        setTopics(userTopics);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };
    
    loadAnalytics();
  }, [analyticsService]);

  return {
    stats,
    topics,
    isLoadingStats
  };
};
```

---

## Типы данных

### Message

**Расположение:** `src/components/dashboard/ai-diary-scenarios/chatTypes.ts`

```typescript
export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}
```

### SessionStats

**Расположение:** `src/services/ai-diary-analytics.service.ts`

```typescript
export interface SessionStats {
  totalSessions: number;
  averageMessagesPerSession: number;
  totalMessages: number;
  currentSession?: {
    duration: string;
    messageCount: number;
    averageMessageLength: number;
  };
}
```

### TopicFrequency

```typescript
export interface TopicFrequency {
  topic: string;
  count: number;
}
```

---

## Realtime Architecture

### Схема работы Realtime

```
┌──────────────────────────────────────────────────────────┐
│                    Frontend (React)                       │
│                                                            │
│  1. Component Mount                                        │
│     └─> useEffect: subscribeToMessages()                 │
│                                                            │
│  2. Supabase Realtime Channel                             │
│     └─> supabase.channel('ai_diary_${sessionId}')       │
│         └─> .on('postgres_changes', ...)                 │
│             └─> event: 'INSERT'                           │
│             └─> table: 'ai_diary_messages'               │
│             └─> filter: 'session_id=eq.${sessionId}'     │
│                                                            │
│  3. WebSocket Connection                                   │
│     └─> wss://szvousyzsqdpubgfycdy.supabase.co/realtime │
│                                                            │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                 Supabase Realtime Server                  │
│                                                            │
│  - Слушает изменения в базе данных                       │
│  - Фильтрует по session_id                               │
│  - Отправляет только message_type = 'ai'                 │
│                                                            │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                  Frontend Callback                         │
│                                                            │
│  onNewMessage(payload.new)                                │
│    │                                                       │
│    ├─> setIsAITyping(true)                               │
│    │                                                       │
│    ├─> Typing Effect (20ms per character)                │
│    │   └─> Постепенное отображение текста                │
│    │                                                       │
│    ├─> Parse Suggestions                                  │
│    │   └─> Извлечение из metadata                        │
│    │                                                       │
│    └─> setChatMessages([...prev, newMessage])            │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

### Конфигурация Realtime в Supabase

**Включение Realtime для таблицы:**

```sql
-- Включить REPLICA IDENTITY FULL для полной информации о строках
ALTER TABLE ai_diary_messages REPLICA IDENTITY FULL;

-- Добавить таблицу в публикацию realtime
ALTER PUBLICATION supabase_realtime ADD TABLE ai_diary_messages;
```

**Проверка статуса Realtime:**

```sql
-- Проверить публикации
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

-- Проверить REPLICA IDENTITY
SELECT 
  schemaname, 
  tablename, 
  CASE relreplident
    WHEN 'd' THEN 'default'
    WHEN 'n' THEN 'nothing'
    WHEN 'f' THEN 'full'
    WHEN 'i' THEN 'index'
  END AS replica_identity
FROM pg_class
JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
WHERE relkind = 'r' AND schemaname = 'public';
```

---

## Интеграции

### n8n Workflow

**URL webhook:** `https://mentalbalans.com/webhook/ai-diary-chat`

**Схема обработки:**

```
┌─────────────────────────────────────────────────────────┐
│                  n8n Workflow                            │
│                                                           │
│  1. Webhook Trigger                                      │
│     └─> POST /webhook/ai-diary-chat                     │
│         ├─> user_id                                      │
│         ├─> session_id                                   │
│         ├─> message                                      │
│         ├─> message_id                                   │
│         └─> timestamp                                    │
│                                                           │
│  2. Load Message History                                 │
│     └─> Supabase Query                                   │
│         SELECT * FROM ai_diary_messages                  │
│         WHERE session_id = {{$json.session_id}}          │
│         ORDER BY created_at ASC                          │
│                                                           │
│  3. Format Messages for OpenAI                           │
│     └─> Transform to OpenAI format                       │
│         [                                                 │
│           { role: "system", content: "..." },            │
│           { role: "user", content: "..." },              │
│           { role: "assistant", content: "..." },         │
│           ...                                             │
│         ]                                                 │
│                                                           │
│  4. Call OpenAI API                                      │
│     └─> POST https://api.openai.com/v1/chat/completions │
│         ├─> model: "gpt-4"                               │
│         ├─> messages: [...]                              │
│         ├─> temperature: 0.7                             │
│         └─> max_tokens: 1000                             │
│                                                           │
│  5. Parse AI Response                                    │
│     └─> Extract content                                  │
│     └─> Generate suggestions (optional)                  │
│                                                           │
│  6. Save to Supabase                                     │
│     └─> INSERT INTO ai_diary_messages                    │
│         {                                                 │
│           user_id,                                        │
│           session_id,                                     │
│           message_type: 'ai',                            │
│           content: ai_response,                          │
│           metadata: {                                     │
│             model: 'gpt-4',                              │
│             suggestions: [...]                            │
│           }                                               │
│         }                                                 │
│                                                           │
│  7. Realtime автоматически уведомляет Frontend          │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**System Prompt для OpenAI:**

```
Вы - эмпатичный AI-ассистент для ведения терапевтического дневника.

Ваша роль:
- Помогать пользователю в рефлексии и самоанализе
- Задавать уточняющие вопросы
- Предлагать новые перспективы
- Быть поддерживающим и безоценочным

Стиль общения:
- Теплый и дружелюбный
- Профессиональный, но не формальный
- Использовать "ты" обращение
- Короткие и понятные ответы

Важно:
- НЕ давать медицинские диагнозы
- НЕ заменять профессионального психолога
- Рекомендовать обратиться к специалисту при серьезных проблемах
- Соблюдать конфиденциальность

После каждого ответа предлагайте 2-3 варианта продолжения разговора в виде коротких фраз.
Формат:
[SUGGESTIONS]
- Хочу рассказать подробнее
- Что мне с этим делать?
- Расскажи о похожих ситуациях
[/SUGGESTIONS]
```

**Обработка Suggestions в n8n:**

```javascript
// Node: Extract Suggestions
const response = $input.item.json.choices[0].message.content;
const suggestionsMatch = response.match(/\[SUGGESTIONS\](.*?)\[\/SUGGESTIONS\]/s);

let content = response;
let suggestions = [];

if (suggestionsMatch) {
  // Убрать блок suggestions из основного текста
  content = response.replace(/\[SUGGESTIONS\].*?\[\/SUGGESTIONS\]/s, '').trim();
  
  // Извлечь suggestions
  const suggestionsText = suggestionsMatch[1];
  suggestions = suggestionsText
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.startsWith('-'))
    .map(s => s.substring(1).trim());
}

return {
  json: {
    content,
    suggestions
  }
};
```

---

## Сценарии использования

### Сценарий 1: Первый запуск

```
1. Пользователь открывает Dashboard
2. Переходит на вкладку "AI Дневник"
3. Компонент FreeChat монтируется
4. useEffect проверяет localStorage для session_id
5. Не находит → вызывает startNewSession()
6. Создается новая сессия в базе
7. session_id сохраняется в localStorage
8. Инициализируется Realtime подписка
9. Отображается пустой чат с приветствием
10. Пользователь может начать общение
```

### Сценарий 2: Отправка сообщения

```
1. Пользователь вводит текст в FreeChatInput
2. Нажимает Enter или кнопку "Отправить"
3. handleSendMessage() вызывается
4. Сообщение добавляется в UI (оптимистичное обновление)
5. aiDiaryService.sendMessage() → INSERT в ai_diary_messages
6. Database trigger срабатывает
7. HTTP POST на n8n webhook
8. n8n получает данные
9. n8n загружает историю сообщений
10. n8n формирует запрос к OpenAI
11. OpenAI генерирует ответ
12. n8n парсит ответ (content + suggestions)
13. n8n INSERT в ai_diary_messages (message_type='ai')
14. Realtime уведомляет Frontend
15. onNewMessage() callback вызывается
16. Эффект печатания начинается
17. Текст постепенно отображается
18. Suggestions парсятся и отображаются как кнопки
19. Пользователь может кликнуть на suggestion → автозаполнение input
```

### Сценарий 3: Возвращение к сессии

```
1. Пользователь возвращается на страницу AI Дневника
2. useEffect проверяет localStorage
3. Находит session_id
4. Вызывает loadSessionHistory(session_id)
5. Загружает все сообщения из базы
6. Форматирует и отображает их
7. Восстанавливает Realtime подписку
8. Пользователь видит историю и может продолжить
```

### Сценарий 4: Новая сессия

```
1. Пользователь кликает "Новая сессия"
2. handleNewSession() вызывается
3. Если есть текущая сессия:
   - endSession() → UPDATE ended_at в базе
   - unsubscribe() от Realtime
4. startNewSession() создает новую запись
5. Новый session_id сохраняется в localStorage
6. chatMessages очищается
7. Новая Realtime подписка инициализируется
8. Toast уведомление "Начата новая сессия"
```

### Сценарий 5: Завершение сессии

```
1. Пользователь кликает "Завершить сессию"
2. handleEndSession() вызывается
3. UPDATE ai_diary_sessions SET ended_at = NOW()
4. localStorage.removeItem('ai_diary_session_id')
5. unsubscribe() от Realtime
6. chatMessages очищается
7. currentSessionId = null
8. Toast уведомление "Сессия завершена"
```

### Сценарий 6: Просмотр аналитики

```
1. Компонент FreeChat монтируется
2. useAIDiaryAnalytics() хук вызывается
3. Загружается userId из Supabase Auth
4. Параллельные запросы:
   - getUserStats(userId)
   - getTopTopics(userId, 5)
5. Данные обрабатываются:
   - Подсчет сессий
   - Среднее количество сообщений
   - Анализ топиков по ключевым словам
6. AIDiaryStats рендерит статистику
7. Отображаются:
   - Всего сессий
   - Среднее сообщений за сессию
   - Популярные темы с badges
```

---

## Безопасность

### Row Level Security (RLS)

**Политики для `ai_diary_sessions`:**

```sql
-- Чтение только своих сессий
CREATE POLICY "Users can view their own diary sessions"
  ON ai_diary_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Создание только своих сессий
CREATE POLICY "Users can create their own diary sessions"
  ON ai_diary_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Обновление только своих сессий
CREATE POLICY "Users can update their own diary sessions"
  ON ai_diary_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Удаление только своих сессий
CREATE POLICY "Users can delete their own diary sessions"
  ON ai_diary_sessions FOR DELETE
  USING (auth.uid() = user_id);
```

**Политики для `ai_diary_messages`:**

```sql
-- Чтение только своих сообщений
CREATE POLICY "Users can view their own diary messages"
  ON ai_diary_messages FOR SELECT
  USING (auth.uid() = user_id);

-- Создание только своих сообщений
CREATE POLICY "Users can create their own diary messages"
  ON ai_diary_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Обновление только своих сообщений
CREATE POLICY "Users can update their own diary messages"
  ON ai_diary_messages FOR UPDATE
  USING (auth.uid() = user_id);

-- Удаление только своих сообщений
CREATE POLICY "Users can delete their own diary messages"
  ON ai_diary_messages FOR DELETE
  USING (auth.uid() = user_id);
```

### Защита данных

**1. На уровне базы данных:**
- ✅ RLS включен для всех таблиц
- ✅ Пользователи видят только свои данные
- ✅ auth.uid() проверяется во всех политиках

**2. На уровне приложения:**
- ✅ Проверка аутентификации перед доступом
- ✅ Токены обновляются автоматически
- ✅ Session timeout настроен

**3. На уровне передачи данных:**
- ✅ HTTPS для всех запросов
- ✅ WSS (WebSocket Secure) для Realtime
- ✅ Токены не хранятся в localStorage

### Конфиденциальность

**Хранение данных:**
- Все сообщения шифруются в базе данных
- Доступ только через аутентифицированные запросы
- Нет логирования содержимого сообщений

**n8n интеграция:**
- Webhook защищен по HTTPS
- Нет хранения сообщений в n8n
- OpenAI API вызывается с ограничением хранения данных

**GDPR Compliance:**
- Пользователи могут удалить все свои данные
- Экспорт данных доступен через SQL запросы
- Право на забвение реализовано через CASCADE DELETE

---

## Производительность

### Оптимизации

**1. Database:**
- Индексы на часто запрашиваемых полях
- Limit и пагинация для больших выборок
- Оптимизированные RLS политики

**2. Frontend:**
- React.memo для компонентов
- useCallback для функций
- useMemo для вычислений
- Виртуализация списка сообщений (если >100)

**3. Realtime:**
- Фильтрация на уровне сервера (session_id)
- Подписка только на нужные события
- Автоматический reconnect

### Мониторинг

**Метрики для отслеживания:**
- Время ответа AI (от отправки до получения)
- Количество активных Realtime соединений
- Ошибки в триггерах
- Нагрузка на n8n webhook
- Использование OpenAI токенов

**Логирование:**
```typescript
// В production добавить:
console.log('[AI Diary] Message sent:', {
  sessionId,
  timestamp: Date.now()
});

console.log('[AI Diary] Response received:', {
  sessionId,
  responseTime: Date.now() - sentTime
});
```

---

## Будущие улучшения

### Возможные расширения:

**1. Голосовой ввод:**
- Speech-to-text API
- Транскрипция аудио сообщений
- Голосовые ответы от AI

**2. Расширенная аналитика:**
- Графики настроения по времени
- Тепловые карты активности
- Корреляции между темами и эмоциями
- Экспорт отчетов в PDF

**3. AI улучшения:**
- Контекстная память на основе профиля
- Персонализированные рекомендации
- Интеграция с другими дневниками (сон, настроение)
- Мультимодальность (анализ изображений)

**4. Совместная работа:**
- Шаринг сессий с терапевтом
- Комментарии от специалиста
- Видеозвонки в контексте дневника

**5. Офлайн режим:**
- Service Worker для кэширования
- IndexedDB для локального хранения
- Синхронизация при восстановлении связи

---

## Заключение

AI Дневник - это комплексная система, построенная на современных технологиях:
- **Realtime архитектура** для мгновенного получения ответов
- **Безопасность** через RLS и шифрование
- **Масштабируемость** благодаря Supabase и n8n
- **UX** с эффектом печатания и suggestions

Система готова к расширению и может быть адаптирована под различные терапевтические сценарии.
