
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { backendDiaryService, MoodEntry } from '@/services/backend-diary.service';
import { emotionsData } from './moodDiaryUtils';
import { MoodDiaryData } from './mood/types';
import MoodStep from './mood/MoodStep';
import EmotionsStep from './mood/EmotionsStep';
import ClarifyingQuestionsStep from './mood/ClarifyingQuestionsStep';
import SelfEvaluationStep from './mood/SelfEvaluationStep';

interface MoodDiaryProps {
  onComplete?: () => void;
}

const MoodDiary: React.FC<MoodDiaryProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [moodValue, setMoodValue] = useState([0]);
  const [selectedEmotions, setSelectedEmotions] = useState<Array<{name: string; intensity: number}>>([]);

  const form = useForm<MoodDiaryData>({
    defaultValues: {
      mood: 0,
      moodComment: '',
      selectedEmotions: [],
      emotionComment: '',
      emotionConnection: '',
      bodyStateInfluence: '',
      bodyStateCustom: ''
    }
  });

  const currentMood = moodValue[0];

  const handleMoodChange = (value: number[]) => {
    setMoodValue(value);
    form.setValue('mood', value[0]);
  };

  const handleEmotionSelect = (emotions: Array<{name: string; intensity: number}>) => {
    setSelectedEmotions(emotions);
    form.setValue('selectedEmotions', emotions);
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      // На последнем шаге сохраняем данные
      await form.handleSubmit(onSubmit)();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: MoodDiaryData) => {
    try {
      const moodEntry: MoodEntry = {
        mood_score: data.mood,
        emotions: data.selectedEmotions.map(emotion => {
          let category: 'positive' | 'neutral' | 'negative' = 'neutral';
          if (emotionsData.positive.find(e => e.name === emotion.name)) {
            category = 'positive';
          } else if (emotionsData.negative.find(e => e.name === emotion.name)) {
            category = 'negative';
          }
          
          return {
            name: emotion.name,
            intensity: emotion.intensity,
            category
          };
        }),
        timestamp: new Date().toISOString(),
        context: data.emotionConnection || '',
        notes: [data.moodComment, data.emotionComment].filter(Boolean).join('. '),
        triggers: []
      };

      await backendDiaryService.createMoodEntry(moodEntry);
      
      const today = new Date().toISOString().split('T')[0];
      const diaryStatus = JSON.parse(localStorage.getItem('diary-status-/mood-diary') || '{}');
      const updatedStatus = { ...diaryStatus, lastEntryDate: today };
      localStorage.setItem('diary-status-/mood-diary', JSON.stringify(updatedStatus));
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'mock_mood_entries',
        newValue: localStorage.getItem('mock_mood_entries'),
        storageArea: localStorage
      }));
      
      window.dispatchEvent(new CustomEvent('mood-data-updated'));
      
      toast.success('Запись дневника настроения сохранена');
      
      onComplete?.();
    } catch (error) {
      console.error('Ошибка при сохранении записи дневника:', error);
      toast.error('Ошибка при сохранении записи дневника');
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <MoodStep 
            form={form}
            moodValue={moodValue}
            onMoodChange={handleMoodChange}
          />
        );
      case 2:
        return (
          <EmotionsStep
            form={form}
            currentMood={currentMood}
            selectedEmotions={selectedEmotions}
            onEmotionsChange={handleEmotionSelect}
          />
        );
      case 3:
        return (
        <ClarifyingQuestionsStep
          form={form}
          selectedEmotions={selectedEmotions}
        />
        );
      case 4:
        return <SelfEvaluationStep form={form} />;
      default:
        return null;
    }
  };

  const steps = [
    { number: 1, title: 'Настроение' },
    { number: 2, title: 'Эмоции' },
    { number: 3, title: 'Уточнения' },
    { number: 4, title: 'Самооценка' },
  ];

  return (
    <div className="w-full">
      <Card className="bg-card/50 backdrop-blur-sm border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-pink-500" />
            <span>Дневник настроения и эмоций</span>
          </CardTitle>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Шаг {currentStep} из {steps.length}: {steps[currentStep - 1].title}
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              {renderCurrentStep()}
              
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
                
                <Button
                  type="button"
                  onClick={handleNext}
                >
                  {currentStep === steps.length ? 'Сохранить' : 'Далее'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodDiary;
