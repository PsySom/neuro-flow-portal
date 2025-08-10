import { useState, useCallback, useMemo } from 'react';
import { useActivitiesRange } from '@/hooks/api/useActivities';
import { calculateActivityLayouts } from '../utils/optimizedTimeUtils';
import { expandRecurringForRange } from '../utils/recurrenceExpansion';
import { convertApiActivitiesToUi } from '@/utils/activityAdapter';
import { getActivitiesForDate } from '@/utils/activitySync';

/**
 * Optimized hook for week activities with better memoization and performance
 */
export const useOptimizedWeekActivities = (startDate: string, endDate: string) => {
  const [filteredTypes, setFilteredTypes] = useState<Set<string>>(new Set());

  // Memoize the date range query
  const { data: weekApiActivities = [], isLoading } = useActivitiesRange(startDate, endDate);

  // Optimize activities processing with better memoization
  const processedActivities = useMemo(() => {
    console.log(`Processing ${weekApiActivities.length} API activities for week ${startDate} - ${endDate}`);
    
    const converted = convertApiActivitiesToUi(weekApiActivities);
    const expanded = expandRecurringForRange(converted, startDate, endDate);
    
    console.log(`Processed result: ${expanded.length} activities after conversion and expansion`);
    return expanded;
  }, [weekApiActivities, startDate, endDate]);

  // Memoize activities grouped by date for better performance
  const activitiesByDate = useMemo(() => {
    const grouped = new Map<string, any[]>();
    
    processedActivities.forEach(activity => {
      const date = activity.date?.split('T')[0] || activity.date;
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)!.push(activity);
    });
    
    // Sort activities in each day
    grouped.forEach(activities => {
      activities.sort((a, b) => {
        if (a.startTime && b.startTime) {
          return a.startTime.localeCompare(b.startTime);
        }
        return 0;
      });
    });
    
    return grouped;
  }, [processedActivities]);

  const getWeekActivities = useCallback(() => {
    return processedActivities;
  }, [processedActivities]);

  const getActivitiesForDay = useCallback((day: Date) => {
    const dayString = day.toLocaleDateString('en-CA');
    const dayActivities = activitiesByDate.get(dayString) || [];
    
    console.log(`WeekView: Activities for ${dayString}:`, dayActivities.length);
    
    // Apply type filtering
    const filteredActivities = dayActivities.filter(activity => 
      !filteredTypes.has(activity.type)
    );
    
    console.log(`WeekView: Filtered activities for ${dayString}:`, filteredActivities.length);
    
    return calculateActivityLayouts(filteredActivities);
  }, [activitiesByDate, filteredTypes]);

  const handleTypeFilterChange = useCallback((type: string, checked: boolean) => {
    setFilteredTypes(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      console.log('Week view filter change:', type, checked, Array.from(newSet));
      return newSet;
    });
  }, []);

  return {
    weekActivities: processedActivities,
    filteredTypes,
    isLoading,
    getWeekActivities,
    getActivitiesForDay,
    handleTypeFilterChange
  };
};