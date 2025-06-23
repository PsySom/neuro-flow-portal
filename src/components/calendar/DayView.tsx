
import React, { useState } from 'react';
import CreateActivityDialog from './components/CreateActivityDialog';
import DayViewSidebar from './components/DayViewSidebar';
import DayViewCalendar from './components/DayViewCalendar';
import { useActivities } from '@/contexts/ActivitiesContext';
import { Activity } from '@/contexts/ActivitiesContext';

interface DayViewProps {
  currentDate: Date;
  onUpdateActivity?: (id: number, updates: Partial<Activity>) => void;
  onDeleteActivity?: (id: number) => void;
}

const DayView: React.FC<DayViewProps> = ({ currentDate, onUpdateActivity, onDeleteActivity }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [filteredTypes, setFilteredTypes] = useState<Set<string>>(new Set());
  const [internalCurrentDate, setInternalCurrentDate] = useState(currentDate);

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
  console.log('Filtered types:', Array.from(filteredTypes));

  const handleEmptyAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    if (target.closest('[data-activity-card]')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    
    // Используем новое соотношение 90px на час
    const hourFromTop = Math.floor(clickY / 90);
    const minuteFromTop = Math.floor((clickY % 90) * (60 / 90));
    
    const clickTime = `${hourFromTop.toString().padStart(2, '0')}:${Math.round(minuteFromTop).toString().padStart(2, '0')}`;
    
    setSelectedTime(clickTime);
    setIsCreateDialogOpen(true);
  };

  const handleActivityCreate = (newActivity: any, recurringOptions?: any) => {
    addActivity(newActivity, recurringOptions);
  };

  const handleActivityUpdate = (id: number, updates: Partial<Activity>) => {
    updateActivity(id, updates);
    if (onUpdateActivity) {
      onUpdateActivity(id, updates);
    }
  };

  const handleActivityDelete = (id: number) => {
    deleteActivity(id);
    if (onDeleteActivity) {
      onDeleteActivity(id);
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
    setInternalCurrentDate(date);
  };

  return (
    <>
      <div className="flex gap-4">
        {/* Левая панель с календарем и фильтрами */}
        <DayViewSidebar
          currentDate={internalCurrentDate}
          activities={dayActivities} // Передаем только активности текущего дня
          filteredTypes={filteredTypes}
          onTypeFilterChange={handleTypeFilterChange}
          onDateSelect={handleDateSelect}
        />

        {/* Основная область календаря */}
        <DayViewCalendar
          visibleActivities={visibleActivities}
          currentDate={internalCurrentDate}
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
        onActivityCreate={handleActivityCreate}
      />
    </>
  );
};

export default DayView;
