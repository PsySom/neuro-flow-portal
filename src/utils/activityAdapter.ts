import { Activity as ApiActivity, ActivityType as ApiActivityType } from '../types/api.types';
import { Activity as UiActivity } from '../contexts/ActivitiesContext';

// Convert API Activity to UI Activity format
export const convertApiActivityToUi = (apiActivity: ApiActivity): UiActivity => {
  // Default values for UI-specific fields
  const defaultColor = apiActivity.activity_type?.color || '#3B82F6';
  const defaultEmoji = apiActivity.activity_type?.icon || '📝';
  
  // Calculate duration
  const startTime = new Date(apiActivity.start_time);
  const endTime = apiActivity.end_time ? new Date(apiActivity.end_time) : new Date(startTime.getTime() + 60 * 60 * 1000); // Default 1 hour
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const duration = durationHours > 0 ? `${durationHours}ч ${durationMinutes}м` : `${durationMinutes}м`;

  return {
    id: apiActivity.id,
    name: apiActivity.title,
    emoji: defaultEmoji,
    startTime: formatTime(apiActivity.start_time),
    endTime: apiActivity.end_time ? formatTime(apiActivity.end_time) : '',
    duration,
    color: defaultColor,
    importance: apiActivity.metadata?.importance || 3,
    completed: apiActivity.status === 'completed',
    type: apiActivity.activity_type?.name || 'general',
    needEmoji: apiActivity.activity_type?.icon,
    date: apiActivity.start_time.split('T')[0], // Extract date part
    reminder: apiActivity.metadata?.reminder,
    note: apiActivity.description,
    // Handle recurring if present in metadata
    recurring: apiActivity.metadata?.recurring ? {
      originalId: apiActivity.metadata.recurring.originalId,
      type: apiActivity.metadata.recurring.type,
      interval: apiActivity.metadata.recurring.interval,
      occurrenceNumber: apiActivity.metadata.recurring.occurrenceNumber,
    } : undefined,
  };
};

// Convert UI Activity to API Activity format for create/update
export const convertUiActivityToApi = (uiActivity: Partial<UiActivity>, activityTypeId?: number) => {
  const startDateTime = uiActivity.date && uiActivity.startTime ? 
    `${uiActivity.date}T${convertTimeToISO(uiActivity.startTime)}` : 
    new Date().toISOString();
    
  const endDateTime = uiActivity.date && uiActivity.endTime ? 
    `${uiActivity.date}T${convertTimeToISO(uiActivity.endTime)}` : 
    undefined;

  return {
    title: uiActivity.name || '',
    description: uiActivity.note,
    activity_type_id: activityTypeId || 1, // Default activity type
    start_time: startDateTime,
    end_time: endDateTime,
    status: uiActivity.completed ? 'completed' : 'planned',
    metadata: {
      importance: uiActivity.importance,
      color: uiActivity.color,
      emoji: uiActivity.emoji,
      reminder: uiActivity.reminder,
      recurring: uiActivity.recurring,
    },
  };
};

// Helper function to format ISO time to HH:mm
const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Helper function to convert HH:mm time to ISO time format
const convertTimeToISO = (timeString: string): string => {
  // timeString format: "HH:mm"
  return `${timeString}:00.000Z`;
};

// Convert array of API activities to UI activities
export const convertApiActivitiesToUi = (apiActivities: ApiActivity[]): UiActivity[] => {
  return apiActivities.map(convertApiActivityToUi);
};

// Default activity type for fallback
export const getDefaultActivityType = (): ApiActivityType => ({
  id: 1,
  name: 'Общая задача',
  description: 'Общая активность',
  color: '#3B82F6',
  icon: '📝',
});