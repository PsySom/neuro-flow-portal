
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ProcrastinationDiaryData, ProcrastinationTask } from './types';
import { helpStrategies } from './constants';

interface Step4SolutionsProps {
  form: UseFormReturn<ProcrastinationDiaryData>;
  onSubmit: (data: ProcrastinationDiaryData) => void;
}

const Step4Solutions: React.FC<Step4SolutionsProps> = ({ form, onSubmit }) => {
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

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Самоподдержка и выводы</h3>
      
      {tasks.map((task, index) => (
        <div key={task.id} className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium">Задача {index + 1}: {task.description.slice(0, 50)}...</h4>

          <div>
            <Label>Что могло бы тебе помочь в следующий раз легче приступить к таким делам? (можно выбрать несколько)</Label>
            <div className="space-y-2 mt-2">
              {helpStrategies.map((strategy) => (
                <label key={strategy.value} className="flex items-center space-x-2">
                  <Checkbox
                    checked={task.helpStrategies.includes(strategy.value)}
                    onCheckedChange={(checked) => 
                      updateTaskArray(task.id, 'helpStrategies', strategy.value, !!checked)
                    }
                  />
                  <span>{strategy.label}</span>
                </label>
              ))}
            </div>
            {task.helpStrategies.includes('other') && (
              <Input
                placeholder="Опишите другую стратегию..."
                value={task.helpStrategyOther || ''}
                onChange={(e) => updateTask(task.id, 'helpStrategyOther', e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          <div>
            <Label>Есть ли сейчас что-то небольшое, что ты всё-таки можешь сделать для решения этой задачи?</Label>
            <div className="space-y-2 mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={task.willDoSmallStep === true}
                  onChange={() => updateTask(task.id, 'willDoSmallStep', true)}
                  className="w-4 h-4"
                />
                <span>Да</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={task.willDoSmallStep === false}
                  onChange={() => updateTask(task.id, 'willDoSmallStep', false)}
                  className="w-4 h-4"
                />
                <span>Нет</span>
              </label>
            </div>
            {task.willDoSmallStep && (
              <Textarea
                placeholder="Опишите небольшой шаг, который вы готовы сделать..."
                value={task.smallStep || ''}
                onChange={(e) => updateTask(task.id, 'smallStep', e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          {task.hasCategoricalThoughts && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">
                💡 Рекомендация: Поскольку у вас были категоричные мысли, рекомендуем также заполнить дневник работы с мыслями для более глубокой проработки.
              </p>
            </div>
          )}
        </div>
      ))}

      <div className="p-4 bg-green-50 rounded-lg">
        <p className="text-green-800 font-medium">
          🌟 Вы проделали важную работу по анализу своих паттернов прокрастинации. Это первый шаг к изменениям. Помните: каждый маленький шаг имеет значение!
        </p>
      </div>

      <Button 
        onClick={() => form.handleSubmit(onSubmit)()} 
        className="w-full"
        size="lg"
      >
        <Save className="w-4 h-4 mr-2" />
        Сохранить запись в дневник
      </Button>
    </div>
  );
};

export default Step4Solutions;
