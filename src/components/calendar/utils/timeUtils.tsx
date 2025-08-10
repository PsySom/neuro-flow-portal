// Re-export optimized utilities for backward compatibility
export * from './optimizedTimeUtils';

// Legacy export for getTimeInMinutes (maps to parseTime)
import { parseTime } from './optimizedTimeUtils';
export const getTimeInMinutes = parseTime;
