import { Activity as ApiActivity, ActivityType as ApiActivityType } from '../types/api.types';
import { Activity as UiActivity } from '../contexts/ActivitiesContext';

// Convert API Activity to UI Activity format
export const convertApiActivityToUi = (apiActivity: ApiActivity): UiActivity => {
  // Default values for UI-specific fields
  const defaultColor = apiActivity.activity_type?.color || '#3B82F6';
  const defaultEmoji = apiActivity.activity_type?.icon || '📝';
  
  // Validate dates before processing
  const startTime = new Date(apiActivity.start_time);
  if (isNaN(startTime.getTime())) {
    console.error('Invalid start_time in activity:', apiActivity);
    throw new Error(`Invalid start_time: ${apiActivity.start_time}`);
  }
  
  const endTime = apiActivity.end_time ? 
    (() => {
      const end = new Date(apiActivity.end_time);
      return isNaN(end.getTime()) ? new Date(startTime.getTime() + 60 * 60 * 1000) : end;
    })() : 
    new Date(startTime.getTime() + 60 * 60 * 1000); // Default 1 hour
    
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const duration = durationHours > 0 ? `${durationHours}ч ${durationMinutes}м` : `${durationMinutes}м`;

  return {
    id: apiActivity.id,
    name: apiActivity.title,
    emoji: apiActivity.metadata?.emoji || defaultEmoji,
    startTime: formatTime(apiActivity.start_time),
    endTime: apiActivity.end_time ? formatTime(apiActivity.end_time) : '',
    duration,
    color: apiActivity.metadata?.color || 'bg-gray-200',
    importance: apiActivity.metadata?.importance || 3,
    completed: apiActivity.status === 'completed',
    type: apiActivity.activity_type?.name || 'general',
    needEmoji: apiActivity.metadata?.needEmoji,
    date: apiActivity.start_time ? apiActivity.start_time.split('T')[0] : new Date().toISOString().split('T')[0], // Extract date part
    reminder: apiActivity.metadata?.reminder,
    note: apiActivity.description,
    // Handle recurring if present in metadata and valid
    recurring: apiActivity.metadata?.recurring && 
               apiActivity.metadata.recurring.type !== 'none' && 
               apiActivity.metadata.recurring.type !== null ? {
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
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', isoString);
      return '00:00';
    }
    // Use more precise formatting to ensure HH:mm format
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting time:', error, isoString);
    return '00:00';
  }
};

// Helper function to convert HH:mm time to ISO time format
const convertTimeToISO = (timeString: string): string => {
  // timeString format: "HH:mm"
  return `${timeString}:00.000Z`;
};

// Convert array of API activities to UI activities
export const convertApiActivitiesToUi = (apiActivities: ApiActivity[]): UiActivity[] => {
  return apiActivities.filter(activity => {
    // Filter out activities with invalid dates
    try {
      const date = new Date(activity.start_time);
      return !isNaN(date.getTime());
    } catch (error) {
      console.warn('Filtering out activity with invalid date:', activity);
      return false;
    }
  }).map(activity => {
    try {
      return convertApiActivityToUi(activity);
    } catch (error) {
      console.error('Error converting activity:', error, activity);
      return null;
    }
  }).filter(Boolean) as UiActivity[];
};

// Default activity type for fallback
export const getDefaultActivityType = (): ApiActivityType => ({
  id: 1,
  name: 'Общая задача',
  description: 'Общая активность',
  color: '#3B82F6',
  icon: '📝',
});