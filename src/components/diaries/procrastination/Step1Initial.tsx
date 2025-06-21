
import React from 'react';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { ProcrastinationDiaryData } from './types';

interface Step1InitialProps {
  form: UseFormReturn<ProcrastinationDiaryData>;
}

const Step1Initial: React.FC<Step1InitialProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Фиксация факта</h3>
      <div className="space-y-4">
        <Label className="text-base">
          Были ли сегодня дела, которые ты откладывал(а) или избегал(а)?
        </Label>
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="true"
              checked={form.watch('hadProcrastination') === true}
              onChange={() => form.setValue('hadProcrastination', true)}
              className="w-4 h-4"
            />
            <span>Да</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="false"
              checked={form.watch('hadProcrastination') === false}
              onChange={() => form.setValue('hadProcrastination', false)}
              className="w-4 h-4"
            />
            <span>Нет</span>
          </label>
        </div>
        {form.watch('hadProcrastination') === false && (
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-green-800">
              Отлично! Сегодня ты справился(лась) со всеми задачами. Можешь вернуться к дневнику в любое время.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step1Initial;
