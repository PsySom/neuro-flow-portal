import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const activityKindSchema = z.enum([
  "restorative",
  "neutral",
  "mixed",
  "depleting",
]);

export const createActivitySchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  activity_type_id: z.number(),
  kind: activityKindSchema.optional(),
  description: z.string().max(1000).optional(),
  start_time: z.string(),
  end_time: z.string().optional(),
  planned_at: z.string().optional(),
  from_template_id: z.number().optional(),
  calendar_provider: z.string().optional(),
  calendar_event_id: z.string().optional(),
  calendar_sync_status: z.string().optional(),
  status: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const updateActivitySchema = createActivitySchema.partial();

export type ActivityKind = z.infer<typeof activityKindSchema>;
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;

export interface Activity {
  id: string;
  user_id: string;
  title: string;
  activity_type_id: number;
  kind: ActivityKind | null;
  description: string | null;
  start_time: string;
  end_time: string | null;
  planned_at: string | null;
  from_template_id: number | null;
  calendar_provider: string | null;
  calendar_event_id: string | null;
  calendar_sync_status: string | null;
  status: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

class ActivitiesService {
  async list(filters?: {
    startDate?: string;
    endDate?: string;
    kind?: ActivityKind;
    status?: string;
    limit?: number;
  }): Promise<Activity[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    let query = supabase
      .from("activities")
      .select("*")
      .eq("user_id", user.user.id)
      .order("start_time", { ascending: false });

    if (filters?.startDate) {
      query = query.gte("start_time", filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte("start_time", filters.endDate);
    }
    if (filters?.kind) {
      query = query.eq("kind", filters.kind);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getById(id: string): Promise<Activity> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.user.id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(input: CreateActivityInput): Promise<Activity> {
    const validated = createActivitySchema.parse(input);
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("activities")
      .insert({
        user_id: user.user.id,
        ...validated,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, input: UpdateActivityInput): Promise<Activity> {
    const validated = updateActivitySchema.parse(input);
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("activities")
      .update(validated)
      .eq("id", id)
      .eq("user_id", user.user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("activities")
      .delete()
      .eq("id", id)
      .eq("user_id", user.user.id);

    if (error) throw error;
  }

  async updateStatus(id: string, status: string): Promise<Activity> {
    return this.update(id, { status });
  }
}

export const activitiesService = new ActivitiesService();
