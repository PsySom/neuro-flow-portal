/**
 * Date utilities for activity management
 */

/**
 * Get greeting based on current time
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 6) return 'Доброй ночи';
  if (hour < 12) return 'Доброе утро';
  if (hour < 17) return 'Добрый день';
  if (hour < 22) return 'Добрый вечер';
  return 'Доброй ночи';
};

/**
 * Get user display name with fallback
 */
export const getUserDisplayName = (user?: any): string => {
  if (!user) return 'Пользователь';
  
  return user.display_name || 
         user.name || 
         user.full_name || 
         (user.email ? user.email.split('@')[0] : 'Пользователь');
};

/**
 * Get current date string in YYYY-MM-DD format
 */
export const getCurrentDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Check if an activity belongs to a specific date
 * FIXED: Activities should stay on their assigned date and not move between days
 */
export const isActivityForDate = (activity: any, dateString: string): boolean => {
  if (!activity.date) return false;
  
  // Extract date part from activity date, handling both ISO strings and date-only strings
  let activityDatePart: string;
  
  if (activity.date.includes('T')) {
    // ISO string format (YYYY-MM-DDTHH:mm:ss.sssZ)
    activityDatePart = activity.date.split('T')[0];
  } else {
    // Date-only format (YYYY-MM-DD)
    activityDatePart = activity.date;
  }
  
  // STRICT date matching - activities must exactly match their assigned date
  const isMatch = activityDatePart === dateString;
  
  return isMatch;
};

/**
 * Check if an activity should be transferred to a new date
 * Returns true only for recurring activities or manually transferred activities
 */
export const shouldTransferActivity = (activity: any): boolean => {
  // Only transfer recurring activities or activities marked for transfer
  return !!(activity.recurring || activity.metadata?.transferToNewDate);
};

/**
 * Filter activities for today only
 */
export const filterTodayActivities = (activities: any[]): any[] => {
  const today = getCurrentDateString();
  return activities.filter(activity => isActivityForDate(activity, today));
};

/**
 * Check if we've crossed into a new day
 */
export const hasDateChanged = (lastCheckDate: string): boolean => {
  const currentDate = getCurrentDateString();
  return currentDate !== lastCheckDate;
};

/**
 * Format date for display
 */
export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get date range for a week starting from given date
 */
export const getWeekDateRange = (startDate: string): { start: string; end: string } => {
  const date = new Date(startDate);
  const dayOfWeek = date.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Monday as start of week
  
  const monday = new Date(date);
  monday.setDate(date.getDate() + mondayOffset);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0]
  };
};