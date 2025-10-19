import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { activityKindSchema, ActivityKind } from "./activities.service";

export const createTemplateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  kind: activityKindSchema,
  default_notes: z.string().max(1000).optional(),
  is_public: z.boolean().default(false),
  metadata: z.record(z.unknown()).optional(),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;

export interface ActivityTemplate {
  id: number;
  created_by: string;
  title: string;
  kind: ActivityKind;
  default_notes: string | null;
  is_public: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

class ActivityTemplatesService {
  async list(): Promise<ActivityTemplate[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("activity_templates")
      .select("*")
      .or(`is_public.eq.true,created_by.eq.${user.user.id}`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async create(input: CreateTemplateInput): Promise<ActivityTemplate> {
    const validated = createTemplateSchema.parse(input);
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("activity_templates")
      .insert({
        created_by: user.user.id,
        ...validated,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createFromTemplate(
    templateId: number,
    overrides: {
      title?: string;
      start_time: string;
      end_time?: string;
      activity_type_id: number;
    }
  ) {
    const { data: template, error: templateError } = await supabase
      .from("activity_templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (templateError) throw templateError;

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("activities")
      .insert({
        user_id: user.user.id,
        title: overrides.title || template.title,
        activity_type_id: overrides.activity_type_id,
        kind: template.kind,
        description: template.default_notes,
        start_time: overrides.start_time,
        end_time: overrides.end_time,
        from_template_id: templateId,
        metadata: template.metadata,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: number): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("activity_templates")
      .delete()
      .eq("id", id)
      .eq("created_by", user.user.id);

    if (error) throw error;
  }
}

export const activityTemplatesService = new ActivityTemplatesService();
