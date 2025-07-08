
import React from 'react';
import { Card } from '@/components/ui/card';
import { LoaderCircle } from 'lucide-react';
import CreateActivityDialog from './activity-timeline/CreateActivityDialog';
import EditActivityDialog from '@/components/calendar/components/EditActivityDialog';
import ActivityTimelineHeader from './activity-timeline/ActivityTimelineHeader';
import ActivityTimelineContent from './activity-timeline/ActivityTimelineContent';
import ActivityTimelineEmpty from './activity-timeline/ActivityTimelineEmpty';
import { useTodayActivities, useUpdateActivity, useDeleteActivity } from '@/hooks/api/useActivities';
import { convertApiActivitiesToUi } from '@/utils/activityAdapter';
import { DeleteRecurringOption } from '@/components/calendar/utils/recurringUtils';
import { useState } from 'react';

const ActivityTimelineComponent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // API hooks
  const { data: apiActivities = [], isLoading, error } = useTodayActivities();
  const updateActivityMutation = useUpdateActivity();
  const deleteActivityMutation = useDeleteActivity();

  // Convert API activities to UI format
  const todayActivities = convertApiActivitiesToUi(apiActivities);

  const handleActivityUpdate = (activityId: number, updates: any) => {
    updateActivityMutation.mutate({ id: activityId, data: updates });
  };

  const handleActivityDelete = (activityId: number, deleteOption?: DeleteRecurringOption) => {
    deleteActivityMutation.mutate(activityId);
  };

  const handleActivityToggle = (activityId: number) => {
    const activity = apiActivities.find(a => a.id === activityId);
    if (activity) {
      const newStatus = activity.status === 'completed' ? 'planned' : 'completed';
      updateActivityMutation.mutate({ 
        id: activityId, 
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
        
        {todayActivities.length > 0 ? (
          <ActivityTimelineContent
            activities={todayActivities}
            onActivityToggle={handleActivityToggle}
            onActivityDelete={handleActivityDelete}
            onActivityUpdate={handleActivityUpdate}
          />
        ) : (
          <ActivityTimelineEmpty formattedDate={formattedDate} />
        )}
      </Card>

      <CreateActivityDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      {selectedActivity && (
        <EditActivityDialog 
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          activity={selectedActivity}
        />
      )}
    </>
  );
};

export default ActivityTimelineComponent;
