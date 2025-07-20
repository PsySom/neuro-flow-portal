import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOnboardingOptions } from '@/hooks/useOnboardingOptions';
import { onboardingService } from '@/services/onboarding.service';
import { useToast } from '@/hooks/use-toast';

const OnboardingTest: React.FC = () => {
  const [isStarting, setIsStarting] = useState(false);
  const [isTestingStage, setIsTestingStage] = useState(false);
  const { options, isLoading: optionsLoading, error } = useOnboardingOptions();
  const { toast } = useToast();

  const handleStartOnboarding = async () => {
    setIsStarting(true);
    try {
      console.log('🚀 Testing onboarding start...');
      await onboardingService.startOnboarding();
      toast({
        title: "Успех!",
        description: "Онбординг успешно инициализирован",
      });
    } catch (error: any) {
      console.error('❌ Error starting onboarding:', error);
      toast({
        title: "Ошибка",
        description: error.response?.data?.detail || error.message,
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  const handleTestStage = async () => {
    setIsTestingStage(true);
    try {
      console.log('🧪 Testing stage submission...');
      
      // Тестируем сохранение этапа introduction
      const testData = {
        name: "Тестовый пользователь",
        age: 25,
        gender: "male" as const,
        timezone: "Europe/Moscow"
      };
      
      await onboardingService.saveIntroduction(testData);
      toast({
        title: "Успех!",
        description: "Тестовые данные этапа сохранены",
      });
    } catch (error: any) {
      console.error('❌ Error testing stage:', error);
      toast({
        title: "Ошибка",
        description: error.response?.data?.detail || error.message,
        variant: "destructive",
      });
    } finally {
      setIsTestingStage(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Тест интеграции онбординга</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Инициализация онбординга</h3>
            <Button 
              onClick={handleStartOnboarding} 
              disabled={isStarting}
              className="w-full"
            >
              {isStarting ? "Инициализация..." : "Запустить онбординг"}
            </Button>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Тест сохранения этапа</h3>
            <Button 
              onClick={handleTestStage} 
              disabled={isTestingStage}
              className="w-full"
            >
              {isTestingStage ? "Тестирование..." : "Тест сохранения данных"}
            </Button>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Загрузка опций</h3>
            {optionsLoading && <p className="text-muted-foreground">Загрузка опций...</p>}
            {error && <p className="text-destructive">Ошибка: {error}</p>}
            {options && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  ✅ Опции загружены:
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Цели: {options.goals.length}</li>
                  <li>• Вызовы: {options.challenges.length}</li>
                  <li>• Состояния: {options.conditions.length}</li>
                  <li>• Триггеры тревоги: {options.anxiety_triggers.length}</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingTest;