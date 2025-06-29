
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { MoodStepProps, MoodDiaryData } from './types';

interface RecommendationsStepProps extends MoodStepProps {
  recommendations: string[];
  onSubmit: (data: MoodDiaryData) => void;
}

const RecommendationsStep = ({ form, recommendations, onSubmit }: RecommendationsStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Рекомендации для тебя</h3>
      
      {recommendations.length > 0 ? (
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-emerald-800">{recommendation}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Заполните дневник, чтобы получить персональные рекомендации</p>
        </div>
      )}

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

export default RecommendationsStep;
