-- Create view for daily RLI (Recovery-Load Index)
CREATE OR REPLACE VIEW v_daily_rli AS
WITH src AS (
  SELECT f.user_id, f.date,
         a.kind,
         f.process_satisfaction AS process,
         f.result_satisfaction  AS result,
         f.energy_cost          AS energy,
         f.stress_level         AS stress
  FROM four_scale_trackers f
  LEFT JOIN activities a ON a.id = f.activity_id
  WHERE f.scope = 'activity'
)
SELECT user_id, date,
  SUM(CASE kind
        WHEN 'restorative' THEN 2.0 
        WHEN 'neutral' THEN 0.5 
        WHEN 'mixed' THEN 1.0 
        WHEN 'depleting' THEN 0.0 
        ELSE 0 
      END
      + 0.3*process + 0.2*result) AS day_recovery,
  SUM(CASE kind
        WHEN 'depleting' THEN 2.0 
        WHEN 'mixed' THEN 0.8 
        WHEN 'neutral' THEN 0.2 
        WHEN 'restorative' THEN 0.0 
        ELSE 0 
      END
      + 0.3*energy + 0.4*stress) AS day_strain
FROM src
GROUP BY user_id, date;