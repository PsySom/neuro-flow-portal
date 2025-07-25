/**
 * Utility functions for consistent time formatting across the application
 */

// Format time from ISO string to HH:mm format
export const formatTimeFromISO = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', isoString);
      return '00:00';
    }
    
    // Use local time to match user's timezone
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting time:', error, isoString);
    return '00:00';
  }
};

// Format time range for display
export const formatTimeRange = (startTime: string, endTime?: string): string => {
  const start = formatTimeFromISO(startTime);
  
  if (!endTime) {
    return start;
  }
  
  const end = formatTimeFromISO(endTime);
  return `${start} - ${end}`;
};

// Calculate and format duration
export const formatDuration = (startTime: string, endTime?: string): string => {
  if (!endTime) {
    return '1ч'; // Default duration
  }
  
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return '1ч';
    }
    
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}ч ${minutes}м` : `${hours}ч`;
    } else {
      return `${minutes}м`;
    }
  } catch (error) {
    console.error('Error calculating duration:', error);
    return '1ч';
  }
};

// Create ISO timestamp from date and time
export const createISOFromDateTime = (date: string, time: string): string => {
  try {
    // Parse time
    const [hours, minutes] = time.split(':').map(Number);
    
    // Create date object from date string  
    const dateObj = new Date(date);
    
    // Set the time in UTC to avoid timezone issues
    dateObj.setUTCHours(hours, minutes, 0, 0);
    
    // Return ISO string  
    return dateObj.toISOString();
  } catch (error) {
    console.error('Error creating ISO timestamp:', error);
    return new Date().toISOString();
  }
};

/**
 * Format time from UTC ISO string to local HH:MM string
 * Properly handles timezone conversion
 */
export const formatTimeFromUTC = (utcString: string): string => {
  try {
    const date = new Date(utcString);
    
    // Get UTC hours and minutes to avoid timezone conversion
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting UTC time:', error);
    return '09:00';
  }
};

// Extract date in YYYY-MM-DD format from ISO string
export const extractDateFromISO = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date for extraction:', isoString);
      return new Date().toISOString().split('T')[0];
    }
    
    // Use UTC date to avoid timezone shifts
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error extracting date:', error);
    return new Date().toISOString().split('T')[0];
  }
};