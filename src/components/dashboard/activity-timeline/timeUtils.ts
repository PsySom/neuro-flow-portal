
import { Activity as ContextActivity } from '@/contexts/ActivitiesContext';
import { Activity, TimeSlot } from './types';

export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export const getCurrentTimePosition = (currentTime: Date): number => {
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const totalMinutes = currentHour * 60 + currentMinute;
  
  const slotIndex = Math.floor(currentHour / 3);
  const slotStartMinutes = slotIndex * 180;
  const minutesIntoSlot = totalMinutes - slotStartMinutes;
  
  const slotHeight = 95 + 8;
  const positionInSlot = (minutesIntoSlot / 180) * slotHeight;
  
  return slotIndex * slotHeight + positionInSlot + 60;
};

export const getActivityTimePosition = (timeStr: string): number => {
  const totalMinutes = timeToMinutes(timeStr);
  // Each hour takes 60px in the timeline grid
  return totalMinutes;
};

export interface ActivityTimelineLayout {
  activity: ContextActivity;
  top: number;
  left: number;
  width: number;
  column: number;
  totalColumns: number;
}

export const calculateTimelineActivityLayouts = (activities: ContextActivity[]): ActivityTimelineLayout[] => {
  if (!activities.length) return [];

  // Sort activities by start time
  const sortedActivities = [...activities].sort((a, b) => 
    timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  const layouts: ActivityTimelineLayout[] = [];
  const columns: { start: number; end: number; activities: ContextActivity[] }[] = [];

  for (const activity of sortedActivities) {
    const startMinutes = timeToMinutes(activity.startTime);
    const endMinutes = activity.endTime ? timeToMinutes(activity.endTime) : startMinutes + 60; // Default 1 hour if no end time

    // Find if this activity overlaps with existing columns
    let assignedColumn = -1;
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      const hasOverlap = column.activities.some(colActivity => {
        const colStart = timeToMinutes(colActivity.startTime);
        const colEnd = colActivity.endTime ? timeToMinutes(colActivity.endTime) : colStart + 60;
        return startMinutes < colEnd && endMinutes > colStart;
      });

      if (!hasOverlap) {
        assignedColumn = i;
        column.activities.push(activity);
        column.start = Math.min(column.start, startMinutes);
        column.end = Math.max(column.end, endMinutes);
        break;
      }
    }

    // If no suitable column found, create a new one
    if (assignedColumn === -1) {
      assignedColumn = columns.length;
      columns.push({
        start: startMinutes,
        end: endMinutes,
        activities: [activity]
      });
    }

    layouts.push({
      activity,
      top: startMinutes,
      left: 0, // Will be calculated based on column
      width: 0, // Will be calculated based on total columns
      column: assignedColumn,
      totalColumns: 0 // Will be set after all activities are processed
    });
  }

  // Update total columns for all layouts
  const totalColumns = columns.length;
  layouts.forEach(layout => {
    layout.totalColumns = totalColumns;
    layout.left = (layout.column / totalColumns) * 100;
    layout.width = (1 / totalColumns) * 100;
  });

  return layouts;
};

export const createTimeSlots = (activities: Activity[]): TimeSlot[] => {
  const allSlots = Array.from({ length: 8 }, (_, i) => {
    const startHour = i * 3;
    const endHour = (i + 1) * 3;
    const timeString = `${startHour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:00`;
    
    const blockActivities = activities.filter(activity => {
      const activityStartMinutes = timeToMinutes(activity.startTime);
      const activityEndMinutes = timeToMinutes(activity.endTime);
      const blockStartMinutes = startHour * 60;
      const blockEndMinutes = endHour * 60;
      
      // Проверяем активности, которые пересекают полночь
      if (activityEndMinutes < activityStartMinutes) {
        // Активность пересекает полночь (например, сон с 22:30 до 08:00)
        return (
          // Часть активности в текущих сутках (например, 22:30-24:00)
          (activityStartMinutes < 24 * 60 && activityStartMinutes < blockEndMinutes && blockStartMinutes < 24 * 60) ||
          // Часть активности в следующих сутках (например, 00:00-08:00)
          (activityEndMinutes > 0 && blockStartMinutes < activityEndMinutes && blockEndMinutes > 0)
        );
      } else {
        // Обычная активность в пределах одних суток
        return (
          activityStartMinutes < blockEndMinutes && activityEndMinutes > blockStartMinutes
        );
      }
    });

    return {
      startHour,
      endHour,
      timeString,
      activities: blockActivities
    };
  });

  // Фильтруем слоты: оставляем только те, которые имеют активности или не полностью покрываются другими активностями
  return allSlots.filter(slot => {
    // Если в слоте есть активности, показываем его
    if (slot.activities.length > 0) {
      return true;
    }

    // Если слот пустой, проверяем, не покрывается ли он полностью какой-то активностью
    const blockStartMinutes = slot.startHour * 60;
    const blockEndMinutes = slot.endHour * 60;

    const isFullyCovered = activities.some(activity => {
      const activityStartMinutes = timeToMinutes(activity.startTime);
      const activityEndMinutes = timeToMinutes(activity.endTime);

      // Для активностей, пересекающих полночь
      if (activityEndMinutes < activityStartMinutes) {
        // Проверяем, покрывается ли слот утренней частью активности (00:00-XX:XX)
        if (blockStartMinutes >= 0 && blockEndMinutes <= activityEndMinutes) {
          return true;
        }
        // Проверяем, покрывается ли слот вечерней частью активности (XX:XX-24:00)
        if (blockStartMinutes >= activityStartMinutes && blockEndMinutes <= 24 * 60) {
          return true;
        }
      } else {
        // Для обычных активностей
        return activityStartMinutes <= blockStartMinutes && activityEndMinutes >= blockEndMinutes;
      }

      return false;
    });

    return !isFullyCovered;
  });
};

export const isActivityStart = (activity: Activity, startHour: number): boolean => {
  const activityStartHour = parseInt(activity.startTime.split(':')[0]);
  const activityEndMinutes = timeToMinutes(activity.endTime);
  const activityStartMinutes = timeToMinutes(activity.startTime);
  
  // Если активность пересекает полночь
  if (activityEndMinutes < activityStartMinutes) {
    // Показываем в блоке, где активность начинается (например, в 21:00-24:00 для сна, начинающегося в 22:30)
    if (activityStartHour >= startHour && activityStartHour < startHour + 3) {
      return true;
    }
    // Также показываем в первом блоке дня (00:00-03:00) для активностей, которые продолжаются после полуночи
    if (startHour === 0 && activityEndMinutes > 0) {
      return true;
    }
    return false;
  } else {
    // Обычная активность
    return activityStartHour >= startHour && activityStartHour < startHour + 3;
  }
};
