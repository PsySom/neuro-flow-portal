
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
  
  // Группируем пересекающиеся активности
  const activityGroups: Activity[][] = [];
  const processed = new Set<number>();
  
  activities.forEach(activity => {
    if (processed.has(activity.id)) return;
    
    const group: Activity[] = [activity];
    processed.add(activity.id);
    
    // Находим все активности, которые пересекаются с текущей или с активностями группы
    let foundNew = true;
    while (foundNew) {
      foundNew = false;
      activities.forEach(otherActivity => {
        if (processed.has(otherActivity.id)) return;
        
        // Проверяем пересечение с любой активностью в группе
        const overlapsWithGroup = group.some(groupActivity => 
          activitiesOverlap(groupActivity, otherActivity)
        );
        
        if (overlapsWithGroup) {
          group.push(otherActivity);
          processed.add(otherActivity.id);
          foundNew = true;
        }
      });
    }
    
    activityGroups.push(group);
  });
  
  // Для каждой группы рассчитываем позиции
  activityGroups.forEach(group => {
    // Сортируем по времени начала
    group.sort((a, b) => getTimeInMinutes(a.startTime) - getTimeInMinutes(b.startTime));
    
    const totalColumns = Math.min(group.length, 4);
    const columnWidth = 100 / totalColumns;
    
    group.forEach((activity, index) => {
      const startMinutes = getTimeInMinutes(activity.startTime);
      let endMinutes = getTimeInMinutes(activity.endTime);
      
      // Обработка активностей, пересекающих полночь
      if (endMinutes < startMinutes) {
        endMinutes += 24 * 60;
      }
      
      // Позиция по вертикали - всегда соответствует времени начала
      const top = (startMinutes / 60) * 60; // 60px на час
      
      // Высота блока
      let height = ((endMinutes - startMinutes) / 60) * 60;
      
      // Минимальная высота - размер часового блока (60px)
      height = Math.max(height, 60);
      
      // Горизонтальное позиционирование
      const column = index % totalColumns;
      const left = column * columnWidth;
      
      layouts.push({
        activity,
        top: Math.max(0, top),
        height: Math.min(height, 1440 - Math.max(0, top)),
        left,
        width: columnWidth - 1, // -1% для отступа между блоками
        column,
        totalColumns
      });
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
