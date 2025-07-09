import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * Hook for invalidating activity-related queries across the application
 * Ensures all calendar views and timeline components update when activities change
 */
export const useActivitiesInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateAllActivities = useCallback(() => {
    // Invalidate all activity queries to ensure all views update
    queryClient.invalidateQueries({ queryKey: ['activities'] });
    
    // Also invalidate specific date ranges that might be cached
    queryClient.invalidateQueries({ queryKey: ['activities', 'range'] });
    
    // Invalidate today's activities specifically
    const today = new Date().toISOString().split('T')[0];
    queryClient.invalidateQueries({ queryKey: ['activities', today] });
    
    console.log('ActivityInvalidation: Invalidated all activity queries');
  }, [queryClient]);

  const invalidateActivitiesForDate = useCallback((date: string) => {
    queryClient.invalidateQueries({ queryKey: ['activities', date] });
    queryClient.invalidateQueries({ queryKey: ['activities'] });
    
    console.log(`ActivityInvalidation: Invalidated activities for date: ${date}`);
  }, [queryClient]);

  const invalidateActivitiesForDateRange = useCallback((startDate: string, endDate: string) => {
    queryClient.invalidateQueries({ queryKey: ['activities', 'range', startDate, endDate] });
    queryClient.invalidateQueries({ queryKey: ['activities'] });
    
    console.log(`ActivityInvalidation: Invalidated activities for range: ${startDate} to ${endDate}`);
  }, [queryClient]);

  return {
    invalidateAllActivities,
    invalidateActivitiesForDate,
    invalidateActivitiesForDateRange
  };
};