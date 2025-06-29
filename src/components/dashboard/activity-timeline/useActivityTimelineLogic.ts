
import { useState, useEffect } from 'react';
import { useActivities } from '@/contexts/ActivitiesContext';

export const useActivityTimelineLogic = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { activities, toggleActivityComplete, deleteActivity, updateActivity, getActivitiesForDate } = useActivities();

  // Функция для получения текущей даты в формате строки
  const getCurrentDateString = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Обновляем текущую дату каждую минуту для проверки смены дня
  useEffect(() => {
    const updateCurrentDate = () => {
      setCurrentDate(new Date());
    };

    // Обновляем сразу
    updateCurrentDate();

    // Устанавливаем интервал обновления каждую минуту
    const interval = setInterval(updateCurrentDate, 60000);

    return () => clearInterval(interval);
  }, []);

  // Получаем активности для текущего дня
  const currentDateString = getCurrentDateString();
  const todayActivities = getActivitiesForDate(currentDateString);

  console.log('Dashboard activities for', currentDateString, ':', todayActivities.length);

  // Форматируем дату для отображения
  const getFormattedDate = () => {
    const date = new Date(currentDateString);
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    selectedActivity,
    setSelectedActivity,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    todayActivities,
    toggleActivityComplete,
    deleteActivity,
    updateActivity,
    getFormattedDate
  };
};
