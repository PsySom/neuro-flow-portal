
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { ProcrastinationDiaryData, ProcrastinationTask } from './types';
import { missingResources } from './constants';

interface Step3ImpactProps {
  form: UseFormReturn<ProcrastinationDiaryData>;
}

const Step3Impact: React.FC<Step3ImpactProps> = ({ form }) => {
  const tasks = form.watch('tasks') || [];

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
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Оценка влияния и ресурсов</h3>
        <p className="text-gray-600">Сначала добавьте задачи на предыдущем шаге.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Оценка влияния и ресурсов</h3>
      
      {tasks.map((task, index) => (
        <div key={task.id} className="border rounded-lg p-4 space-y-4 bg-white dark:bg-gray-800">
          <h4 className="font-medium">Задача {index + 1}: {task.description ? task.description.slice(0, 50) + (task.description.length > 50 ? '...' : '') : 'Не указана'}</h4>

          <div>
            <Label>Насколько сильно откладывание этого дела повлияло на твое общее состояние сегодня?</Label>
            <div className="mt-2">
              <input
                type="range"
                min="-5"
                max="0"
                value={task.impactLevel || 0}
                onChange={(e) => updateTask(task.id, 'impactLevel', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span>-5 (очень сильно ухудшило)</span>
                <span>0 (не повлияло)</span>
              </div>
              <p className="text-center mt-2 font-medium">
                Выбрано: {task.impactLevel || 0}
              </p>
            </div>
          </div>

          <div>
            <Label>Чего тебе не хватало для того, чтобы приступить к этому делу? (можно выбрать несколько)</Label>
            <div className="space-y-2 mt-2">
              {missingResources.map((resource) => (
                <label key={resource.value} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={(task.missingResources || []).includes(resource.value)}
                    onCheckedChange={(checked) => 
                      updateTaskArray(task.id, 'missingResources', resource.value, !!checked)
                    }
                  />
                  <span>{resource.label}</span>
                </label>
              ))}
            </div>
            {(task.missingResources || []).includes('other') && (
              <Input
                placeholder="Укажите, чего ещё не хватало..."
                value={task.missingResourceOther || ''}
                onChange={(e) => updateTask(task.id, 'missingResourceOther', e.target.value)}
                className="mt-2"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Step3Impact;
