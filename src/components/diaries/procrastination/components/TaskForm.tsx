
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ProcrastinationTask } from '../types';
import { spheres, procrastinationReasons, procrastinationEmotions } from '../constants';

interface TaskFormProps {
  task: ProcrastinationTask;
  onUpdateTask: (field: keyof ProcrastinationTask, value: any) => void;
  onUpdateTaskArray: (field: keyof ProcrastinationTask, value: string, checked: boolean) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onUpdateTask, onUpdateTaskArray }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Что это было за дело?</Label>
        <Textarea
          value={task.description}
          onChange={(e) => onUpdateTask('description', e.target.value)}
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
                onChange={() => onUpdateTask('sphere', sphere.value)}
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
            onChange={(e) => onUpdateTask('sphereOther', e.target.value)}
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
                  onUpdateTaskArray('reasons', reason.value, !!checked)
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
            onChange={(e) => onUpdateTask('reasonOther', e.target.value)}
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
                  onUpdateTaskArray('emotions', emotion.value, !!checked)
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
            onChange={(e) => onUpdateTask('emotionOther', e.target.value)}
            className="mt-2"
          />
        )}
      </div>

      <div>
        <Label>Какие мысли приходили тебе в голову, когда ты думал(а) о выполнении этого дела?</Label>
        <Textarea
          value={task.thoughts}
          onChange={(e) => onUpdateTask('thoughts', e.target.value)}
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
              onChange={() => onUpdateTask('hasCategoricalThoughts', true)}
              className="w-4 h-4"
            />
            <span>Да</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={task.hasCategoricalThoughts === false}
              onChange={() => onUpdateTask('hasCategoricalThoughts', false)}
              className="w-4 h-4"
            />
            <span>Нет</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
