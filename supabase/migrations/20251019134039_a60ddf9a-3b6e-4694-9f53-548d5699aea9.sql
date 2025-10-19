-- Create ENUM types (idempotent)
DO $$ BEGIN 
  CREATE TYPE tracker_scope AS ENUM ('day','day_part','activity'); 
EXCEPTION 
  WHEN duplicate_object THEN NULL; 
END $$;

DO $$ BEGIN 
  CREATE TYPE day_part AS ENUM ('morning','afternoon','evening'); 
EXCEPTION 
  WHEN duplicate_object THEN NULL; 
END $$;

-- Create diary_notes table
CREATE TABLE IF NOT EXISTS diary_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  text text NOT NULL,
  topics text[] DEFAULT '{}',
  ai_suggestions text[] DEFAULT '{}',
  ai_followups text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_diary_notes_user ON diary_notes(user_id, created_at DESC);

-- Enable RLS on diary_notes
ALTER TABLE diary_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own diary notes" ON diary_notes;
CREATE POLICY "Users can view their own diary notes"
  ON diary_notes FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own diary notes" ON diary_notes;
CREATE POLICY "Users can create their own diary notes"
  ON diary_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own diary notes" ON diary_notes;
CREATE POLICY "Users can update their own diary notes"
  ON diary_notes FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own diary notes" ON diary_notes;
CREATE POLICY "Users can delete their own diary notes"
  ON diary_notes FOR DELETE
  USING (auth.uid() = user_id);

-- Create diary_entries table
CREATE TABLE IF NOT EXISTS diary_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  topic text NOT NULL,
  context text,
  ai_summary text,
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_diary_entries_user ON diary_entries(user_id, created_at DESC);

-- Enable RLS on diary_entries
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own diary entries" ON diary_entries;
CREATE POLICY "Users can view their own diary entries"
  ON diary_entries FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own diary entries" ON diary_entries;
CREATE POLICY "Users can create their own diary entries"
  ON diary_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own diary entries" ON diary_entries;
CREATE POLICY "Users can update their own diary entries"
  ON diary_entries FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own diary entries" ON diary_entries;
CREATE POLICY "Users can delete their own diary entries"
  ON diary_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Create diary_entry_metrics table
CREATE TABLE IF NOT EXISTS diary_entry_metrics (
  id bigserial PRIMARY KEY,
  entry_id uuid NOT NULL REFERENCES diary_entries(id) ON DELETE CASCADE,
  key text NOT NULL,
  value numeric NOT NULL,
  norm_min numeric,
  norm_max numeric
);

CREATE INDEX IF NOT EXISTS idx_diary_metrics_entry ON diary_entry_metrics(entry_id);

-- Enable RLS on diary_entry_metrics
ALTER TABLE diary_entry_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view metrics for their entries" ON diary_entry_metrics;
CREATE POLICY "Users can view metrics for their entries"
  ON diary_entry_metrics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM diary_entries 
    WHERE diary_entries.id = diary_entry_metrics.entry_id 
    AND diary_entries.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can create metrics for their entries" ON diary_entry_metrics;
CREATE POLICY "Users can create metrics for their entries"
  ON diary_entry_metrics FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM diary_entries 
    WHERE diary_entries.id = diary_entry_metrics.entry_id 
    AND diary_entries.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update metrics for their entries" ON diary_entry_metrics;
CREATE POLICY "Users can update metrics for their entries"
  ON diary_entry_metrics FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM diary_entries 
    WHERE diary_entries.id = diary_entry_metrics.entry_id 
    AND diary_entries.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete metrics for their entries" ON diary_entry_metrics;
CREATE POLICY "Users can delete metrics for their entries"
  ON diary_entry_metrics FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM diary_entries 
    WHERE diary_entries.id = diary_entry_metrics.entry_id 
    AND diary_entries.user_id = auth.uid()
  ));

-- Create diary_entry_emotions table
CREATE TABLE IF NOT EXISTS diary_entry_emotions (
  id bigserial PRIMARY KEY,
  entry_id uuid NOT NULL REFERENCES diary_entries(id) ON DELETE CASCADE,
  label text NOT NULL,
  intensity numeric
);

-- Enable RLS on diary_entry_emotions
ALTER TABLE diary_entry_emotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view emotions for their entries" ON diary_entry_emotions;
CREATE POLICY "Users can view emotions for their entries"
  ON diary_entry_emotions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM diary_entries 
    WHERE diary_entries.id = diary_entry_emotions.entry_id 
    AND diary_entries.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can create emotions for their entries" ON diary_entry_emotions;
CREATE POLICY "Users can create emotions for their entries"
  ON diary_entry_emotions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM diary_entries 
    WHERE diary_entries.id = diary_entry_emotions.entry_id 
    AND diary_entries.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update emotions for their entries" ON diary_entry_emotions;
CREATE POLICY "Users can update emotions for their entries"
  ON diary_entry_emotions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM diary_entries 
    WHERE diary_entries.id = diary_entry_emotions.entry_id 
    AND diary_entries.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete emotions for their entries" ON diary_entry_emotions;
CREATE POLICY "Users can delete emotions for their entries"
  ON diary_entry_emotions FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM diary_entries 
    WHERE diary_entries.id = diary_entry_emotions.entry_id 
    AND diary_entries.user_id = auth.uid()
  ));

-- Create metric_alerts table
CREATE TABLE IF NOT EXISTS metric_alerts (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_id uuid NOT NULL REFERENCES diary_entries(id) ON DELETE CASCADE,
  metric_key text NOT NULL,
  value numeric NOT NULL,
  norm_min numeric,
  norm_max numeric,
  created_at timestamptz DEFAULT now(),
  delivered boolean DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_metric_alerts_user ON metric_alerts(user_id, created_at DESC);

-- Enable RLS on metric_alerts
ALTER TABLE metric_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own metric alerts" ON metric_alerts;
CREATE POLICY "Users can view their own metric alerts"
  ON metric_alerts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own metric alerts" ON metric_alerts;
CREATE POLICY "Users can update their own metric alerts"
  ON metric_alerts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own metric alerts" ON metric_alerts;
CREATE POLICY "Users can delete their own metric alerts"
  ON metric_alerts FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create metric alerts" ON metric_alerts;
CREATE POLICY "System can create metric alerts"
  ON metric_alerts FOR INSERT
  WITH CHECK (true);

-- Create function to check metric norms
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS t_check_metric_norms ON diary_entry_metrics;
CREATE TRIGGER t_check_metric_norms
AFTER INSERT OR UPDATE ON diary_entry_metrics
FOR EACH ROW EXECUTE FUNCTION check_metric_norms();