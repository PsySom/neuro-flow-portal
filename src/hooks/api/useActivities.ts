import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import activityService from '../../services/activity.service';
import { CreateActivityRequest, UpdateActivityRequest, UpdateActivityStateRequest } from '../../types/api.types';
import { useToast } from '../use-toast';
import { useActivitiesRealtime, useActivitySync } from './useActivitiesRealtime';

// Get activities for specific date with real-time updates
export const useActivities = (date?: string, enableRealtime: boolean = true) => {
  // Enable realtime updates
  useActivitiesRealtime(enableRealtime);
  
  return useQuery({
    queryKey: ['activities', date],
    queryFn: () => activityService.getActivities(date),
    staleTime: 1 * 60 * 1000, // 1 minute - shorter due to realtime updates
    refetchOnWindowFocus: true, // Refetch when window becomes focused
    refetchOnReconnect: true, // Refetch when network reconnects
  });
};

// Get today's activities with automatic date updates
export const useTodayActivities = () => {
  const [currentDate, setCurrentDate] = React.useState(() => 
    new Date().toISOString().split('T')[0]
  );

  // Update current date every minute to catch day changes
  React.useEffect(() => {
    const updateDate = () => {
      const newDate = new Date().toISOString().split('T')[0];
      if (newDate !== currentDate) {
        console.log('useTodayActivities: Date changed from', currentDate, 'to', newDate);
        setCurrentDate(newDate);
      }
    };

    // Check immediately and then every minute
    updateDate();
    const interval = setInterval(updateDate, 60000);

    return () => clearInterval(interval);
  }, [currentDate]);

  const result = useActivities(currentDate);
  
  // Enhanced logging for debugging
  React.useEffect(() => {
    if (result.data) {
      console.log(`useTodayActivities: Found ${result.data.length} activities for ${currentDate}`);
      console.log('useTodayActivities: Sample activities:', result.data.slice(0, 3).map(a => ({
        id: a.id,
        title: a.title,
        start_time: a.start_time
      })));
    }
  }, [result.data, currentDate]);

  return result;
};

// Get activities for date range with real-time updates
export const useActivitiesRange = (startDate: string, endDate: string, enableRealtime: boolean = true) => {
  // Enable realtime updates
  useActivitiesRealtime(enableRealtime);
  
  return useQuery({
    queryKey: ['activities', 'range', startDate, endDate],
    queryFn: () => activityService.getActivitiesRange(startDate, endDate),
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter due to realtime updates
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

// Get activity types
export const useActivityTypes = () => {
  return useQuery({
    queryKey: ['activity-types'],
    queryFn: activityService.getActivityTypes,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Create activity mutation
export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateActivityRequest) => activityService.createActivity(data),
    onSuccess: (newActivity) => {
      // Get the activity date to invalidate specific queries
      const activityDate = newActivity.start_time ? new Date(newActivity.start_time).toISOString().split('T')[0] : undefined;
      
      // Comprehensive cache invalidation for all activity-related queries
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activities', 'range'] });
      
      // Invalidate specific date if available
      if (activityDate) {
        queryClient.invalidateQueries({ queryKey: ['activities', activityDate] });
      }
      
      // Also invalidate today's activities specifically
      const today = new Date().toISOString().split('T')[0];
      queryClient.invalidateQueries({ queryKey: ['activities', today] });
      
      console.log('Created activity, invalidated all activity caches:', newActivity.id, 'for date:', activityDate);
      
      toast({
        title: "Активность создана",
        description: `${newActivity.title} добавлена в план`,
      });
    },
    onError: (error: any) => {
      console.error('Activity creation error:', error);
      toast({
        title: "Ошибка создания",
        description: error.message || "Не удалось создать активность",
        variant: "destructive",
      });
    },
  });
};

// Update activity mutation
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateActivityRequest }) => 
      activityService.updateActivity(id, data),
    onSuccess: (updatedActivity) => {
      // Get the activity date to invalidate specific queries  
      const activityDate = updatedActivity.start_time ? new Date(updatedActivity.start_time).toISOString().split('T')[0] : undefined;
      
      // Comprehensive cache invalidation for all activity-related queries
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activities', 'range'] });
      
      // Invalidate specific date if available
      if (activityDate) {
        queryClient.invalidateQueries({ queryKey: ['activities', activityDate] });
      }
      
      // Also invalidate today's activities specifically
      const today = new Date().toISOString().split('T')[0];
      queryClient.invalidateQueries({ queryKey: ['activities', today] });
      
      console.log('Updated activity, invalidated all activity caches:', updatedActivity.id, 'for date:', activityDate);
      
      toast({
        title: "Активность обновлена",
        description: `${updatedActivity.title} изменена`,
      });
    },
    onError: (error: any) => {
      console.error('Activity update error:', error);
      toast({
        title: "Ошибка обновления",
        description: error.message || "Не удалось обновить активность",
        variant: "destructive",
      });
    },
  });
};

