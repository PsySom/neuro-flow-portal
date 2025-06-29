
import { Activity } from '@/contexts/ActivitiesContext';
import { RecurringActivityOptions, DeleteRecurringOption, generateRecurringActivities } from '@/components/calendar/utils/recurringUtils';

export const generateUniqueId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

export const sortActivities = (activities: Activity[]): Activity[] => {
  return activities.sort((a, b) => {
    if (a.date !== b.date) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    const timeA = a.startTime.split(':').map(Number);
    const timeB = b.startTime.split(':').map(Number);
    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
  });
};

export const addActivityWithRecurring = (
  activities: Activity[],
  activity: Activity,
  getCurrentDateString: () => string,
  recurringOptions?: RecurringActivityOptions
): Activity[] => {
  let newActivities = [...activities];
  
  const activityWithUniqueId = {
    ...activity,
    id: activity.id || generateUniqueId(),
    date: activity.date || getCurrentDateString()
  };
  
  if (recurringOptions && recurringOptions.type !== 'none') {
    const startDate = new Date(activityWithUniqueId.date);
    const recurringActivities = generateRecurringActivities(activityWithUniqueId, recurringOptions, startDate);
    console.log('Generated recurring activities:', recurringActivities.length, 'activities');
    console.log('Recurring activities dates:', recurringActivities.map(a => a.date));
    newActivities = [...newActivities, ...recurringActivities];
  } else {
    newActivities = [...newActivities, activityWithUniqueId];
  }

  return sortActivities(newActivities);
};

export const updateActivityWithRecurring = (
  activities: Activity[],
  id: number,
  updates: Partial<Activity>,
  recurringOptions?: RecurringActivityOptions
): Activity[] => {
  const activityToUpdate = activities.find(a => a.id === id);
  if (!activityToUpdate) {
    console.warn('Activity not found for update:', id);
    return activities;
  }

  console.log('Updating activity:', id, 'with updates:', updates, 'recurring options:', recurringOptions);

  let updatedActivities = activities.map(activity => 
    activity.id === id 
      ? { ...activity, ...updates }
      : activity
  );

  if (recurringOptions && recurringOptions.type !== 'none') {
    const updatedActivity = updatedActivities.find(a => a.id === id);
    if (updatedActivity) {
      const originalId = activityToUpdate.recurring?.originalId || id;
      updatedActivities = updatedActivities.filter(activity => 
        activity.id !== originalId && activity.recurring?.originalId !== originalId
      );

      const baseActivity = {
        ...updatedActivity,
        id: generateUniqueId(),
        recurring: undefined
      };

      const startDate = new Date(baseActivity.date);
      const recurringActivities = generateRecurringActivities(baseActivity, recurringOptions, startDate);
      
      console.log('Generated new recurring activities for update:', recurringActivities.length, 'activities');
      updatedActivities = [...updatedActivities, ...recurringActivities];
    }
  }

  return sortActivities(updatedActivities);
};

export const deleteActivityWithRecurring = (
  activities: Activity[],
  id: number,
  deleteOption: DeleteRecurringOption = 'single'
): Activity[] => {
  const activityToDelete = activities.find(a => a.id === id);
  
  if (!activityToDelete) return activities;

  console.log('Deleting activity:', id, 'with option:', deleteOption);

  if (deleteOption === 'all' && (activityToDelete.recurring || 
      activities.some(a => a.recurring?.originalId === id))) {
    const originalId = activityToDelete.recurring?.originalId || id;
    const filteredActivities = activities.filter(activity => 
      activity.id !== originalId && activity.recurring?.originalId !== originalId
    );
    console.log('Deleted all recurring activities for:', originalId);
    return filteredActivities;
  } else {
    const filteredActivities = activities.filter(activity => activity.id !== id);
    console.log('Deleted single activity:', id);
    return filteredActivities;
  }
};

export const toggleActivityCompletion = (
  activities: Activity[],
  id: number
): Activity[] => {
  console.log('Toggled activity completion:', id);
  return activities.map(activity => 
    activity.id === id 
      ? { ...activity, completed: !activity.completed }
      : activity
  );
};

export const getActivitiesForDate = (activities: Activity[], date: string): Activity[] => {
  const result = activities.filter(activity => activity.date === date);
  console.log(`getActivitiesForDate ${date}:`, result.length, 'activities found');
  return result;
};

export const getActivitiesForDateRange = (
  activities: Activity[],
  startDate: string,
  endDate: string
): Activity[] => {
  return activities.filter(activity => 
    activity.date >= startDate && activity.date <= endDate
  );
};
