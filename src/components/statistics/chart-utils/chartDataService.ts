import { format, subDays, subMonths, subWeeks } from 'date-fns';
import { backendDiaryService, MoodEntry } from '@/services/backend-diary.service';
import { ChartDataPoint, TimeRange, convertMoodEntriesToChartData, generateDemoData, getDateRange } from './chartDataConverters';

export class ChartDataService {
  async fetchMoodData(range: TimeRange, isAuthenticated: boolean = true): Promise<ChartDataPoint[]> {
    try {
      const { startDate, endDate } = getDateRange(range);

      console.log(`📊 Загружаем данные настроения для диапазона ${range}:`, { startDate, endDate });

      // Пробуем загрузить реальные данные через Supabase
      let entries: MoodEntry[] = [];
      
      if (isAuthenticated) {
        try {
          // Импортируем репозиторий динамически
          const { moodDiaryRepository } = await import('@/integrations/supabase/mood-diary.repo');
          
          const supabaseEntries = await moodDiaryRepository.getEntries({
            start_date: format(startDate, 'yyyy-MM-dd'),
            end_date: format(endDate, 'yyyy-MM-dd'),
            order_direction: 'asc',
            limit: 100
          });

          // Конвертируем формат
          entries = supabaseEntries.map(entry => ({
            id: entry.id,
            user_id: entry.user_id,
            mood_score: entry.mood_score,
            emotions: entry.emotions || [],
            triggers: entry.triggers || [],
            physical_sensations: entry.physical_sensations || [],
            body_areas: entry.body_areas || [],
            context: entry.context || '',
            notes: entry.notes || '',
            timestamp: entry.created_at || new Date().toISOString()
          }));

          console.log(`📊 Получено ${entries.length} записей настроения из Supabase`);
        } catch (supabaseError) {
          console.warn('⚠️ Supabase недоступен, пробуем fallback API:', supabaseError);
          // Fallback к старому API
          entries = await backendDiaryService.getMoodEntries({
            start_date: format(startDate, 'yyyy-MM-dd'),
            end_date: format(endDate, 'yyyy-MM-dd'),
            sort_desc: false
          });
        }
      }

      if (entries.length > 0) {
        const chartData = convertMoodEntriesToChartData(entries, range);
        console.log(`📊 Конвертировано в ${chartData.length} точек для графика`);
        return chartData;
      } else {
        // Если нет реальных записей и пользователь авторизован, показываем пустой график
        if (isAuthenticated) {
          console.log('📊 Нет записей пользователя - показываем пустой график');
          return [];
        } else {
          // Для неавторизованных пользователей показываем демо-данные
          console.log('📊 Пользователь не авторизован - показываем демо-данные');
          return this.generateDemoMoodData(range);
        }
      }
    } catch (error: any) {
      console.error('❌ Ошибка загрузки данных настроения:', error);
      
      // При ошибке показываем пустой график для авторизованных или демо для неавторизованных
      if (isAuthenticated) {
        return [];
      } else {
        return this.generateDemoMoodData(range);
      }
    }
  }

  private generateDemoMoodData(range: TimeRange): ChartDataPoint[] {
    console.log('📊 Генерируем демо-данные для примера');
    
    const now = new Date();
    const dataPoints: ChartDataPoint[] = [];
    
    let startDate: Date;
    let pointCount: number;
    
    switch (range) {
      case 'day':
        startDate = subDays(now, 1);
        pointCount = 24; // Каждый час
        break;
      case 'week':
        startDate = subWeeks(now, 1);
        pointCount = 7; // Каждый день
        break;
      case 'month':
        startDate = subMonths(now, 1);
        pointCount = 15; // Каждые 2 дня
        break;
      default:
        startDate = subWeeks(now, 1);
        pointCount = 7;
    }

    for (let i = 0; i < pointCount; i++) {
      const date = new Date(startDate.getTime() + (i * (now.getTime() - startDate.getTime()) / pointCount));
      
      // Генерируем реалистичные данные настроения
      const baseScore = -1 + Math.sin(i / pointCount * Math.PI * 2) * 2; // Волна от -3 до 1
      const randomVariation = (Math.random() - 0.5) * 2; // ±1
      const mood = Math.max(-5, Math.min(5, Math.round(baseScore + randomVariation)));
      
      // Демо эмоции в зависимости от настроения
      const emotions = mood > 2 ? ['Радость', 'Энтузиазм'] :
                     mood > 0 ? ['Спокойствие', 'Удовлетворение'] :
                     mood > -2 ? ['Нейтральность'] :
                     ['Грусть', 'Усталость'];

      const triggers = mood < 0 ? ['Работа', 'Стресс'] : ['Отдых', 'Общение'];

      let timeFormat: string;
      switch (range) {
        case 'day':
          timeFormat = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
          break;
        case 'week':
          timeFormat = date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' });
          break;
        default:
          timeFormat = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
      }

      dataPoints.push({
        time: timeFormat,
        mood: mood,
        emotions: emotions,
        triggers: triggers,
        physical_sensations: mood < 0 ? ['Напряжение', 'Усталость'] : ['Легкость'],
        connection: mood > 0 ? 'Положительные события' : 'Стрессовые ситуации',
        notes: 'Демо-запись для примера',
        fullDate: date.toLocaleDateString('ru-RU', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });
    }

    return dataPoints;
  }
}

export const chartDataService = new ChartDataService();