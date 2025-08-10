
import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DayViewSidebar from './components/DayViewSidebar';
import CreateActivityDialog from './components/CreateActivityDialog';
import WeekViewHeader from './components/WeekViewHeader';
import WeekViewDay from './components/WeekViewDay';
import TimeColumn from './components/TimeColumn';
import ActivitySyncIndicator from './components/ActivitySyncIndicator';
import { useWeekView } from './hooks/useWeekView';
import { useUnifiedActivityOperations } from '@/hooks/useUnifiedActivityOperations';

interface WeekViewProps {
  currentDate: Date;
  onDateChange?: (date: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = memo(({ currentDate, onDateChange }) => {
  const {
    scrollAreaRef,
    filteredTypes,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    selectedTime,
    selectedDate,
    weekDays,
    getWeekActivities,
    getActivitiesForDay,
    handleEmptyAreaClick,
    handleTypeFilterChange,
    isLoading
  } = useWeekView(currentDate);

  // Use unified activity sync hook
  const {
    handleActivityCreate: createActivity,
    handleActivityUpdate: updateActivity,
    handleActivityDelete: deleteActivity,
    handleActivityToggle: toggleActivityStatus
  } = useUnifiedActivityOperations();

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const weekActivities = getWeekActivities();

  const handleDateSelect = (date: Date) => {
    if (onDateChange) {
      onDateChange(date);
    }
  };

  const handleActivityCreate = (newActivity: any, recurringOptions?: any) => {
    console.log('WeekView creating activity:', newActivity, 'with recurring:', recurringOptions);
    createActivity(newActivity, recurringOptions)
      .then(() => setIsCreateDialogOpen(false))
      .catch(error => console.error('Failed to create activity:', error));
  };

  const handleActivityUpdate = (activityId: number, updates: any, recurringOptions?: any) => {
    console.log('WeekView updating activity:', activityId, updates, recurringOptions);
    updateActivity(activityId, updates, recurringOptions)
      .catch(error => console.error('Failed to update activity:', error));
  };

  const handleActivityDelete = (id: number, deleteOption?: any) => {
    console.log('WeekView deleting activity:', id, deleteOption);
    deleteActivity(id, deleteOption)
      .catch(error => console.error('Failed to delete activity:', error));
  };

  const handleActivityToggle = (activityId: number) => {
    // Find activity to get current status
    const activity = weekActivities.find(a => a.id === activityId);
    if (activity) {
      const currentStatus = activity.completed ? 'completed' : 'planned';
      console.log('WeekView toggling activity status:', activityId, 'current:', currentStatus);
      toggleActivityStatus(activityId)
        .catch(error => console.error('Failed to toggle activity:', error));
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-6">
        <div className="w-64">
          <DayViewSidebar
            currentDate={currentDate}
            activities={[]}
            filteredTypes={filteredTypes}
            onTypeFilterChange={handleTypeFilterChange}
            onDateSelect={handleDateSelect}
          />
        </div>
        <div className="flex-1">
          <Card className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="text-center text-gray-500">Загрузка...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-6">
        <div className="w-64">
          <DayViewSidebar
            currentDate={currentDate}
            activities={weekActivities}
            filteredTypes={filteredTypes}
            onTypeFilterChange={handleTypeFilterChange}
            onDateSelect={handleDateSelect}
          />
        </div>
        <div className="flex-1">
          <Card className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-xl">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-medium">Календарь недели</h3>
                <ActivitySyncIndicator />
              </div>
              <WeekViewHeader weekDays={weekDays} />

              <div className="h-[720px] overflow-y-auto" ref={scrollAreaRef}>
                <div className="flex" style={{ height: '2160px' }}>
                  <TimeColumn hours={hours} />

                  {weekDays.map((day, dayIndex) => {
                    const dayActivities = getActivitiesForDay(day);
                    
                    return (
                      <WeekViewDay
                        key={`${day.getTime()}-${dayIndex}`}
                        day={day}
                        dayIndex={dayIndex}
                        dayActivities={dayActivities}
                        hours={hours}
                        onEmptyAreaClick={handleEmptyAreaClick}
                        onActivityToggle={handleActivityToggle}
                        onActivityDelete={handleActivityDelete}
                        onActivityUpdate={handleActivityUpdate}
                      />
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateActivityDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        initialTime={selectedTime}
        initialDate={selectedDate}
        onActivityCreate={handleActivityCreate}
      />
    </>
  );
});

WeekView.displayName = 'WeekView';

export default WeekView;
