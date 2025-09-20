import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useActivitiesInvalidation } from './useActivitiesInvalidation';

/**
 * Global activity synchronization hook
 * Ensures all calendar views and timeline are synchronized when activities change
 */
export const useGlobalActivitySync = () => {
  const queryClient = useQueryClient();
  const { invalidateActivities, invalidateActivitiesForDate, invalidateActivitiesForDateRange } = useActivitiesInvalidation();

  /**
   * Force refresh all activity-related data across the entire application
   */
  const forceRefreshAll = useCallback(async () => {
    console.log('🔄 Force refreshing all activity data across application');
    
    try {
      // Invalidate all activity queries
      await invalidateActivities();
      
      // Force refetch critical queries immediately
      await queryClient.refetchQueries({
        queryKey: ['activities'],
        type: 'active'
      });
      
      console.log('✅ Global activity refresh completed');
    } catch (error) {
      console.error('❌ Global activity refresh failed:', error);
    }
  }, [queryClient, invalidateActivities]);

  /**
   * Sync activity changes for specific date across all views
   */
  const syncActivityForDate = useCallback(async (date: string) => {
    console.log('🔄 Syncing activities for date:', date);
    
    try {
      await invalidateActivitiesForDate(date);
      
      // Also invalidate today if different from the changed date
      const today = new Date().toISOString().split('T')[0];
      if (date !== today) {
        await invalidateActivitiesForDate(today);
      }
      
      console.log('✅ Activity sync completed for date:', date);
    } catch (error) {
      console.error('❌ Activity sync failed for date:', date, error);
    }
  }, [invalidateActivitiesForDate]);

  /**
   * Sync activity changes for date range across all views (for week/month views)
   */
  const syncActivityForDateRange = useCallback(async (startDate: string, endDate: string) => {
    console.log('🔄 Syncing activities for date range:', startDate, 'to', endDate);
    
    try {
      await invalidateActivitiesForDateRange(startDate, endDate);
      
      console.log('✅ Activity sync completed for date range:', startDate, 'to', endDate);
    } catch (error) {
      console.error('❌ Activity sync failed for date range:', startDate, 'to', endDate, error);
    }
  }, [invalidateActivitiesForDateRange]);

  /**
   * Get sync status information
   */
  const getSyncStatus = useCallback(() => {
    const queries = queryClient.getQueriesData({ queryKey: ['activities'] });
    const activeQueries = queries.filter(([_, data]) => data !== undefined);
    
    return {
      totalQueries: queries.length,
      activeQueries: activeQueries.length,
      lastUpdate: activeQueries.length > 0 ? 
        Math.max(...activeQueries.map(([queryKey]) => {
          const state = queryClient.getQueryState(queryKey as any);
          return state?.dataUpdatedAt || 0;
        })) : 0
    };
  }, [queryClient]);

  return {
    forceRefreshAll,
    syncActivityForDate,
    syncActivityForDateRange,
    getSyncStatus
  };
};