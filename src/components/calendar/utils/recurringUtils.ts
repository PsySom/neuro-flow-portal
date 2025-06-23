
import { Activity } from '@/contexts/ActivitiesContext';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface RecurringActivityOptions {
  type: RecurrenceType;
  interval: number; // каждые N дней/недель/месяцев
  endDate?: Date;
  maxOccurrences?: number;
}

export const generateRecurringActivities = (
  baseActivity: Activity,
  options: RecurringActivityOptions,
  startDate: Date
): Activity[] => {
  if (options.type === 'none') {
    return [baseActivity];
  }

  const activities: Activity[] = [baseActivity];
  let currentDate = new Date(startDate);
  let occurrenceCount = 1;

  const maxDate = options.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // год вперед по умолчанию
  const maxOccurrences = options.maxOccurrences || 365;

  while (occurrenceCount < maxOccurrences && currentDate <= maxDate) {
    switch (options.type) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + options.interval);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + (7 * options.interval));
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + options.interval);
        break;
    }

    if (currentDate <= maxDate) {
      const recurringActivity: Activity = {
        ...baseActivity,
        id: baseActivity.id + occurrenceCount,
        date: currentDate.toISOString().split('T')[0],
        recurring: {
          originalId: baseActivity.id,
          type: options.type,
          interval: options.interval,
          occurrenceNumber: occurrenceCount + 1
        }
      };

      activities.push(recurringActivity);
      occurrenceCount++;
    }
  }

  return activities;
};

export const isRecurringActivity = (activity: Activity): boolean => {
  return !!activity.recurring;
};

export const getRecurringGroup = (activities: Activity[], originalId: number): Activity[] => {
  return activities.filter(activity => 
    activity.id === originalId || activity.recurring?.originalId === originalId
  );
};

export const deleteRecurringOption = {
  SINGLE: 'single',
  ALL: 'all'
} as const;

export type DeleteRecurringOption = typeof deleteRecurringOption[keyof typeof deleteRecurringOption];
