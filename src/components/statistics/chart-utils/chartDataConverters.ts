import { format } from 'date-fns';
import { MoodEntry } from '@/services/backend-diary.service';

export interface ChartDataPoint {
  time: string;
  mood: number;
  emotions?: string[];
  context?: string;
  notes?: string;
  triggers?: string[];
  physical_sensations?: string[];
  connection?: string;
  fullDate?: string;
}

export type TimeRange = 'day' | 'week' | 'month';

// Нормализация шкалы настроения к диапазону -5..5
// Если приходят значения из диапазона -10..10 (бекенд), делим на 2 и округляем до 1 знака
const normalizeMood = (value: number): number => {
  if (value > 5 || value < -5) {
    const scaled = value / 2;
    return Math.max(-5, Math.min(5, Math.round(scaled * 10) / 10));
  }
  // также ограничим значения на всякий случай
  return Math.max(-5, Math.min(5, Math.round(value * 10) / 10));
};

export const convertMoodEntriesToChartData = (entries: MoodEntry[], range: TimeRange): ChartDataPoint[] => {
  console.log(`🔄 Конвертация ${entries.length} записей настроения для диапазона ${range}`);
  
  if (entries.length === 0) {
    console.log('📊 Нет записей для конвертации');
    return [];
  }

  // Получаем диапазон дат для фильтрации
  const { startDate, endDate } = getDateRange(range);
  console.log(`📅 Диапазон для ${range}:`, { 
    start: format(startDate, 'yyyy-MM-dd HH:mm'), 
    end: format(endDate, 'yyyy-MM-dd HH:mm') 
  });

  // Фильтруем записи по диапазону
  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    const isInRange = entryDate >= startDate && entryDate <= endDate;
    return isInRange;
  });

  console.log(`🔍 Отфильтровано ${filteredEntries.length} записей из ${entries.length} для диапазона ${range}`);

  if (filteredEntries.length === 0) {
    console.log('📊 Нет записей в указанном диапазоне');
    return [];
  }

  if (range === 'day') {
    // День: каждая запись отдельно по времени
    return convertDayData(filteredEntries);
  } else if (range === 'week') {
    // Неделя: 3 временных промежутка в день
    return convertWeekData(filteredEntries);
  } else {
    // Месяц: одна запись на день (среднее)
    return convertMonthData(filteredEntries);
  }
};

// Конвертация данных для дневного графика - каждая запись отдельно
const convertDayData = (entries: MoodEntry[]): ChartDataPoint[] => {
  console.log('📅 Конвертация дневных данных - каждая запись отдельно');
  
  const chartData: ChartDataPoint[] = entries.map(entry => {
    const entryDate = new Date(entry.timestamp);
    const timeKey = format(entryDate, 'HH:mm');
    
    const emotions = entry.emotions?.map(e => e.name) || [];
    
    return {
      time: timeKey,
      mood: normalizeMood(entry.mood_score),
      emotions,
      context: entry.context,
      notes: entry.notes,
      triggers: entry.triggers,
      physical_sensations: entry.physical_sensations,
      connection: emotions.join(', '),
      fullDate: format(entryDate, 'dd.MM.yyyy HH:mm')
    };
  });

  // Сортируем по времени
  chartData.sort((a, b) => a.time.localeCompare(b.time));
  
  console.log(`✅ Дневные данные: ${chartData.length} записей`);
  return chartData;
};

// Конвертация данных для недельного графика - 3 промежутка в день
const convertWeekData = (entries: MoodEntry[]): ChartDataPoint[] => {
  console.log('📅 Конвертация недельных данных - 3 промежутка в день');
  
  const groupedData = new Map<string, MoodEntry[]>();
  
  entries.forEach(entry => {
    const entryDate = new Date(entry.timestamp);
    const dayNames = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
    const dayIndex = (entryDate.getDay() + 6) % 7;
    const dayName = dayNames[dayIndex];
    const dateStr = format(entryDate, 'dd.MM');
    
    // Определяем временной промежуток
    const hours = entryDate.getHours();
    let timeSlot: string;
    if (hours < 12) {
      timeSlot = 'утро';
    } else if (hours < 17) {
      timeSlot = 'день'; 
    } else {
      timeSlot = 'вечер';
    }
    
    const timeKey = `${dayName}\n${dateStr}\n${timeSlot}`;
    
    if (!groupedData.has(timeKey)) {
      groupedData.set(timeKey, []);
    }
    groupedData.get(timeKey)!.push(entry);
  });

  const chartData: ChartDataPoint[] = [];
  
  groupedData.forEach((entriesGroup, timeKey) => {
    // Усредняем настроение если несколько записей в промежутке (нормализуя шкалу)
    const avgMood = entriesGroup.reduce((sum, entry) => sum + normalizeMood(entry.mood_score), 0) / entriesGroup.length;
    
    // Собираем все эмоции
    const allEmotions: string[] = [];
    entriesGroup.forEach(entry => {
      entry.emotions?.forEach(emotion => {
        if (!allEmotions.includes(emotion.name)) {
          allEmotions.push(emotion.name);
        }
      });
    });

    // Берем данные из последней записи
    const lastEntry = entriesGroup[entriesGroup.length - 1];
    
    const dataPoint: ChartDataPoint = {
      time: timeKey,
      mood: Math.round(avgMood * 10) / 10, // Округляем до 1 знака
      emotions: allEmotions,
      context: lastEntry.context,
      notes: `${entriesGroup.length} записей за промежуток`,
      triggers: lastEntry.triggers,
      physical_sensations: lastEntry.physical_sensations,
      connection: allEmotions.join(', '),
      fullDate: format(new Date(lastEntry.timestamp), 'dd.MM.yyyy HH:mm')
    };

    chartData.push(dataPoint);
  });

  // Сортируем по дням недели и времени суток
  const weekDayOrder = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
  const timeSlotOrder = ['утро', 'день', 'вечер'];
  
  chartData.sort((a, b) => {
    const [dayA, , timeSlotA] = a.time.split('\n');
    const [dayB, , timeSlotB] = b.time.split('\n');
    
    const dayDiff = weekDayOrder.indexOf(dayA) - weekDayOrder.indexOf(dayB);
    if (dayDiff !== 0) return dayDiff;
    
    return timeSlotOrder.indexOf(timeSlotA) - timeSlotOrder.indexOf(timeSlotB);
  });
  
  console.log(`✅ Недельные данные: ${chartData.length} временных промежутков`);
  return chartData;
};

