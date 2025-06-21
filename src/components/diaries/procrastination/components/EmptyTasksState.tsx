
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyTasksStateProps {
  onAddTask: () => void;
}

const EmptyTasksState: React.FC<EmptyTasksStateProps> = ({ onAddTask }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Детализация и анализ</h3>
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Добавьте задачи, которые вы откладывали</p>
        <Button onClick={onAddTask}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить задачу
        </Button>
      </div>
    </div>
  );
};

export default EmptyTasksState;
