-- Fix security warning: add search_path to check_metric_norms function
CREATE OR REPLACE FUNCTION check_metric_norms()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.norm_min IS NOT NULL AND NEW.value < NEW.norm_min)
     OR (NEW.norm_max IS NOT NULL AND NEW.value > NEW.norm_max) THEN
    INSERT INTO metric_alerts (user_id, entry_id, metric_key, value, norm_min, norm_max)
      SELECT e.user_id, NEW.entry_id, NEW.key, NEW.value, NEW.norm_min, NEW.norm_max
      FROM diary_entries e WHERE e.id = NEW.entry_id;
  END IF;
  RETURN NEW;
END; 
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;