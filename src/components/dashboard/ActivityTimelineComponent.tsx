
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Plus } from 'lucide-react';
import CreateActivityDialog from './activity-timeline/CreateActivityDialog';
import EditActivityDialog from '@/components/calendar/components/EditActivityDialog';
import ActivityCard from '@/components/calendar/components/ActivityCard';
import { useActivities } from '@/contexts/ActivitiesContext';

const ActivityTimelineComponent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  const { activities, toggleActivityComplete, deleteActivity, updateActivity } = useActivities();

  const handleActivityUpdate = (activityId: number, updates: any) => {
    updateActivity(activityId, updates);
  };

  const handleActivityDelete = (activityId: number) => {
    deleteActivity(activityId);
  };

  const handleActivityToggle = (activityId: number) => {
    toggleActivityComplete(activityId);
  };

  return (
    <>
      <Card className="h-[600px] bg-white/70 backdrop-blur-lg border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span>Список активностей</span>
          </CardTitle>
          <Button 
            size="icon" 
            className="rounded-full bg-emerald-500 hover:bg-emerald-600"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6">
          <ScrollArea className="h-[480px]">
            <div className="space-y-0">
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  layout={{
                    activity,
                    top: 0,
                    height: 0,
                    left: 0,
                    width: 100,
                    column: 0,
                    totalColumns: 1
                  }}
                  onToggleComplete={handleActivityToggle}
                  onDelete={handleActivityDelete}
                  onUpdate={handleActivityUpdate}
                  viewType="dashboard"
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
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