// Delete activity mutation
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => activityService.deleteActivity(id),
    onSuccess: () => {
      // Comprehensive cache invalidation for all activity-related queries
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activities', 'range'] });
      
      // Also invalidate today's activities specifically
      const today = new Date().toISOString().split('T')[0];
      queryClient.invalidateQueries({ queryKey: ['activities', today] });
      
      console.log('Deleted activity, invalidated all activity caches');
      
      toast({
        title: "Активность удалена",
        description: "Активность успешно удалена",
      });
    },
    onError: (error: any) => {
      console.error('Activity deletion error:', error);
      toast({
        title: "Ошибка удаления",
        description: error.message || "Не удалось удалить активность",
        variant: "destructive",
      });
    },
  });
};

// Activity state hooks
export const useActivityState = (activityId: number) => {
  return useQuery({
    queryKey: ['activity-state', activityId],
    queryFn: () => activityService.getActivityState(activityId),
    enabled: !!activityId,
  });
};

export const useUpdateActivityState = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ activityId, data }: { activityId: number; data: UpdateActivityStateRequest }) => 
      activityService.updateActivityState(activityId, data),
    onSuccess: (_, variables) => {
      // Invalidate activity state query
      queryClient.invalidateQueries({ queryKey: ['activity-state', variables.activityId] });
      // Also invalidate activities to refresh status
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      
      toast({
        title: "Состояние обновлено",
        description: "Состояние активности сохранено",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка сохранения",
        description: error.message || "Не удалось сохранить состояние",
        variant: "destructive",
      });
    },
  });
};

// Hook for quick status toggle with enhanced logic
export const useToggleActivityStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ activityId, currentStatus }: { activityId: number; currentStatus: string }) => {
      const newStatus = currentStatus === 'completed' ? 'planned' : 'completed';
      return activityService.updateActivity(activityId, { status: newStatus });
    },
    onMutate: async ({ activityId, currentStatus }) => {
      // Optimistic update
      const newStatus = currentStatus === 'completed' ? 'planned' : 'completed';
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['activities'] });
      
      // Snapshot the previous value
      const previousActivities = queryClient.getQueriesData({ queryKey: ['activities'] });
      
      // Optimistically update activities in cache
      queryClient.setQueriesData({ queryKey: ['activities'] }, (old: any) => {
        if (!old) return old;
        return old.map((activity: any) => 
          activity.id === activityId ? { ...activity, status: newStatus } : activity
        );
      });
      
      return { previousActivities, newStatus };
    },
    onError: (err, variables, context) => {
      // Revert optimistic update on error
      if (context?.previousActivities) {
        context.previousActivities.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      
      toast({
        title: "Ошибка изменения статуса",
        description: "Не удалось изменить статус активности",
        variant: "destructive",
      });
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch all activity queries for comprehensive sync
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activities', 'range'] });
      
      // Get the activity date to invalidate specific queries
      const activityDate = data.start_time ? new Date(data.start_time).toISOString().split('T')[0] : undefined;
      if (activityDate) {
        queryClient.invalidateQueries({ queryKey: ['activities', activityDate] });
      }
      
      const statusText = context?.newStatus === 'completed' ? 'завершена' : 'запланирована';
      toast({
        title: `Активность ${statusText}`,
        description: `${data.title} отмечена как ${statusText}`,
      });
    },
  });
};

// Hook for sync utilities
export const useActivitiesSync = () => {
  return useActivitySync();
};