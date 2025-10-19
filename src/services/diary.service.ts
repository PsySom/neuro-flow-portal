import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Validation schemas
export const createNoteSchema = z.object({
  text: z.string().trim().min(1, "Text cannot be empty").max(10000, "Text must be less than 10000 characters"),
  topics: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const createStructuredSchema = z.object({
  topic: z.string().trim().min(1, "Topic is required").max(100),
  context: z.string().trim().max(1000).optional(),
  metrics: z.array(z.object({
    key: z.string(),
    value: z.number(),
    norm_min: z.number().optional(),
    norm_max: z.number().optional(),
  })),
  emotions: z.array(z.object({
    label: z.string(),
    intensity: z.number().min(0).max(10),
  })).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type CreateStructuredInput = z.infer<typeof createStructuredSchema>;

export interface DiaryNote {
  id: string;
  user_id: string;
  text: string;
  topics: string[] | null;
  ai_suggestions: string[] | null;
  ai_followups: string[] | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface DiaryEntry {
  id: string;
  user_id: string;
  topic: string;
  context: string | null;
  ai_summary: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface DiaryMetric {
  id: number;
  entry_id: string;
  key: string;
  value: number;
  norm_min: number | null;
  norm_max: number | null;
}

export interface DiaryEmotion {
  id: number;
  entry_id: string;
  label: string;
  intensity: number | null;
}

export interface MetricSeriesPoint {
  user_id: string;
  ts: string;
  topic: string;
  key: string;
  value: number;
  norm_min: number | null;
  norm_max: number | null;
}

export interface DefaultNorm {
  metric_key: string;
  norm_min: number;
  norm_max: number;
}

export class DiaryService {
  async createNote(input: CreateNoteInput): Promise<DiaryNote> {
    const validated = createNoteSchema.parse(input);
    
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("diary_notes")
      .insert({
        user_id: user.user.id,
        text: validated.text,
        topics: validated.topics || [],
        metadata: validated.metadata || {},
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async listNotes(limit = 50): Promise<DiaryNote[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("diary_notes")
      .select("*")
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async createStructured(input: CreateStructuredInput): Promise<{
    entry: DiaryEntry;
    metrics: DiaryMetric[];
    emotions: DiaryEmotion[];
  }> {
    const validated = createStructuredSchema.parse(input);
    
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    // Create entry
    const { data: entry, error: entryError } = await supabase
      .from("diary_entries")
      .insert({
        user_id: user.user.id,
        topic: validated.topic,
        context: validated.context,
        metadata: validated.metadata || {},
      })
      .select()
      .single();

    if (entryError) throw entryError;

    // Create metrics
    const { data: metrics, error: metricsError } = await supabase
      .from("diary_entry_metrics")
      .insert(
        validated.metrics.map((m) => ({
          entry_id: entry.id,
          key: m.key,
          value: m.value,
          norm_min: m.norm_min,
          norm_max: m.norm_max,
        }))
      )
      .select();

    if (metricsError) throw metricsError;

    // Create emotions if provided
    let emotions: DiaryEmotion[] = [];
    if (validated.emotions && validated.emotions.length > 0) {
      const { data: emotionsData, error: emotionsError } = await supabase
        .from("diary_entry_emotions")
        .insert(
          validated.emotions.map((e) => ({
            entry_id: entry.id,
            label: e.label,
            intensity: e.intensity,
          }))
        )
        .select();

      if (emotionsError) throw emotionsError;
      emotions = emotionsData || [];
    }

    return { entry, metrics: metrics || [], emotions };
  }

  async listStructured(limit = 50): Promise<DiaryEntry[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("diary_entries")
      .select("*")
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async listMetricSeries(metricKey?: string, limit = 100): Promise<MetricSeriesPoint[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    let query = supabase
      .from("v_diary_metrics_timeseries")
      .select("*")
      .eq("user_id", user.user.id)
      .order("ts", { ascending: false })
      .limit(limit);

    if (metricKey) {
      query = query.eq("key", metricKey);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getDefaultNorms(): Promise<DefaultNorm[]> {
    const { data, error } = await supabase
      .from("v_default_norms")
      .select("*");

    if (error) throw error;
    return data || [];
  }
}

export const diaryService = new DiaryService();
