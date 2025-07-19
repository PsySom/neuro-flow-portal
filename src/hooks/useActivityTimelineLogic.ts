import { useCallback, useEffect, useState } from 'react';
import { getCurrentDateString, hasDateChanged } from '@/utils/dateUtils';
import { useToast } from './use-toast';

/**
 * Hook for managing activity timeline logic and date changes
 */
export const useActivityTimelineLogic = () => {
  const [lastKnownDate, setLastKnownDate] = useState(getCurrentDateString());
  const { toast } = useToast();

  // Check for date changes every minute
  useEffect(() => {
    const checkDateChange = () => {
      if (hasDateChanged(lastKnownDate)) {
        const newDate = getCurrentDateString();
        console.log('Date changed detected:', lastKnownDate, '->', newDate);
        
        setLastKnownDate(newDate);
        
        // Notify user about the date change
        toast({
          title: "Новый день!",
          description: "Лента активностей обновлена для новой даты",
        });
      }
    };

    // Check immediately and then every minute
    checkDateChange();
    const interval = setInterval(checkDateChange, 60000);

    return () => clearInterval(interval);
  }, [lastKnownDate, toast]);

  // Validate that activity operations only happen on current date
  const validateCurrentDateOperation = useCallback((activityDate: string | undefined, operation: string): boolean => {
    if (!activityDate) {
      console.warn(`${operation} attempted on activity with no date`);
      toast({
        title: "Ошибка",
        description: "Активность не имеет даты",
        variant: "destructive",
      });
      return false;
    }

    const currentDate = getCurrentDateString();
    const normalizedActivityDate = activityDate.split('T')[0];
    
    if (normalizedActivityDate !== currentDate) {
      console.warn(`${operation} attempted on activity from different date:`, normalizedActivityDate, 'vs', currentDate);
      toast({
        title: "Предупреждение",
        description: `${operation} доступно только для активностей текущего дня`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [toast]);

  // Enhanced activity toggle with date validation
  const validateAndToggleActivity = useCallback((activity: any, originalToggle: () => void) => {
    if (validateCurrentDateOperation(activity.date, 'Изменение статуса')) {
      console.log('Validating activity toggle for current date:', activity.id, activity.date);
      originalToggle();
    }
  }, [validateCurrentDateOperation]);

  // Enhanced activity update with date validation
  const validateAndUpdateActivity = useCallback((activity: any, originalUpdate: (updates: any) => void, updates: any) => {
    if (validateCurrentDateOperation(activity.date, 'Обновление активности')) {
      console.log('Validating activity update for current date:', activity.id, activity.date);
      originalUpdate(updates);
    }
  }, [validateCurrentDateOperation]);

  // Enhanced activity delete with date validation
  const validateAndDeleteActivity = useCallback((activity: any, originalDelete: () => void) => {
    if (validateCurrentDateOperation(activity.date, 'Удаление активности')) {
      console.log('Validating activity delete for current date:', activity.id, activity.date);
      originalDelete();
    }
  }, [validateCurrentDateOperation]);

  return {
    currentDate: lastKnownDate,
    validateCurrentDateOperation,
    validateAndToggleActivity,
    validateAndUpdateActivity,
    validateAndDeleteActivity
  };
};