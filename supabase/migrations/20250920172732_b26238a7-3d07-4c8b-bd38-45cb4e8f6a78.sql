-- Исправление критической уязвимости безопасности AI дневника
-- Заменяем открытые политики доступа на безопасные RLS политики

-- ========================================
-- Удаляем небезопасные "открытые" политики
-- ========================================

-- Удаляем открытую политику для ai_diary_messages
DROP POLICY IF EXISTS "Open access messages" ON public.ai_diary_messages;

-- Удаляем открытую политику для ai_diary_sessions  
DROP POLICY IF EXISTS "Open access sessions" ON public.ai_diary_sessions;

-- ========================================
-- Создаем безопасные RLS политики для ai_diary_messages
-- ========================================

-- Пользователи могут просматривать только свои сообщения
CREATE POLICY "Users can view their own diary messages" 
ON public.ai_diary_messages 
FOR SELECT 
USING (auth.uid() = user_id);

-- Пользователи могут создавать только свои сообщения
CREATE POLICY "Users can create their own diary messages" 
ON public.ai_diary_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Пользователи могут обновлять только свои сообщения
CREATE POLICY "Users can update their own diary messages" 
ON public.ai_diary_messages 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Пользователи могут удалять только свои сообщения
CREATE POLICY "Users can delete their own diary messages" 
ON public.ai_diary_messages 
FOR DELETE 
USING (auth.uid() = user_id);

-- ========================================
-- Создаем безопасные RLS политики для ai_diary_sessions
-- ========================================

-- Пользователи могут просматривать только свои сессии
CREATE POLICY "Users can view their own diary sessions" 
ON public.ai_diary_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Пользователи могут создавать только свои сессии
CREATE POLICY "Users can create their own diary sessions" 
ON public.ai_diary_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Пользователи могут обновлять только свои сессии
CREATE POLICY "Users can update their own diary sessions" 
ON public.ai_diary_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Пользователи могут удалять только свои сессии
CREATE POLICY "Users can delete their own diary sessions" 
ON public.ai_diary_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- ========================================
-- Проверяем, что RLS включен (должен быть уже включен)
-- ========================================

-- Убеждаемся, что RLS включен для ai_diary_messages
ALTER TABLE public.ai_diary_messages ENABLE ROW LEVEL SECURITY;

-- Убеждаемся, что RLS включен для ai_diary_sessions
ALTER TABLE public.ai_diary_sessions ENABLE ROW LEVEL SECURITY;