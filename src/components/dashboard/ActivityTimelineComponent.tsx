
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { LoaderCircle } from 'lucide-react';
import CreateActivityDialog from '@/components/calendar/components/CreateActivityDialog';
import EditActivityDialog from '@/components/calendar/components/EditActivityDialog';
import ActivityTimelineHeader from './activity-timeline/ActivityTimelineHeader';
import TimelineContentWithTime from './activity-timeline/TimelineContentWithTime';
import { useTodayActivities } from '@/hooks/api/useActivities';
import { useActivitiesRealtime } from '@/hooks/api/useActivitiesRealtime';
import { useActivityOperationsAdapter } from '@/hooks/useActivityOperationsAdapter';
import ActivitySyncIndicator from '@/components/calendar/components/ActivitySyncIndicator';
import { convertApiActivitiesToUi } from '@/utils/activityAdapter';
import { formatDateForInput, getFormattedCurrentDate } from '@/utils/activityConversion';
import { useIsMobile } from '@/hooks/use-mobile';

const ActivityTimelineComponent = () => {
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // API hooks
  const { data: apiActivities = [], isLoading, error } = useTodayActivities();
  
  // Enable realtime updates
  useActivitiesRealtime(true);

  // Activity operations hook
  const {
    handleActivityCreate,
    handleActivityUpdateForTimeline: handleActivityUpdate,
    handleActivityDelete,
    handleActivityToggle,
    handleActivityUpdateForEdit
  } = useActivityOperationsAdapter(apiActivities);

  // Convert API activities to UI format
  const todayActivities = convertApiActivitiesToUi(apiActivities);

  // Get formatted date
  const formattedDate = getFormattedCurrentDate();

  // Loading state
  if (isLoading) {
    return (
      <Card className={`${isMobile ? 'h-[80vh]' : 'h-[600px]'} bg-white/70 backdrop-blur-lg border-0 shadow-xl`}>
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
      <Card className={`${isMobile ? 'h-[80vh]' : 'h-[600px]'} bg-white/70 backdrop-blur-lg border-0 shadow-xl`}>
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
      <Card className={`${isMobile ? 'h-[80vh]' : 'h-[600px]'} bg-white/70 backdrop-blur-lg border-0 shadow-xl`}>
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
        onActivityUpdate={handleActivityUpdateForEdit}
          onDelete={handleActivityDelete}
        />
      )}
    </>
  );
};

export default ActivityTimelineComponent;
