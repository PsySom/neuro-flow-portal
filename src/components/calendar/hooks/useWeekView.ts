import { useState, useRef, useCallback, useMemo } from 'react';
import { useActivitiesRange, useCreateActivity, useUpdateActivity, useDeleteActivity } from '@/hooks/api/useActivities';
import { DeleteRecurringOption, RecurringActivityOptions } from '../utils/recurringUtils';
import { calculateActivityLayouts } from '../utils/timeUtils';
import { convertApiActivitiesToUi } from '@/utils/activityAdapter';
import { calendarService } from '@/services/calendar.service';

export const useWeekView = (currentDate: Date) => {
  const createActivityMutation = useCreateActivity();
  const updateActivityMutation = useUpdateActivity();
  const deleteActivityMutation = useDeleteActivity();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [filteredTypes, setFilteredTypes] = useState<Set<string>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const weekDays = useMemo(() => {
    try {
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
    } catch (error) {
      console.error('Error creating week days:', error);
      // Fallback to current date
      const today = new Date();
      return [today];
    }
  }, [currentDate]);

  // Get date range for the week
  const { startDate, endDate } = useMemo(() => {
    try {
      const start = weekDays[0].toISOString().split('T')[0];
      const end = weekDays[6].toISOString().split('T')[0];
      return { startDate: start, endDate: end };
    } catch (error) {
      console.error('Error creating date range for week:', error);
      const today = new Date().toISOString().split('T')[0];
      return { startDate: today, endDate: today };
    }
  }, [weekDays]);

  // Use API call for the week range
  const { data: weekApiActivities = [], isLoading } = useActivitiesRange(startDate, endDate);

  // Convert API activities to UI format
  const weekActivities = useMemo(() => {
    return convertApiActivitiesToUi(weekApiActivities);
  }, [weekApiActivities]);

  const getWeekActivities = useCallback(() => {
    console.log('Week activities total:', weekActivities.length);
    return weekActivities;
  }, [weekActivities]);

  const getActivitiesForDay = useCallback((day: Date) => {
    const dayString = day.toISOString().split('T')[0];
    
    // Filter activities for this specific day
    const dayActivities = weekActivities.filter(activity => {
      try {
        // Validate activity date field
        if (!activity.date) {
          console.warn('Activity has no date field:', activity);
          return false;
        }
        
        // Compare date fields directly instead of constructing dates
        const activityDateString = activity.date;
        return activityDateString === dayString;
      } catch (error) {
        console.error('Error processing activity date:', error, activity);
        return false;
      }
    });
    
    console.log(`WeekView: Activities for ${dayString}:`, dayActivities.length);
    
    const filteredActivities = dayActivities.filter(activity => 
      !filteredTypes.has(activity.type)
    );
    
    // Sort activities by start time
    filteredActivities.sort((a, b) => {
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });
    
    console.log(`WeekView: Filtered activities for ${dayString}:`, filteredActivities.length);
    
    return calculateActivityLayouts(filteredActivities);
  }, [weekActivities, filteredTypes]);

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

  const handleActivityCreate = useCallback(async (newActivity: any, recurringOptions?: RecurringActivityOptions) => {
    try {
      // Map activity type to API type ID
      const getActivityTypeId = (type: string) => {
        switch (type) {
          case 'задача': return 1;
          case 'восстановление': return 2;
          case 'нейтральная': return 3;
          case 'смешанная': return 4;
          default: return 1;
        }
      };

      const activityData = {
        title: newActivity.name,
        description: newActivity.note,
        activity_type_id: getActivityTypeId(newActivity.type),
        start_time: `${newActivity.date}T${newActivity.startTime}:00.000Z`,
        end_time: newActivity.endTime ? `${newActivity.date}T${newActivity.endTime}:00.000Z` : undefined,
        metadata: {
          importance: newActivity.importance,
          color: newActivity.color,
          emoji: newActivity.emoji,
          needEmoji: newActivity.needEmoji
        }
      };
      
      console.log('Creating activity in WeekView:', activityData, 'with recurring:', recurringOptions);
      
      if (recurringOptions && recurringOptions.type !== 'none') {
        // Use calendar service for recurring activities
        await calendarService.createActivity(activityData, recurringOptions);
      } else {
        // Use regular mutation for single activities
        createActivityMutation.mutate(activityData);
      }
      
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  }, [createActivityMutation]);

  const handleActivityUpdate = useCallback((activityId: number, updates: any, recurringOptions?: RecurringActivityOptions) => {
    console.log('WeekView updating activity:', activityId, updates);
    const apiUpdates = {
      title: updates.name,
      description: updates.note,
      status: updates.completed !== undefined ? (updates.completed ? 'completed' : 'planned') : undefined,
      metadata: {
        importance: updates.importance,
        color: updates.color,
        emoji: updates.emoji,
        needEmoji: updates.needEmoji
      }
    };
    
    const cleanApiUpdates = Object.fromEntries(
      Object.entries(apiUpdates).filter(([_, value]) => value !== undefined)
    );
    
    updateActivityMutation.mutate({ id: activityId, data: cleanApiUpdates });
  }, [updateActivityMutation]);

  const handleActivityDelete = useCallback((activityId: number, deleteOption?: DeleteRecurringOption) => {
    console.log('WeekView deleting activity:', activityId, deleteOption);
    deleteActivityMutation.mutate(activityId);
  }, [deleteActivityMutation]);

  const handleActivityToggle = useCallback((activityId: number) => {
    console.log('WeekView toggling activity:', activityId);
    // Find the activity to toggle
    const activity = weekActivities.find(a => a.id === activityId);
    if (activity) {
      const newStatus = activity.completed ? 'planned' : 'completed';
      updateActivityMutation.mutate({ 
        id: activityId, 
        data: { status: newStatus } 
      });
    }
  }, [weekActivities, updateActivityMutation]);

  const handleTypeFilterChange = useCallback((type: string, checked: boolean) => {
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
  }, []);

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
    handleTypeFilterChange,
    isLoading
  };
};