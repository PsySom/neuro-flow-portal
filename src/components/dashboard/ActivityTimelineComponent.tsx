
import React from 'react';
import { Card } from '@/components/ui/card';
import CreateActivityDialog from './activity-timeline/CreateActivityDialog';
import EditActivityDialog from '@/components/calendar/components/EditActivityDialog';
import ActivityTimelineHeader from './activity-timeline/ActivityTimelineHeader';
import ActivityTimelineContent from './activity-timeline/ActivityTimelineContent';
import ActivityTimelineEmpty from './activity-timeline/ActivityTimelineEmpty';
import { useActivityTimelineLogic } from './activity-timeline/useActivityTimelineLogic';
import { DeleteRecurringOption } from '@/components/calendar/utils/recurringUtils';

const ActivityTimelineComponent = () => {
  const {
    isDialogOpen,
    setIsDialogOpen,
    selectedActivity,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    todayActivities,
    toggleActivityComplete,
    deleteActivity,
    updateActivity,
    getFormattedDate
  } = useActivityTimelineLogic();

  const handleActivityUpdate = (activityId: number, updates: any) => {
    updateActivity(activityId, updates);
  };

  const handleActivityDelete = (activityId: number, deleteOption?: DeleteRecurringOption) => {
    deleteActivity(activityId, deleteOption);
  };

  const handleActivityToggle = (activityId: number) => {
    toggleActivityComplete(activityId);
  };

  const formattedDate = getFormattedDate();

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
