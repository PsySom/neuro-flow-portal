import { useState, useCallback, useMemo } from 'react';
import { useUnifiedActivityOperations } from '@/hooks/useUnifiedActivityOperations';
import { CalendarSyncService } from '@/services/calendar-sync.service';
import { Activity } from '@/contexts/ActivitiesContext';
import { RecurringActivityOptions, DeleteRecurringOption } from '@/components/calendar/utils/recurringUtils';

interface CalendarViewConfig {
  viewType: 'day' | 'week' | 'month';
  activities: any[];
  isLoading: boolean;
  startDate: string;
  endDate: string;
  onActivityCreate?: (activity: Activity, recurringOptions?: RecurringActivityOptions) => Promise<void>;
  onActivityUpdate?: (id: number, updates: Partial<Activity>) => void;
  onActivityDelete?: (id: number, deleteOption?: DeleteRecurringOption) => void;
}

/**
 * Unified calendar view hook for consistent activity management across all calendar views
 */
export const useCalendarView = (config: CalendarViewConfig) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [filteredTypes, setFilteredTypes] = useState<Set<string>>(new Set());

  // Process activities using unified sync service
  const processedActivities = useMemo(() => {
    const processed = CalendarSyncService.processActivities(
      config.activities,
      config.startDate,
      config.endDate,
      config.viewType
    );
    
    const cleanActivities = CalendarSyncService.cleanActivities(processed.expanded);
    
    console.log(`CalendarView(${config.viewType}): Processed ${config.activities.length} API to ${cleanActivities.length} UI activities`);
    return cleanActivities;
  }, [config.activities, config.startDate, config.endDate, config.viewType]);

  // Get unified activity operations
  const {
    handleActivityCreate: createActivity,
    handleActivityUpdate: updateActivity,
    handleActivityDelete: deleteActivity,
    handleActivityToggle: toggleActivity
  } = useUnifiedActivityOperations(processedActivities);

  // Activity handlers with consistent logic
  const handleActivityCreate = useCallback(async (newActivity: any, recurringOptions?: RecurringActivityOptions) => {
    console.log(`CalendarView(${config.viewType}): Creating activity:`, newActivity);
    try {
      const result = await createActivity(newActivity, recurringOptions);
      setIsCreateDialogOpen(false);
      
      if (config.onActivityCreate) {
        await config.onActivityCreate(newActivity, recurringOptions);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to create activity:', error);
      throw error;
    }
  }, [createActivity, config.onActivityCreate, config.viewType]);

  const handleActivityUpdate = useCallback(async (activityId: number, updates: Partial<Activity>, recurringOptions?: RecurringActivityOptions) => {
    console.log(`CalendarView(${config.viewType}): Updating activity:`, activityId, updates);
    try {
      const result = await updateActivity(activityId, updates, recurringOptions);
      
      if (config.onActivityUpdate) {
        config.onActivityUpdate(activityId, updates);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to update activity:', error);
      throw error;
    }
  }, [updateActivity, config.onActivityUpdate, config.viewType]);

  const handleActivityDelete = useCallback(async (id: number, deleteOption?: DeleteRecurringOption) => {
    console.log(`CalendarView(${config.viewType}): Deleting activity:`, id, deleteOption);
    try {
      const result = await deleteActivity(id, deleteOption);
      
      if (config.onActivityDelete) {
        config.onActivityDelete(id, deleteOption);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to delete activity:', error);
      throw error;
    }
  }, [deleteActivity, config.onActivityDelete, config.viewType]);

  const handleActivityToggle = useCallback(async (activityId: number) => {
    console.log(`CalendarView(${config.viewType}): Toggling activity:`, activityId);
    try {
      return await toggleActivity(activityId);
    } catch (error) {
      console.error('Failed to toggle activity:', error);
      throw error;
    }
  }, [toggleActivity, config.viewType]);

  // Filter management
  const handleTypeFilterChange = useCallback((type: string, checked: boolean) => {
    setFilteredTypes(prev => {
      const newFiltered = new Set(prev);
      if (checked) {
        newFiltered.delete(type);
      } else {
        newFiltered.add(type);
      }
      console.log(`CalendarView(${config.viewType}): Filter change:`, type, checked, Array.from(newFiltered));
      return newFiltered;
    });
  }, [config.viewType]);

  // Get filtered activities
  const visibleActivities = useMemo(() => 
    CalendarSyncService.filterActivitiesByType(processedActivities, filteredTypes)
  , [processedActivities, filteredTypes]);

  // Time slot click handler for creating activities
  const handleTimeSlotClick = useCallback((time: string, date: string) => {
    setSelectedTime(time);
    setSelectedDate(date);
    setIsCreateDialogOpen(true);
  }, []);

  return {
    // State
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    selectedTime,
    selectedDate,
    filteredTypes,
    
    // Data
    activities: processedActivities,
    visibleActivities,
    isLoading: config.isLoading,
    
    // Handlers
    handleActivityCreate,
    handleActivityUpdate,
    handleActivityDelete,
    handleActivityToggle,
    handleTypeFilterChange,
    handleTimeSlotClick,
    
    // Utilities
    getActivitiesForDate: (dateString: string) => 
      CalendarSyncService.getActivitiesForDate(processedActivities, dateString),
    filterActivitiesByType: (activities: Activity[], types: Set<string>) =>
      CalendarSyncService.filterActivitiesByType(activities, types)
  };
};