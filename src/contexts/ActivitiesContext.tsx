
import React, { createContext, useContext, ReactNode } from 'react';
import { RecurringActivityOptions, DeleteRecurringOption } from '@/components/calendar/utils/recurringUtils';
import { useActivityState } from '@/hooks/useActivityState';

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
  addActivity: (activity: Activity, recurringOptions?: RecurringActivityOptions) => Promise<void>;
  updateActivity: (id: number, updates: Partial<Activity>, recurringOptions?: RecurringActivityOptions) => Promise<void>;
  deleteActivity: (id: number, deleteOption?: DeleteRecurringOption) => Promise<void>;
  toggleActivityComplete: (id: number) => Promise<void>;
  getActivitiesForDate: (date: string) => Promise<Activity[]>;
  getActivitiesForDateRange: (startDate: string, endDate: string) => Promise<Activity[]>;
  getCurrentDateString: () => string;
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
  const activityState = useActivityState();

  return (
    <ActivitiesContext.Provider value={activityState}>
      {children}
    </ActivitiesContext.Provider>
  );
};
