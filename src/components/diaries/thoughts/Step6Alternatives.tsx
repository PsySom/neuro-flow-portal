
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { ThoughtsDiaryData } from './types';

interface Step6AlternativesProps {
  form: UseFormReturn<ThoughtsDiaryData>;
}

const Step6Alternatives: React.FC<Step6AlternativesProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Оспаривание и формирование альтернатив</h3>
      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 rounded-lg space-y-3">
          <h4 className="font-medium text-yellow-900">Анализ доказательств</h4>
          <div>
            <Label>Какие есть доказательства ЗА эту мысль?</Label>
            <Textarea
              placeholder="Что подтверждает эту мысль?"
              {...form.register('evidenceFor')}
            />
          </div>
          <div>
            <Label>Какие есть доказательства ПРОТИВ этой мысли?</Label>
            <Textarea
              placeholder="Что опровергает эту мысль? Было ли так всегда?"
              {...form.register('evidenceAgainst')}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <Label>Какой более поддерживающий, заботливый или реалистичный взгляд возможен?</Label>
            <Textarea
              placeholder="Альтернативная мысль..."
              {...form.register('alternativeThought')}
            />
          </div>
          <div>
            <Label>Как вы могли бы проявить сострадание к себе?</Label>
            <Textarea
              placeholder="Что бы вы сказали близкому другу в такой ситуации?"
              {...form.register('selfCompassion')}
            />
          </div>
          <div>
            <Label>Какую фразу могли бы повторять себе в следующий раз?</Label>
            <Input
              placeholder="Например: 'Я не обязан быть идеальным — я стараюсь, и этого достаточно'"
              {...form.register('supportivePhrase')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step6Alternatives;
