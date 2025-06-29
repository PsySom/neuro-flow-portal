
import { useState, useEffect } from 'react';
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
  const getCurrentDateString = (): string => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  const [activities, setActivities] = useState<Activity[]>(() => {
    const loadedActivities = loadActivitiesFromStorage(getCurrentDateString);
    return sortActivities(loadedActivities);
  });

  // Save to localStorage when activities change
  useEffect(() => {
    saveActivitiesToStorage(activities);
  }, [activities]);

  const addActivity = (activity: Activity, recurringOptions?: RecurringActivityOptions) => {
    setActivities(prev => addActivityWithRecurring(prev, activity, recurringOptions, getCurrentDateString));
  };

  const updateActivity = (id: number, updates: Partial<Activity>, recurringOptions?: RecurringActivityOptions) => {
    setActivities(prev => updateActivityWithRecurring(prev, id, updates, recurringOptions));
  };

  const deleteActivity = (id: number, deleteOption?: DeleteRecurringOption) => {
    setActivities(prev => deleteActivityWithRecurring(prev, id, deleteOption));
  };

  const toggleActivityComplete = (id: number) => {
    setActivities(prev => toggleActivityCompletion(prev, id));
  };

  const getActivitiesForDateFunc = (date: string): Activity[] => {
    return getActivitiesForDate(activities, date);
  };

  const getActivitiesForDateRangeFunc = (startDate: string, endDate: string): Activity[] => {
    return getActivitiesForDateRange(activities, startDate, endDate);
  };

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
