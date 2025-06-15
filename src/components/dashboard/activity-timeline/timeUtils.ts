
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
      
      if (activityEndMinutes < activityStartMinutes) {
        return (
          (activityStartMinutes >= blockStartMinutes && activityStartMinutes < blockEndMinutes) ||
          (activityEndMinutes > blockStartMinutes && activityEndMinutes <= blockEndMinutes) ||
          (blockStartMinutes < 24 * 60 && blockEndMinutes > 0 && activityStartMinutes >= blockStartMinutes) ||
          (blockStartMinutes < activityEndMinutes && blockEndMinutes > 0)
        );
      } else {
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
  
  if (activityEndMinutes < activityStartMinutes) {
    return (
      (activityStartHour >= startHour && activityStartHour < startHour + 3) ||
      (startHour === 0 && activityEndMinutes <= (startHour + 3) * 60)
    );
  } else {
    return activityStartHour >= startHour && activityStartHour < startHour + 3;
  }
};
