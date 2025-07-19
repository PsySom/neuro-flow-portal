/**
 * Activity synchronization utilities for cross-component sync
 */

import { Activity } from '@/contexts/ActivitiesContext';
import { getCurrentDateString, isActivityForDate } from './dateUtils';

/**
 * Ensure activity has correct date format for sync
 */
export const normalizeActivityDate = (activity: any): any => {
  if (!activity.date) {
    return { ...activity, date: getCurrentDateString() };
  }
  
  // If date includes time, extract just the date part
  if (activity.date.includes('T')) {
    return { ...activity, date: activity.date.split('T')[0] };
  }
  
  return activity;
};

/**
 * Filter activities for specific date with enhanced validation
 */
export const getActivitiesForDate = (activities: any[], dateString: string): any[] => {
  const filteredActivities = activities.filter(activity => {
    try {
      return isActivityForDate(normalizeActivityDate(activity), dateString);
    } catch (error) {
      console.error('Error filtering activity by date:', error, activity);
      return false;
    }
  });
  
  console.log(`Sync: Activities for ${dateString}:`, filteredActivities.length);
  return filteredActivities;
};

/**
 * Get activities for current date only
 */
export const getTodayActivities = (activities: any[]): any[] => {
  const today = getCurrentDateString();
  return getActivitiesForDate(activities, today);
};

/**
 * Validate activity data integrity for sync
 */
export const validateActivityForSync = (activity: any): boolean => {
  if (!activity) return false;
  if (!activity.id) return false;
  if (!activity.date) return false;
  
  // Ensure basic required fields exist
  if (!activity.name && !activity.title) return false;
  
  return true;
};

/**
 * Sanitize activity data for cross-component consistency
 */
export const sanitizeActivityForSync = (activity: any): any => {
  const normalized = normalizeActivityDate(activity);
  
  return {
    ...normalized,
    // Ensure consistent field names
    name: normalized.name || normalized.title,
    title: normalized.title || normalized.name,
    // Ensure status field exists
    status: normalized.status || (normalized.completed ? 'completed' : 'planned'),
    completed: normalized.completed ?? (normalized.status === 'completed'),
    // Ensure time fields are present
    startTime: normalized.startTime || normalized.start_time || '09:00',
    endTime: normalized.endTime || normalized.end_time || '10:00'
  };
};

/**
 * Check if activity sync is needed between components
 */
export const needsSync = (localActivity: any, remoteActivity: any): boolean => {
  if (!localActivity || !remoteActivity) return true;
  
  // Compare key fields that should be synced
  const keyFields = ['status', 'completed', 'name', 'title', 'date', 'startTime', 'endTime'];
  
  for (const field of keyFields) {
    if (localActivity[field] !== remoteActivity[field]) {
      return true;
    }
  }
  
  return false;
};