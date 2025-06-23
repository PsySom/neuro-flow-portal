
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Plus } from 'lucide-react';
import CreateActivityDialog from './activity-timeline/CreateActivityDialog';
import EditActivityDialog from '@/components/calendar/components/EditActivityDialog';
import ActivityCard from '@/components/calendar/components/ActivityCard';
import { useActivities } from '@/contexts/ActivitiesContext';
import { DeleteRecurringOption } from '@/components/calendar/utils/recurringUtils';

const ActivityTimelineComponent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  const { activities, toggleActivityComplete, deleteActivity, updateActivity, getActivitiesForDate } = useActivities();

  // Получаем активности для 23 июня 2025 (текущий день в системе)
  const currentSystemDate = '2025-06-23';
  const todayActivities = getActivitiesForDate(currentSystemDate);

  console.log('Dashboard activities for', currentSystemDate, ':', todayActivities.length);

  const handleActivityUpdate = (activityId: number, updates: any) => {
    updateActivity(activityId, updates);
  };

  const handleActivityDelete = (activityId: number, deleteOption?: DeleteRecurringOption) => {
    deleteActivity(activityId, deleteOption);
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
            <span>Активности на 23 июня 2025</span>
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
              {todayActivities.map((activity) => (
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
              {todayActivities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Нет активностей на 23 июня 2025</p>
                </div>
              )}
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
