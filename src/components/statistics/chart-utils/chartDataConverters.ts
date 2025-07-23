import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ru } from 'date-fns/locale';
import { MoodEntry } from '@/services/backend-diary.service';

export interface ChartDataPoint {
  time: string;
  mood: number;
  emotions?: string[];
  emotionIntensity?: string;
  connection?: string;
  impact?: string;
  fullDate?: string;
  entry?: MoodEntry;
}

export type TimeRange = 'day' | 'week' | 'month';

export const convertMoodEntriesToChartData = (entries: MoodEntry[], range: TimeRange): ChartDataPoint[] => {
  if (entries.length === 0) return [];

  // Сортируем записи по времени (новые записи в конце)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const convertedData: ChartDataPoint[] = [];

  if (range === 'day') {
    // Для дневного режима: группируем по часам, показываем все записи
    const hourlyData = new Map<string, ChartDataPoint>();
    
    sortedEntries.forEach((entry, index) => {
      const date = new Date(entry.timestamp);
      const hourKey = format(date, 'HH:mm');
      const normalizedMood = entry.mood_score; // Данные уже в формате -5/+5
      const emotions = entry.emotions?.map(emotion => emotion.name) || [];

      hourlyData.set(`${hourKey}_${index}`, {
        time: hourKey,
        mood: normalizedMood,
        emotions,
        connection: entry.context || '',
        fullDate: format(date, 'dd.MM.yyyy HH:mm'),
        entry
      });
    });

    // Сортируем по времени
    return Array.from(hourlyData.values()).sort((a, b) => a.time.localeCompare(b.time));
  }

  if (range === 'week') {
    // Для недельного режима: группируем по дням недели, берем последнюю запись дня
    const weeklyData = new Map<string, ChartDataPoint>();
    
    sortedEntries.forEach(entry => {
      const date = new Date(entry.timestamp);
      const dayKey = format(date, 'EEEE', { locale: ru });
      const normalizedMood = entry.mood_score;
      const emotions = entry.emotions?.map(emotion => emotion.name) || [];
      
      // Всегда перезаписываем более новой записью (последняя запись дня)
      weeklyData.set(dayKey, {
        time: `${dayKey.slice(0, 2)} ${format(date, 'dd.MM')}`,
        mood: normalizedMood,
        emotions,
        connection: entry.context || '',
        fullDate: format(date, 'dd.MM.yyyy'),
        entry
      });
    });

    const daysOrder = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];
    
    return daysOrder.map(day => weeklyData.get(day)).filter(Boolean) as ChartDataPoint[];
  }

  if (range === 'month') {
    // Для месячного режима: группируем по дням месяца, берем последнюю запись дня
    const monthlyData = new Map<number, ChartDataPoint>();
    
    sortedEntries.forEach(entry => {
      const date = new Date(entry.timestamp);
      const day = date.getDate();
      const normalizedMood = entry.mood_score;
      const emotions = entry.emotions?.map(emotion => emotion.name) || [];
      
      // Всегда перезаписываем более новой записью (последняя запись дня)
      monthlyData.set(day, {
        time: day.toString(),
        mood: normalizedMood,
        emotions,
        connection: entry.context || '',
        fullDate: format(date, 'dd.MM.yyyy'),
        entry
      });
    });

    const convertedData: ChartDataPoint[] = [];
    for (let day = 1; day <= 31; day++) {
      const dayData = monthlyData.get(day);
      if (dayData) {
        convertedData.push(dayData);
      }
    }
    
    return convertedData;
  }

  return convertedData;
};

export const generateDemoData = (range: TimeRange): ChartDataPoint[] => {
  const demoData: ChartDataPoint[] = [];
  const now = new Date();

  if (range === 'day') {
    // Дневной режим: от 00:00 до 24:00 (каждые 2 часа)
    for (let hour = 0; hour <= 24; hour += 2) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      const mood = Math.floor(Math.random() * 11) - 5; // от -5 до +5
      demoData.push({
        time: timeString,
        mood,
        emotions: ['спокойствие', 'радость'].slice(0, Math.random() > 0.5 ? 1 : 2),
        connection: 'Демо-контекст',
        fullDate: format(now, 'dd.MM.yyyy') + ' ' + timeString
      });
    }
  } else if (range === 'week') {
    // Недельный режим: дни недели с датами
    const daysOfWeek = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - 6 + i);
      const dayName = daysOfWeek[i];
      const dateStr = format(date, 'dd.MM');
      const mood = Math.floor(Math.random() * 11) - 5;
      
      demoData.push({
        time: `${dayName} ${dateStr}`,
        mood,
        emotions: ['настроение', 'энергия'],
        connection: 'Демо-контекст недели',
        fullDate: format(date, 'dd.MM.yyyy')
      });
    }
  } else if (range === 'month') {
    // Месячный режим: числа от 1 до 30
    for (let day = 1; day <= 30; day++) {
      const mood = Math.floor(Math.random() * 11) - 5;
      demoData.push({
        time: day.toString(),
        mood,
        emotions: ['настроение'],
        connection: 'Демо-контекст месяца',
        fullDate: `${day.toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`
      });
    }
  }

  return demoData;
};

export const getDateRange = (range: TimeRange) => {
  const now = new Date();
  let startDate: Date, endDate: Date;

  if (range === 'day') {
    startDate = startOfDay(now);
    endDate = endOfDay(now);
  } else if (range === 'week') {
    startDate = startOfWeek(now, { weekStartsOn: 1 });
    endDate = endOfWeek(now, { weekStartsOn: 1 });
  } else {
    startDate = startOfMonth(now);
    endDate = endOfMonth(now);
  }

  return { startDate, endDate };
};