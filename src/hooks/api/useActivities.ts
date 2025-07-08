import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import activityService from '../../services/activity.service';
import { CreateActivityRequest, UpdateActivityRequest, UpdateActivityStateRequest } from '../../types/api.types';
import { useToast } from '../use-toast';

// Get activities for specific date
export const useActivities = (date?: string) => {
  return useQuery({
    queryKey: ['activities', date],
    queryFn: () => activityService.getActivities(date),
    staleTime: 2 * 60 * 1000, // 2 minutes
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
        setCurrentDate(newDate);
      }
    };

    // Check immediately and then every minute
    updateDate();
    const interval = setInterval(updateDate, 60000);

    return () => clearInterval(interval);
  }, [currentDate]);

  return useActivities(currentDate);
};

// Get activities for date range
export const useActivitiesRange = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['activities', 'range', startDate, endDate],
    queryFn: () => activityService.getActivitiesRange(startDate, endDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
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
      // Invalidate activities queries
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      
      toast({
        title: "Активность создана",
        description: `${newActivity.title} добавлена в план`,
      });
    },
    onError: (error: any) => {
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
      // Invalidate activities queries
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      
      toast({
        title: "Активность обновлена",
        description: `${updatedActivity.title} изменена`,
      });
    },
    onError: (error: any) => {
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
      // Invalidate activities queries
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      
      toast({
        title: "Активность удалена",
        description: "Активность успешно удалена",
      });
    },
    onError: (error: any) => {
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