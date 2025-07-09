import React, { useState, useCallback, useMemo } from 'react';
import CreateActivityDialog from './components/CreateActivityDialog';
import DayViewSidebar from './components/DayViewSidebar';
import DayViewCalendar from './components/DayViewCalendar';
import { useActivities, useCreateActivity, useUpdateActivity, useDeleteActivity } from '@/hooks/api/useActivities';
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

  // Use API hooks instead of context
  const currentDateString = useMemo(() => currentDate.toISOString().split('T')[0], [currentDate]);
  const { data: apiActivities = [], isLoading } = useActivities(currentDateString);
  const createActivityMutation = useCreateActivity();
  const updateActivityMutation = useUpdateActivity();
  const deleteActivityMutation = useDeleteActivity();

  // Convert API activities to UI format
  const dayActivities = useMemo(() => convertApiActivitiesToUi(apiActivities), [apiActivities]);

  console.log('DayView current date:', currentDateString);
  console.log('DayView activities for date:', dayActivities.length);

  const handleActivityToggle = useCallback((activityId: number) => {
    const activity = apiActivities.find(a => a.id === activityId);
    if (activity) {
      const newStatus = activity.status === 'completed' ? 'planned' : 'completed';
      updateActivityMutation.mutate({ 
        id: activityId, 
        data: { status: newStatus } 
      });
    }
  }, [apiActivities, updateActivityMutation]);

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
    
    // Convert UI updates to API format
    const apiUpdates: UpdateActivityRequest = {
      title: updates.name,
      description: updates.note,
      status: updates.completed !== undefined ? (updates.completed ? 'completed' : 'planned') : undefined,
      metadata: {
        importance: updates.importance,
        color: updates.color,
        emoji: updates.emoji,
        needEmoji: updates.needEmoji
      }
    };
    
    // Remove undefined values
    const cleanApiUpdates = Object.fromEntries(
      Object.entries(apiUpdates).filter(([_, value]) => value !== undefined)
    ) as UpdateActivityRequest;
    
    updateActivityMutation.mutate({ id: activityId, data: cleanApiUpdates });
    if (onUpdateActivity) {
      onUpdateActivity(activityId, updates);
    }
  }, [updateActivityMutation, onUpdateActivity]);

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
    return <div className="flex items-center justify-center h-96">Загрузка активностей...</div>;
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