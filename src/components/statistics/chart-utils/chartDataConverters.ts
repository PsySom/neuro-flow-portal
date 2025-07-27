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
    console.log(`📝 Запись ${format(entryDate, 'yyyy-MM-dd HH:mm')} в диапазоне: ${isInRange}`);
    return isInRange;
  });

  console.log(`🔍 Отфильтровано ${filteredEntries.length} записей из ${entries.length} для диапазона ${range}`);

  if (filteredEntries.length === 0) {
    console.log('📊 Нет записей в указанном диапазоне');
    return [];
  }

  const chartData: ChartDataPoint[] = [];
  const groupedData = new Map<string, MoodEntry[]>();

  // Группируем записи по времени в зависимости от диапазона
  filteredEntries.forEach(entry => {
    const entryDate = new Date(entry.timestamp);
    let timeKey: string;

    if (range === 'day') {
      // Группируем по часам и минутам
      timeKey = format(entryDate, 'HH:mm');
    } else if (range === 'week') {
      // Группируем по дням недели с проверкой что запись в текущей неделе
      const dayNames = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
      const dayIndex = (entryDate.getDay() + 6) % 7; // Преобразуем воскресенье=0 в понедельник=0
      const dayName = dayNames[dayIndex];
      const dateStr = format(entryDate, 'dd.MM');
      timeKey = `${dayName}\n${dateStr}`;
    } else {
      // Группируем по дням месяца
      timeKey = format(entryDate, 'd');
    }

    console.log(`🏷️ Запись ${entry.timestamp} → timeKey: "${timeKey}"`);

    if (!groupedData.has(timeKey)) {
      groupedData.set(timeKey, []);
    }
    groupedData.get(timeKey)!.push(entry);
  });

  console.log(`📊 Сгруппировано в ${groupedData.size} временных интервалов:`, Array.from(groupedData.keys()));

  // Конвертируем сгруппированные данные в точки графика
  groupedData.forEach((entriesGroup, timeKey) => {
    // Усредняем настроение если несколько записей в одном временном интервале
    const avgMood = entriesGroup.reduce((sum, entry) => sum + entry.mood_score, 0) / entriesGroup.length;
    
    // Собираем все эмоции
    const allEmotions: string[] = [];
    entriesGroup.forEach(entry => {
      entry.emotions?.forEach(emotion => {
        if (!allEmotions.includes(emotion.name)) {
          allEmotions.push(emotion.name);
        }
      });
    });

    // Берем контекст и заметки из последней записи
    const lastEntry = entriesGroup[entriesGroup.length - 1];
    
    const dataPoint: ChartDataPoint = {
      time: timeKey,
      mood: avgMood,
      emotions: allEmotions,
      context: lastEntry.context,
      notes: lastEntry.notes,
      triggers: lastEntry.triggers,
      physical_sensations: lastEntry.physical_sensations,
      connection: allEmotions.join(', '),
      fullDate: format(new Date(lastEntry.timestamp), 'dd.MM.yyyy HH:mm')
    };

    console.log(`✨ Создана точка графика:`, dataPoint);
    chartData.push(dataPoint);
  });

  // Сортируем данные по времени
  if (range === 'day') {
    chartData.sort((a, b) => a.time.localeCompare(b.time));
  } else if (range === 'week') {
    // Сортировка для недели по дням
    const weekDayOrder = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
    chartData.sort((a, b) => {
      const dayA = a.time.split('\n')[0];
      const dayB = b.time.split('\n')[0];
      return weekDayOrder.indexOf(dayA) - weekDayOrder.indexOf(dayB);
    });
  } else {
    // Для месяца сортируем по числу
    chartData.sort((a, b) => parseInt(a.time) - parseInt(b.time));
  }

  console.log(`✅ Конвертировано в ${chartData.length} точек графика:`, chartData);
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