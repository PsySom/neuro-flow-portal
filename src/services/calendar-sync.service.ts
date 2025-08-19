/**
 * Unified Calendar Synchronization Service
 * Ensures consistent activity data across all calendar views
 */

import { Activity as ApiActivity } from '@/types/api.types';
import { Activity as UiActivity } from '@/contexts/ActivitiesContext';
import { convertApiActivitiesToUi } from '@/utils/activityAdapter';
import { expandRecurringForRange } from '@/components/calendar/utils/recurrenceExpansion';
import { getActivitiesForDate } from '@/utils/activitySync';

interface ProcessedActivities {
  converted: UiActivity[];
  expanded: UiActivity[];
  hasRecurring: boolean;
}

export class CalendarSyncService {
  /**
   * Process API activities consistently for all calendar views
   */
  static processActivities(
    apiActivities: ApiActivity[], 
    startDate: string, 
    endDate: string,
    viewType: 'day' | 'week' | 'month'
  ): ProcessedActivities {
    console.log(`CalendarSync: Processing ${apiActivities.length} API activities for ${viewType} view (${startDate} - ${endDate})`);
    
    // Convert API activities to UI format
    const converted = convertApiActivitiesToUi(apiActivities);
    console.log(`CalendarSync: Converted ${apiActivities.length} API to ${converted.length} UI activities`);
    
    // Check for recurring activities
    const hasRecurring = converted.some(activity => {
      const isRecurring = !!(activity.recurring?.type);
      if (isRecurring) {
        console.log(`CalendarSync: Found recurring activity ${activity.id} (${activity.name}) of type ${activity.recurring?.type}`);
      }
      return isRecurring;
    });
    
    console.log(`CalendarSync: Has recurring activities: ${hasRecurring}`);
    
    // For day view, don't expand recurring - show only activities for exact date
    if (viewType === 'day') {
      console.log('CalendarSync: Day view - no expansion needed');
      return {
        converted,
        expanded: converted,
        hasRecurring
      };
    }
    
    // For week and month views, expand recurring activities if present
    let expanded = converted;
    if (hasRecurring) {
      console.log(`CalendarSync: Expanding recurring activities for ${viewType} view`);
      expanded = expandRecurringForRange(converted, startDate, endDate);
      console.log(`CalendarSync: Expanded to ${expanded.length} activities total`);
    } else {
      console.log(`CalendarSync: No recurring activities, skipping expansion for ${viewType} view`);
    }
    
    return {
      converted,
      expanded,
      hasRecurring
    };
  }
  
  /**
   * Get activities for a specific date with consistent filtering
   */
  static getActivitiesForDate(activities: UiActivity[], dateString: string): UiActivity[] {
    const dayActivities = getActivitiesForDate(activities, dateString);
    
    // Sort by start time for consistency
    dayActivities.sort((a, b) => {
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });
    
    return dayActivities;
  }
  
  /**
   * Filter activities by type consistently across views
   */
  static filterActivitiesByType(activities: UiActivity[], filteredTypes: Set<string>): UiActivity[] {
    return activities.filter(activity => !filteredTypes.has(activity.type));
  }
  
  /**
   * Validate activity data integrity
   */
  static validateActivity(activity: UiActivity): boolean {
    if (!activity.id || !activity.name || !activity.date) {
      console.warn('CalendarSync: Invalid activity detected:', activity);
      return false;
    }
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(activity.date)) {
      console.warn('CalendarSync: Invalid date format in activity:', activity.id, activity.date);
      return false;
    }
    
    // Check for duplicate recurring clones (should not happen)
    if (activity.recurring?.isClone && typeof activity.id === 'string' && activity.id.includes('_recurring_')) {
      const parts = activity.id.split('_recurring_');
      const cloneDate = parts[1];
      if (cloneDate !== activity.date) {
        console.warn('CalendarSync: Mismatched clone date in activity:', activity.id, activity.date);
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Clean and validate activity list
   */
  static cleanActivities(activities: UiActivity[]): UiActivity[] {
    return activities.filter(activity => this.validateActivity(activity));
  }
  
  /**
   * Debug activity distribution across date range
   */
  static debugActivityDistribution(activities: UiActivity[], startDate: string, endDate: string, viewType: string): void {
    const distribution = new Map<string, number>();
    
    activities.forEach(activity => {
      const date = activity.date;
      distribution.set(date, (distribution.get(date) || 0) + 1);
    });
    
    console.log(`CalendarSync: Activity distribution for ${viewType} view (${startDate} - ${endDate}):`);
    const sortedDates = Array.from(distribution.keys()).sort();
    sortedDates.forEach(date => {
      console.log(`  ${date}: ${distribution.get(date)} activities`);
    });
  }
}