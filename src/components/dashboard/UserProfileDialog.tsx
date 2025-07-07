import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, User, Clock, Heart, Brain, Target, Moon, Zap, AlertCircle, Shield, Workflow, Users, Settings, Palette } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { onboardingService } from '@/services/onboarding.service';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface UserProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProfileData();
    }
  }, [isOpen]);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      console.log('Загрузка данных профиля...');
      const response = await onboardingService.getProfile();
      console.log('Ответ от сервиса профиля:', response);
      setProfileData(response.data);
    } catch (error) {
      console.error('Ошибка загрузки данных профиля:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Не указано';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
    } catch {
      return 'Не указано';
    }
  };

  const mockProfileData = {
    basicInfo: {
      name: user?.full_name || 'Пользователь',
      age: 28,
      gender: 'Мужской',
      timezone: 'Europe/Moscow'
    },
    naturalRhythms: {
      activityPreference: 'Утренний человек',
      wakeTime: '07:00',
      sleepTime: '23:00',
      sleepQuality: 'Хорошее'
    },
    currentState: {
      moodScore: 7,
      energyLevel: 'Средний',
      fatigueFrequency: 'Иногда',
      stressImpact: 'Умеренный',
      copingStrategies: ['Дыхательные техники', 'Физическая активность', 'Медитация']
    },
    challenges: [
      'Тревога и беспокойство',
      'Проблемы со сном',
      'Прокрастинация'
    ],
    medicalInfo: {
      diagnosedConditions: ['Тревожное расстройство'],
      workingWithTherapist: 'Да, регулярно',
      takingMedication: false
    },
    procrastination: {
      frequency: 'Часто',
      barriers: ['Страх сделать неидеально', 'Задача кажется слишком большой'],
      taskApproach: 'Постепенно'
    },
    anxiety: {
      frequency: 'Несколько раз в неделю',
      triggers: ['При принятии решений', 'В социальных ситуациях'],
      manifestations: ['Навязчивые мысли', 'Учащенное сердцебиение'],
      copingMethods: ['Дыхательные техники', 'Медитация']
    },
    socialSupport: {
      relationshipQuality: 'Хорошее',
      lonelinessFrequency: 'Редко',
      supportSources: ['Семья', 'Близкие друзья'],
      barriers: ['Стыжусь своих проблем', 'Не умею просить о помощи'],
      lonelinessSituations: ['Вечером или перед сном']
    },
    goals: [
      'Научиться справляться с тревогой и стрессом',
      'Нормализовать сон',
      'Повысить продуктивность и фокус'
    ],
    preferences: {
      dailyPracticeTime: '15-30 минут',
      reminderFrequency: 'Каждый день',
      recommendationTime: 'Утром',
      developmentApproach: 'Постепенный',
      dayStructure: 'Средняя структурированность'
    },
    personalization: {
      supportStyle: 'Мягкий и поддерживающий',
      feedbackStyle: 'Конструктивный'
    }
  };

  const displayData = profileData || mockProfileData;
  
  console.log('Отображаемые данные:', displayData);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Профиль пользователя</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Основная информация */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <User className="w-4 h-4" />
                <span>Основная информация</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Имя:</span>
                  <span className="text-sm font-medium">{displayData.basicInfo?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="text-sm font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Возраст:</span>
                  <span className="text-sm font-medium">{displayData.basicInfo?.age || 'Не указано'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Пол:</span>
                  <span className="text-sm font-medium">{displayData.basicInfo?.gender || 'Не указано'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Часовой пояс:</span>
                  <span className="text-sm font-medium">{displayData.basicInfo?.timezone || 'Не указано'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Дата регистрации:</span>
                  <span className="text-sm font-medium">
                    {formatDate(user?.created_at || new Date().toISOString())}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Естественные ритмы */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Moon className="w-4 h-4" />
                <span>Естественные ритмы</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Тип активности:</span>
                   <span className="text-sm font-medium">{displayData.naturalRhythms?.activity_preference || displayData.naturalRhythms?.activityPreference}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Время пробуждения:</span>
                   <span className="text-sm font-medium">{displayData.naturalRhythms?.wake_time || displayData.naturalRhythms?.wakeTime}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Время сна:</span>
                   <span className="text-sm font-medium">{displayData.naturalRhythms?.sleep_time || displayData.naturalRhythms?.sleepTime}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Качество сна:</span>
                   <span className="text-sm font-medium">{displayData.naturalRhythms?.sleep_quality || displayData.naturalRhythms?.sleepQuality}</span>
                 </div>
              </div>
            </div>

            <Separator />

            {/* Текущее состояние */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Zap className="w-4 h-4" />
                <span>Текущее состояние</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Настроение (1-10):</span>
                   <span className="text-sm font-medium">{displayData.currentState?.mood_score || displayData.currentState?.moodScore}/10</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Уровень энергии:</span>
                   <span className="text-sm font-medium">{displayData.currentState?.energy_level || displayData.currentState?.energyLevel}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Частота усталости:</span>
                   <span className="text-sm font-medium">{displayData.currentState?.fatigue_frequency || displayData.currentState?.fatigueFrequency}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Влияние стресса:</span>
                   <span className="text-sm font-medium">{displayData.currentState?.stress_impact || displayData.currentState?.stressImpact}</span>
                 </div>
                 <div className="space-y-1">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Стратегии совладания:</span>
                   <div className="flex flex-wrap gap-1">
                     {(displayData.currentState?.coping_strategies || displayData.currentState?.copingStrategies)?.map((strategy: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {strategy}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Основные вызовы */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <AlertCircle className="w-4 h-4" />
                <span>Основные вызовы</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {displayData.challenges?.map((challenge: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="destructive"
                    className="text-xs"
                  >
                    {challenge}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Медицинская информация */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Shield className="w-4 h-4" />
                <span>Медицинская информация</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                 <div className="space-y-1">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Диагнозы:</span>
                   <div className="flex flex-wrap gap-1">
                     {(displayData.medicalInfo?.diagnosed_conditions || displayData.medicalInfo?.diagnosedConditions)?.map((condition: string, index: number) => (
                       <Badge key={index} variant="secondary" className="text-xs">
                         {condition}
                       </Badge>
                     )) || <span className="text-sm text-gray-500">Нет</span>}
                   </div>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Работа с терапевтом:</span>
                   <span className="text-sm font-medium">{displayData.medicalInfo?.working_with_therapist || displayData.medicalInfo?.workingWithTherapist}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Прием медикаментов:</span>
                   <span className="text-sm font-medium">{(displayData.medicalInfo?.taking_medication ?? displayData.medicalInfo?.takingMedication) ? 'Да' : 'Нет'}</span>
                 </div>
              </div>
            </div>

            <Separator />

            {/* Прокрастинация */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Clock className="w-4 h-4" />
                <span>Прокрастинация</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Частота:</span>
                  <span className="text-sm font-medium">{displayData.procrastination?.frequency}</span>
                </div>
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Подход к задачам:</span>
                   <span className="text-sm font-medium">{displayData.procrastination?.task_approach || displayData.procrastination?.taskApproach}</span>
                 </div>
                 <div className="space-y-1">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Барьеры:</span>
                   <div className="flex flex-wrap gap-1">
                     {displayData.procrastination?.barriers?.map((barrier: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {barrier}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Тревожность */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Heart className="w-4 h-4" />
                <span>Тревожность</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Частота:</span>
                  <span className="text-sm font-medium">{displayData.anxiety?.frequency}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Триггеры:</span>
                  <div className="flex flex-wrap gap-1">
                    {displayData.anxiety?.triggers?.map((trigger: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Проявления:</span>
                  <div className="flex flex-wrap gap-1">
                    {displayData.anxiety?.manifestations?.map((manifestation: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {manifestation}
                      </Badge>
                    ))}
                  </div>
                </div>
                 <div className="space-y-1">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Методы преодоления:</span>
                   <div className="flex flex-wrap gap-1">
                     {(displayData.anxiety?.coping_methods || displayData.anxiety?.copingMethods)?.map((method: string, index: number) => (
                      <Badge key={index} variant="default" className="text-xs">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Социальная поддержка */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Users className="w-4 h-4" />
                <span>Социальная поддержка</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Качество отношений:</span>
                   <span className="text-sm font-medium">{displayData.socialSupport?.relationship_quality || displayData.socialSupport?.relationshipQuality}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Частота одиночества:</span>
                   <span className="text-sm font-medium">{displayData.socialSupport?.loneliness_frequency || displayData.socialSupport?.lonelinessFrequency}</span>
                 </div>
                 <div className="space-y-1">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Источники поддержки:</span>
                   <div className="flex flex-wrap gap-1">
                     {(displayData.socialSupport?.support_sources || displayData.socialSupport?.supportSources)?.map((source: string, index: number) => (
                       <Badge key={index} variant="default" className="text-xs">
                         {source}
                       </Badge>
                     ))}
                   </div>
                 </div>
                 <div className="space-y-1">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Барьеры поддержки:</span>
                   <div className="flex flex-wrap gap-1">
                     {(displayData.socialSupport?.barriers_to_support || displayData.socialSupport?.barriers)?.map((barrier: string, index: number) => (
                       <Badge key={index} variant="outline" className="text-xs">
                         {barrier}
                       </Badge>
                     ))}
                   </div>
                 </div>
                 <div className="space-y-1">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Ситуации одиночества:</span>
                   <div className="flex flex-wrap gap-1">
                     {(displayData.socialSupport?.loneliness_situations || displayData.socialSupport?.lonelinessSituations)?.map((situation: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {situation}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Цели */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Target className="w-4 h-4" />
                <span>Цели в PsyBalans</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {displayData.goals?.map((goal: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="default"
                    className="text-xs"
                    style={{
                      backgroundColor: `hsl(var(--psybalans-primary))`,
                      color: 'white'
                    }}
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Предпочтения приложения */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Settings className="w-4 h-4" />
                <span>Предпочтения приложения</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Время практик:</span>
                   <span className="text-sm font-medium">{displayData.preferences?.daily_practice_time || displayData.preferences?.dailyPracticeTime}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Напоминания:</span>
                   <span className="text-sm font-medium">{displayData.preferences?.reminder_frequency || displayData.preferences?.reminderFrequency}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Время рекомендаций:</span>
                   <span className="text-sm font-medium">{displayData.preferences?.recommendation_time || displayData.preferences?.recommendationTime}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Подход к развитию:</span>
                   <span className="text-sm font-medium">{displayData.preferences?.development_approach || displayData.preferences?.developmentApproach}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Структура дня:</span>
                   <span className="text-sm font-medium">{displayData.preferences?.day_structure || displayData.preferences?.dayStructure}</span>
                 </div>
              </div>
            </div>

            <Separator />

            {/* Персонализация поддержки */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Palette className="w-4 h-4" />
                <span>Персонализация поддержки</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Стиль поддержки:</span>
                   <span className="text-sm font-medium">{displayData.personalization?.support_style || displayData.personalization?.supportStyle}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-sm text-gray-600 dark:text-gray-400">Стиль обратной связи:</span>
                   <span className="text-sm font-medium">{displayData.personalization?.feedback_style || displayData.personalization?.feedbackStyle}</span>
                 </div>
              </div>
            </div>

            {/* Статус загрузки */}
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Загрузка данных...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;