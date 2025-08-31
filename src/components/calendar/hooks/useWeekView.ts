import { useRef, useMemo } from 'react';
import { useWeekDates } from './useWeekDates';
import { useActivitiesRangeApi } from '@/hooks/api/useActivitiesApi';
import { useCalendarView } from '@/hooks/useCalendarView';

export const useWeekView = (currentDate: Date) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Get week dates
  const { weekDays, startDate, endDate } = useWeekDates(currentDate);

  // Get activities for the week
  const { data: weekApiActivities = [], isLoading } = useActivitiesRangeApi(startDate, endDate);

  // Use unified calendar view logic
  const calendarView = useCalendarView({
    viewType: 'week',
    activities: weekApiActivities,
    isLoading,
    startDate,
    endDate
  });

  // Enhanced empty area click handler with day context
  const handleEmptyAreaClick = (e: React.MouseEvent<HTMLDivElement>, dayIndex: number) => {
    const target = e.target as HTMLElement;
    
    if (target.closest('[data-activity-card]')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    
    const hourFromTop = Math.floor(clickY / 90);
    const minuteFromTop = Math.floor((clickY % 90) * (60 / 90));
    
    const clickTime = `${hourFromTop.toString().padStart(2, '0')}:${Math.round(minuteFromTop).toString().padStart(2, '0')}`;
    const clickDate = weekDays[dayIndex] ? weekDays[dayIndex].toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    
    console.log('Week view click:', clickTime, clickDate);
    calendarView.handleTimeSlotClick(clickTime, clickDate);
  };

  // Get activities for specific day using unified logic
  const getActivitiesForDay = (day: Date) => {
    const dayString = day.toLocaleDateString('en-CA');
    return calendarView.getActivitiesForDate(dayString);
  };

  return {
    scrollAreaRef,
    weekDays,
    getActivitiesForDay,
    handleEmptyAreaClick,
    // Spread all calendar view functionality
    ...calendarView
  };
};