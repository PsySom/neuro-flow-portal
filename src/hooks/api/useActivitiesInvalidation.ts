import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * Hook for invalidating activity-related queries across the application
 * Ensures all calendar views and timeline components update when activities change
 */
export const useActivitiesInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateAllActivities = useCallback(() => {
    console.log('ActivityInvalidation: Starting comprehensive cache invalidation');
    
    // Invalidate all activity queries to ensure all views update
    queryClient.invalidateQueries({ queryKey: ['activities'] });
    
    // Also invalidate specific date ranges that might be cached
    queryClient.invalidateQueries({ queryKey: ['activities', 'range'] });
    
    // Invalidate today's activities specifically
    const today = new Date().toISOString().split('T')[0];
    queryClient.invalidateQueries({ queryKey: ['activities', today] });
    
    // Force refetch to ensure fresh data
    queryClient.refetchQueries({ queryKey: ['activities'] });
    
    console.log('ActivityInvalidation: Completed comprehensive cache invalidation');
  }, [queryClient]);

  const invalidateActivitiesForDate = useCallback((date: string) => {
    console.log(`ActivityInvalidation: Invalidating activities for date: ${date}`);
    
    // Invalidate specific date query
    queryClient.invalidateQueries({ queryKey: ['activities', date] });
    
    // Invalidate all general activity queries
    queryClient.invalidateQueries({ queryKey: ['activities'] });
    
    // Invalidate any range queries that might include this date
    queryClient.invalidateQueries({ 
      queryKey: ['activities', 'range'],
      predicate: (query) => {
        const [, , startDate, endDate] = query.queryKey as string[];
        if (startDate && endDate) {
          return date >= startDate && date <= endDate;
        }
        return true; // Invalidate all if we can't determine
      }
    });
    
    console.log(`ActivityInvalidation: Completed invalidation for date: ${date}`);
  }, [queryClient]);

  const invalidateActivitiesForDateRange = useCallback((startDate: string, endDate: string) => {
    console.log(`ActivityInvalidation: Invalidating activities for range: ${startDate} to ${endDate}`);
    
    // Invalidate specific range query
    queryClient.invalidateQueries({ queryKey: ['activities', 'range', startDate, endDate] });
    
    // Invalidate all range queries
    queryClient.invalidateQueries({ queryKey: ['activities', 'range'] });
    
    // Invalidate all general activity queries
    queryClient.invalidateQueries({ queryKey: ['activities'] });
    
    // Invalidate specific date queries within the range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const current = new Date(start);
    
    while (current <= end) {
      const dateString = current.toISOString().split('T')[0];
      queryClient.invalidateQueries({ queryKey: ['activities', dateString] });
      current.setDate(current.getDate() + 1);
    }
    
    console.log(`ActivityInvalidation: Completed invalidation for range: ${startDate} to ${endDate}`);
  }, [queryClient]);

  return {
    invalidateAllActivities,
    invalidateActivitiesForDate,
    invalidateActivitiesForDateRange
  };
};