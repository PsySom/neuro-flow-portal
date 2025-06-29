
import { useState, useEffect, useCallback } from 'react';
import { Activity } from '@/contexts/ActivitiesContext';
import { RecurringActivityOptions, DeleteRecurringOption } from '@/components/calendar/utils/recurringUtils';
import { loadActivitiesFromStorage, saveActivitiesToStorage } from '@/utils/activityStorage';
import { 
  addActivityWithRecurring,
  updateActivityWithRecurring,
  deleteActivityWithRecurring,
  toggleActivityCompletion,
  getActivitiesForDate,
  getActivitiesForDateRange,
  sortActivities
} from '@/utils/activityOperations';

export const useActivityState = () => {
  const getCurrentDateString = useCallback((): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const [activities, setActivities] = useState<Activity[]>(() => {
    const loadedActivities = loadActivitiesFromStorage();
    return sortActivities(loadedActivities);
  });

  // Save to localStorage when activities change
  useEffect(() => {
    saveActivitiesToStorage(activities);
  }, [activities]);

  const addActivity = useCallback((activity: Activity, recurringOptions?: RecurringActivityOptions) => {
    setActivities(prev => addActivityWithRecurring(prev, activity, getCurrentDateString, recurringOptions));
  }, [getCurrentDateString]);

  const updateActivity = useCallback((id: number, updates: Partial<Activity>, recurringOptions?: RecurringActivityOptions) => {
    setActivities(prev => updateActivityWithRecurring(prev, id, updates, recurringOptions));
  }, []);

  const deleteActivity = useCallback((id: number, deleteOption?: DeleteRecurringOption) => {
    setActivities(prev => deleteActivityWithRecurring(prev, id, deleteOption));
  }, []);

  const toggleActivityComplete = useCallback((id: number) => {
    setActivities(prev => toggleActivityCompletion(prev, id));
  }, []);

  const getActivitiesForDateFunc = useCallback((date: string): Activity[] => {
    return getActivitiesForDate(activities, date);
  }, [activities]);

  const getActivitiesForDateRangeFunc = useCallback((startDate: string, endDate: string): Activity[] => {
    return getActivitiesForDateRange(activities, startDate, endDate);
  }, [activities]);

  return {
    activities,
    setActivities,
    addActivity,
    updateActivity,
    deleteActivity,
    toggleActivityComplete,
    getActivitiesForDate: getActivitiesForDateFunc,
    getActivitiesForDateRange: getActivitiesForDateRangeFunc,
    getCurrentDateString,
  };
};
