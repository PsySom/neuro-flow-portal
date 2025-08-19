import React, { useState, useCallback, useMemo } from 'react';
import CreateActivityDialog from './components/CreateActivityDialog';
import DayViewSidebar from './components/DayViewSidebar';
import DayViewCalendar from './components/DayViewCalendar';
import ActivitySyncIndicator from './components/ActivitySyncIndicator';
import { useActivities } from '@/hooks/api/useActivities';
import { Activity } from '@/contexts/ActivitiesContext';
import { useUnifiedActivityOperations } from '@/hooks/useUnifiedActivityOperations';
import { CalendarSyncService } from '@/services/calendar-sync.service';
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [filteredTypes, setFilteredTypes] = useState<Set<string>>(new Set());

  // Use API hooks with realtime updates enabled
  const currentDateString = useMemo(() => currentDate.toLocaleDateString('en-CA'), [currentDate]);
  const { data: apiActivities = [], isLoading } = useActivities(currentDateString, true);
  
  // Unified activity operations will be initialized after activities conversion for accurate context

  // Process activities using unified sync service for day view  
  const dayActivities = useMemo(() => {
    const processed = CalendarSyncService.processActivities(
      apiActivities,
      currentDateString,
      currentDateString,
      'day'
    );
    
    // Clean and validate the activities
    const cleanActivities = CalendarSyncService.cleanActivities(processed.expanded);
    
    console.log(`DayView: Processed ${apiActivities.length} API activities to ${cleanActivities.length} UI activities for ${currentDateString}`);
    return cleanActivities;
  }, [apiActivities, currentDateString]);

  const {
    handleActivityCreate: createActivity,
    handleActivityUpdate: updateActivity,
    handleActivityDelete: deleteActivity,
    handleActivityToggle: toggleActivityStatus,
  } = useUnifiedActivityOperations(dayActivities);

  console.log('DayView current date:', currentDateString);
  console.log('DayView activities for date:', dayActivities.length);
  const handleActivityToggle = useCallback((activityId: number) => {
    const activity = apiActivities.find(a => a.id === activityId);
    if (activity) {
      console.log('Toggling activity status:', activityId, 'current:', activity.status);
      toggleActivityStatus(activityId);
    }
  }, [apiActivities, toggleActivityStatus]);

  const visibleActivities = useMemo(() => 
    CalendarSyncService.filterActivitiesByType(dayActivities, filteredTypes)
  , [dayActivities, filteredTypes]);

  console.log('Visible activities count:', visibleActivities.length);

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
    
    setSelectedTime(clickTime);
    setIsCreateDialogOpen(true);
  }, []);

  const handleActivityCreate = useCallback((newActivity: any, recurringOptions?: RecurringActivityOptions) => {
    console.log('DayView creating activity:', newActivity, 'with recurring:', recurringOptions);
    createActivity(newActivity, recurringOptions)
      .then((result) => {
        console.log('Activity creation result:', result);
        setIsCreateDialogOpen(false);
      })
      .catch(error => console.error('Failed to create activity:', error));
  }, [createActivity]);

  const handleActivityUpdate = useCallback((activityId: number, updates: Partial<Activity>, recurringOptions?: RecurringActivityOptions) => {
    console.log('DayView handleActivityUpdate:', activityId, updates, recurringOptions);
    updateActivity(activityId, updates, recurringOptions)
      .then(() => {
        if (onUpdateActivity) {
          onUpdateActivity(activityId, updates);
        }
      })
      .catch(error => console.error('Failed to update activity:', error));
  }, [updateActivity, onUpdateActivity]);

  const handleActivityDelete = useCallback((id: number, deleteOption?: DeleteRecurringOption) => {
    console.log('DayView handleActivityDelete:', id, deleteOption);
    deleteActivity(id, deleteOption)
      .then(() => {
        if (onDeleteActivity) {
          onDeleteActivity(id, deleteOption);
        }
      })
      .catch(error => console.error('Failed to delete activity:', error));
  }, [deleteActivity, onDeleteActivity]);

  const handleTypeFilterChange = useCallback((type: string, checked: boolean) => {
    console.log('Filter change:', type, checked);
    setFilteredTypes(prev => {
      const newFiltered = new Set(prev);
      if (checked) {
        newFiltered.delete(type);
      } else {
        newFiltered.add(type);
      }
      console.log('New filtered types:', Array.from(newFiltered));
      return newFiltered;
    });
  }, []);

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
            filteredTypes={new Set()}
            onTypeFilterChange={() => {}}
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
          activities={dayActivities}
          filteredTypes={filteredTypes}
          onTypeFilterChange={handleTypeFilterChange}
          onDateSelect={handleDateSelect}
        />

        {/* Main calendar area */}
        <DayViewCalendar
          visibleActivities={visibleActivities}
          currentDate={currentDate}
          onEmptyAreaClick={handleEmptyAreaClick}
          onActivityToggle={handleActivityToggle}
          onUpdateActivity={handleActivityUpdate}
          onDeleteActivity={handleActivityDelete}
        />
      </div>

      <CreateActivityDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        initialTime={selectedTime}
        initialDate={currentDateString}
        onActivityCreate={handleActivityCreate}
      />
    </>
  );
};

export default DayView;