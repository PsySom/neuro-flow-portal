
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Activity } from '@/contexts/ActivitiesContext';
import { DeleteRecurringOption } from '../utils/recurringUtils';

interface DeleteRecurringDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: Activity;
  onConfirm: (deleteOption: DeleteRecurringOption) => void;
}

const DeleteRecurringDialog: React.FC<DeleteRecurringDialogProps> = ({
  open,
  onOpenChange,
  activity,
  onConfirm
}) => {
  const handleDeleteSingle = () => {
    onConfirm('single');
    onOpenChange(false);
  };

  const handleDeleteAll = () => {
    onConfirm('all');
    onOpenChange(false);
  };

  const isRecurring = !!activity.recurring;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isRecurring ? 'Удалить повторяющуюся активность?' : 'Удалить активность?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isRecurring ? (
              <>
                Активность "{activity.name}" является частью повторяющейся серии.
                <br /><br />
                Что вы хотите удалить?
              </>
            ) : (
              `Вы уверены, что хотите удалить активность "${activity.name}"? Это действие нельзя отменить.`
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {isRecurring ? (
            <>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteSingle}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Только эту активность
              </AlertDialogAction>
              <AlertDialogAction 
                onClick={handleDeleteAll}
                className="bg-red-600 hover:bg-red-700"
              >
                Все повторы
              </AlertDialogAction>
            </>
          ) : (
            <>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteSingle}
                className="bg-red-600 hover:bg-red-700"
              >
                Удалить
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRecurringDialog;
