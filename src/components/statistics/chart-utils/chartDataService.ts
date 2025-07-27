import { format } from 'date-fns';
import { backendDiaryService, MoodEntry } from '@/services/backend-diary.service';
import { ChartDataPoint, TimeRange, convertMoodEntriesToChartData, generateDemoData, getDateRange } from './chartDataConverters';

export class ChartDataService {
  async fetchMoodData(range: TimeRange, isAuthenticated: boolean = true): Promise<ChartDataPoint[]> {
    try {
      const { startDate, endDate } = getDateRange(range);

      console.log(`📊 Загружаем данные настроения для диапазона ${range}:`, { startDate, endDate });

      // Загружаем данные настроения (реальные или mock)
      const entries = await backendDiaryService.getMoodEntries({
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        sort_desc: false
      });

      console.log(`📊 Получено ${entries.length} записей настроения для диапазона ${range}`);
      
      if (entries.length > 0) {
        const chartData = convertMoodEntriesToChartData(entries, range);
        console.log(`📊 Конвертировано в ${chartData.length} точек для графика`, chartData);
        return chartData;
      } else {
        // Если нет реальных записей, возвращаем пустой массив (НЕ демо-данные!)
        console.log('📊 Нет записей пользователя - показываем пустой график');
        return [];
      }
    } catch (error: any) {
      console.error('❌ Ошибка загрузки данных настроения:', error);
      
      // Для ошибок тоже возвращаем пустой массив  
      console.log('📊 Ошибка: показываем пустой график');
      return [];
    }
  }
}

export const chartDataService = new ChartDataService();