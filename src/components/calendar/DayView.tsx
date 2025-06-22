
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

  // Используем активности из контекста - те же данные, что и в дашборде
  const { activities, toggleActivityComplete, addActivity } = useActivities();

  // Добавляем логирование для отладки
  console.log('DayView activities count:', activities.length);
  console.log('DayView activities:', activities.map(a => ({ id: a.id, name: a.name, time: `${a.startTime}-${a.endTime}` })));

  // Обработчик переключения состояния активности
  const handleActivityToggle = (activityId: number) => {
    toggleActivityComplete(activityId);
  };

  // Фильтруем активности по выбранным типам - убеждаемся, что показываем все активности
  const visibleActivities = activities.filter(activity => 
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

  const handleActivityCreate = (newActivity: any) => {
    addActivity(newActivity);
  };

  const handleTypeFilterChange = (type: string, checked: boolean) => {
    setFilteredTypes(prev => {
      const newFiltered = new Set(prev);
      if (checked) {
        newFiltered.delete(type);
      } else {
        newFiltered.add(type);
      }
      return newFiltered;
    });
  };

  return (
    <>
      <div className="flex gap-4">
        {/* Левая панель с календарем и фильтрами */}
        <DayViewSidebar
          currentDate={currentDate}
          activities={activities}
          filteredTypes={filteredTypes}
          onTypeFilterChange={handleTypeFilterChange}
        />

        {/* Основная область календаря */}
        <DayViewCalendar
          visibleActivities={visibleActivities}
          currentDate={currentDate}
          onEmptyAreaClick={handleEmptyAreaClick}
          onActivityToggle={handleActivityToggle}
          onUpdateActivity={onUpdateActivity}
          onDeleteActivity={onDeleteActivity}
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
