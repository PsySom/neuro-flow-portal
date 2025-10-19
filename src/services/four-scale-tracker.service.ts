import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const trackerScopeSchema = z.enum(["activity", "day", "day_part"]);
export const dayPartSchema = z.enum(["morning", "afternoon", "evening"]);

export const createTrackerSchema = z.object({
  scope: trackerScopeSchema,
  date: z.string(),
  day_part: dayPartSchema.optional(),
  activity_id: z.string().optional(),
  process_satisfaction: z.number().min(0).max(10),
  result_satisfaction: z.number().min(0).max(10),
  energy_cost: z.number().min(0).max(10),
  stress_level: z.number().min(0).max(10),
  metadata: z.record(z.unknown()).optional(),
});

export type TrackerScope = z.infer<typeof trackerScopeSchema>;
export type DayPart = z.infer<typeof dayPartSchema>;
export type CreateTrackerInput = z.infer<typeof createTrackerSchema>;

export interface FourScaleTracker {
  id: string;
  user_id: string;
  scope: TrackerScope;
  date: string;
  day_part: DayPart | null;
  activity_id: string | null;
  process_satisfaction: number;
  result_satisfaction: number;
  energy_cost: number;
  stress_level: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

class FourScaleTrackerService {
  async create(input: CreateTrackerInput): Promise<FourScaleTracker> {
    const validated = createTrackerSchema.parse(input);
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    // Validate scope-specific requirements
    if (validated.scope === "activity" && !validated.activity_id) {
      throw new Error("activity_id is required for activity scope");
    }
    if (validated.scope === "day_part" && !validated.day_part) {
      throw new Error("day_part is required for day_part scope");
    }

    const { data, error } = await supabase
      .from("four_scale_trackers")
      .insert({
        user_id: user.user.id,
        ...validated,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getForActivity(activityId: string): Promise<FourScaleTracker | null> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("four_scale_trackers")
      .select("*")
      .eq("user_id", user.user.id)
      .eq("activity_id", activityId)
      .eq("scope", "activity")
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getForDay(date: string): Promise<FourScaleTracker | null> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("four_scale_trackers")
      .select("*")
      .eq("user_id", user.user.id)
      .eq("date", date)
      .eq("scope", "day")
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getForDayPart(date: string, dayPart: DayPart): Promise<FourScaleTracker | null> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("four_scale_trackers")
      .select("*")
      .eq("user_id", user.user.id)
      .eq("date", date)
      .eq("day_part", dayPart)
      .eq("scope", "day_part")
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async list(filters?: {
    startDate?: string;
    endDate?: string;
    scope?: TrackerScope;
  }): Promise<FourScaleTracker[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    let query = supabase
      .from("four_scale_trackers")
      .select("*")
      .eq("user_id", user.user.id)
      .order("date", { ascending: false });

    if (filters?.startDate) {
      query = query.gte("date", filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte("date", filters.endDate);
    }
    if (filters?.scope) {
      query = query.eq("scope", filters.scope);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }
}

export const fourScaleTrackerService = new FourScaleTrackerService();
