import { format } from 'date-fns';
import { backendDiaryService, MoodEntry } from '@/services/backend-diary.service';
import { ChartDataPoint, TimeRange, convertMoodEntriesToChartData, generateDemoData, getDateRange } from './chartDataConverters';

export class ChartDataService {
  async fetchMoodData(range: TimeRange): Promise<ChartDataPoint[]> {
    try {
      const { startDate, endDate } = getDateRange(range);

      const entries = await backendDiaryService.getMoodEntries({
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        sort_desc: false
      });

      if (entries.length > 0) {
        console.log(`✅ Загружено ${entries.length} записей для ${range}`);
        return convertMoodEntriesToChartData(entries, range);
      } else {
        // Если нет данных от API, используем демо-данные
        console.log('🔄 Используем демо-данные для', range);
        return generateDemoData(range);
      }
    } catch (error) {
      console.error('❌ Ошибка при загрузке данных настроения:', error);
      // В случае ошибки используем демо-данные
      console.log('🔄 Fallback на демо-данные');
      return generateDemoData(range);
    }
  }
}

export const chartDataService = new ChartDataService();