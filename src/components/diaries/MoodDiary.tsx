
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import { getRecommendations, emotionsData } from './moodDiaryUtils';
import { MoodDiaryData } from './mood/types';
import MoodStep from './mood/MoodStep';
import EmotionsStep from './mood/EmotionsStep';
import ClarifyingQuestionsStep from './mood/ClarifyingQuestionsStep';
import SelfEvaluationStep from './mood/SelfEvaluationStep';
import RecommendationsStep from './mood/RecommendationsStep';

interface MoodDiaryProps {
  onComplete?: () => void;
}

const MoodDiary: React.FC<MoodDiaryProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [moodValue, setMoodValue] = useState([0]);
  const [selectedEmotions, setSelectedEmotions] = useState<Array<{name: string; intensity: number}>>([]);
  const [showNegativeQuestions, setShowNegativeQuestions] = useState(false);
  const [showPositiveQuestions, setShowPositiveQuestions] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const form = useForm<MoodDiaryData>({
    defaultValues: {
      mood: 0,
      moodComment: '',
      selectedEmotions: [],
      emotionComment: '',
      relatedThoughts: '',
      hasCognitiveBias: false,
      selfEvaluation: 0,
      gratitude: '',
      emotionConnection: '',
      emotionImpact: ''
    }
  });

  const currentMood = moodValue[0];

  useEffect(() => {
    // Проверяем нужны ли уточняющие вопросы
    const hasHighNegativeEmotions = selectedEmotions.some(emotion => {
      const emotionData = emotionsData.negative.find(e => e.name === emotion.name);
      return emotionData && emotion.intensity >= 7;
    });

    const hasHighPositiveEmotions = selectedEmotions.some(emotion => {
      const emotionData = emotionsData.positive.find(e => e.name === emotion.name);
      return emotionData && emotion.intensity >= 8;
    });

    setShowNegativeQuestions(hasHighNegativeEmotions);
    setShowPositiveQuestions(hasHighPositiveEmotions);
  }, [selectedEmotions]);

  const handleMoodChange = (value: number[]) => {
    setMoodValue(value);
    form.setValue('mood', value[0]);
  };

  const handleEmotionSelect = (emotions: Array<{name: string; intensity: number}>) => {
    setSelectedEmotions(emotions);
    form.setValue('selectedEmotions', emotions);
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: MoodDiaryData) => {
    // Генерируем рекомендации на основе данных
    const generatedRecommendations = getRecommendations(data);
    setRecommendations(generatedRecommendations);
    
    console.log('Diary entry saved:', data);
    // Здесь будет сохранение в базу данных
    
    // Вызываем callback о завершении
    setTimeout(() => {
      onComplete?.();
    }, 2000); // Даем время показать рекомендации
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
            showNegativeQuestions={showNegativeQuestions}
            showPositiveQuestions={showPositiveQuestions}
          />
        );
      case 4:
        return <SelfEvaluationStep form={form} />;
      case 5:
        return (
          <RecommendationsStep
            form={form}
            recommendations={recommendations}
            onSubmit={onSubmit}
          />
        );
      default:
        return null;
    }
  };

  const steps = [
    { number: 1, title: 'Настроение' },
    { number: 2, title: 'Эмоции' },
    { number: 3, title: 'Уточнения' },
    { number: 4, title: 'Самооценка' },
    { number: 5, title: 'Рекомендации' },
  ];

  return (
    <div className="w-full">
      <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
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
                
                {currentStep < steps.length && (
                  <Button
                    type="button"
                    onClick={handleNext}
                  >
                    Далее
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodDiary;
