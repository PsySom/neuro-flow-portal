
import { useState, useRef } from 'react';
import { useActivities } from '@/contexts/ActivitiesContext';
import { DeleteRecurringOption, RecurringActivityOptions } from '../utils/recurringUtils';
import { calculateActivityLayouts } from '../utils/timeUtils';
import { formatDateToString } from '@/utils/dateUtils';

export const useWeekView = (currentDate: Date) => {
  const { getActivitiesForDate, updateActivity, deleteActivity, toggleActivityComplete, addActivity } = useActivities();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [filteredTypes, setFilteredTypes] = useState<Set<string>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const getWeekActivities = () => {
    const weekActivities = [];
    weekDays.forEach(day => {
      const dayString = formatDateToString(day);
      const dayActivities = getActivitiesForDate(dayString);
      weekActivities.push(...dayActivities);
    });
    console.log('Week activities total:', weekActivities.length);
    return weekActivities;
  };

  const getActivitiesForDay = (day: Date) => {
    const dayString = formatDateToString(day);
    const dayActivities = getActivitiesForDate(dayString);
    console.log(`WeekView: Activities for ${dayString}:`, dayActivities.length);
    
    const filteredActivities = dayActivities.filter(activity => 
      !filteredTypes.has(activity.type)
    );
    
    console.log(`WeekView: Filtered activities for ${dayString}:`, filteredActivities.length);
    
    return calculateActivityLayouts(filteredActivities);
  };

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
    const clickDate = formatDateToString(weekDays[dayIndex]);
    
    console.log('Week view click:', clickTime, clickDate);
    
    setSelectedTime(clickTime);
    setSelectedDate(clickDate);
    setIsCreateDialogOpen(true);
  };

  const handleActivityCreate = (newActivity: any, recurringOptions?: RecurringActivityOptions) => {
    const activityWithDate = {
      ...newActivity,
      date: newActivity.date || selectedDate
    };
    console.log('Creating activity in WeekView:', activityWithDate);
    addActivity(activityWithDate, recurringOptions);
  };

  const handleActivityUpdate = (activityId: number, updates: any, recurringOptions?: RecurringActivityOptions) => {
    console.log('WeekView updating activity:', activityId, updates);
    updateActivity(activityId, updates, recurringOptions);
  };

  const handleActivityDelete = (activityId: number, deleteOption?: DeleteRecurringOption) => {
    console.log('WeekView deleting activity:', activityId, deleteOption);
    deleteActivity(activityId, deleteOption);
  };

  const handleActivityToggle = (activityId: number) => {
    console.log('WeekView toggling activity:', activityId);
    toggleActivityComplete(activityId);
  };

  const handleTypeFilterChange = (type: string, checked: boolean) => {
    setFilteredTypes(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      console.log('Week view filter change:', type, checked, Array.from(newSet));
      return newSet;
    });
  };

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
    handleActivityCreate,
    handleActivityUpdate,
    handleActivityDelete,
    handleActivityToggle,
    handleTypeFilterChange
  };
};
