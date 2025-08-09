import { useMemo } from 'react';

export const useWeekDates = (currentDate: Date) => {
  const weekDays = useMemo(() => {
    try {
      const startOfWeek = new Date(currentDate);
      const dayOfWeek = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startOfWeek.setDate(diff);

      const days = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        days.push(day);
      }
      return days;
    } catch (error) {
      console.error('Error creating week days:', error);
      // Fallback to current date
      const today = new Date();
      return [today];
    }
  }, [currentDate]);

  // Get date range for the week
  const { startDate, endDate } = useMemo(() => {
    try {
      const start = weekDays[0].toLocaleDateString('en-CA');
      const end = weekDays[6].toLocaleDateString('en-CA');
      return { startDate: start, endDate: end };
    } catch (error) {
      console.error('Error creating date range for week:', error);
      const today = new Date().toLocaleDateString('en-CA');
      return { startDate: today, endDate: today };
    }
  }, [weekDays]);

  return {
    weekDays,
    startDate,
    endDate
  };
};