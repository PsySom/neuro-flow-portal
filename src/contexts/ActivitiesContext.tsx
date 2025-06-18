
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { activities as initialActivities } from '@/components/dashboard/activity-timeline/activityData';

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
}

interface ActivitiesContextType {
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  addActivity: (activity: Activity) => void;
  updateActivity: (id: number, updates: Partial<Activity>) => void;
  deleteActivity: (id: number) => void;
  toggleActivityComplete: (id: number) => void;
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
  const [activities, setActivities] = useState<Activity[]>(
    initialActivities.sort((a, b) => {
      const timeA = a.startTime.split(':').map(Number);
      const timeB = b.startTime.split(':').map(Number);
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    })
  );

  const addActivity = (activity: Activity) => {
    setActivities(prev => {
      const newActivities = [...prev, activity];
      // Сортируем по времени начала
      return newActivities.sort((a, b) => {
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
        const timeA = a.startTime.split(':').map(Number);
        const timeB = b.startTime.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      })
    );
  };

  const deleteActivity = (id: number) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
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

  const value = {
    activities,
    setActivities,
    addActivity,
    updateActivity,
    deleteActivity,
    toggleActivityComplete,
  };

  return (
    <ActivitiesContext.Provider value={value}>
      {children}
    </ActivitiesContext.Provider>
  );
};
