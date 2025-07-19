import { useMemo, useCallback } from 'react';
import { useActivitiesRange } from '@/hooks/api/useActivities';
import { convertApiActivitiesToUi } from '@/utils/activityAdapter';
import { useActivityOperations } from '@/hooks/useActivityOperations';
import { getActivitiesForDate } from '@/utils/activitySync';

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

  console.log('MonthView: Date range:', { startDate, endDate });
  console.log('MonthView: API activities count:', monthApiActivities.length);

  // Convert API activities to UI format
  const monthActivities = useMemo(() => {
    const converted = convertApiActivitiesToUi(monthApiActivities);
    console.log('MonthView: Converted activities count:', converted.length);
    return converted;
  }, [monthApiActivities]);

  const isToday = useCallback((date: Date) => {
    return date.toDateString() === today.toDateString();
  }, [today]);

  const isCurrentMonth = useCallback((date: Date) => {
    return date.getMonth() === currentMonth;
  }, [currentMonth]);

  const getActivitiesForDateObj = useCallback((date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    
    // Use enhanced sync utility for better date filtering
    const dayActivities = getActivitiesForDate(monthActivities, dateString);
    
    console.log(`MonthView: Raw activities for ${dateString}:`, dayActivities.length, dayActivities.map(a => ({ id: a.id, name: a.name, date: a.date })));
    
    // Sort activities by start time
    dayActivities.sort((a, b) => {
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });
    
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