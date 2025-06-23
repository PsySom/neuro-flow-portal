
import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  updateActivity: (id: number, updates: Partial<Activity>) => void;
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

export const ActivitiesProvider: React.FC<ActivitiesProviderProps> = ({ children }) => {
  // Устанавливаем дату 23 июня 2025 года для всех активностей из данных
  const currentDate = '2025-06-23';
  const activitiesWithCorrectDate = initialActivities.map(activity => ({
    ...activity,
    date: currentDate
  }));

  const [activities, setActivities] = useState<Activity[]>(
    activitiesWithCorrectDate.sort((a, b) => {
      if (a.date !== b.date) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      const timeA = a.startTime.split(':').map(Number);
      const timeB = b.startTime.split(':').map(Number);
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    })
  );

  const addActivity = (activity: Activity, recurringOptions?: RecurringActivityOptions) => {
    setActivities(prev => {
      let newActivities = [...prev];
      
      if (recurringOptions && recurringOptions.type !== 'none') {
        const startDate = new Date(activity.date);
        const recurringActivities = generateRecurringActivities(activity, recurringOptions, startDate);
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

  const updateActivity = (id: number, updates: Partial<Activity>) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id 
          ? { ...activity, ...updates }
          : activity
      ).sort((a, b) => {
        if (a.date !== b.date) {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        const timeA = a.startTime.split(':').map(Number);
        const timeB = b.startTime.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      })
    );
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
    return activities.filter(activity => activity.date === date);
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
