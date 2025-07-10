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

// Функция для поиска пересекающихся активностей
const findOverlappingActivities = (activity: Activity, existingActivities: Activity[]): Activity[] => {
  return existingActivities.filter(existingActivity => 
    activitiesOverlap(activity, existingActivity)
  );
};

// Функция для группировки пересекающихся активностей
const groupOverlappingActivities = (activities: Activity[]): Activity[][] => {
  const groups: Activity[][] = [];
  const processed = new Set<string>();

  activities.forEach(activity => {
    if (processed.has(activity.id.toString())) return;

    const group = [activity];
    processed.add(activity.id.toString());

    // Найти все активности, которые пересекаются с текущей или с любой в группе
    let changed = true;
    while (changed) {
      changed = false;
      activities.forEach(otherActivity => {
        if (processed.has(otherActivity.id.toString())) return;
        
        // Проверить пересечение с любой активностью в группе
        const overlapsWithGroup = group.some(groupActivity => 
          activitiesOverlap(groupActivity, otherActivity)
        );
        
        if (overlapsWithGroup) {
          group.push(otherActivity);
          processed.add(otherActivity.id.toString());
          changed = true;
        }
      });
    }

    groups.push(group);
  });

  return groups;
};

// Функция для расчета раскладки активностей
export const calculateActivityLayouts = (activities: Activity[]): ActivityLayout[] => {
  const layouts: ActivityLayout[] = [];
  
  console.log('calculateActivityLayouts: Processing', activities.length, 'activities');
  
  if (activities.length === 0) {
    return layouts;
  }
  
  // Сортируем активности по времени начала для корректного размещения
  const sortedActivities = [...activities].sort((a, b) => 
    getTimeInMinutes(a.startTime) - getTimeInMinutes(b.startTime)
  );
  
  // Группируем пересекающиеся активности
  const overlapGroups = groupOverlappingActivities(sortedActivities);
  
  overlapGroups.forEach(group => {
    const groupSize = group.length;
    
    // Рассчитываем ширину и отступы на основе количества активностей в группе
    let width: number;
    let spacing: number = 1; // Минимальный отступ между активностями
    
    switch (groupSize) {
      case 1:
        width = 100;
        spacing = 0;
        break;
      case 2:
        width = 50 - spacing;
        break;
      case 3:
        width = 33.33 - spacing;
        break;
      case 4:
        width = 25 - spacing;
        break;
      default:
        // Для большего количества активностей делим поровну
        width = (100 / groupSize) - spacing;
        break;
    }
    
    console.log(`Processing group of ${groupSize} overlapping activities with width ${width}%`);
    
    group.forEach((activity, indexInGroup) => {
      const startMinutes = getTimeInMinutes(activity.startTime);
      let endMinutes = getTimeInMinutes(activity.endTime);
      
      // Обработка активностей, пересекающих полночь (например, сон)
      if (endMinutes < startMinutes) {
        endMinutes += 24 * 60;
      }
      
      const durationMinutes = endMinutes - startMinutes;
      
      // Вычисляем позицию с учетом высоты строки (90px на час)
      let top = (startMinutes / 60) * 90;
      
      // Для активностей, пересекающих полночь, обрабатываем специально
      if (startMinutes >= 22 * 60 && endMinutes > 24 * 60) {
        top = (startMinutes / 60) * 90;
      } else if (startMinutes < endMinutes - 24 * 60) {
        top = 0;
      }
      
      // Вычисляем высоту блока с минимумом 50% от часа (45px)
      let displayDurationMinutes = durationMinutes;
      
      if (endMinutes > 24 * 60) {
        if (startMinutes >= 22 * 60) {
          displayDurationMinutes = 24 * 60 - startMinutes;
        } else {
          displayDurationMinutes = endMinutes - 24 * 60;
          top = 0;
        }
      }
      
      const calculatedHeight = (displayDurationMinutes / 60) * 90;
      const height = Math.max(calculatedHeight, 30); // Минимальная высота 30px
      
      // Рассчитываем горизонтальное положение
      const left = groupSize === 1 ? 0 : indexInGroup * (width + spacing);
      
      console.log(`Activity "${activity.name}" (${activity.startTime}-${activity.endTime}) placed at position ${indexInGroup + 1}/${groupSize}, left: ${left}%, width: ${width}%, top: ${top}px, height: ${height}px`);
      
      // Убеждаемся, что активность находится в пределах видимой области
      const finalTop = Math.max(0, Math.min(top, 2160 - height));
      const finalHeight = Math.min(height, 2160 - finalTop);
      
      layouts.push({
        activity,
        top: finalTop,
        height: finalHeight,
        left,
        width,
        column: indexInGroup,
        totalColumns: groupSize
      });
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
      position: hour * 90 // 90px на час
    };
  });
};
