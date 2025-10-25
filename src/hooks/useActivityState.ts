import { useState, useEffect, useCallback } from 'react';
import { Activity } from '@/contexts/ActivitiesContext';
import { RecurringActivityOptions, DeleteRecurringOption } from '@/components/calendar/utils/recurringUtils';
import { loadActivitiesFromStorage, saveActivitiesToStorage } from '@/utils/activityStorage';
import { unifiedActivityService } from '@/services/unified-activity.service';
import { sortActivities } from '@/utils/activityOperations';
import { supabase } from '@/integrations/supabase/client';

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

  const addActivity = useCallback(async (activity: Activity, recurringOptions?: RecurringActivityOptions) => {
    try {
      const createdActivities = await unifiedActivityService.createActivity(activity, recurringOptions);
      setActivities(prev => sortActivities([...prev, ...createdActivities]));
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  }, []);

  const updateActivity = useCallback(async (id: number, updates: Partial<Activity>, recurringOptions?: RecurringActivityOptions) => {
    try {
      const updatedActivity = await unifiedActivityService.updateActivity(id, updates, recurringOptions);
      setActivities(prev => prev.map(a => a.id === id ? updatedActivity : a));
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  }, []);

  const deleteActivity = useCallback(async (id: number, deleteOption?: DeleteRecurringOption) => {
    try {
      await unifiedActivityService.deleteActivity(id, deleteOption);
      setActivities(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  }, []);

  const toggleActivityComplete = useCallback(async (id: number) => {
    try {
      const updatedActivity = await unifiedActivityService.toggleActivityCompletion(id);
      setActivities(prev => prev.map(a => a.id === id ? updatedActivity : a));
    } catch (error) {
      console.error('Error toggling activity completion:', error);
    }
  }, []);

  const getActivitiesForDateFunc = useCallback(async (date: string): Promise<Activity[]> => {
    try {
      return await unifiedActivityService.getActivitiesForDate(date);
    } catch (error) {
      console.error('Error getting activities for date:', error);
      return activities.filter(a => a.date === date);
    }
  }, [activities]);

  const getActivitiesForDateRangeFunc = useCallback(async (startDate: string, endDate: string): Promise<Activity[]> => {
    try {
      return await unifiedActivityService.getActivitiesForDateRange(startDate, endDate);
    } catch (error) {
      console.error('Error getting activities for date range:', error);
      return activities.filter(a => a.date >= startDate && a.date <= endDate);
    }
  }, [activities]);

  // Load activities from server on mount (only if authenticated)
  useEffect(() => {
    const loadServerActivities = async () => {
      try {
        // Check if user is authenticated before loading
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return; // Don't try to load activities if not authenticated
        }

        const today = getCurrentDateString();
        const serverActivities = await unifiedActivityService.getActivitiesForDate(today);
        if (serverActivities.length > 0) {
          setActivities(sortActivities(serverActivities));
        }
      } catch (error) {
        // Silently handle errors to avoid console spam for unauthenticated users
        if (error instanceof Error && !error.message.includes('Не авторизовано')) {
          console.error('Error loading server activities:', error);
        }
      }
    };

    loadServerActivities();
  }, [getCurrentDateString]);

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
