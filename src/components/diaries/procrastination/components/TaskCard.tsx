
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ProcrastinationTask } from '../types';
import TaskForm from './TaskForm';

interface TaskCardProps {
  task: ProcrastinationTask;
  index: number;
  canRemove: boolean;
  onRemoveTask: () => void;
  onUpdateTask: (field: keyof ProcrastinationTask, value: any) => void;
  onUpdateTaskArray: (field: keyof ProcrastinationTask, value: string, checked: boolean) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  canRemove,
  onRemoveTask,
  onUpdateTask,
  onUpdateTaskArray
}) => {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Задача {index + 1}</h4>
        {canRemove && (
          <Button 
            onClick={onRemoveTask} 
            variant="ghost" 
            size="sm"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <TaskForm
        task={task}
        onUpdateTask={onUpdateTask}
        onUpdateTaskArray={onUpdateTaskArray}
      />
    </div>
  );
};

export default TaskCard;
