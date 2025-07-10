import { useCallback } from 'react';
import { useActivityOperations } from './useActivityOperations';
import { Activity } from '@/contexts/ActivitiesContext';
import { DeleteRecurringOption, RecurringActivityOptions } from '@/components/calendar/utils/recurringUtils';

/**
 * Adapter hook that provides backwards compatibility with existing interfaces
 */
export const useActivityOperationsAdapter = (activities: any[] = []) => {
  const baseOperations = useActivityOperations(activities);

  // Adapter for ActivityTimelineComponent interface (Activity object)
  const handleActivityUpdateForTimeline = useCallback((
    updatedActivity: Activity, 
    recurringOptions?: RecurringActivityOptions
  ) => {
    baseOperations.handleActivityUpdate(updatedActivity.id, updatedActivity, recurringOptions);
  }, [baseOperations.handleActivityUpdate]);

  // Adapter for EditActivityDialog interface (Activity object)  
  const handleActivityUpdateForEdit = useCallback((
    activity: Activity, 
    recurringOptions?: RecurringActivityOptions
  ) => {
    baseOperations.handleActivityUpdate(activity.id, activity, recurringOptions);
  }, [baseOperations.handleActivityUpdate]);

  return {
    ...baseOperations,
    handleActivityUpdateForTimeline,
    handleActivityUpdateForEdit
  };
};