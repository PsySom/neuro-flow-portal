-- Create activities table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  activity_type_id INTEGER NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity types table
CREATE TABLE public.activity_types (
  id INTEGER NOT NULL DEFAULT nextval('activity_types_id_seq'::regclass) PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  icon TEXT NOT NULL DEFAULT '📝',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sequence for activity types
CREATE SEQUENCE public.activity_types_id_seq AS INTEGER START WITH 1 INCREMENT BY 1;

-- Create activity states table
CREATE TABLE public.activity_states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  state TEXT NOT NULL DEFAULT 'planned' CHECK (state IN ('planned', 'in_progress', 'completed', 'skipped')),
  mood_before INTEGER CHECK (mood_before BETWEEN 1 AND 10),
  mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 10),
  energy_before INTEGER CHECK (energy_before BETWEEN 1 AND 10),
  energy_after INTEGER CHECK (energy_after BETWEEN 1 AND 10),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_states ENABLE ROW LEVEL SECURITY;

-- Create policies for activities
CREATE POLICY "Users can view their own activities" 
ON public.activities 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" 
ON public.activities 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities" 
ON public.activities 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities" 
ON public.activities 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for activity types (viewable by everyone, manageable by authenticated users)
CREATE POLICY "Activity types are viewable by everyone" 
ON public.activity_types 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create activity types" 
ON public.activity_types 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update activity types" 
ON public.activity_types 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create policies for activity states
CREATE POLICY "Users can view their own activity states" 
ON public.activity_states 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity states" 
ON public.activity_states 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity states" 
ON public.activity_states 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activity states" 
ON public.activity_states 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON public.activities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activity_types_updated_at
    BEFORE UPDATE ON public.activity_types
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activity_states_updated_at
    BEFORE UPDATE ON public.activity_states
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default activity types
INSERT INTO public.activity_types (id, name, description, color, icon) VALUES
(1, 'задача', 'Истощающие активности (дела)', '#EF4444', '📋'),
(2, 'восстановление', 'Восстанавливающие активности', '#10B981', '🌱'),
(3, 'нейтральная', 'Нейтральные активности', '#3B82F6', '⚪'),
(4, 'смешанная', 'Смешанные активности', '#F59E0B', '🔄');

-- Set sequence current value
SELECT setval('public.activity_types_id_seq', 5);