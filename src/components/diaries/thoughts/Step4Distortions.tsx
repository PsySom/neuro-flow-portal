
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { ThoughtsDiaryData } from './types';
import { cognitiveDistortions } from './constants';

interface Step4DistortionsProps {
  form: UseFormReturn<ThoughtsDiaryData>;
}

const Step4Distortions: React.FC<Step4DistortionsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Определение когнитивных искажений</h3>
      <div className="space-y-4">
        <Label>Найдите в этой мысли/убеждении что-то из когнитивных искажений:</Label>
        <div className="space-y-2">
          {cognitiveDistortions.map((distortion) => (
            <label key={distortion.value} className="flex items-center space-x-2">
              <Checkbox
                checked={form.watch('cognitiveDistortions').includes(distortion.value)}
                onCheckedChange={(checked) => {
                  const current = form.watch('cognitiveDistortions');
                  if (checked) {
                    form.setValue('cognitiveDistortions', [...current, distortion.value]);
                  } else {
                    form.setValue('cognitiveDistortions', current.filter(d => d !== distortion.value));
                  }
                }}
              />
              <span>{distortion.label}</span>
            </label>
          ))}
        </div>
        {form.watch('cognitiveDistortions').includes('other') && (
          <Input
            placeholder="Опишите другое искажение..."
            {...form.register('distortionOther')}
          />
        )}
        
        <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900">АБС-анализ</h4>
          <div className="space-y-3">
            <div>
              <Label>A — Активирующее событие (что произошло?):</Label>
              <Input
                placeholder="Опишите событие..."
                {...form.register('abcAnalysis.activatingEvent')}
              />
            </div>
            <div>
              <Label>B — Вера/убеждение (во что я поверил(а)?):</Label>
              <Input
                placeholder="Ваша мысль/убеждение..."
                {...form.register('abcAnalysis.belief')}
              />
            </div>
            <div>
              <Label>C — Последствие (что я почувствовал(а)? что сделал(а)?):</Label>
              <Input
                placeholder="Эмоции и поведение..."
                {...form.register('abcAnalysis.consequence')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4Distortions;
