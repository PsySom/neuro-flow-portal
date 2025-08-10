import { useMemo, useCallback } from 'react';
import { useActivitiesRange } from '@/hooks/api/useActivities';
import { convertApiActivitiesToUi } from '@/utils/activityAdapter';
import { useUnifiedActivityOperations } from '@/hooks/useUnifiedActivityOperations';
import { getActivitiesForDate } from '@/utils/activitySync';
import { expandRecurringForRange } from '../utils/recurrenceExpansion';

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

  // Get date range for the month view using local timezone
  const { startDate, endDate } = useMemo(() => {
    const start = days[0].toLocaleDateString('en-CA'); // YYYY-MM-DD in local timezone
    const end = days[days.length - 1].toLocaleDateString('en-CA'); // YYYY-MM-DD in local timezone
    return { startDate: start, endDate: end };
  }, [days]);

  // Use API call for the month range
  const { data: monthApiActivities = [], isLoading } = useActivitiesRange(startDate, endDate);

  console.log('MonthView: Date range:', { startDate, endDate });
  console.log('MonthView: API activities count:', monthApiActivities.length);

  // Convert API activities to UI format
  const monthActivities = useMemo(() => {
    const converted = convertApiActivitiesToUi(monthApiActivities);
    try {
      // Expand recurring activities within the month grid range
      const { expandRecurringForRange } = require('../utils/recurrenceExpansion');
      const expanded = expandRecurringForRange(converted, startDate, endDate);
      console.log('MonthView: Converted + expanded activities count:', expanded.length);
      return expanded;
    } catch (e) {
      console.warn('MonthView: recurrence expansion util not available, using converted only');
      return converted;
    }
  }, [monthApiActivities, startDate, endDate]);

  const isToday = useCallback((date: Date) => {
    return date.toDateString() === today.toDateString();
  }, [today]);

  const isCurrentMonth = useCallback((date: Date) => {
    return date.getMonth() === currentMonth;
  }, [currentMonth]);

  const getActivitiesForDateObj = useCallback((date: Date) => {
    // Get date string in local timezone format (YYYY-MM-DD)
    const dateString = date.toLocaleDateString('en-CA'); // Always gives YYYY-MM-DD format
    
    console.log(`MonthView: Looking for activities on ${dateString} (calendar date: ${date.toDateString()})`);
    
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

  // Get activity operations with unified interface
  const {
    handleActivityCreate,
    handleActivityUpdate,
    handleActivityDelete,
    handleActivityToggle
  } = useUnifiedActivityOperations(monthActivities);

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