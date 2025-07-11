import { useMemo, useCallback } from 'react';
import { useActivitiesRange } from '@/hooks/api/useActivities';
import { convertApiActivitiesToUi } from '@/utils/activityAdapter';
import { useActivityOperations } from '@/hooks/useActivityOperations';

export const useMonthView = (currentDate: Date) => {
  const today = new Date();
  
  const { days, currentMonth } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);
    
    // Adjust to start from Monday
    const startDay = firstDay.getDay();
    startDate.setDate(firstDay.getDate() - (startDay === 0 ? 6 : startDay - 1));
    
    const endDay = lastDay.getDay();
    endDate.setDate(lastDay.getDate() + (endDay === 0 ? 0 : 7 - endDay));
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return { days, currentMonth: month };
  }, [currentDate]);

  // Get date range for the month view
  const { startDate, endDate } = useMemo(() => {
    const start = days[0].toISOString().split('T')[0];
    const end = days[days.length - 1].toISOString().split('T')[0];
    return { startDate: start, endDate: end };
  }, [days]);

  // Use API call for the month range
  const { data: monthApiActivities = [], isLoading } = useActivitiesRange(startDate, endDate);

  // Convert API activities to UI format
  const monthActivities = useMemo(() => {
    return convertApiActivitiesToUi(monthApiActivities);
  }, [monthApiActivities]);

  const isToday = useCallback((date: Date) => {
    return date.toDateString() === today.toDateString();
  }, [today]);

  const isCurrentMonth = useCallback((date: Date) => {
    return date.getMonth() === currentMonth;
  }, [currentMonth]);

  const getActivitiesForDateObj = useCallback((date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    
    // Filter activities for this specific day
    const dayActivities = monthActivities.filter(activity => {
      try {
        // Validate activity date field
        if (!activity.date) {
          console.warn('Activity has no date field:', activity);
          return false;
        }
        
        // Compare date fields directly instead of constructing dates
        const activityDateString = activity.date;
        return activityDateString === dateString;
      } catch (error) {
        console.error('Error processing activity date:', error, activity);
        return false;
      }
    });
    
    // Sort activities by start time
    dayActivities.sort((a, b) => {
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });
    
    console.log(`MonthView: Activities for ${dateString}:`, dayActivities.length);
    return dayActivities;
  }, [monthActivities]);

  const truncateText = useCallback((text: string, maxLength: number = 12) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }, []);

  // Get activity operations
  const {
    handleActivityCreate,
    handleActivityUpdate,
    handleActivityDelete,
    handleActivityToggle
  } = useActivityOperations(monthActivities);

  return {
    days,
    currentMonth,
    today,
    monthActivities,
    isToday,
    isCurrentMonth,
    getActivitiesForDateObj,
    truncateText,
    isLoading,
    handleActivityCreate,
    handleActivityUpdate,
    handleActivityDelete,
    handleActivityToggle
  };
};