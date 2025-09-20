-- Create mood_diary_entries table for storing mood diary data
CREATE TABLE public.mood_diary_entries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mood_score INTEGER NOT NULL CHECK (mood_score >= -10 AND mood_score <= 10),
    emotions JSONB NOT NULL DEFAULT '[]'::jsonb,
    triggers TEXT[] DEFAULT '{}',
    physical_sensations TEXT[] DEFAULT '{}',
    body_areas TEXT[] DEFAULT '{}',
    context TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.mood_diary_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for mood_diary_entries
CREATE POLICY "Users can view their own mood diary entries"
ON public.mood_diary_entries
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mood diary entries"
ON public.mood_diary_entries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood diary entries"
ON public.mood_diary_entries
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood diary entries"
ON public.mood_diary_entries
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updating updated_at column
CREATE TRIGGER update_mood_diary_entries_updated_at
    BEFORE UPDATE ON public.mood_diary_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_mood_diary_entries_user_id ON public.mood_diary_entries(user_id);
CREATE INDEX idx_mood_diary_entries_created_at ON public.mood_diary_entries(created_at);
CREATE INDEX idx_mood_diary_entries_mood_score ON public.mood_diary_entries(mood_score);

-- Add some sample data for demonstration (optional - will be inserted for current user if they're authenticated)
-- This is just for development/testing purposes