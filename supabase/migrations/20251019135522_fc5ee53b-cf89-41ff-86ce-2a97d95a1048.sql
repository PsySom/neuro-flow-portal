-- Create view for default norms
CREATE OR REPLACE VIEW v_default_norms AS
SELECT * FROM (VALUES
  ('mood'::text, 4::numeric, 8::numeric),
  ('stress',     0,          6),
  ('energy',     4,          8),
  ('sleep_quality',6,        9),
  ('morning_feeling',6,      9),
  ('overall_sleep_impact',5, 9)
) AS t(metric_key, norm_min, norm_max);

-- Create view for diary metrics timeseries with norms
CREATE OR REPLACE VIEW v_diary_metrics_timeseries AS
SELECT e.user_id, e.created_at AS ts, e.topic, m.key, m.value,
       COALESCE(m.norm_min, d.norm_min) AS norm_min,
       COALESCE(m.norm_max, d.norm_max) AS norm_max
FROM diary_entries e
JOIN diary_entry_metrics m ON m.entry_id = e.id
LEFT JOIN v_default_norms d ON d.metric_key = m.key;