
import React, { useState, useEffect } from 'react';
import CreateActivityDialog from './components/CreateActivityDialog';
import DayViewSidebar from './components/DayViewSidebar';
import DayViewCalendar from './components/DayViewCalendar';
import { useActivities } from '@/contexts/ActivitiesContext';
import { Activity } from '@/contexts/ActivitiesContext';
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

  // Используем активности из контекста
  const { activities, getActivitiesForDate, toggleActivityComplete, addActivity, updateActivity, deleteActivity } = useActivities();

  // Получаем активности для выбранной даты
  const currentDateString = currentDate.toISOString().split('T')[0];
  const dayActivities = getActivitiesForDate(currentDateString);

  console.log('DayView current date:', currentDateString);
  console.log('DayView activities for date:', dayActivities.length);

  // Обработчик переключения состояния активности
  const handleActivityToggle = (activityId: number) => {
    toggleActivityComplete(activityId);
  };

  // Фильтруем активности по выбранным типам
  const visibleActivities = dayActivities.filter(activity => 
    !filteredTypes.has(activity.type)
  );

  console.log('Visible activities count:', visibleActivities.length);

  const handleEmptyAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    if (target.closest('[data-activity-card]')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    
    // Используем соотношение 90px на час
    const hourFromTop = Math.floor(clickY / 90);
    const minuteFromTop = Math.floor((clickY % 90) * (60 / 90));
    
    const clickTime = `${hourFromTop.toString().padStart(2, '0')}:${Math.round(minuteFromTop).toString().padStart(2, '0')}`;
    
    setSelectedTime(clickTime);
    setIsCreateDialogOpen(true);
  };

  const handleActivityCreate = (newActivity: any, recurringOptions?: RecurringActivityOptions) => {
    // Устанавливаем дату из currentDate, если она не указана
    const activityWithDate = {
      ...newActivity,
      date: newActivity.date || currentDateString
    };
    console.log('Creating activity in DayView:', activityWithDate, 'with recurring:', recurringOptions);
    addActivity(activityWithDate, recurringOptions);
  };

  const handleActivityUpdate = (activityId: number, updates: Partial<Activity>, recurringOptions?: RecurringActivityOptions) => {
    console.log('DayView handleActivityUpdate:', activityId, updates, recurringOptions);
    
    // Используем обновленный метод updateActivity с поддержкой recurring options
    updateActivity(activityId, updates, recurringOptions);
    
    if (onUpdateActivity) {
      onUpdateActivity(activityId, updates);
    }
  };

  const handleActivityDelete = (id: number, deleteOption?: DeleteRecurringOption) => {
    console.log('DayView handleActivityDelete:', id, deleteOption);
    deleteActivity(id, deleteOption);
    if (onDeleteActivity) {
      onDeleteActivity(id, deleteOption);
    }
  };

  const handleTypeFilterChange = (type: string, checked: boolean) => {
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
  };

  const handleDateSelect = (date: Date) => {
    console.log('Date selected in DayView:', date);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  return (
    <>
      <div className="flex gap-4">
        {/* Левая панель с календарем и фильтрами */}
        <DayViewSidebar
          currentDate={currentDate}
          activities={dayActivities}
          filteredTypes={filteredTypes}
          onTypeFilterChange={handleTypeFilterChange}
          onDateSelect={handleDateSelect}
        />

        {/* Основная область календаря */}
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
