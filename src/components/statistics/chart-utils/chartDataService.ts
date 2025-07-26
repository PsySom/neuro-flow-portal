import { format } from 'date-fns';
import { backendDiaryService, MoodEntry } from '@/services/backend-diary.service';
import { ChartDataPoint, TimeRange, convertMoodEntriesToChartData, generateDemoData, getDateRange } from './chartDataConverters';

export class ChartDataService {
  async fetchMoodData(range: TimeRange, isAuthenticated?: boolean): Promise<ChartDataPoint[]> {
    try {
      const { startDate, endDate } = getDateRange(range);

      // Если пользователь не авторизован, сразу показываем демо-данные
      if (!isAuthenticated) {
        console.log('📊 Пользователь не авторизован, показываем демо-данные');
        return generateDemoData(range);
      }

      // Используем flexible endpoint который поддерживает fallback на демо-данные
      const entries = await backendDiaryService.getMoodEntries({
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        sort_desc: false
      });

      console.log(`📊 Получено ${entries.length} записей настроения для диапазона ${range}`);
      
      if (entries.length > 0) {
        return convertMoodEntriesToChartData(entries, range);
      } else {
        // Используем демо-данные если нет реальных записей
        console.log('📊 Нет записей пользователя, отображаем демо-данные для графика');
        return generateDemoData(range);
      }
    } catch (error: any) {
      console.error('❌ Ошибка загрузки данных настроения:', error);
      
      // Если ошибка 401 - пользователь не авторизован
      if (error.status === 401) {
        console.log('📊 Ошибка 401: Пользователь не авторизован, показываем демо-данные');
        return generateDemoData(range);
      }
      
      // Для других ошибок тоже показываем демо-данные  
      return generateDemoData(range);
    }
  }
}

export const chartDataService = new ChartDataService();