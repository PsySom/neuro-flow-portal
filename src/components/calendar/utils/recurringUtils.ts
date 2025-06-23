
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

  // Для ежедневных повторений устанавливаем 10 дней
  const maxOccurrences = options.type === 'daily' ? 10 : (options.maxOccurrences || 30);
  const maxDate = options.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  while (occurrenceCount < maxOccurrences && currentDate <= maxDate) {
    // Создаем новую дату для следующего повторения
    const nextDate = new Date(currentDate);
    
    switch (options.type) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + options.interval);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + (7 * options.interval));
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + options.interval);
        break;
    }

    if (nextDate <= maxDate) {
      const recurringActivity: Activity = {
        ...baseActivity,
        id: baseActivity.id + occurrenceCount * 1000, // Уникальный ID для каждого повторения
        date: nextDate.toISOString().split('T')[0],
        recurring: {
          originalId: baseActivity.id,
          type: options.type,
          interval: options.interval,
          occurrenceNumber: occurrenceCount + 1
        }
      };

      activities.push(recurringActivity);
      currentDate = nextDate;
      occurrenceCount++;
    } else {
      break;
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
