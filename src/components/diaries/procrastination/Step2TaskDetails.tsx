
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ProcrastinationDiaryData, ProcrastinationTask } from './types';
import { spheres, procrastinationReasons, procrastinationEmotions } from './constants';

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
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Детализация и анализ</h3>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Добавьте задачи, которые вы откладывали</p>
          <Button onClick={addTask}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить задачу
          </Button>
        </div>
      </div>
    );
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
        <div key={task.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Задача {index + 1}</h4>
            {tasks.length > 1 && (
              <Button 
                onClick={() => removeTask(task.id)} 
                variant="ghost" 
                size="sm"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div>
            <Label>Что это было за дело?</Label>
            <Textarea
              value={task.description}
              onChange={(e) => updateTask(task.id, 'description', e.target.value)}
              placeholder="Опишите задачу..."
            />
          </div>

          <div>
            <Label>Сфера:</Label>
            <div className="space-y-2 mt-2">
              {spheres.map((sphere) => (
                <label key={sphere.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value={sphere.value}
                    checked={task.sphere === sphere.value}
                    onChange={() => updateTask(task.id, 'sphere', sphere.value)}
                    className="w-4 h-4"
                  />
                  <span>{sphere.label}</span>
                </label>
              ))}
            </div>
            {task.sphere === 'other' && (
              <Input
                placeholder="Уточните сферу..."
                value={task.sphereOther || ''}
                onChange={(e) => updateTask(task.id, 'sphereOther', e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          <div>
            <Label>Почему тебе не хотелось делать это дело? (можно выбрать несколько)</Label>
            <div className="space-y-2 mt-2">
              {procrastinationReasons.map((reason) => (
                <label key={reason.value} className="flex items-center space-x-2">
                  <Checkbox
                    checked={task.reasons.includes(reason.value)}
                    onCheckedChange={(checked) => 
                      updateTaskArray(task.id, 'reasons', reason.value, !!checked)
                    }
                  />
                  <span>{reason.label}</span>
                </label>
              ))}
            </div>
            {task.reasons.includes('other') && (
              <Input
                placeholder="Опишите другую причину..."
                value={task.reasonOther || ''}
                onChange={(e) => updateTask(task.id, 'reasonOther', e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          <div>
            <Label>Какие эмоции или чувства сопровождали избегание? (можно выбрать несколько)</Label>
            <div className="space-y-2 mt-2">
              {procrastinationEmotions.map((emotion) => (
                <label key={emotion.value} className="flex items-center space-x-2">
                  <Checkbox
                    checked={task.emotions.includes(emotion.value)}
                    onCheckedChange={(checked) => 
                      updateTaskArray(task.id, 'emotions', emotion.value, !!checked)
                    }
                  />
                  <span>{emotion.label}</span>
                </label>
              ))}
            </div>
            {task.emotions.includes('other') && (
              <Input
                placeholder="Укажите другое чувство..."
                value={task.emotionOther || ''}
                onChange={(e) => updateTask(task.id, 'emotionOther', e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          <div>
            <Label>Какие мысли приходили тебе в голову, когда ты думал(а) о выполнении этого дела?</Label>
            <Textarea
              value={task.thoughts}
              onChange={(e) => updateTask(task.id, 'thoughts', e.target.value)}
              placeholder="Опишите ваши мысли..."
            />
          </div>

          <div>
            <Label>Были ли среди этих мыслей категоричные или самокритичные?</Label>
            <p className="text-sm text-gray-600 mb-2">
              (например: «я не справлюсь», «у меня всё плохо», «это невозможно»)
            </p>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={task.hasCategoricalThoughts === true}
                  onChange={() => updateTask(task.id, 'hasCategoricalThoughts', true)}
                  className="w-4 h-4"
                />
                <span>Да</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={task.hasCategoricalThoughts === false}
                  onChange={() => updateTask(task.id, 'hasCategoricalThoughts', false)}
                  className="w-4 h-4"
                />
                <span>Нет</span>
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Step2TaskDetails;
