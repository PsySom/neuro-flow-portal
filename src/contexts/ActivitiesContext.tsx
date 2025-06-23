
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { activities as initialActivities } from '@/components/dashboard/activity-timeline/activityData';
import { generateRecurringActivities, RecurringActivityOptions, DeleteRecurringOption, getRecurringGroup } from '@/components/calendar/utils/recurringUtils';

export interface Activity {
  id: number;
  name: string;
  emoji: string;
  startTime: string;
  endTime: string;
  duration: string;
  color: string;
  importance: number;
  completed: boolean;
  type: string;
  needEmoji?: string;
  date: string;
  reminder?: string;
  note?: string;
  recurring?: {
    originalId: number;
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    occurrenceNumber: number;
  };
}

interface ActivitiesContextType {
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  addActivity: (activity: Activity, recurringOptions?: RecurringActivityOptions) => void;
  updateActivity: (id: number, updates: Partial<Activity>, recurringOptions?: RecurringActivityOptions) => void;
  deleteActivity: (id: number, deleteOption?: DeleteRecurringOption) => void;
  toggleActivityComplete: (id: number) => void;
  getActivitiesForDate: (date: string) => Activity[];
  getActivitiesForDateRange: (startDate: string, endDate: string) => Activity[];
}

const ActivitiesContext = createContext<ActivitiesContextType | undefined>(undefined);

export const useActivities = () => {
  const context = useContext(ActivitiesContext);
  if (context === undefined) {
    throw new Error('useActivities must be used within an ActivitiesProvider');
  }
  return context;
};

interface ActivitiesProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'psybalans-activities';

export const ActivitiesProvider: React.FC<ActivitiesProviderProps> = ({ children }) => {
  // Функция для загрузки данных из localStorage
  const loadActivitiesFromStorage = (): Activity[] => {
    try {
      const savedActivities = localStorage.getItem(STORAGE_KEY);
      if (savedActivities) {
        const parsed = JSON.parse(savedActivities);
        console.log('Loaded activities from localStorage:', parsed.length, 'activities');
        return parsed;
      }
    } catch (error) {
      console.error('Error loading activities from localStorage:', error);
    }
    
    // Если нет сохраненных данных, используем начальные данные
    const currentDate = '2025-06-23';
    const activitiesWithCorrectDate = initialActivities.map(activity => ({
      ...activity,
      date: currentDate
    }));
    console.log('Using initial activities:', activitiesWithCorrectDate.length, 'activities');
    return activitiesWithCorrectDate;
  };

  const [activities, setActivities] = useState<Activity[]>(() => {
    const loadedActivities = loadActivitiesFromStorage();
    return loadedActivities.sort((a, b) => {
      if (a.date !== b.date) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      const timeA = a.startTime.split(':').map(Number);
      const timeB = b.startTime.split(':').map(Number);
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });
  });

  // Сохранение в localStorage при изменении активностей
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
      console.log('Saved activities to localStorage:', activities.length, 'activities');
    } catch (error) {
      console.error('Error saving activities to localStorage:', error);
    }
  }, [activities]);

  const addActivity = (activity: Activity, recurringOptions?: RecurringActivityOptions) => {
    setActivities(prev => {
      let newActivities = [...prev];
      
      if (recurringOptions && recurringOptions.type !== 'none') {
        const startDate = new Date(activity.date);
        const recurringActivities = generateRecurringActivities(activity, recurringOptions, startDate);
        console.log('Generated recurring activities:', recurringActivities.length, 'activities');
        console.log('Recurring activities dates:', recurringActivities.map(a => a.date));
        newActivities = [...newActivities, ...recurringActivities];
      } else {
        newActivities = [...newActivities, activity];
      }

      return newActivities.sort((a, b) => {
        if (a.date !== b.date) {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        const timeA = a.startTime.split(':').map(Number);
        const timeB = b.startTime.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      });
    });
  };

  const updateActivity = (id: number, updates: Partial<Activity>, recurringOptions?: RecurringActivityOptions) => {
    setActivities(prev => {
      let updatedActivities = prev.map(activity => 
        activity.id === id 
          ? { ...activity, ...updates }
          : activity
      );

      // Если есть параметры повторения, создаем новые повторяющиеся активности
      if (recurringOptions && recurringOptions.type !== 'none') {
        const updatedActivity = updatedActivities.find(a => a.id === id);
        if (updatedActivity) {
          // Удаляем старые повторения этой активности
          updatedActivities = updatedActivities.filter(activity => 
            activity.recurring?.originalId !== id
          );

          // Генерируем новые повторения
          const startDate = new Date(updatedActivity.date);
          const recurringActivities = generateRecurringActivities(updatedActivity, recurringOptions, startDate);
          
          // Исключаем оригинальную активность из повторений (она уже обновлена)
          const newRecurringActivities = recurringActivities.slice(1);
          
          console.log('Generated new recurring activities for update:', newRecurringActivities.length, 'activities');
          console.log('New recurring activities dates:', newRecurringActivities.map(a => a.date));
          
          updatedActivities = [...updatedActivities, ...newRecurringActivities];
        }
      }

      return updatedActivities.sort((a, b) => {
        if (a.date !== b.date) {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        const timeA = a.startTime.split(':').map(Number);
        const timeB = b.startTime.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      });
    });
  };

  const deleteActivity = (id: number, deleteOption: DeleteRecurringOption = 'single') => {
    setActivities(prev => {
      const activityToDelete = prev.find(a => a.id === id);
      
      if (!activityToDelete) return prev;

      if (deleteOption === 'all' && (activityToDelete.recurring || 
          prev.some(a => a.recurring?.originalId === id))) {
        // Удаляем все повторяющиеся активности
        const originalId = activityToDelete.recurring?.originalId || id;
        return prev.filter(activity => 
          activity.id !== originalId && activity.recurring?.originalId !== originalId
        );
      } else {
        // Удаляем только выбранную активность
        return prev.filter(activity => activity.id !== id);
      }
    });
  };

  const toggleActivityComplete = (id: number) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id 
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
  };

  const getActivitiesForDate = (date: string): Activity[] => {
    const result = activities.filter(activity => activity.date === date);
    console.log(`getActivitiesForDate ${date}:`, result.length, 'activities found');
    return result;
  };

  const getActivitiesForDateRange = (startDate: string, endDate: string): Activity[] => {
    return activities.filter(activity => 
      activity.date >= startDate && activity.date <= endDate
    );
  };

  const value = {
    activities,
    setActivities,
    addActivity,
    updateActivity,
    deleteActivity,
    toggleActivityComplete,
    getActivitiesForDate,
    getActivitiesForDateRange,
  };

  return (
    <ActivitiesContext.Provider value={value}>
      {children}
    </ActivitiesContext.Provider>
  );
};
