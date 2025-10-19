-- Migration: Transfer old mood and sleep diary entries to unified diary model
-- This migration will run in two phases: dry-run (10 records) and full migration

-- Phase 1: Dry-run migration (10 records from each table)
-- Uncomment the next line to run full migration after verifying dry-run
-- SET LOCAL app.migration_mode = 'full';

DO $$
DECLARE
  v_migration_mode TEXT := COALESCE(current_setting('app.migration_mode', true), 'dry-run');
  v_limit INTEGER := CASE WHEN v_migration_mode = 'full' THEN NULL ELSE 10 END;
  v_mood_migrated INTEGER := 0;
  v_sleep_migrated INTEGER := 0;
  v_mood_record RECORD;
  v_sleep_record RECORD;
  v_new_entry_id UUID;
  v_default_norms RECORD;
BEGIN
  RAISE NOTICE 'Starting migration in % mode', v_migration_mode;

  -- Migrate mood_diary_entries
  FOR v_mood_record IN (
    SELECT *
    FROM mood_diary_entries mde
    WHERE NOT EXISTS (
      SELECT 1 FROM diary_entries de
      WHERE de.metadata->>'migrated_from_table' = 'mood_diary_entries'
        AND de.metadata->>'migrated_from_id' = mde.id::text
    )
    ORDER BY created_at
    LIMIT v_limit
  )
  LOOP
    -- Get default norms for mood metric
    SELECT norm_min, norm_max INTO v_default_norms
    FROM v_default_norms
    WHERE metric_key = 'mood'
    LIMIT 1;

    -- Insert diary_entry
    INSERT INTO diary_entries (
      user_id,
      topic,
      context,
      created_at,
      metadata
    ) VALUES (
      v_mood_record.user_id,
      'mood',
      COALESCE(v_mood_record.notes, v_mood_record.context, ''),
      v_mood_record.created_at,
      jsonb_build_object(
        'migrated_from_table', 'mood_diary_entries',
        'migrated_from_id', v_mood_record.id::text,
        'migration_timestamp', now(),
        'original_emotions', v_mood_record.emotions,
        'original_triggers', v_mood_record.triggers,
        'original_physical_sensations', v_mood_record.physical_sensations,
        'original_body_areas', v_mood_record.body_areas
      )
    )
    RETURNING id INTO v_new_entry_id;

    -- Insert mood metric
    INSERT INTO diary_entry_metrics (
      entry_id,
      key,
      value,
      norm_min,
      norm_max
    ) VALUES (
      v_new_entry_id,
      'mood',
      v_mood_record.mood_score,
      COALESCE(v_default_norms.norm_min, 1),
      COALESCE(v_default_norms.norm_max, 10)
    );

    v_mood_migrated := v_mood_migrated + 1;
  END LOOP;

  RAISE NOTICE 'Migrated % mood diary entries', v_mood_migrated;

  -- Migrate sleep_diary_entries
  FOR v_sleep_record IN (
    SELECT *
    FROM sleep_diary_entries sde
    WHERE NOT EXISTS (
      SELECT 1 FROM diary_entries de
      WHERE de.metadata->>'migrated_from_table' = 'sleep_diary_entries'
        AND de.metadata->>'migrated_from_id' = sde.id::text
    )
    ORDER BY created_at
    LIMIT v_limit
  )
  LOOP
    -- Insert diary_entry
    INSERT INTO diary_entries (
      user_id,
      topic,
      context,
      created_at,
      metadata
    ) VALUES (
      v_sleep_record.user_id,
      'sleep',
      COALESCE(v_sleep_record.sleep_comment, v_sleep_record.rest_comment, ''),
      v_sleep_record.created_at,
      jsonb_build_object(
        'migrated_from_table', 'sleep_diary_entries',
        'migrated_from_id', v_sleep_record.id::text,
        'migration_timestamp', now(),
        'original_bedtime', v_sleep_record.bedtime,
        'original_wake_up_time', v_sleep_record.wake_up_time,
        'original_sleep_duration', v_sleep_record.sleep_duration,
        'original_night_awakenings', v_sleep_record.night_awakenings,
        'original_sleep_disruptors', v_sleep_record.sleep_disruptors,
        'original_has_day_rest', v_sleep_record.has_day_rest,
        'original_day_rest_type', v_sleep_record.day_rest_type,
        'original_day_rest_effectiveness', v_sleep_record.day_rest_effectiveness,
        'original_recommendations', v_sleep_record.recommendations
      )
    )
    RETURNING id INTO v_new_entry_id;

    -- Insert sleep_quality metric
    SELECT norm_min, norm_max INTO v_default_norms
    FROM v_default_norms
    WHERE metric_key = 'sleep_quality'
    LIMIT 1;

    INSERT INTO diary_entry_metrics (
      entry_id,
      key,
      value,
      norm_min,
      norm_max
    ) VALUES (
      v_new_entry_id,
      'sleep_quality',
      v_sleep_record.sleep_quality,
      COALESCE(v_default_norms.norm_min, 1),
      COALESCE(v_default_norms.norm_max, 10)
    );

    -- Insert morning_feeling metric
    SELECT norm_min, norm_max INTO v_default_norms
    FROM v_default_norms
    WHERE metric_key = 'morning_feeling'
    LIMIT 1;

    INSERT INTO diary_entry_metrics (
      entry_id,
      key,
      value,
      norm_min,
      norm_max
    ) VALUES (
      v_new_entry_id,
      'morning_feeling',
      v_sleep_record.morning_feeling,
      COALESCE(v_default_norms.norm_min, 1),
      COALESCE(v_default_norms.norm_max, 10)
    );

    -- Insert overall_sleep_impact metric
    SELECT norm_min, norm_max INTO v_default_norms
    FROM v_default_norms
    WHERE metric_key = 'overall_sleep_impact'
    LIMIT 1;

    INSERT INTO diary_entry_metrics (
      entry_id,
      key,
      value,
      norm_min,
      norm_max
    ) VALUES (
      v_new_entry_id,
      'overall_sleep_impact',
      v_sleep_record.overall_sleep_impact,
      COALESCE(v_default_norms.norm_min, 1),
      COALESCE(v_default_norms.norm_max, 10)
    );

    v_sleep_migrated := v_sleep_migrated + 1;
  END LOOP;

  RAISE NOTICE 'Migrated % sleep diary entries', v_sleep_migrated;
  RAISE NOTICE 'Total migrated: % entries', v_mood_migrated + v_sleep_migrated;
  RAISE NOTICE 'To run full migration, execute: SET LOCAL app.migration_mode = ''full''; then run this migration again';
END $$;