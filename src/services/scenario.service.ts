import { supabase } from '@/integrations/supabase/client';
import type { 
  TherapyScenario, 
  TherapyQuestion, 
  TherapyTransition,
  DiaryEntry,
  DiaryMetric,
  DiaryEmotion
} from '@/types/scenario.types';

class ScenarioService {
  async getScenario(scenarioSlug: string): Promise<TherapyScenario | null> {
    const { data, error } = await supabase
      .from('therapy_scenarios')
      .select('*')
      .eq('scenario_code', scenarioSlug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching scenario:', error);
      return null;
    }

    return data;
  }

  async getScenarioQuestions(scenarioId: string): Promise<TherapyQuestion[]> {
    const { data, error } = await supabase
      .from('therapy_questions')
      .select('*')
      .eq('scenario_id', scenarioId)
      .order('sequence_number', { ascending: true });

    if (error) {
      console.error('Error fetching questions:', error);
      return [];
    }

    return data || [];
  }

  async getTransitions(fromQuestionId: string): Promise<TherapyTransition[]> {
    const { data, error } = await supabase
      .from('therapy_transitions')
      .select('*')
      .eq('from_question_id', fromQuestionId)
      .order('priority', { ascending: false });

    if (error) {
      console.error('Error fetching transitions:', error);
      return [];
    }

    return data || [];
  }

  async getDefaultNorms(): Promise<Record<string, { norm_min?: number; norm_max?: number }>> {
    const { data, error } = await supabase
      .from('v_default_norms')
      .select('*');

    if (error) {
      console.error('Error fetching default norms:', error);
      return {};
    }

    const norms: Record<string, { norm_min?: number; norm_max?: number }> = {};
    data?.forEach((row: any) => {
      norms[row.metric_key] = {
        norm_min: row.norm_min,
        norm_max: row.norm_max
      };
    });

    return norms;
  }

  async saveStructuredEntry(
    scenarioSlug: string,
    responses: Record<string, any>,
    questions: TherapyQuestion[]
  ): Promise<{ success: boolean; entryId?: string; error?: string }> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) {
        return { success: false, error: 'User not authenticated' };
      }

      // Получаем нормы
      const norms = await this.getDefaultNorms();

      // Собираем контекст из text-вопросов
      const contextParts: string[] = [];
      const metadataExtras: Record<string, any> = {};

      questions.forEach(q => {
        const response = responses[q.question_code];
        if (response && q.question_type === 'text') {
          contextParts.push(`${q.question_text}: ${response}`);
        }
      });

      // Создаем diary_entries
      const { data: entry, error: entryError } = await supabase
        .from('diary_entries')
        .insert({
          user_id: userId,
          topic: scenarioSlug,
          context: contextParts.join('\n\n') || null,
          metadata: metadataExtras
        })
        .select()
        .single();

      if (entryError || !entry) {
        console.error('Error creating diary entry:', entryError);
        return { success: false, error: entryError?.message || 'Failed to create entry' };
      }

      // Сохраняем метрики и эмоции
      const metricsToInsert: any[] = [];
      const emotionsToInsert: any[] = [];

      questions.forEach(q => {
        const response = responses[q.question_code];
        if (!response) return;

        // Scale и number → metrics
        if (q.question_type === 'scale' || q.question_type === 'number') {
          const norm = norms[q.question_code] || {};
          metricsToInsert.push({
            entry_id: entry.id,
            key: q.question_code,
            value: Number(response),
            norm_min: norm.norm_min,
            norm_max: norm.norm_max
          });
        }

        // Эмоции
        if (q.question_code === 'emotions' && Array.isArray(response)) {
          response.forEach(emotionId => {
            const option = q.metadata.options?.find(o => o.id === emotionId);
            if (option) {
              emotionsToInsert.push({
                entry_id: entry.id,
                label: option.label,
                intensity: null
              });
            }
          });
        }

        // Прочие chips → metadata
        if ((q.question_type === 'chips' || q.question_type === 'multiple_choice') 
            && q.question_code !== 'emotions') {
          metadataExtras[q.question_code] = response;
        }
      });

      // Обновляем metadata если есть дополнительные данные
      if (Object.keys(metadataExtras).length > 0) {
        await supabase
          .from('diary_entries')
          .update({ metadata: metadataExtras })
          .eq('id', entry.id);
      }

      // Вставляем метрики
      if (metricsToInsert.length > 0) {
        const { error: metricsError } = await supabase
          .from('diary_entry_metrics')
          .insert(metricsToInsert);

        if (metricsError) {
          console.error('Error inserting metrics:', metricsError);
        }
      }

      // Вставляем эмоции
      if (emotionsToInsert.length > 0) {
        const { error: emotionsError } = await supabase
          .from('diary_entry_emotions')
          .insert(emotionsToInsert);

        if (emotionsError) {
          console.error('Error inserting emotions:', emotionsError);
        }
      }

      return { success: true, entryId: entry.id };
    } catch (error) {
      console.error('Error saving structured entry:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getRecentEntries(limit: number = 20): Promise<Array<DiaryEntry & { 
    hasAbnormalMetrics?: boolean;
    metrics?: DiaryMetric[];
    emotions?: DiaryEmotion[];
  }>> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return [];

      const { data: entries, error } = await supabase
        .from('diary_entries')
        .select(`
          *,
          diary_entry_metrics(*),
          diary_entry_emotions(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching entries:', error);
        return [];
      }

      return (entries || []).map(entry => {
        const metrics = entry.diary_entry_metrics || [];
        const hasAbnormalMetrics = metrics.some((m: any) => 
          (m.norm_min !== null && m.value < m.norm_min) ||
          (m.norm_max !== null && m.value > m.norm_max)
        );

        return {
          ...entry,
          metrics,
          emotions: entry.diary_entry_emotions || [],
          hasAbnormalMetrics
        };
      });
    } catch (error) {
      console.error('Error in getRecentEntries:', error);
      return [];
    }
  }
}

export const scenarioService = new ScenarioService();
