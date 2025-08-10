import { Activity, ActivityLayout } from '../types';

/**
 * Optimized time utilities with better performance and error handling
 */

// Cache for parsed times to avoid repeated parsing
const timeParseCache = new Map<string, number>();

export const parseTime = (timeString: string): number => {
  if (!timeString) return 0;
  
  if (timeParseCache.has(timeString)) {
    return timeParseCache.get(timeString)!;
  }
  
  const [hours, minutes] = timeString.split(':').map(Number);
  const result = (hours || 0) * 60 + (minutes || 0);
  timeParseCache.set(timeString, result);
  return result;
};

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const getCurrentTime = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

export const isCurrentTimeInRange = (startTime: string, endTime: string): boolean => {
  const currentMinutes = getCurrentTime();
  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);
  
  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
};

// Optimized overlap detection
const activitiesOverlap = (
  start1: number, end1: number,
  start2: number, end2: number
): boolean => {
  return !(end1 <= start2 || start1 >= end2);
};

// Optimized activity layout calculation with better conflict resolution
export const calculateActivityLayouts = (activities: Activity[]): ActivityLayout[] => {
  if (!activities || activities.length === 0) return [];

  // Sort activities by start time once
  const sortedActivities = [...activities].sort((a, b) => {
    const timeA = parseTime(a.startTime || '00:00');
    const timeB = parseTime(b.startTime || '00:00');
    return timeA - timeB;
  });

  const layouts: ActivityLayout[] = [];
  const timeSlots: { start: number; end: number; columns: Activity[] }[] = [];

  sortedActivities.forEach((activity) => {
    const startTime = parseTime(activity.startTime || '00:00');
    let endTime = activity.endTime ? parseTime(activity.endTime) : startTime + 60;
    
    // Ensure valid duration
    if (isNaN(endTime) || endTime <= startTime) {
      endTime = startTime + 60;
    }
    
    const duration = endTime - startTime;
    const top = (startTime / 60) * 90; // 90px per hour
    const height = Math.max((duration / 60) * 90, 30); // minimum height 30px

    // Find or create time slot
    let timeSlot = timeSlots.find(slot => 
      activitiesOverlap(startTime, endTime, slot.start, slot.end)
    );

    if (!timeSlot) {
      timeSlot = { start: startTime, end: endTime, columns: [] };
      timeSlots.push(timeSlot);
    } else {
      // Extend time slot boundaries if needed
      timeSlot.start = Math.min(timeSlot.start, startTime);
      timeSlot.end = Math.max(timeSlot.end, endTime);
    }

    // Find available column in this time slot
    let columnIndex = 0;
    while (timeSlot.columns[columnIndex]) {
      const existingActivity = timeSlot.columns[columnIndex];
      const existingStart = parseTime(existingActivity.startTime || '00:00');
      const existingEnd = existingActivity.endTime ? parseTime(existingActivity.endTime) : existingStart + 60;
      
      if (!activitiesOverlap(startTime, endTime, existingStart, existingEnd)) {
        break;
      }
      columnIndex++;
    }

    timeSlot.columns[columnIndex] = activity;

    // Calculate layout properties
    const totalColumns = Math.max(1, timeSlot.columns.filter(Boolean).length);
    const widthPercent = 100 / totalColumns;
    const leftPercent = columnIndex * widthPercent;

    layouts.push({
      activity,
      top,
      height,
      left: leftPercent,
      width: widthPercent,
      column: columnIndex,
      totalColumns
    });
  });

  return layouts;
};

// Generate time markers with caching
let cachedTimeMarkers: Array<{ hour: number; time: string; position: number }> | null = null;

export const generateTimeMarkers = () => {
  if (cachedTimeMarkers) {
    return cachedTimeMarkers;
  }
  
  cachedTimeMarkers = Array.from({ length: 25 }, (_, i) => ({
    hour: i,
    time: `${i.toString().padStart(2, '0')}:00`,
    position: i * 90 // 90px per hour
  }));
  
  return cachedTimeMarkers;
};