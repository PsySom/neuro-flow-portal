import { supabase } from "@/integrations/supabase/client";

export interface DailyRLI {
  user_id: string;
  date: string;
  day_recovery: number;
  day_strain: number;
  rli: number;
}

export interface MetricTimeseriesPoint {
  user_id: string;
  ts: string;
  topic: string;
  key: string;
  value: number;
  norm_min: number | null;
  norm_max: number | null;
}

export interface FourScalesData {
  id: string;
  user_id: string;
  scope: string;
  date: string;
  day_part: string | null;
  activity_id: string | null;
  process_satisfaction: number;
  result_satisfaction: number;
  energy_cost: number;
  stress_level: number;
  created_at: string;
}

class AnalyticsService {
  async getDailyRLI(filters?: {
    startDate?: string;
    endDate?: string;
  }): Promise<DailyRLI[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    let query = supabase
      .from("v_daily_rli")
      .select("*")
      .eq("user_id", user.user.id)
      .order("date", { ascending: true });

    if (filters?.startDate) {
      query = query.gte("date", filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte("date", filters.endDate);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map((row) => ({
      ...row,
      rli: row.day_recovery - row.day_strain,
    }));
  }

  async getMetricsTimeseries(filters?: {
    metricKey?: string;
    startDate?: string;
    endDate?: string;
    topic?: string;
    limit?: number;
  }): Promise<MetricTimeseriesPoint[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    let query = supabase
      .from("v_diary_metrics_timeseries")
      .select("*")
      .eq("user_id", user.user.id)
      .order("ts", { ascending: true });

    if (filters?.metricKey) {
      query = query.eq("key", filters.metricKey);
    }
    if (filters?.topic) {
      query = query.eq("topic", filters.topic);
    }
    if (filters?.startDate) {
      query = query.gte("ts", filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte("ts", filters.endDate);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getFourScalesData(filters?: {
    scope?: string;
    dayPart?: string;
    activityId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<FourScalesData[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    let query = supabase
      .from("four_scale_trackers")
      .select("*")
      .eq("user_id", user.user.id)
      .order("date", { ascending: true });

    if (filters?.scope) {
      query = query.eq("scope", filters.scope);
    }
    if (filters?.dayPart) {
      query = query.eq("day_part", filters.dayPart);
    }
    if (filters?.activityId) {
      query = query.eq("activity_id", filters.activityId);
    }
    if (filters?.startDate) {
      query = query.gte("date", filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte("date", filters.endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }
}

export const analyticsService = new AnalyticsService();
