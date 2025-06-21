
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ProcrastinationDiaryData, ProcrastinationTask } from './types';
import EmptyTasksState from './components/EmptyTasksState';
import TaskCard from './components/TaskCard';

interface Step2TaskDetailsProps {
  form: UseFormReturn<ProcrastinationDiaryData>;
}

const Step2TaskDetails: React.FC<Step2TaskDetailsProps> = ({ form }) => {
  const tasks = form.watch('tasks') || [];

  const addTask = () => {
    const newTask: ProcrastinationTask = {
      id: Date.now().toString(),
      description: '',
      sphere: '',
      sphereOther: '',
      reasons: [],
      reasonOther: '',
      emotions: [],
      emotionOther: '',
      thoughts: '',
      hasCategoricalThoughts: false,
      impactLevel: 0,
      missingResources: [],
      missingResourceOther: '',
      helpStrategies: [],
      helpStrategyOther: '',
      smallStep: '',
      willDoSmallStep: false
    };
    form.setValue('tasks', [...tasks, newTask]);
  };

  const removeTask = (taskId: string) => {
    form.setValue('tasks', tasks.filter(task => task.id !== taskId));
  };

  const updateTask = (taskId: string, field: keyof ProcrastinationTask, value: any) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, [field]: value } : task
    );
    form.setValue('tasks', updatedTasks);
  };

  const updateTaskArray = (taskId: string, field: keyof ProcrastinationTask, value: string, checked: boolean) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const currentArray = (task[field] as string[]) || [];
    const updatedArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    updateTask(taskId, field, updatedArray);
  };

  if (tasks.length === 0) {
    return <EmptyTasksState onAddTask={addTask} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Детализация и анализ</h3>
        <Button onClick={addTask} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Добавить задачу
        </Button>
      </div>
      
      {tasks.map((task, index) => (
        <TaskCard
          key={task.id}
          task={task}
          index={index}
          canRemove={tasks.length > 1}
          onRemoveTask={() => removeTask(task.id)}
          onUpdateTask={(field, value) => updateTask(task.id, field, value)}
          onUpdateTaskArray={(field, value, checked) => updateTaskArray(task.id, field, value, checked)}
        />
      ))}
    </div>
  );
};

export default Step2TaskDetails;
