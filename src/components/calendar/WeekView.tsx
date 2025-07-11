
import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DayViewSidebar from './components/DayViewSidebar';
import CreateActivityDialog from './components/CreateActivityDialog';
import WeekViewHeader from './components/WeekViewHeader';
import WeekViewDay from './components/WeekViewDay';
import TimeColumn from './components/TimeColumn';
import ActivitySyncIndicator from './components/ActivitySyncIndicator';
import { useWeekView } from './hooks/useWeekView';

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
    handleActivityCreate,
    handleActivityUpdate,
    handleActivityDelete,
    handleActivityToggle,
    handleTypeFilterChange,
    isLoading,
    syncActivities
  } = useWeekView(currentDate);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const weekActivities = getWeekActivities();

  const handleDateSelect = (date: Date) => {
    if (onDateChange) {
      onDateChange(date);
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
          <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p>Синхронизация недельных активностей...</p>
                </div>
                <ActivitySyncIndicator />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="flex gap-6">
        <DayViewSidebar
          currentDate={currentDate}
          activities={weekActivities}
          filteredTypes={filteredTypes}
          onTypeFilterChange={handleTypeFilterChange}
          onDateSelect={handleDateSelect}
        />

        <div className="flex-1">
          <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
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
