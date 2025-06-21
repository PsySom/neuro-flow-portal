
import React from 'react';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { ThoughtsDiaryData } from './types';

interface Step1AwarenessProps {
  form: UseFormReturn<ThoughtsDiaryData>;
}

const Step1Awareness: React.FC<Step1AwarenessProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Осознанность. «Поймать мысль»</h3>
      <div className="space-y-4">
        <Label className="text-base">
          Была ли сегодня мысль, установка или внутренний сценарий, который(-ая) повторялся(-ась), тревожил(-а), мешал(-а) чувствовать себя спокойно или уверенно?
        </Label>
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="true"
              checked={form.watch('hasDisturbingThought') === true}
              onChange={() => form.setValue('hasDisturbingThought', true)}
              className="w-4 h-4"
            />
            <span>Да</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="false"
              checked={form.watch('hasDisturbingThought') === false}
              onChange={() => form.setValue('hasDisturbingThought', false)}
              className="w-4 h-4"
            />
            <span>Нет</span>
          </label>
        </div>
        {form.watch('hasDisturbingThought') === false && (
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-green-800">
              Прекрасно! Вы можете вернуться к дневнику, когда появится желание или необходимость.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step1Awareness;
