import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import activityService from '../../services/activity.service';
import { CreateActivityRequest, UpdateActivityRequest, UpdateActivityStateRequest } from '../../types/api.types';
import { useToast } from '../use-toast';
import { useActivitiesRealtime, useActivitySync } from './useActivitiesRealtime';
import { useActivitiesInvalidation } from './useActivitiesInvalidation';

// Get activities for specific date with real-time updates
export const useActivitiesApi = (date?: string, enableRealtime: boolean = true) => {
  // Enable realtime updates
  useActivitiesRealtime(enableRealtime);
  
  return useQuery({
    queryKey: ['activities', date],
    queryFn: () => activityService.getActivities(date),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

// Get today's activities with automatic date updates
export const useTodayActivitiesApi = () => {
  const [currentDate, setCurrentDate] = React.useState(() => 
    new Date().toISOString().split('T')[0]
  );

  // Update current date every minute to catch day changes
  React.useEffect(() => {
    const updateDate = () => {
      const newDate = new Date().toISOString().split('T')[0];
      if (newDate !== currentDate) {
        console.log('useTodayActivitiesApi: Date changed from', currentDate, 'to', newDate);
        setCurrentDate(newDate);
      }
    };

    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, [currentDate]);

  const result = useActivitiesApi(currentDate);
  
  React.useEffect(() => {
    if (result.data) {
      console.log(`useTodayActivitiesApi: Found ${result.data.length} activities for ${currentDate}`);
    }
  }, [result.data, currentDate]);

  return result;
};

// Get activities for date range with real-time updates
export const useActivitiesRangeApi = (startDate: string, endDate: string, enableRealtime: boolean = true) => {
  useActivitiesRealtime(enableRealtime);
  
  return useQuery({
    queryKey: ['activities', 'range', startDate, endDate],
    queryFn: () => activityService.getActivitiesRange(startDate, endDate),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

// Get activity types
export const useActivityTypesApi = () => {
  return useQuery({
    queryKey: ['activity-types'],
    queryFn: activityService.getActivityTypes,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Mutations with enhanced cache invalidation using unified invalidation hook
export const useCreateActivityApi = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { invalidateActivities, invalidateActivitiesForDate } = useActivitiesInvalidation();

  return useMutation({
    mutationFn: (data: CreateActivityRequest) => activityService.createActivity(data),
    onSuccess: (newActivity) => {
      const activityDate = newActivity.start_time ? new Date(newActivity.start_time).toISOString().split('T')[0] : undefined;
      
      // Use unified invalidation for consistent updates across all views
      invalidateActivities();
      
      if (activityDate) {
        invalidateActivitiesForDate(activityDate);
      }
      
      // Also invalidate today's activities for timeline
      const today = new Date().toISOString().split('T')[0];
      if (activityDate !== today) {
        invalidateActivitiesForDate(today);
      }
      
      console.log('✅ Created activity, invalidated caches:', newActivity.id, 'for date:', activityDate);
      
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

export const useUpdateActivityApi = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { invalidateActivities, invalidateActivitiesForDate } = useActivitiesInvalidation();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateActivityRequest }) => 
      activityService.updateActivity(id, data),
    onSuccess: (updatedActivity) => {
      const activityDate = updatedActivity.start_time ? new Date(updatedActivity.start_time).toISOString().split('T')[0] : undefined;
      
      // Use unified invalidation for consistent updates across all views
      invalidateActivities();
      
      if (activityDate) {
        invalidateActivitiesForDate(activityDate);
      }
      
      // Also invalidate today's activities for timeline
      const today = new Date().toISOString().split('T')[0];
      if (activityDate !== today) {
        invalidateActivitiesForDate(today);
      }
      
      console.log('✅ Updated activity, invalidated caches:', updatedActivity.id, 'for date:', activityDate);
      
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

export const useDeleteActivityApi = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { invalidateActivities } = useActivitiesInvalidation();

  return useMutation({
    mutationFn: (id: number) => activityService.deleteActivity(id),
    onSuccess: () => {
      // Use unified invalidation for consistent updates across all views
      invalidateActivities();
      
      console.log('✅ Deleted activity, invalidated all caches');
      
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

// Toggle activity status with optimistic updates and unified invalidation
export const useToggleActivityStatusApi = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { invalidateActivities, invalidateActivitiesForDate } = useActivitiesInvalidation();

  return useMutation({
    mutationFn: async ({ activityId, currentStatus }: { activityId: number; currentStatus: string }) => {
      const newStatus = currentStatus === 'completed' ? 'planned' : 'completed';
      return activityService.updateActivity(activityId, { status: newStatus });
    },
    onMutate: async ({ activityId, currentStatus }) => {
      const newStatus = currentStatus === 'completed' ? 'planned' : 'completed';
      
      await queryClient.cancelQueries({ queryKey: ['activities'] });
      
      const previousActivities = queryClient.getQueriesData({ queryKey: ['activities'] });
      
      queryClient.setQueriesData({ queryKey: ['activities'] }, (old: any) => {
        if (!old) return old;
        return old.map((activity: any) => 
          activity.id === activityId ? { ...activity, status: newStatus } : activity
        );
      });
      
      return { previousActivities, newStatus };
    },
    onError: (err, variables, context) => {
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
      // Use unified invalidation for consistent updates across all views
      invalidateActivities();
      
      const activityDate = data.start_time ? new Date(data.start_time).toISOString().split('T')[0] : undefined;
      if (activityDate) {
        invalidateActivitiesForDate(activityDate);
      }
      
      console.log('✅ Toggled activity status, invalidated caches:', data.id, 'status:', context?.newStatus);
      
      const statusText = context?.newStatus === 'completed' ? 'завершена' : 'запланирована';
      toast({
        title: `Активность ${statusText}`,
        description: `${data.title} отмечена как ${statusText}`,
      });
    },
  });
};

// Hook for sync utilities
export const useActivitiesSyncApi = () => {
  return useActivitySync();
};