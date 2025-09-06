import { Activity } from '@/contexts/ActivitiesContext';
import { ActivityStatus } from '@/types/api.types';
import { RecurringActivityOptions } from '@/components/calendar/utils/recurringUtils';
import { getActivityTypeId } from '@/components/calendar/utils/activityTypeMapping';

export interface ActivityCreateData {
  name: string;
  note?: string;
  type: string;
  date: string;
  startTime: string;
  endTime?: string;
  completed?: boolean;
  importance?: number;
  color?: string;
  emoji?: string;
  needEmoji?: string;
}

export interface ActivityUpdateData extends Partial<Activity> {
  id: number | string;
}

/**
 * Converts UI activity creation data to API format
 */
export const convertCreateDataToApi = (
  activityData: ActivityCreateData, 
  recurringOptions?: RecurringActivityOptions
) => {
  return {
    title: activityData.name,
    description: activityData.note || '',
    activity_type_id: getActivityTypeId(activityData.type),
    start_time: `${activityData.date}T${convertTimeToISO(activityData.startTime)}`,
    end_time: activityData.endTime ? `${activityData.date}T${convertTimeToISO(activityData.endTime)}` : undefined,
    status: (activityData.completed ? 'completed' : 'planned') as ActivityStatus,
    metadata: {
      importance: activityData.importance,
      color: activityData.color,
      emoji: activityData.emoji,
      needEmoji: activityData.needEmoji,
      recurring: recurringOptions
    }
  };
};

/**
 * Converts UI activity update data to API format
 */
export const convertUpdateDataToApi = (
  activityData: ActivityUpdateData,
  recurringOptions?: RecurringActivityOptions
) => {
  const apiUpdates: any = {
    title: activityData.name,
    description: activityData.note,
    activity_type_id: activityData.type ? getActivityTypeId(activityData.type) : undefined,
    start_time: activityData.date && activityData.startTime ? 
      `${activityData.date}T${convertTimeToISO(activityData.startTime)}` : undefined,
    end_time: activityData.date && activityData.endTime ? 
      `${activityData.date}T${convertTimeToISO(activityData.endTime)}` : undefined,
    status: activityData.completed !== undefined ? 
      (activityData.completed ? 'completed' : 'planned') : undefined,
    metadata: {
      importance: activityData.importance,
      color: activityData.color,
      emoji: activityData.emoji,
      needEmoji: activityData.needEmoji,
      recurring: recurringOptions
    }
  };

  // Remove undefined values but keep null values for proper serialization
  const cleanApiUpdates = Object.fromEntries(
    Object.entries(apiUpdates).filter(([_, value]) => value !== undefined)
  );

  // Remove metadata if empty or contains only undefined values
  if (cleanApiUpdates.metadata && Object.values(cleanApiUpdates.metadata).every(v => v === undefined)) {
    delete cleanApiUpdates.metadata;
  }

  return cleanApiUpdates;
};

/**
 * Ensures activity ID is numeric
 */
export const normalizeActivityId = (id: number | string): number => {
  return typeof id === 'string' ? parseInt(id) : id;
};

/**
 * Formats date for initial date input
 */
export const formatDateForInput = (dateString: string): string => {
  return dateString.split(',')[0];
};

/**
 * Converts time string to ISO format
 */
export const convertTimeToISO = (timeString: string): string => {
  return `${timeString}:00.000Z`;
};

/**
 * Gets formatted current date
 */
export const getFormattedCurrentDate = (): string => {
  const today = new Date().toISOString().split('T')[0];
  const date = new Date(today + 'T12:00:00'); // Use noon to avoid timezone issues
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
