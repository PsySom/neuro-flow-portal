
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

// Функция для поиска свободной трети в конкретном временном слоте
const findAvailableThirdInTimeSlot = (activity: Activity, existingLayouts: ActivityLayout[]): number => {
  // Найти все активности, которые пересекаются по времени с текущей
  const overlappingActivities = existingLayouts.filter(layout => 
    activitiesOverlap(activity, layout.activity)
  );
  
  // Найти занятые трети среди пересекающихся активностей
  const occupiedThirds = overlappingActivities.map(layout => layout.column);
  
  // Найти первую свободную треть (0, 1, 2)
  for (let third = 0; third < 3; third++) {
    if (!occupiedThirds.includes(third)) {
      return third;
    }
  }
  
  // Если все три трети заняты, возвращаем -1
  return -1;
};

// Функция для расчета раскладки активностей
export const calculateActivityLayouts = (activities: Activity[]): ActivityLayout[] => {
  const layouts: ActivityLayout[] = [];
  
  // Сортируем активности по времени начала для корректного размещения
  const sortedActivities = [...activities].sort((a, b) => 
    getTimeInMinutes(a.startTime) - getTimeInMinutes(b.startTime)
  );
  
  sortedActivities.forEach((activity, index) => {
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
    
    // Сначала пытаемся найти свободную треть в этом временном слоте
    let column = findAvailableThirdInTimeSlot(activity, layouts);
    
    // Если в текущем временном слоте нет свободных третей, 
    // используем циклическое распределение по общему индексу
    if (column === -1) {
      column = index % 3;
      console.warn(`Time slot full for activity "${activity.name}", using cyclic placement in third ${column + 1}`);
    }
    
    // Размещение по третям: каждая треть занимает треть ширины
    const width = (100 / 3) - 1; // Треть ширины минус небольшой отступ
    const left = (100 / 3) * column + 0.5; // Позиция по горизонтали с небольшим отступом
    
    layouts.push({
      activity,
      top: Math.max(0, top),
      height: Math.min(height, 1440 - Math.max(0, top)),
      left,
      width,
      column,
      totalColumns: 3 // Всегда 3 трети
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
