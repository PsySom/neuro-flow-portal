import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Activity } from '@/types/api.types';
import { useToast } from '../use-toast';

// Hook for real-time activity updates
export const useActivitiesRealtime = (enabled: boolean = true) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleRealtimeUpdate = useCallback((payload: any) => {
    console.log('Realtime activity update:', payload);
    
    // Invalidate all activity-related queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['activities'] });
    queryClient.invalidateQueries({ queryKey: ['activities', 'range'] });
    
    // Show notification for different types of updates
    switch (payload.eventType) {
      case 'INSERT':
        toast({
          title: "Новая активность",
          description: `Добавлена активность: ${payload.new?.title || 'Без названия'}`,
        });
        break;
      case 'UPDATE':
        const wasCompleted = payload.old?.status !== 'completed' && payload.new?.status === 'completed';
        const wasPlanned = payload.old?.status !== 'planned' && payload.new?.status === 'planned';
        
        if (wasCompleted) {
          toast({
            title: "Активность завершена",
            description: `${payload.new?.title || 'Активность'} отмечена как выполненная`,
          });
        } else if (wasPlanned) {
          toast({
            title: "Активность запланирована",
            description: `${payload.new?.title || 'Активность'} возвращена в план`,
          });
        } else {
          toast({
            title: "Активность обновлена",
            description: `${payload.new?.title || 'Активность'} изменена`,
          });
        }
        break;
      case 'DELETE':
        toast({
          title: "Активность удалена",
          description: `${payload.old?.title || 'Активность'} удалена`,
        });
        break;
    }
  }, [queryClient, toast]);

  useEffect(() => {
    if (!enabled) return;

    console.log('Setting up realtime subscription for activities');

    const channel = supabase
      .channel('activities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities'
        },
        handleRealtimeUpdate
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_states'
        },
        (payload) => {
          console.log('Realtime activity state update:', payload);
          queryClient.invalidateQueries({ queryKey: ['activity-state'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [enabled, handleRealtimeUpdate, queryClient]);
};

// Hook for activity sync status
export const useActivitySync = () => {
  const queryClient = useQueryClient();

  const syncActivities = useCallback(async () => {
    console.log('Manual sync triggered');
    await queryClient.invalidateQueries({ queryKey: ['activities'] });
    await queryClient.invalidateQueries({ queryKey: ['activities', 'range'] });
    await queryClient.invalidateQueries({ queryKey: ['activity-state'] });
  }, [queryClient]);

  const getLastSyncTime = useCallback(() => {
    // Get the last time activities were fetched
    const queries = queryClient.getQueriesData({ queryKey: ['activities'] });
    let lastSync = 0;
    
    queries.forEach(([_, data]) => {
      if (data) {
        const queryState = queryClient.getQueryState(['activities']);
        if (queryState?.dataUpdatedAt && queryState.dataUpdatedAt > lastSync) {
          lastSync = queryState.dataUpdatedAt;
        }
      }
    });
    
    return lastSync ? new Date(lastSync) : null;
  }, [queryClient]);

  return {
    syncActivities,
    getLastSyncTime
  };
};