-- Create function to insert test mood diary entries for the current user
CREATE OR REPLACE FUNCTION insert_test_mood_entries()
RETURNS TABLE(inserted_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Insert test entries for today
  INSERT INTO mood_diary_entries (
    user_id,
    mood_score,
    emotions,
    created_at,
    updated_at
  ) VALUES 
    -- 08:00 - Morning entry
    (
      auth.uid(), 
      7, 
      '["Бодрость", "Оптимизм"]'::jsonb,
      date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE 'UTC') + INTERVAL '8 hours',
      date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE 'UTC') + INTERVAL '8 hours'
    ),
    -- 11:30 - Mid-day entry
    (
      auth.uid(), 
      5, 
      '["Спокойствие", "Концентрация"]'::jsonb,
      date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE 'UTC') + INTERVAL '11 hours 30 minutes',
      date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE 'UTC') + INTERVAL '11 hours 30 minutes'
    ),
    -- 15:00 - Afternoon entry
    (
      auth.uid(), 
      8, 
      '["Удовлетворённость", "Энергичность"]'::jsonb,
      date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE 'UTC') + INTERVAL '15 hours',
      date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE 'UTC') + INTERVAL '15 hours'
    );

  GET DIAGNOSTICS v_count = ROW_COUNT;
  
  RETURN QUERY SELECT v_count;
END;
$$;