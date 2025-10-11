import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StateMetric {
  timestamp: string;
  mood: number;
  energy: number;
  stress: number;
}

export const useStateMetrics = () => {
  const [metrics, setMetrics] = useState<StateMetric[]>([]);
  const [todayMetrics, setTodayMetrics] = useState<StateMetric | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Get mood diary entries
      const { data: moodEntries, error } = await supabase
        .from('mood_diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', weekAgo.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transform data
      const transformedMetrics: StateMetric[] = moodEntries?.map(entry => ({
        timestamp: new Date(entry.created_at).toLocaleDateString('ru-RU', { 
          day: '2-digit', 
          month: '2-digit' 
        }),
        mood: entry.mood_score || 5,
        energy: 5, // Default for now
        stress: 5  // Default for now
      })) || [];

      setMetrics(transformedMetrics);

      // Get today's latest entry
      const todayStart = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const { data: todayEntry } = await supabase
        .from('mood_diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', todayStart)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (todayEntry) {
        setTodayMetrics({
          timestamp: new Date(todayEntry.created_at).toLocaleTimeString('ru-RU'),
          mood: todayEntry.mood_score || 5,
          energy: 5,
          stress: 5
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading metrics:', error);
      setLoading(false);
    }
  };

  return { metrics, todayMetrics, loading, refreshMetrics: loadMetrics };
};
