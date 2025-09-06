/**
 * Unified Activity Synchronization Service
 * Ensures consistent activity display across all calendar views and timeline
 */

import { Activity as ApiActivity } from '@/types/api.types';
import { Activity as UiActivity } from '@/contexts/ActivitiesContext';
import { convertApiActivitiesToUi } from '@/utils/activityAdapter';
import { expandRecurringForRange } from '@/components/calendar/utils/recurrenceExpansion';
import { getActivitiesForDate } from '@/utils/activitySync';

interface SyncedActivities {
  raw: ApiActivity[];
  converted: UiActivity[];
  filtered: UiActivity[];
  hasRecurring: boolean;
}

export class UnifiedActivitySyncService {
  /**
   * Process activities consistently for all views with detailed logging
   */
  static processActivitiesForView(
    apiActivities: ApiActivity[], 
    viewType: 'day' | 'week' | 'month',
    targetDate?: string,
    startDate?: string, 
    endDate?: string
  ): SyncedActivities {
    console.log(`UnifiedSync: Processing ${apiActivities.length} API activities for ${viewType} view`);
    
    if (targetDate) {
      console.log(`UnifiedSync: Target date: ${targetDate}`);
    }
    if (startDate && endDate) {
      console.log(`UnifiedSync: Date range: ${startDate} to ${endDate}`);
    }
    
    // Step 1: Convert API to UI format
    const converted = convertApiActivitiesToUi(apiActivities);
    console.log(`UnifiedSync: Converted ${apiActivities.length} API to ${converted.length} UI activities`);
    
    // Step 2: Check for recurring activities
    const hasRecurring = converted.some(activity => activity.recurring?.type);
    console.log(`UnifiedSync: Has recurring activities: ${hasRecurring}`);
    
    // Step 3: Expand recurring activities based on view type
    let processed = converted;
    if (hasRecurring && viewType !== 'day' && startDate && endDate) {
      console.log(`UnifiedSync: Expanding recurring activities for ${viewType} view`);
      processed = expandRecurringForRange(converted, startDate, endDate);
      console.log(`UnifiedSync: Expanded to ${processed.length} activities`);
    }
    
    // Step 4: Filter by target date for day view or specific date filtering
    let filtered = processed;
    if (targetDate) {
      filtered = getActivitiesForDate(processed, targetDate);
      console.log(`UnifiedSync: Filtered to ${filtered.length} activities for date ${targetDate}`);
    }
    
    // Step 5: Sort by start time for consistent display
    filtered.sort((a, b) => {
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });
    
    console.log(`UnifiedSync: Final result for ${viewType}: ${filtered.length} activities`);
    
    return {
      raw: apiActivities,
      converted,
      filtered,
      hasRecurring
    };
  }
  
  /**
   * Process activities specifically for timeline (today's activities)
   */
  static processActivitiesForTimeline(apiActivities: ApiActivity[]): UiActivity[] {
    const today = new Date().toISOString().split('T')[0];
    console.log(`UnifiedSync: Processing timeline activities for ${today}`);
    
    const result = this.processActivitiesForView(apiActivities, 'day', today);
    
    console.log(`UnifiedSync: Timeline result: ${result.filtered.length} activities for today`);
    return result.filtered;
  }
  
  /**
   * Process activities for day view
   */
  static processActivitiesForDay(apiActivities: ApiActivity[], date: string): UiActivity[] {
    console.log(`UnifiedSync: Processing day view activities for ${date}`);
    
    const result = this.processActivitiesForView(apiActivities, 'day', date);
    
    console.log(`UnifiedSync: Day view result: ${result.filtered.length} activities for ${date}`);
    return result.filtered;
  }
  
  /**
   * Process activities for week view
   */
  static processActivitiesForWeek(
    apiActivities: ApiActivity[], 
    startDate: string, 
    endDate: string
  ): UiActivity[] {
    console.log(`UnifiedSync: Processing week view activities from ${startDate} to ${endDate}`);
    
    const result = this.processActivitiesForView(apiActivities, 'week', undefined, startDate, endDate);
    
    console.log(`UnifiedSync: Week view result: ${result.filtered.length} activities for week`);
    return result.filtered;
  }
  
  /**
   * Process activities for month view
   */
  static processActivitiesForMonth(
    apiActivities: ApiActivity[], 
    startDate: string, 
    endDate: string
  ): UiActivity[] {
    console.log(`UnifiedSync: Processing month view activities from ${startDate} to ${endDate}`);
    
    const result = this.processActivitiesForView(apiActivities, 'month', undefined, startDate, endDate);
    
    console.log(`UnifiedSync: Month view result: ${result.filtered.length} activities for month`);
    return result.filtered;
  }
  
  /**
   * Get activities for a specific date with consistent filtering
   */
  static getActivitiesForDate(activities: UiActivity[], date: string): UiActivity[] {
    console.log(`UnifiedSync: Filtering ${activities.length} activities for date ${date}`);
    
    const filtered = getActivitiesForDate(activities, date);
    
    // Sort by start time
    filtered.sort((a, b) => {
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });
    
    console.log(`UnifiedSync: Found ${filtered.length} activities for date ${date}`);
    return filtered;
  }
  
  /**
   * Debug activity distribution for troubleshooting
   */
  static debugActivityDistribution(activities: UiActivity[], viewType: string): void {
    const distribution = new Map<string, UiActivity[]>();
    
    activities.forEach(activity => {
      const date = activity.date;
      if (!distribution.has(date)) {
        distribution.set(date, []);
      }
      distribution.get(date)!.push(activity);
    });
    
    console.log(`UnifiedSync: Activity distribution for ${viewType}:`);
    const sortedDates = Array.from(distribution.keys()).sort();
    sortedDates.forEach(date => {
      const dayActivities = distribution.get(date)!;
      console.log(`  ${date}: ${dayActivities.length} activities`);
      dayActivities.forEach(activity => {
        console.log(`    - ${activity.name} (${activity.startTime})`);
      });
    });
  }
  
  /**
   * Validate activity sync consistency across views
   */
  static validateSyncConsistency(
    timelineActivities: UiActivity[],
    calendarActivities: UiActivity[],
    targetDate: string
  ): boolean {
    const timelineCount = timelineActivities.length;
    const calendarForDate = this.getActivitiesForDate(calendarActivities, targetDate);
    const calendarCount = calendarForDate.length;
    
    const isConsistent = timelineCount === calendarCount;
    
    console.log(`UnifiedSync: Sync validation for ${targetDate}:`);
    console.log(`  Timeline: ${timelineCount} activities`);
    console.log(`  Calendar: ${calendarCount} activities`);
    console.log(`  Consistent: ${isConsistent}`);
    
    if (!isConsistent) {
      console.warn(`UnifiedSync: SYNC MISMATCH detected for ${targetDate}!`);
      console.warn('Timeline activities:', timelineActivities.map(a => ({ id: a.id, name: a.name, date: a.date })));
      console.warn('Calendar activities:', calendarForDate.map(a => ({ id: a.id, name: a.name, date: a.date })));
    }
    
    return isConsistent;
  }
}