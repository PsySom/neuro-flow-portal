
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { ThoughtsDiaryData } from './types';
import { categories } from './constants';

interface Step3CategorizationProps {
  form: UseFormReturn<ThoughtsDiaryData>;
}

const Step3Categorization: React.FC<Step3CategorizationProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Категоризация</h3>
      <div className="space-y-4">
        <Label>Эта мысль/убеждение про... (можно выбрать несколько):</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.value} className="flex items-center space-x-2">
              <Checkbox
                checked={form.watch('categories').includes(category.value)}
                onCheckedChange={(checked) => {
                  const current = form.watch('categories');
                  if (checked) {
                    form.setValue('categories', [...current, category.value]);
                  } else {
                    form.setValue('categories', current.filter(c => c !== category.value));
                  }
                }}
              />
              <span>{category.label}</span>
            </label>
          ))}
        </div>
        {form.watch('categories').includes('other') && (
          <Input
            placeholder="Уточните..."
            {...form.register('categoryOther')}
          />
        )}
      </div>
    </div>
  );
};

export default Step3Categorization;
