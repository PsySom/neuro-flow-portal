
import { Activity, ActivityLayout } from '../types';

export const calculateActivityLayouts = (activities: Activity[]): ActivityLayout[] => {
  if (!activities || activities.length === 0) return [];

  // Сортируем активности по времени начала
  const sortedActivities = [...activities].sort((a, b) => {
    const timeA = parseTime(a.startTime);
    const timeB = parseTime(b.startTime);
    return timeA - timeB;
  });

  const layouts: ActivityLayout[] = [];
  const columns: Activity[][] = [];

  for (const activity of sortedActivities) {
    const startTime = parseTime(activity.startTime);
    const endTime = parseTime(activity.endTime);
    const duration = endTime - startTime;
    const top = (startTime / 60) * 90; // 90px на час
    const height = Math.max((duration / 60) * 90, 30); // минимальная высота 30px

    // Найдем колонку для размещения активности
    let columnIndex = 0;
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      const hasConflict = column.some(existingActivity => {
        const existingStart = parseTime(existingActivity.startTime);
        const existingEnd = parseTime(existingActivity.endTime);
        return !(endTime <= existingStart || startTime >= existingEnd);
      });
      
      if (!hasConflict) {
        columnIndex = i;
        break;
      }
      
      if (i === columns.length - 1) {
        columnIndex = columns.length;
        break;
      }
    }

    // Создаем новую колонку если нужно
    if (columnIndex >= columns.length) {
      columns.push([]);
    }
    
    columns[columnIndex].push(activity);

    // Находим все пересекающиеся активности для определения общего количества колонок
    const conflictingActivities = sortedActivities.filter(otherActivity => {
      if (otherActivity.id === activity.id) return true;
      const otherStart = parseTime(otherActivity.startTime);
      const otherEnd = parseTime(otherActivity.endTime);
      return !(endTime <= otherStart || startTime >= otherEnd);
    });

    const totalColumns = Math.max(1, conflictingActivities.length);
    const widthPercent = 100 / totalColumns;
    const leftPercent = columnIndex * widthPercent;

    layouts.push({
      activity,
      top,
      height,
      left: leftPercent,
      width: widthPercent,
      column: columnIndex,
      totalColumns
    });
  }

  return layouts;
};

const parseTime = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const getCurrentTime = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

export const isCurrentTimeInRange = (startTime: string, endTime: string): boolean => {
  const currentMinutes = getCurrentTime();
  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);
  
  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
};

// Генерируем часовые отметки
export const generateTimeMarkers = () => {
  return Array.from({ length: 25 }, (_, i) => {
    const hour = i;
    return {
      hour,
      time: `${hour.toString().padStart(2, '0')}:00`,
      position: hour * 90 // 90px на час
    };
  });
};
