
import React from 'react';
import { Card } from '@/components/ui/card';
import { LoaderCircle } from 'lucide-react';
import CreateActivityDialog from '@/components/calendar/components/CreateActivityDialog';
import EditActivityDialog from '@/components/calendar/components/EditActivityDialog';
import ActivityTimelineHeader from './activity-timeline/ActivityTimelineHeader';
import ActivityTimelineEmpty from './activity-timeline/ActivityTimelineEmpty';
import TimelineContentWithTime from './activity-timeline/TimelineContentWithTime';
import { useTodayActivities, useUpdateActivity, useDeleteActivity, useCreateActivity } from '@/hooks/api/useActivities';
import { useActivitiesRealtime } from '@/hooks/api/useActivitiesRealtime';
import ActivitySyncIndicator from '@/components/calendar/components/ActivitySyncIndicator';
import { convertApiActivitiesToUi } from '@/utils/activityAdapter';
import { DeleteRecurringOption, RecurringActivityOptions } from '@/components/calendar/utils/recurringUtils';
import { Activity } from '@/components/calendar/types';
import { ActivityStatus } from '@/types/api.types';
import { useState } from 'react';

const ActivityTimelineComponent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // API hooks
  const { data: apiActivities = [], isLoading, error } = useTodayActivities();
  const updateActivityMutation = useUpdateActivity();
  const deleteActivityMutation = useDeleteActivity();
  const createActivityMutation = useCreateActivity();
  
  // Enable realtime updates
  useActivitiesRealtime(true);

  // Convert API activities to UI format
  const todayActivities = convertApiActivitiesToUi(apiActivities);

  const handleActivityUpdate = (updatedActivity: Activity, recurringOptions?: RecurringActivityOptions) => {
    console.log('ActivityTimelineComponent updating activity:', updatedActivity.id, updatedActivity, 'recurring:', recurringOptions);
    console.log('Timeline: Processing full activity object');
    
    // Map activity type to API type ID
    const getActivityTypeId = (type: string) => {
      switch (type) {
        case 'задача': return 1;
        case 'восстановление': return 2;
        case 'нейтральная': return 3;
        case 'смешанная': return 4;
        default: return 1;
      }
    };

    const apiUpdates: any = {
      title: updatedActivity.name,
      description: updatedActivity.note,
      activity_type_id: updatedActivity.type ? getActivityTypeId(updatedActivity.type) : undefined,
      start_time: updatedActivity.date && updatedActivity.startTime ? `${updatedActivity.date}T${updatedActivity.startTime}:00.000Z` : undefined,
      end_time: updatedActivity.date && updatedActivity.endTime ? `${updatedActivity.date}T${updatedActivity.endTime}:00.000Z` : undefined,
      status: updatedActivity.completed !== undefined ? (updatedActivity.completed ? 'completed' : 'planned') : undefined,
      metadata: {
        importance: updatedActivity.importance,
        color: updatedActivity.color,
        emoji: updatedActivity.emoji,
        needEmoji: updatedActivity.needEmoji,
        recurring: recurringOptions
      }
    };
    
    console.log('ActivityTimelineComponent: Raw API updates before cleaning:', apiUpdates);
    
    // Remove undefined values but keep null values for proper serialization
    const cleanApiUpdates = Object.fromEntries(
      Object.entries(apiUpdates).filter(([_, value]) => value !== undefined)
    );
    
    // Remove metadata if empty or contains only undefined values
    if (cleanApiUpdates.metadata && Object.values(cleanApiUpdates.metadata).every(v => v === undefined)) {
      delete cleanApiUpdates.metadata;
    }
    
    console.log('ActivityTimelineComponent: Sending update request:', cleanApiUpdates);
    updateActivityMutation.mutate({ 
      id: typeof updatedActivity.id === 'string' ? parseInt(updatedActivity.id) : updatedActivity.id, 
      data: cleanApiUpdates 
    });
  };

  const handleActivityDelete = (activityId: number | string, deleteOption?: DeleteRecurringOption) => {
    const numericId = typeof activityId === 'string' ? parseInt(activityId) : activityId;
    deleteActivityMutation.mutate(numericId);
  };

  const handleActivityCreate = (newActivity: any, recurringOptions?: RecurringActivityOptions) => {
    console.log('ActivityTimelineComponent creating activity:', newActivity, 'recurring:', recurringOptions);
    
    // Map activity type to API type ID
    const getActivityTypeId = (type: string) => {
      switch (type) {
        case 'задача': return 1;
        case 'восстановление': return 2;
        case 'нейтральная': return 3;
        case 'смешанная': return 4;
        default: return 1;
      }
    };

    const apiData = {
      title: newActivity.name,
      description: newActivity.note || '',
      activity_type_id: getActivityTypeId(newActivity.type),
      start_time: `${newActivity.date}T${newActivity.startTime}:00.000Z`,
      end_time: newActivity.endTime ? `${newActivity.date}T${newActivity.endTime}:00.000Z` : undefined,
      status: (newActivity.completed ? 'completed' : 'planned') as ActivityStatus,
      metadata: {
        importance: newActivity.importance,
        color: newActivity.color,
        emoji: newActivity.emoji,
        needEmoji: newActivity.needEmoji,
        recurring: recurringOptions
      }
    };

    createActivityMutation.mutate(apiData);
  };

  const handleActivityToggle = (activityId: number | string) => {
    const numericId = typeof activityId === 'string' ? parseInt(activityId) : activityId;
    const activity = apiActivities.find(a => a.id === numericId);
    if (activity) {
      const newStatus = activity.status === 'completed' ? 'planned' : 'completed';
      updateActivityMutation.mutate({ 
        id: numericId, 
        data: { status: newStatus } 
      });
    }
  };

  // Create reactive formatted date that updates with activities data
  const getFormattedDate = () => {
    // Use the same date calculation as the API hook to ensure consistency
    const today = new Date().toISOString().split('T')[0];
    const date = new Date(today + 'T12:00:00'); // Use noon to avoid timezone issues
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formattedDate = getFormattedDate();

  // Loading state
  if (isLoading) {
    return (
      <Card className="h-[600px] bg-white/70 backdrop-blur-lg border-0 shadow-xl">
        <div className="flex items-center justify-center h-full">
          <LoaderCircle className="w-6 h-6 animate-spin" />
          <span className="ml-2">Загрузка активностей...</span>
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="h-[600px] bg-white/70 backdrop-blur-lg border-0 shadow-xl">
        <div className="flex items-center justify-center h-full text-center text-red-600">
          <div>
            <p>Ошибка загрузки активностей</p>
            <p className="text-sm mt-2">Проверьте подключение к серверу</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-[600px] bg-white/70 backdrop-blur-lg border-0 shadow-xl">
        <ActivityTimelineHeader 
          formattedDate={formattedDate}
          onAddClick={() => setIsDialogOpen(true)}
        />
        <div className="px-6 py-2">
          <ActivitySyncIndicator />
        </div>
        
        <TimelineContentWithTime
          activities={todayActivities}
          onActivityToggle={handleActivityToggle}
          onActivityDelete={handleActivityDelete}
          onActivityUpdate={handleActivityUpdate}
          isEmpty={todayActivities.length === 0}
          formattedDate={formattedDate}
        />
      </Card>

      <CreateActivityDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialDate={formattedDate.split(',')[0]} // Используем текущую дату
        onActivityCreate={handleActivityCreate}
      />

      {selectedActivity && (
        <EditActivityDialog 
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          activity={selectedActivity}
          onActivityUpdate={handleActivityUpdate}
          onDelete={handleActivityDelete}
        />
      )}
    </>
  );
};

export default ActivityTimelineComponent;
