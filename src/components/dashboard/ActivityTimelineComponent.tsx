
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import CreateActivityDialog from '@/components/calendar/components/CreateActivityDialog';
import EditActivityDialog from '@/components/calendar/components/EditActivityDialog';
import ActivityTimelineHeader from './activity-timeline/ActivityTimelineHeader';
import TimelineContentWithTime from './activity-timeline/TimelineContentWithTime';
import { useTodayActivitiesApi } from '@/hooks/api/useActivitiesApi';
import { useUnifiedActivityOperations } from '@/hooks/useUnifiedActivityOperations';
import ActivitySyncIndicator from '@/components/calendar/components/ActivitySyncIndicator';
import { formatDateForInput, getFormattedCurrentDate } from '@/utils/activityConversion';
import { useActivityTimelineLogic } from '@/hooks/useActivityTimelineLogic';
import { Activity } from '@/contexts/ActivitiesContext';
import { UnifiedActivitySyncService } from '@/services/unified-activity-sync.service';

const ActivityTimelineComponent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  // Enhanced timeline logic with date validation
  const { currentDate } = useActivityTimelineLogic();

  // Get current date for comparison
  const currentDateString = new Date().toISOString().split('T')[0];
  
  // API hooks - use consistent pattern with calendar views
  const { data: apiActivities = [], isLoading, error } = useTodayActivitiesApi();
  console.log('ActivityTimeline: Using date:', currentDateString);
  console.log('ActivityTimeline: Raw API activities:', apiActivities.length);

  // Convert API activities to UI format using unified service
  const allActivities = UnifiedActivitySyncService.processActivitiesForTimeline(apiActivities);
  
  console.log('ActivityTimeline: All activities:', allActivities.length);
  console.log('ActivityTimeline: Current date:', currentDateString);
  console.log('ActivityTimeline: Sample activities:', allActivities.slice(0, 2).map(a => ({
    id: a.id,
    name: a.name,
    date: a.date,
    startTime: a.startTime
  })));

  // Use unified activity operations with consistent API
  const {
    handleActivityCreate: createActivity,
    handleActivityUpdate: updateActivity,
    handleActivityDelete: deleteActivity,
    handleActivityToggle: toggleActivityStatus
  } = useUnifiedActivityOperations(allActivities);

  // Enhanced activity handlers with proper error handling and consistency
  const handleActivityToggle = async (activityId: number | string) => {
    console.log('ActivityTimeline: Toggling activity status:', activityId);
    try {
      await toggleActivityStatus(activityId);
    } catch (error) {
      console.error('Failed to toggle activity:', error);
    }
  };

  const handleActivityCreate = async (newActivity: any, recurringOptions?: any) => {
    console.log('ActivityTimeline creating activity:', newActivity, 'with recurring:', recurringOptions);
    try {
      await createActivity(newActivity, recurringOptions);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to create activity:', error);
    }
  };

  const handleActivityUpdate = async (activityId: number | string, updates: Partial<Activity>, recurringOptions?: any) => {
    console.log('ActivityTimeline updating activity:', activityId, updates, recurringOptions);
    try {
      const numericId = typeof activityId === 'string' ? parseInt(activityId, 10) : activityId;
      await updateActivity(numericId, updates, recurringOptions);
      setIsDetailsDialogOpen(false);
    } catch (error) {
      console.error('Failed to update activity:', error);
    }
  };

  const handleActivityDelete = async (id: number | string, deleteOption?: any) => {
    console.log('ActivityTimeline deleting activity:', id, deleteOption);
    try {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      await deleteActivity(numericId, deleteOption);
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  // Use all activities since we already filtered by date in the API call
  const todayActivities = allActivities;

  // Get formatted date
  const formattedDate = getFormattedCurrentDate();

  // Loading state
  if (isLoading) {
    return (
      <Card className="h-[600px] bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-xl">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <div className="w-6 h-6 border-2 border-gray-400 border-t-emerald-500 rounded-full animate-spin"></div>
              <span>Загрузка активностей...</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-[600px] bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-xl">
        <div className="flex items-center justify-center h-full text-center text-red-600">
          <p>Ошибка загрузки активностей</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-[600px] bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-xl">
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
        initialDate={formatDateForInput(formattedDate)}
        onActivityCreate={handleActivityCreate}
      />

      {selectedActivity && (
        <EditActivityDialog 
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          activity={selectedActivity}
          onActivityUpdate={(activity, recurringOptions) => handleActivityUpdate(activity.id, activity, recurringOptions)}
          onDelete={(activityId) => handleActivityDelete(activityId)}
        />
      )}
    </>
  );
};

export default ActivityTimelineComponent;
