
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

// Функция для поиска свободной колонки для активности
const findAvailableColumn = (activity: Activity, existingLayouts: ActivityLayout[]): number => {
  const overlappingActivities = existingLayouts.filter(layout => 
    activitiesOverlap(activity, layout.activity)
  );
  
  if (overlappingActivities.length === 0) {
    return 0; // Первая колонка свободна
  }
  
  // Найти занятые колонки
  const occupiedColumns = overlappingActivities.map(layout => layout.column);
  
  // Найти первую свободную колонку (максимум 3 колонки по третям)
  for (let column = 0; column < 3; column++) {
    if (!occupiedColumns.includes(column)) {
      return column;
    }
  }
  
  // Если все три колонки заняты, размещаем в первой с меньшей шириной
  return 0;
};

// Функция для расчета раскладки активностей
export const calculateActivityLayouts = (activities: Activity[]): ActivityLayout[] => {
  const layouts: ActivityLayout[] = [];
  
  // Сортируем активности по времени начала
  const sortedActivities = [...activities].sort((a, b) => 
    getTimeInMinutes(a.startTime) - getTimeInMinutes(b.startTime)
  );
  
  sortedActivities.forEach(activity => {
    const startMinutes = getTimeInMinutes(activity.startTime);
    let endMinutes = getTimeInMinutes(activity.endTime);
    
    // Обработка активностей, пересекающих полночь
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }
    
    const durationMinutes = endMinutes - startMinutes;
    const top = (startMinutes / 60) * 60; // 60px на час
    
    // Определяем высоту блока - минимум 60px
    const calculatedHeight = (durationMinutes / 60) * 60;
    const height = Math.max(calculatedHeight, 60);
    
    // Найти доступную колонку для этой активности
    const column = findAvailableColumn(activity, layouts);
    
    // Рассчитать количество колонок для текущего времени
    const overlappingActivities = layouts.filter(layout => 
      activitiesOverlap(activity, layout.activity)
    );
    
    const maxColumns = Math.max(1, overlappingActivities.length + 1, 3);
    const columnsToUse = Math.min(maxColumns, 3); // Максимум 3 колонки
    
    // Размещение по третям: каждая колонка занимает треть ширины
    const width = (100 / 3) - 2; // Треть ширины минус отступы
    const left = (100 / 3) * column + 1; // Позиция по горизонтали
    
    // Обновить существующие активности в том же временном диапазоне
    overlappingActivities.forEach(layout => {
      if (layout.width > width) {
        layout.width = width;
        layout.left = (100 / 3) * layout.column + 1;
      }
    });
    
    layouts.push({
      activity,
      top: Math.max(0, top),
      height: Math.min(height, 1440 - Math.max(0, top)),
      left,
      width,
      column,
      totalColumns: columnsToUse
    });
  });
  
  return layouts;
};

// Генерируем часовые отметки
export const generateTimeMarkers = () => {
  return Array.from({ length: 25 }, (_, i) => {
    const hour = i;
    return {
      hour,
      time: `${hour.toString().padStart(2, '0')}:00`,
      position: hour * 60 // 60px на час
    };
  });
};
