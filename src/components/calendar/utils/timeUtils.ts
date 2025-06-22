import { Activity, ActivityLayout } from '../types';

// Функция для получения времени в минутах от начала дня
export const getTimeInMinutes = (timeString: string): number => {
  const [hour, minute] = timeString.split(':').map(Number);
  return hour * 60 + minute;
};

// Функция для проверки пересечения активностей
export const activitiesOverlap = (activity1: Activity, activity2: Activity): boolean => {
  const start1 = getTimeInMinutes(activity1.startTime);
  let end1 = getTimeInMinutes(activity1.endTime);
  const start2 = getTimeInMinutes(activity2.startTime);
  let end2 = getTimeInMinutes(activity2.endTime);
  
  // Обработка активностей, пересекающих полночь
  if (end1 < start1) end1 += 24 * 60;
  if (end2 < start2) end2 += 24 * 60;
  
  return start1 < end2 && start2 < end1;
};

// Функция для поиска свободной колонки для недели (позволяет наложение)
const findAvailableColumn = (activity: Activity, existingLayouts: ActivityLayout[]): number => {
  const overlappingActivities = existingLayouts.filter(layout => 
    activitiesOverlap(activity, layout.activity)
  );
  
  if (overlappingActivities.length === 0) {
    return 0;
  }
  
  const occupiedColumns = overlappingActivities.map(layout => layout.column);
  
  // Ищем первую свободную колонку, если все заняты - используем колонку 0 (наложение)
  for (let column = 0; column < 3; column++) {
    if (!occupiedColumns.includes(column)) {
      return column;
    }
  }
  
  return 0; // Наложение на первую колонку
};

// Функция для расчета раскладки активностей
export const calculateActivityLayouts = (activities: Activity[]): ActivityLayout[] => {
  const layouts: ActivityLayout[] = [];
  
  console.log('calculateActivityLayouts: Processing', activities.length, 'activities');
  
  // Сортируем активности по времени начала
  const sortedActivities = [...activities].sort((a, b) => 
    getTimeInMinutes(a.startTime) - getTimeInMinutes(b.startTime)
  );
  
  sortedActivities.forEach((activity) => {
    const startMinutes = getTimeInMinutes(activity.startTime);
    let endMinutes = getTimeInMinutes(activity.endTime);
    
    // Обработка активностей, пересекающих полночь
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }
    
    const durationMinutes = endMinutes - startMinutes;
    
    // Точное позиционирование по времени (90px = 1 час = 60 минут)
    const pixelsPerMinute = 90 / 60; // 1.5px на минуту
    let top = startMinutes * pixelsPerMinute;
    
    // Для активностей, пересекающих полночь
    if (startMinutes >= 22 * 60 && endMinutes > 24 * 60) {
      top = startMinutes * pixelsPerMinute;
    } else if (startMinutes < endMinutes - 24 * 60) {
      top = 0;
    }
    
    // Вычисляем высоту блока - точное соответствие времени
    let displayDurationMinutes = durationMinutes;
    
    if (endMinutes > 24 * 60) {
      if (startMinutes >= 22 * 60) {
        displayDurationMinutes = 24 * 60 - startMinutes;
      } else {
        displayDurationMinutes = endMinutes - 24 * 60;
        top = 0;
      }
    }
    
    const height = Math.max(displayDurationMinutes * pixelsPerMinute, 20); // Минимальная высота 20px
    
    // Найти свободную колонку (допускаем наложение)
    const column = findAvailableColumn(activity, layouts);
    
    // Размещение по колонкам
    const width = (100 / 3) - 1;
    const left = (100 / 3) * column + 0.5;
    
    console.log(`Activity "${activity.name}" positioned at ${top}px with height ${height}px in column ${column}`);
    
    // Убеждаемся, что активность находится в пределах видимой области
    const finalTop = Math.max(0, Math.min(top, 2160 - height));
    const finalHeight = Math.min(height, 2160 - finalTop);
    
    layouts.push({
      activity,
      top: finalTop,
      height: finalHeight,
      left,
      width,
      column,
      totalColumns: 3
    });
  });
  
  console.log('calculateActivityLayouts: Created', layouts.length, 'layouts');
  
  return layouts;
};

// Генерируем часовые отметки
export const generateTimeMarkers = () => {
  return Array.from({ length: 25 }, (_, i) => {
    const hour = i;
    return {
      hour,
      time: `${hour.toString().padStart(2, '0')}:00`,
      position: hour * 90
    };
  });
};
