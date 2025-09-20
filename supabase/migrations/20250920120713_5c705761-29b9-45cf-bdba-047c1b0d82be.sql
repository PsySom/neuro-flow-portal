-- Создаем таблицу для записей дневника сна
CREATE TABLE public.sleep_diary_entries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    bedtime TIME NOT NULL,
    wake_up_time TIME NOT NULL,
    sleep_duration DECIMAL(4,2) NOT NULL,
    sleep_quality INTEGER NOT NULL CHECK (sleep_quality >= -5 AND sleep_quality <= 5),
    night_awakenings INTEGER NOT NULL DEFAULT 0,
    morning_feeling INTEGER NOT NULL CHECK (morning_feeling >= 1 AND morning_feeling <= 10),
    has_day_rest BOOLEAN NOT NULL DEFAULT false,
    day_rest_type TEXT,
    day_rest_effectiveness INTEGER CHECK (day_rest_effectiveness >= 1 AND day_rest_effectiveness <= 10),
    overall_sleep_impact INTEGER NOT NULL CHECK (overall_sleep_impact >= -5 AND overall_sleep_impact <= 5),
    sleep_disruptors TEXT[] DEFAULT ARRAY[]::TEXT[],
    sleep_comment TEXT,
    rest_comment TEXT,
    recommendations TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем Row Level Security
ALTER TABLE public.sleep_diary_entries ENABLE ROW LEVEL SECURITY;

-- Политики RLS - пользователи могут видеть только свои записи
CREATE POLICY "Users can view their own sleep diary entries" 
ON public.sleep_diary_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sleep diary entries" 
ON public.sleep_diary_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep diary entries" 
ON public.sleep_diary_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep diary entries" 
ON public.sleep_diary_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Создаем индекс для быстрого поиска записей пользователя
CREATE INDEX idx_sleep_diary_entries_user_id_created_at 
ON public.sleep_diary_entries (user_id, created_at DESC);

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_sleep_diary_entries_updated_at
    BEFORE UPDATE ON public.sleep_diary_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();