import React, { useState, useCallback, useMemo } from 'react';
import CreateActivityDialog from './components/CreateActivityDialog';
import DayViewSidebar from './components/DayViewSidebar';
import DayViewCalendar from './components/DayViewCalendar';
import ActivitySyncIndicator from './components/ActivitySyncIndicator';
import { useActivitiesApi } from '@/hooks/api/useActivitiesApi';
import { Activity } from '@/contexts/ActivitiesContext';
import { useCalendarView } from '@/hooks/useCalendarView';
import { DeleteRecurringOption, RecurringActivityOptions } from './utils/recurringUtils';

interface DayViewProps {
  currentDate: Date;
  onUpdateActivity?: (id: number, updates: Partial<Activity>) => void;
  onDeleteActivity?: (id: number, deleteOption?: DeleteRecurringOption) => void;
  onDateChange?: (date: Date) => void;
}

const DayView: React.FC<DayViewProps> = ({ 
  currentDate, 
  onUpdateActivity, 
  onDeleteActivity,
  onDateChange 
}) => {
  // Use API hooks with realtime updates enabled
  const currentDateString = useMemo(() => currentDate.toLocaleDateString('en-CA'), [currentDate]);
  const { data: apiActivities = [], isLoading } = useActivitiesApi(currentDateString, true);

  // Use unified calendar view logic
  const calendarView = useCalendarView({
    viewType: 'day',
    activities: apiActivities,
    isLoading,
    startDate: currentDateString,
    endDate: currentDateString
  });

  console.log('DayView current date:', currentDateString);
  console.log('DayView activities for date:', calendarView.activities.length);
  
  const handleActivityToggle = useCallback((activityId: number) => {
    const activity = apiActivities.find(a => a.id === activityId);
    if (activity) {
      console.log('Toggling activity status:', activityId, 'current:', activity.status);
      calendarView.handleActivityToggle(activityId);
    }
  }, [apiActivities, calendarView]);

  console.log('Visible activities count:', calendarView.visibleActivities.length);

  const handleActivityUpdate = useCallback(async (activityId: number, updates: Partial<Activity>, recurringOptions?: RecurringActivityOptions) => {
    try {
      await calendarView.handleActivityUpdate(activityId, updates, recurringOptions);
      if (onUpdateActivity) {
        onUpdateActivity(activityId, updates);
      }
    } catch (error) {
      console.error('Failed to update activity:', error);
    }
  }, [calendarView, onUpdateActivity]);

  const handleActivityDelete = useCallback(async (id: number, deleteOption?: DeleteRecurringOption) => {
    try {
      await calendarView.handleActivityDelete(id, deleteOption);
      if (onDeleteActivity) {
        onDeleteActivity(id, deleteOption);
      }
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  }, [calendarView, onDeleteActivity]);

  const handleEmptyAreaClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    if (target.closest('[data-activity-card]')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    
    const hourFromTop = Math.floor(clickY / 90);
    const minuteFromTop = Math.floor((clickY % 90) * (60 / 90));
    
    const clickTime = `${hourFromTop.toString().padStart(2, '0')}:${Math.round(minuteFromTop).toString().padStart(2, '0')}`;
    
    calendarView.handleTimeSlotClick(clickTime, currentDateString);
  }, [calendarView, currentDateString]);

  const handleDateSelect = useCallback((date: Date) => {
    console.log('Date selected in DayView:', date);
    if (onDateChange) {
      onDateChange(date);
    }
  }, [onDateChange]);

  if (isLoading) {
    return (
      <div className="flex gap-4">
        <div className="w-64">
        <DayViewSidebar
          currentDate={currentDate}
          activities={[]}
          filteredTypes={calendarView.filteredTypes}
          onTypeFilterChange={calendarView.handleTypeFilterChange}
          onDateSelect={handleDateSelect}
        />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p>Синхронизация активностей...</p>
              <ActivitySyncIndicator className="mt-4 justify-center" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-4">
        {/* Left sidebar */}
        <DayViewSidebar
          currentDate={currentDate}
          activities={calendarView.activities}
          filteredTypes={calendarView.filteredTypes}
          onTypeFilterChange={calendarView.handleTypeFilterChange}
          onDateSelect={handleDateSelect}
        />

        {/* Main calendar area */}
        <DayViewCalendar
          visibleActivities={calendarView.visibleActivities}
          currentDate={currentDate}
          onEmptyAreaClick={handleEmptyAreaClick}
          onActivityToggle={handleActivityToggle}
          onUpdateActivity={handleActivityUpdate}
          onDeleteActivity={handleActivityDelete}
        />
      </div>

      <CreateActivityDialog 
        open={calendarView.isCreateDialogOpen}
        onOpenChange={calendarView.setIsCreateDialogOpen}
        initialTime={calendarView.selectedTime}
        initialDate={calendarView.selectedDate}
        onActivityCreate={calendarView.handleActivityCreate}
      />
    </>
  );
};

export default DayView;