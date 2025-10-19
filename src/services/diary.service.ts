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

export interface DiaryHistoryFilters {
  type?: "all" | "notes" | "structured";
  topic?: string;
  startDate?: string;
  endDate?: string;
  onlyOutOfNorm?: boolean;
  limit?: number;
  offset?: number;
}

export interface DiaryHistoryItem {
  id: string;
  type: "note" | "structured";
  created_at: string;
  content: string;
  topic?: string;
  topics?: string[];
  hasOutOfNormMetrics?: boolean;
  metrics?: DiaryMetric[];
  emotions?: DiaryEmotion[];
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

  async getDiaryHistory(filters: DiaryHistoryFilters = {}): Promise<{
    items: DiaryHistoryItem[];
    total: number;
  }> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    const items: DiaryHistoryItem[] = [];

    // Fetch notes if needed
    if (filters.type === "all" || filters.type === "notes" || !filters.type) {
      let notesQuery = supabase
        .from("diary_notes")
        .select("*", { count: "exact" })
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (filters.startDate) {
        notesQuery = notesQuery.gte("created_at", filters.startDate);
      }
      if (filters.endDate) {
        notesQuery = notesQuery.lte("created_at", filters.endDate);
      }

      const { data: notes } = await notesQuery.limit(limit);

      if (notes) {
        items.push(
          ...notes.map((note) => ({
            id: note.id,
            type: "note" as const,
            created_at: note.created_at,
            content: note.text,
            topics: note.topics || [],
          }))
        );
      }
    }

    // Fetch structured entries if needed
    if (filters.type === "all" || filters.type === "structured" || !filters.type) {
      let entriesQuery = supabase
        .from("diary_entries")
        .select("*, diary_entry_metrics(*)", { count: "exact" })
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (filters.topic) {
        entriesQuery = entriesQuery.eq("topic", filters.topic);
      }
      if (filters.startDate) {
        entriesQuery = entriesQuery.gte("created_at", filters.startDate);
      }
      if (filters.endDate) {
        entriesQuery = entriesQuery.lte("created_at", filters.endDate);
      }

      const { data: entries } = await entriesQuery.limit(limit);

      if (entries) {
        const defaultNorms = await this.getDefaultNorms();

        for (const entry of entries) {
          const metrics = (entry.diary_entry_metrics as any[]) || [];
          
          // Check if any metric is out of norm
          const hasOutOfNormMetrics = metrics.some((m) => {
            const norm = defaultNorms.find((n) => n.metric_key === m.key);
            if (!norm && !m.norm_min && !m.norm_max) return false;
            
            const min = m.norm_min ?? norm?.norm_min ?? -Infinity;
            const max = m.norm_max ?? norm?.norm_max ?? Infinity;
            
            return m.value < min || m.value > max;
          });

          // Only include if not filtering by onlyOutOfNorm, or if it matches the filter
          if (!filters.onlyOutOfNorm || hasOutOfNormMetrics) {
            items.push({
              id: entry.id,
              type: "structured" as const,
              created_at: entry.created_at,
              content: entry.context || "",
              topic: entry.topic,
              hasOutOfNormMetrics,
              metrics,
            });
          }
        }
      }
    }

    // Sort by date and apply pagination
    items.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const paginatedItems = items.slice(offset, offset + limit);

    return {
      items: paginatedItems,
      total: items.length,
    };
  }

  async updateNoteTopics(noteId: string, topics: string[]): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("diary_notes")
      .update({ topics })
      .eq("id", noteId)
      .eq("user_id", user.user.id);

    if (error) throw error;
  }

  async updateEntryContext(entryId: string, context: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("diary_entries")
      .update({ context })
      .eq("id", entryId)
      .eq("user_id", user.user.id);

    if (error) throw error;
  }
}

export const diaryService = new DiaryService();
