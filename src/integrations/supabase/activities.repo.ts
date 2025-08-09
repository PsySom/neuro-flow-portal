import { supabase } from '@/integrations/supabase/client';
import { Activity, ActivityState, ActivityStatus, ActivityType, CreateActivityRequest, UpdateActivityRequest, UpdateActivityStateRequest } from '@/types/api.types';

// Deterministic hash from UUID to 53-bit number to keep legacy numeric IDs
function hashUuidToNumber(uuid: string): number {
  let h1 = 0x811c9dc5;
  for (let i = 0; i < uuid.length; i++) {
    h1 ^= uuid.charCodeAt(i);
    h1 = Math.imul(h1, 0x01000193);
    h1 >>>= 0;
  }
  // constrain to safe integer
  return Math.abs(h1);
}

async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('Не авторизовано');
  return data.user.id;
}

function mapRowToActivity(row: any, typeMap?: Map<number, ActivityType>): Activity {
  const activityType: ActivityType | undefined = typeMap?.get(row.activity_type_id);
  return {
    id: hashUuidToNumber(row.id),
    user_id: 0, // hidden in RLS; not used by UI
    title: row.title,
    description: row.description ?? undefined,
    activity_type: activityType ?? { id: row.activity_type_id, name: String(row.activity_type_id) },
    start_time: row.start_time,
    end_time: row.end_time ?? undefined,
    status: row.status as ActivityStatus,
    metadata: row.metadata ?? undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function resolveUuidByHashedId(numericId: number): Promise<string | null> {
  const userId = await getCurrentUserId();
  // First try to find by metadata.hash_id (for newly created)
  const { data: byMeta } = await supabase
    .from('activities')
    .select('id, metadata')
    .eq('user_id', userId);

  if (byMeta) {
    for (const row of byMeta) {
      const metaHash = (row.metadata as any)?.hash_id as number | undefined;
      if (metaHash === numericId) return row.id as string;
    }
  }

  // Fallback: compute hash over all and match
  if (byMeta) {
    for (const row of byMeta) {
      if (hashUuidToNumber(row.id as string) === numericId) return row.id as string;
    }
  }
  return null;
}

export const supabaseActivitiesRepo = {
  async getActivityTypes(): Promise<ActivityType[]> {
    const { data, error } = await supabase.from('activity_types').select('*').order('id');
    if (error) throw error;
    return (data ?? []).map((t) => ({ id: t.id, name: t.name, description: t.description ?? undefined, color: t.color ?? undefined, icon: t.icon ?? undefined }));
  },

  async getActivities(date?: string): Promise<Activity[]> {
    const userId = await getCurrentUserId();
    const types = await this.getActivityTypes().catch(() => [] as ActivityType[]);
    const typeMap: Map<number, ActivityType> = new Map(types.map((t: ActivityType) => [t.id, t] as const));

    let query = supabase.from('activities').select('*').eq('user_id', userId).order('start_time');
    if (date) {
      const start = new Date(date + 'T00:00:00.000Z').toISOString();
      const end = new Date(date + 'T23:59:59.999Z').toISOString();
      query = query.gte('start_time', start).lte('start_time', end);
    }
    const { data, error } = await query;
    if (error) throw error;
    const items = (data ?? []).map((row) => mapRowToActivity(row, typeMap));

    // Backfill metadata.hash_id for faster future lookups
    await Promise.all(
      (data ?? []).map(async (row) => {
        const meta = (row.metadata as any) || {};
        if (meta.hash_id == null) {
          await supabase.from('activities').update({ metadata: { ...meta, hash_id: hashUuidToNumber(row.id) } }).eq('id', row.id);
        }
      })
    ).catch(() => {});

    return items;
  },

  async getActivitiesRange(startDate: string, endDate: string): Promise<Activity[]> {
    const userId = await getCurrentUserId();
    const types = await this.getActivityTypes().catch(() => [] as ActivityType[]);
    const typeMap: Map<number, ActivityType> = new Map(types.map((t: ActivityType) => [t.id, t] as const));

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', new Date(startDate + 'T00:00:00.000Z').toISOString())
      .lte('start_time', new Date(endDate + 'T23:59:59.999Z').toISOString())
      .order('start_time');

    if (error) throw error;
    return (data ?? []).map((row) => mapRowToActivity(row, typeMap));
  },

  async createActivity(data: CreateActivityRequest): Promise<Activity> {
    const userId = await getCurrentUserId();
    const insertPayload = {
      user_id: userId,
      title: data.title,
      description: data.description ?? null,
      activity_type_id: data.activity_type_id,
      start_time: data.start_time,
      end_time: data.end_time ?? null,
      status: data.status ?? 'planned',
      metadata: data.metadata ?? {},
    };

    const { data: inserted, error } = await supabase.from('activities').insert(insertPayload).select('*').single();
    if (error || !inserted) throw error || new Error('Insert failed');

    // add hash_id
    const hash = hashUuidToNumber(inserted.id);
    await supabase.from('activities').update({ metadata: { ...(inserted.metadata || {}), hash_id: hash } }).eq('id', inserted.id);

    // Map to API type
    const types = await this.getActivityTypes().catch(() => [] as ActivityType[]);
    const typeMap: Map<number, ActivityType> = new Map(types.map((t: ActivityType) => [t.id, t] as const));
    return mapRowToActivity({ ...inserted, metadata: { ...(inserted.metadata || {}), hash_id: hash } }, typeMap);
  },

  async updateActivity(id: number, data: UpdateActivityRequest): Promise<Activity> {
    const uuid = await resolveUuidByHashedId(id);
    if (!uuid) throw new Error('Activity not found');

    const updates: any = {
      title: data.title,
      description: data.description,
      activity_type_id: data.activity_type_id,
      start_time: data.start_time,
      end_time: data.end_time,
      status: data.status,
      metadata: data.metadata as any,
      updated_at: new Date().toISOString(),
    };
    Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

    const { data: updated, error } = await supabase.from('activities').update(updates).eq('id', uuid).select('*').single();
    if (error || !updated) throw error || new Error('Update failed');

    const types = await this.getActivityTypes().catch(() => [] as ActivityType[]);
    const typeMap: Map<number, ActivityType> = new Map(types.map((t: ActivityType) => [t.id, t] as const));
    return mapRowToActivity(updated, typeMap);
  },

  async deleteActivity(id: number): Promise<void> {
    const uuid = await resolveUuidByHashedId(id);
    if (!uuid) return;
    await supabase.from('activities').delete().eq('id', uuid);
  },

  async getActivityState(activityId: number): Promise<ActivityState | null> {
    const uuid = await resolveUuidByHashedId(activityId);
    if (!uuid) return null;
    const { data, error } = await supabase.from('activity_states').select('*').eq('activity_id', uuid).maybeSingle();
    if (error) return null;
    if (!data) return null;
    return {
      id: data.id,
      activity_id: activityId,
      user_id: 0,
      state: data.state,
      mood_before: data.mood_before ?? undefined,
      mood_after: data.mood_after ?? undefined,
      energy_before: data.energy_before ?? undefined,
      energy_after: data.energy_after ?? undefined,
      notes: data.notes ?? undefined,
      metadata: data.metadata ?? undefined,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  },

  async updateActivityState(activityId: number, payload: UpdateActivityStateRequest): Promise<ActivityState> {
    const uuid = await resolveUuidByHashedId(activityId);
    if (!uuid) throw new Error('Activity not found');

    // Prefer RPC if only status/notes
    if (payload.state && Object.keys(payload).every((k) => ['state', 'notes'].includes(k))) {
      const { data, error } = await supabase.rpc('update_activity_status', {
        activity_id: uuid,
        new_status: payload.state,
        user_notes: (payload as any).notes ?? null,
      });
      if (error) throw error;
    } else {
      // Upsert state row
      const userId = await getCurrentUserId();
      const upsert = {
        activity_id: uuid,
        user_id: userId,
        state: payload.state ?? 'planned',
        mood_before: payload.mood_before ?? null,
        mood_after: payload.mood_after ?? null,
        energy_before: payload.energy_before ?? null,
        energy_after: payload.energy_after ?? null,
        notes: payload.notes ?? null,
        metadata: payload.metadata ?? {},
        updated_at: new Date().toISOString(),
      } as any;
      const { error } = await supabase.from('activity_states').upsert(upsert, { onConflict: 'activity_id,user_id' });
      if (error) throw error;
    }

    const current = await this.getActivityState(activityId);
    if (!current) throw new Error('Failed to update state');
    return current;
  },
};
