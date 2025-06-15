
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

export const createTimeSlots = (activities: Activity[]): TimeSlot[] => {
  return Array.from({ length: 8 }, (_, i) => {
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
