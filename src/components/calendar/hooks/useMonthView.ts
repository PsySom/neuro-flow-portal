import { useMemo, useCallback } from 'react';
import { useActivitiesRangeApi } from '@/hooks/api/useActivitiesApi';
import { useCalendarView } from '@/hooks/useCalendarView';

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
  const { data: monthApiActivities = [], isLoading } = useActivitiesRangeApi(startDate, endDate);

  console.log('MonthView: Date range:', { startDate, endDate });
  console.log('MonthView: API activities count:', monthApiActivities.length);

  // Use unified calendar view logic for consistent behavior
  const calendarView = useCalendarView({
    viewType: 'month',
    activities: monthApiActivities,
    isLoading,
    startDate,
    endDate
  });

  const isToday = useCallback((date: Date) => {
    return date.toDateString() === today.toDateString();
  }, [today]);

  const isCurrentMonth = useCallback((date: Date) => {
    return date.getMonth() === currentMonth;
  }, [currentMonth]);

  const getActivitiesForDateObj = useCallback((date: Date) => {
    const dateString = date.toLocaleDateString('en-CA');
    
    console.log(`MonthView: Looking for activities on ${dateString} (calendar date: ${date.toDateString()})`);
    
    const dayActivities = calendarView.getActivitiesForDate(dateString);
    
    console.log(`MonthView: Filtered activities for ${dateString}:`, dayActivities.length, dayActivities.map(a => ({ id: a.id, name: a.name, date: a.date })));
    
    return dayActivities;
  }, [calendarView]);

  const truncateText = useCallback((text: string, maxLength: number = 12) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }, []);

  return {
    days,
    currentMonth,
    today,
    isToday,
    isCurrentMonth,
    getActivitiesForDateObj,
    truncateText,
    // Spread all calendar view functionality for consistency
    ...calendarView
  };
};