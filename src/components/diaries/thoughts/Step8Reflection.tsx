
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ThoughtsDiaryData } from './types';

interface Step8ReflectionProps {
  form: UseFormReturn<ThoughtsDiaryData>;
  onSubmit: (data: ThoughtsDiaryData) => void;
}

const Step8Reflection: React.FC<Step8ReflectionProps> = ({ form, onSubmit }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Краткая рефлексия</h3>
      <div className="space-y-4">
        <div>
          <Label>Что вы сейчас чувствуете, когда просмотрели все эти шаги?</Label>
          <Textarea
            placeholder="Опишите ваши ощущения после работы с мыслями..."
            {...form.register('currentFeeling')}
          />
        </div>

        <div>
          <Label>Есть ли желание позаботиться о себе прямо сейчас? Что это может быть?</Label>
          <Input
            placeholder="Например: попить чай, послушать музыку, позвонить другу..."
            {...form.register('selfCareAction')}
          />
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-green-800 font-medium">
            🌟 Вы сделали для себя нечто важное. Это не всегда легко, но с каждым разом становится проще. Спасибо, что заботитесь о себе!
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
    </div>
  );
};

export default Step8Reflection;