// Конвертация данных для месячного графика - среднее за день
const convertMonthData = (entries: MoodEntry[]): ChartDataPoint[] => {
  console.log('📅 Конвертация месячных данных - среднее за день');
  
  const groupedData = new Map<string, MoodEntry[]>();
  
  entries.forEach(entry => {
    const entryDate = new Date(entry.timestamp);
    const dayKey = format(entryDate, 'd'); // День месяца
    
    if (!groupedData.has(dayKey)) {
      groupedData.set(dayKey, []);
    }
    groupedData.get(dayKey)!.push(entry);
  });

  const chartData: ChartDataPoint[] = [];
  
  groupedData.forEach((entriesGroup, dayKey) => {
    // Усредняем настроение за день (нормализуя шкалу)
    const avgMood = entriesGroup.reduce((sum, entry) => sum + normalizeMood(entry.mood_score), 0) / entriesGroup.length;
    
    // Собираем все эмоции за день
    const allEmotions: string[] = [];
    entriesGroup.forEach(entry => {
      entry.emotions?.forEach(emotion => {
        if (!allEmotions.includes(emotion.name)) {
          allEmotions.push(emotion.name);
        }
      });
    });

    // Берем данные из последней записи дня
    const lastEntry = entriesGroup[entriesGroup.length - 1];
    
    const dataPoint: ChartDataPoint = {
      time: dayKey,
      mood: Math.round(avgMood * 10) / 10, // Округляем до 1 знака
      emotions: allEmotions,
      context: lastEntry.context,
      notes: `${entriesGroup.length} записей за день`,
      triggers: lastEntry.triggers,
      physical_sensations: lastEntry.physical_sensations,
      connection: allEmotions.join(', '),
      fullDate: format(new Date(lastEntry.timestamp), 'dd.MM.yyyy')
    };

    chartData.push(dataPoint);
  });

  // Сортируем по дням месяца
  chartData.sort((a, b) => parseInt(a.time) - parseInt(b.time));
  
  console.log(`✅ Месячные данные: ${chartData.length} дней`);
  return chartData;
};

// Детерминированные демо-данные (только для показа интерфейса, не для реального использования)
export const generateDemoData = (range: TimeRange): ChartDataPoint[] => {
  console.log('🎨 Генерация детерминированных демо-данных для', range);
  const demoData: ChartDataPoint[] = [];
  const now = new Date();

  if (range === 'day') {
    // Дневной режим: фиксированные данные для демонстрации
    const hourlyData = [
      { hour: 8, mood: 2 }, { hour: 10, mood: 3 }, { hour: 12, mood: 1 },
      { hour: 14, mood: 4 }, { hour: 16, mood: 2 }, { hour: 18, mood: 3 },
      { hour: 20, mood: 1 }, { hour: 22, mood: 2 }
    ];
    
    hourlyData.forEach(({ hour, mood }) => {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      demoData.push({
        time: timeString,
        mood,
        emotions: mood >= 2 ? ['радость', 'спокойствие'] : ['усталость'],
        connection: 'Демо-данные для показа интерфейса',
        fullDate: format(now, 'dd.MM.yyyy') + ' ' + timeString
      });
    });
  } else if (range === 'week') {
    // Недельный режим: фиксированные данные
    const daysOfWeek = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
    const weeklyMoods = [2, 3, 1, 4, 2, 3, 1]; // Фиксированные значения
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - 6 + i);
      const dayName = daysOfWeek[i];
      const dateStr = format(date, 'dd.MM');
      const mood = weeklyMoods[i];
      
      demoData.push({
        time: `${dayName}\n${dateStr}`,
        mood,
        emotions: mood >= 2 ? ['спокойствие', 'радость'] : ['усталость'],
        connection: 'Демо-данные для показа интерфейса',
        fullDate: format(date, 'dd.MM.yyyy')
      });
    }
  } else if (range === 'month') {
    // Месячный режим: фиксированные данные
    const monthlyMoods = [1, 2, 3, 2, 4, 1, 3, 2, 3, 1, 4, 2, 3, 1, 2]; // 15 дней
    
    for (let i = 0; i < 15; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - 14 + i);
      const day = date.getDate();
      const mood = monthlyMoods[i];
      
      demoData.push({
        time: day.toString(),
        mood,
        emotions: mood >= 2 ? ['спокойствие'] : ['усталость'],
        connection: 'Демо-данные для показа интерфейса',
        fullDate: format(date, 'dd.MM.yyyy')
      });
    }
  }

  return demoData;
};

export const getDateRange = (range: TimeRange) => {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  if (range === 'day') {
    // Текущий день от 00:00 до 23:59
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  } else if (range === 'week') {
    // Текущая неделя (понедельник - воскресенье)
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate = new Date(now);
    startDate.setDate(now.getDate() + diffToMonday);
    startDate.setHours(0, 0, 0, 0);
    
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
  } else {
    // Текущий месяц
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  return { startDate, endDate };
};