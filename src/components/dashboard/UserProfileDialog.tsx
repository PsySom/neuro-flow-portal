import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, User } from 'lucide-react';
import { useBackendAuth as useAuth } from '@/contexts/BackendAuthContext';
import { onboardingService } from '@/services/onboarding.service';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { UserProfileData, UserProfileDialogProps } from './user-profile/types';
import {
  BasicInfoSection,
  NaturalRhythmsSection,
  CurrentStateSection,
  ChallengesSection,
  MedicalInfoSection,
  ProcrastinationSection,
  AnxietySection,
  SocialSupportSection,
  GoalsSection,
  PreferencesSection,
  PersonalizationSection
} from './user-profile/sections';

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
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

  const mockProfileData: UserProfileData = {
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
            <BasicInfoSection 
              data={displayData}
              userEmail={user?.email}
              userCreatedAt={undefined}
              formatDate={formatDate}
            />

            <Separator />

            <NaturalRhythmsSection data={displayData} />

            <Separator />

            <CurrentStateSection data={displayData} />

            <Separator />

            <ChallengesSection data={displayData} />

            <Separator />

            <MedicalInfoSection data={displayData} />

            <Separator />

            <ProcrastinationSection data={displayData} />

            <Separator />

            <AnxietySection data={displayData} />

            <Separator />

            <SocialSupportSection data={displayData} />

            <Separator />

            <GoalsSection data={displayData} />

            <Separator />

            <PreferencesSection data={displayData} />

            <Separator />

            <PersonalizationSection data={displayData} />

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