import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * Hook for invalidating activity-related queries across the application
 * Ensures all calendar views and timeline components update when activities change
 */
export const useActivitiesInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateActivities = useCallback(() => {
    console.log('🔄 Invalidating all activities queries');
    // Invalidate and refetch all activity-related queries to get fresh data
    queryClient.invalidateQueries({
      queryKey: ['activities'],
    });
    
    queryClient.invalidateQueries({
      queryKey: ['activity-types'],
    });
    
    // Force refetch for immediate update
    queryClient.refetchQueries({
      queryKey: ['activities'],
    });
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
    invalidateActivities,
    invalidateActivitiesForDate,
    invalidateActivitiesForDateRange
  };
};