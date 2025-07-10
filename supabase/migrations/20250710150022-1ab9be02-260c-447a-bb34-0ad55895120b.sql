-- Enable realtime for activities table
ALTER TABLE public.activities REPLICA IDENTITY FULL;

-- Add activities table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;

-- Add activity_states table to realtime publication  
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_states;

-- Create trigger to update updated_at column for activities
CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON public.activities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to update updated_at column for activity_states
CREATE TRIGGER update_activity_states_updated_at
    BEFORE UPDATE ON public.activity_states
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle activity status changes
CREATE OR REPLACE FUNCTION public.update_activity_status(
    activity_id UUID,
    new_status TEXT,
    user_notes TEXT DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    title TEXT,
    status TEXT,
    updated_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update activity status
    UPDATE public.activities 
    SET 
        status = new_status,
        updated_at = NOW()
    WHERE activities.id = activity_id 
    AND activities.user_id = auth.uid();
    
    -- Insert or update activity state
    INSERT INTO public.activity_states (
        activity_id,
        user_id,
        state,
        notes,
        created_at,
        updated_at
    ) VALUES (
        activity_id,
        auth.uid(),
        new_status,
        user_notes,
        NOW(),
        NOW()
    )
    ON CONFLICT (activity_id, user_id) 
    DO UPDATE SET
        state = EXCLUDED.state,
        notes = EXCLUDED.notes,
        updated_at = NOW();
    
    -- Return updated activity
    RETURN QUERY
    SELECT 
        a.id,
        a.title,
        a.status,
        a.updated_at
    FROM public.activities a
    WHERE a.id = activity_id 
    AND a.user_id = auth.uid();
END;
$$;