import { useState, useCallback, useMemo } from 'react';
import { useActivitiesRange } from '@/hooks/api/useActivities';
import { calculateActivityLayouts } from '../utils/timeUtils';
import { convertApiActivitiesToUi } from '@/utils/activityAdapter';
import { getActivitiesForDate } from '@/utils/activitySync';

export const useWeekActivities = (startDate: string, endDate: string) => {
  const [filteredTypes, setFilteredTypes] = useState<Set<string>>(new Set());

  // Use API call for the week range
  const { data: weekApiActivities = [], isLoading } = useActivitiesRange(startDate, endDate);

  // Convert API activities to UI format
  const weekActivities = useMemo(() => {
    return convertApiActivitiesToUi(weekApiActivities);
  }, [weekApiActivities]);

  const getWeekActivities = useCallback(() => {
    console.log('Week activities total:', weekActivities.length);
    return weekActivities;
  }, [weekActivities]);

  const getActivitiesForDay = useCallback((day: Date) => {
    const dayString = day.toISOString().split('T')[0];
    
    // Use enhanced sync utility for better date filtering
    const dayActivities = getActivitiesForDate(weekActivities, dayString);
    
    console.log(`WeekView: Activities for ${dayString}:`, dayActivities.length);
    
    const filteredActivities = dayActivities.filter(activity => 
      !filteredTypes.has(activity.type)
    );
    
    // Sort activities by start time
    filteredActivities.sort((a, b) => {
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });
    
    console.log(`WeekView: Filtered activities for ${dayString}:`, filteredActivities.length);
    
    return calculateActivityLayouts(filteredActivities);
  }, [weekActivities, filteredTypes]);

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
    weekActivities,
    filteredTypes,
    isLoading,
    getWeekActivities,
    getActivitiesForDay,
    handleTypeFilterChange
  };
};