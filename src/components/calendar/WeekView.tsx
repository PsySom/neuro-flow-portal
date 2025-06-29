
import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DayViewSidebar from './components/DayViewSidebar';
import CreateActivityDialog from './components/CreateActivityDialog';
import WeekViewHeader from './components/WeekViewHeader';
import WeekViewDay from './components/WeekViewDay';
import TimeColumn from './components/TimeColumn';
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
    handleTypeFilterChange
  } = useWeekView(currentDate);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const weekActivities = getWeekActivities();

  const handleDateSelect = (date: Date) => {
    if (onDateChange) {
      onDateChange(date);
    }
  };

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
              <WeekViewHeader weekDays={weekDays} />

              <div className="h-[720px] overflow-y-auto" ref={scrollAreaRef}>
                <div className="flex" style={{ height: '2160px' }}>
                  <TimeColumn hours={hours} />

                  {weekDays.map((day, dayIndex) => {
                    const dayActivities = getActivitiesForDay(day);
                    
                    return (
                      <WeekViewDay
                        key={`${day.toISOString()}-${dayIndex}`}
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
