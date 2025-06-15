
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

// Функция для расчета раскладки активностей
export const calculateActivityLayouts = (activities: Activity[]): ActivityLayout[] => {
  const layouts: ActivityLayout[] = [];
  
  // Сортируем активности по времени начала
  const sortedActivities = [...activities].sort((a, b) => 
    getTimeInMinutes(a.startTime) - getTimeInMinutes(b.startTime)
  );
  
  // Отслеживаем занятость колонок для каждого часового блока
  const columnUsage: { [hourBlock: number]: boolean[] } = {};
  
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
    
    // Определяем ширину и позицию
    let left = 0;
    let width = 100;
    let column = 0;
    let totalColumns = 1;
    
    // Если активность меньше часа, размещаем каскадом
    if (durationMinutes < 60) {
      const hourBlock = Math.floor(startMinutes / 60);
      
      // Инициализируем отслеживание колонок для этого часа если нужно
      if (!columnUsage[hourBlock]) {
        columnUsage[hourBlock] = [false, false, false]; // 3 колонки
      }
      
      // Ищем свободную колонку
      let assignedColumn = 0;
      for (let i = 0; i < 3; i++) {
        if (!columnUsage[hourBlock][i]) {
          assignedColumn = i;
          columnUsage[hourBlock][i] = true;
          break;
        }
      }
      
      // Если все колонки заняты, используем каскадное наслоение
      if (columnUsage[hourBlock].every(col => col)) {
        assignedColumn = Math.floor(Math.random() * 3);
      }
      
      totalColumns = 3;
      column = assignedColumn;
      width = 100 / 3 - 1; // Треть ширины минус отступ
      left = (100 / 3) * assignedColumn;
    } else {
      // Активности час и более занимают всю ширину
      const startHour = Math.floor(startMinutes / 60);
      const endHour = Math.ceil(endMinutes / 60);
      
      // Помечаем все часы как занятые для полной ширины
      for (let hour = startHour; hour < endHour; hour++) {
        if (!columnUsage[hour]) {
          columnUsage[hour] = [true, true, true];
        } else {
          columnUsage[hour] = [true, true, true];
        }
      }
      
      left = 0;
      width = 100;
      column = 0;
      totalColumns = 1;
    }
    
    layouts.push({
      activity,
      top: Math.max(0, top),
      height: Math.min(height, 1440 - Math.max(0, top)),
      left,
      width,
      column,
      totalColumns
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
