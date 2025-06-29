
import { Activity } from '@/contexts/ActivitiesContext';
import { activities as initialActivities } from '@/components/dashboard/activity-timeline/activityData';

const STORAGE_KEY = 'psybalans-activities';

export const loadActivitiesFromStorage = (getCurrentDateString: () => string): Activity[] => {
  try {
    const savedActivities = localStorage.getItem(STORAGE_KEY);
    if (savedActivities) {
      const parsed = JSON.parse(savedActivities);
      console.log('Loaded activities from localStorage:', parsed.length, 'activities');
      return parsed;
    }
  } catch (error) {
    console.error('Error loading activities from localStorage:', error);
  }
  
  // If no saved data, use initial data for current day
  const currentDate = getCurrentDateString();
  const activitiesWithCorrectDate = initialActivities.map(activity => ({
    ...activity,
    date: currentDate
  }));
  console.log('Using initial activities for current date:', activitiesWithCorrectDate.length, 'activities');
  return activitiesWithCorrectDate;
};

export const saveActivitiesToStorage = (activities: Activity[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    console.log('Saved activities to localStorage:', activities.length, 'activities');
  } catch (error) {
    console.error('Error saving activities to localStorage:', error);
  }
};
