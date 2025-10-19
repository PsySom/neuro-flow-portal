-- Create activity_kind enum
DO $$ BEGIN 
  CREATE TYPE activity_kind AS ENUM ('restorative','neutral','mixed','depleting'); 
EXCEPTION 
  WHEN duplicate_object THEN NULL; 
END $$;

-- Extend activities table
ALTER TABLE activities
  ADD COLUMN IF NOT EXISTS kind activity_kind,
  ADD COLUMN IF NOT EXISTS planned_at timestamptz,
  ADD COLUMN IF NOT EXISTS from_template_id bigint,
  ADD COLUMN IF NOT EXISTS calendar_provider text,
  ADD COLUMN IF NOT EXISTS calendar_event_id text,
  ADD COLUMN IF NOT EXISTS calendar_sync_status text;

-- Create activity_templates table
CREATE TABLE IF NOT EXISTS activity_templates (
  id bigserial PRIMARY KEY,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  kind activity_kind NOT NULL,
  default_notes text,
  metadata jsonb DEFAULT '{}',
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create four_scale_trackers table
CREATE TABLE IF NOT EXISTS four_scale_trackers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scope tracker_scope NOT NULL,
  date date NOT NULL,
  day_part day_part,
  activity_id uuid REFERENCES activities(id) ON DELETE SET NULL,
  process_satisfaction numeric NOT NULL CHECK (process_satisfaction >= 0 AND process_satisfaction <= 10),
  result_satisfaction  numeric NOT NULL CHECK (result_satisfaction >= 0 AND result_satisfaction <= 10),
  energy_cost          numeric NOT NULL CHECK (energy_cost >= 0 AND energy_cost <= 10),
  stress_level         numeric NOT NULL CHECK (stress_level >= 0 AND stress_level <= 10),
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

-- Create indexes for four_scale_trackers
CREATE INDEX IF NOT EXISTS idx_four_scales_user_date ON four_scale_trackers(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_four_scales_activity ON four_scale_trackers(activity_id);

-- Enable RLS on new tables
ALTER TABLE activity_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE four_scale_trackers ENABLE ROW LEVEL SECURITY;

-- RLS policies for activity_templates
DROP POLICY IF EXISTS "Templates: users can view public or own" ON activity_templates;
CREATE POLICY "Templates: users can view public or own"
  ON activity_templates FOR SELECT
  USING (is_public = true OR created_by = auth.uid());

DROP POLICY IF EXISTS "Templates: users can create own" ON activity_templates;
CREATE POLICY "Templates: users can create own"
  ON activity_templates FOR INSERT
  WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Templates: users can update own" ON activity_templates;
CREATE POLICY "Templates: users can update own"
  ON activity_templates FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Templates: users can delete own" ON activity_templates;
CREATE POLICY "Templates: users can delete own"
  ON activity_templates FOR DELETE
  USING (created_by = auth.uid());

-- RLS policies for four_scale_trackers
DROP POLICY IF EXISTS "Users can view own trackers" ON four_scale_trackers;
CREATE POLICY "Users can view own trackers"
  ON four_scale_trackers FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own trackers" ON four_scale_trackers;
CREATE POLICY "Users can create own trackers"
  ON four_scale_trackers FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own trackers" ON four_scale_trackers;
CREATE POLICY "Users can update own trackers"
  ON four_scale_trackers FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own trackers" ON four_scale_trackers;
CREATE POLICY "Users can delete own trackers"
  ON four_scale_trackers FOR DELETE
  USING (user_id = auth.uid());