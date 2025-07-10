import React, { useState, useCallback, useMemo } from 'react';
import CreateActivityDialog from './components/CreateActivityDialog';
import DayViewSidebar from './components/DayViewSidebar';
import DayViewCalendar from './components/DayViewCalendar';
import ActivitySyncIndicator from './components/ActivitySyncIndicator';
import { useActivities, useCreateActivity, useUpdateActivity, useDeleteActivity, useToggleActivityStatus } from '@/hooks/api/useActivities';
import { Activity as ApiActivity, UpdateActivityRequest } from '@/types/api.types';
import { Activity } from '@/contexts/ActivitiesContext';
import { convertApiActivitiesToUi, convertUiActivityToApi } from '@/utils/activityAdapter';
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
  const currentDateString = useMemo(() => currentDate.toISOString().split('T')[0], [currentDate]);
  const { data: apiActivities = [], isLoading } = useActivities(currentDateString, true);
  const createActivityMutation = useCreateActivity();
  const updateActivityMutation = useUpdateActivity();
  const deleteActivityMutation = useDeleteActivity();
  const toggleActivityStatusMutation = useToggleActivityStatus();

  // Convert API activities to UI format
  const dayActivities = useMemo(() => convertApiActivitiesToUi(apiActivities), [apiActivities]);

  console.log('DayView current date:', currentDateString);
  console.log('DayView activities for date:', dayActivities.length);

  const handleActivityToggle = useCallback((activityId: number) => {
    const activity = apiActivities.find(a => a.id === activityId);
    if (activity) {
      console.log('Toggling activity status:', activityId, 'current:', activity.status);
      toggleActivityStatusMutation.mutate({ 
        activityId, 
        currentStatus: activity.status 
      });
    }
  }, [apiActivities, toggleActivityStatusMutation]);

  const visibleActivities = useMemo(() => dayActivities.filter(activity => 
    !filteredTypes.has(activity.type)
  ), [dayActivities, filteredTypes]);

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
    // Activity creation will be handled by the parent Calendar component
    setIsCreateDialogOpen(false);
  }, []);

  const handleActivityUpdate = useCallback((activityId: number, updates: Partial<Activity>, recurringOptions?: RecurringActivityOptions) => {
    console.log('DayView handleActivityUpdate:', activityId, updates, recurringOptions);
    
    // Map activity type to API type ID if type is being updated
    const getActivityTypeId = (type: string) => {
      switch (type) {
        case 'задача': return 1;
        case 'восстановление': return 2;
        case 'нейтральная': return 3;
        case 'смешанная': return 4;
        default: return 1;
      }
    };
    
    // Build update object with only changed fields to avoid overwriting existing data
    const apiUpdates: Partial<UpdateActivityRequest> = {};
    
    if (updates.name !== undefined) apiUpdates.title = updates.name;
    if (updates.note !== undefined) apiUpdates.description = updates.note;
    if (updates.type !== undefined) apiUpdates.activity_type_id = getActivityTypeId(updates.type);
    if (updates.completed !== undefined) apiUpdates.status = updates.completed ? 'completed' : 'planned';
    
    // Handle time updates with proper ISO string formatting
    if (updates.date && updates.startTime) {
      apiUpdates.start_time = `${updates.date}T${updates.startTime}:00.000Z`;
    }
    if (updates.date && updates.endTime) {
      apiUpdates.end_time = `${updates.date}T${updates.endTime}:00.000Z`;
    }
    
    // Handle metadata updates
    if (updates.importance !== undefined || updates.color !== undefined || 
        updates.emoji !== undefined || updates.needEmoji !== undefined || recurringOptions) {
      
      // Get current activity to preserve existing metadata
      const currentActivity = apiActivities.find(a => a.id === activityId);
      const currentMetadata = currentActivity?.metadata || {};
      
      apiUpdates.metadata = {
        ...currentMetadata,
        ...(updates.importance !== undefined && { importance: updates.importance }),
        ...(updates.color !== undefined && { color: updates.color }),
        ...(updates.emoji !== undefined && { emoji: updates.emoji }),
        ...(updates.needEmoji !== undefined && { needEmoji: updates.needEmoji }),
        ...(recurringOptions && { recurring: recurringOptions })
      };
    }
    
    console.log('Sending API update:', apiUpdates);
    
    updateActivityMutation.mutate({ id: activityId, data: apiUpdates as UpdateActivityRequest });
    if (onUpdateActivity) {
      onUpdateActivity(activityId, updates);
    }
  }, [updateActivityMutation, onUpdateActivity, apiActivities]);

  const handleActivityDelete = useCallback((id: number, deleteOption?: DeleteRecurringOption) => {
    console.log('DayView handleActivityDelete:', id, deleteOption);
    deleteActivityMutation.mutate(id);
    if (onDeleteActivity) {
      onDeleteActivity(id, deleteOption);
    }
  }, [deleteActivityMutation, onDeleteActivity]);

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