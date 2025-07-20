import { useState, useRef, useCallback } from 'react';
import { useWeekDates } from './useWeekDates';
import { useWeekActivities } from './useWeekActivities';
import { useActivityOperations } from '@/hooks/useActivityOperations';
import { useActivitiesSync } from '@/hooks/api/useActivities';

export const useWeekView = (currentDate: Date) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Get week dates
  const { weekDays, startDate, endDate } = useWeekDates(currentDate);

  // Get activities for the week with realtime updates
  const {
    weekActivities,
    filteredTypes,
    isLoading,
    getWeekActivities,
    getActivitiesForDay,
    handleTypeFilterChange
  } = useWeekActivities(startDate, endDate);

  // Get sync utilities
  const { syncActivities } = useActivitiesSync();

  const handleEmptyAreaClick = useCallback((e: React.MouseEvent<HTMLDivElement>, dayIndex: number) => {
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
    
    setSelectedTime(clickTime);
    setSelectedDate(clickDate);
    setIsCreateDialogOpen(true);
  }, [weekDays]);

  return {
    scrollAreaRef,
    filteredTypes,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    selectedTime,
    selectedDate,
    weekDays,
    getWeekActivities,
    getActivitiesForDay,
    handleEmptyAreaClick,
    handleTypeFilterChange,
    isLoading,
    syncActivities // Export sync function
  };
};