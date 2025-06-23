
import { Activity } from '@/contexts/ActivitiesContext';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface RecurringActivityOptions {
  type: RecurrenceType;
  interval: number; // каждые N дней/недель/месяцев
  endDate?: Date;
  maxOccurrences?: number;
}

const generateUniqueId = (baseId: number, occurrence: number): number => {
  return baseId * 10000 + occurrence;
};

export const generateRecurringActivities = (
  baseActivity: Activity,
  options: RecurringActivityOptions,
  startDate: Date
): Activity[] => {
  if (options.type === 'none') {
    return [baseActivity];
  }

  const activities: Activity[] = [];
  let currentDate = new Date(startDate);
  let occurrenceCount = 1;

  // Определяем максимальное количество повторений
  const maxOccurrences = options.maxOccurrences || (
    options.type === 'daily' ? 10 :
    options.type === 'weekly' ? 8 :
    12 // monthly
  );

  // Устанавливаем максимальную дату (год вперед)
  const maxDate = options.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  console.log(`Generating ${options.type} recurring activities, max: ${maxOccurrences}`);
  console.log('Base activity date:', baseActivity.date);
  console.log('Start date:', startDate.toISOString().split('T')[0]);

  // Добавляем первую активность (оригинал)
  const firstActivity: Activity = {
    ...baseActivity,
    recurring: {
      originalId: baseActivity.id,
      type: options.type,
      interval: options.interval,
      occurrenceNumber: 1
    }
  };
  activities.push(firstActivity);

  // Генерируем повторения
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
      const nextDateString = nextDate.toISOString().split('T')[0];
      
      const recurringActivity: Activity = {
        ...baseActivity,
        id: generateUniqueId(baseActivity.id, occurrenceCount + 1),
        date: nextDateString,
        recurring: {
          originalId: baseActivity.id,
          type: options.type,
          interval: options.interval,
          occurrenceNumber: occurrenceCount + 1
        }
      };

      console.log(`Generated recurring activity ${occurrenceCount + 1}:`, nextDateString, 'ID:', recurringActivity.id);
      activities.push(recurringActivity);
      currentDate = nextDate;
      occurrenceCount++;
    } else {
      break;
    }
  }

  console.log(`Total generated activities: ${activities.length}`);
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
