import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, User, Clock, Heart, Brain, Target } from 'lucide-react';
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
      const response = await onboardingService.getProfile();
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
      timezone: 'Europe/Moscow'
    },
    goals: [
      'Научиться справляться с тревогой и стрессом',
      'Нормализовать сон',
      'Повысить продуктивность и фокус'
    ],
    challenges: [
      'Тревога и беспокойство',
      'Проблемы со сном',
      'Прокрастинация'
    ],
    preferences: {
      dailyPracticeTime: '15-30 минут',
      reminderFrequency: 'Каждый день',
      supportStyle: 'Мягкий и поддерживающий'
    }
  };

  const displayData = profileData || mockProfileData;

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
                <Calendar className="w-4 h-4" />
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
                  <span className="text-sm text-gray-600 dark:text-gray-400">Дата регистрации:</span>
                  <span className="text-sm font-medium">
                    {formatDate(user?.created_at || new Date().toISOString())}
                  </span>
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
                    variant="secondary"
                    className="text-xs"
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Основные вызовы */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Brain className="w-4 h-4" />
                <span>Основные вызовы</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {displayData.challenges?.map((challenge: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="text-xs"
                  >
                    {challenge}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Предпочтения */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Heart className="w-4 h-4" />
                <span>Предпочтения</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Время практик:</span>
                  <span className="text-sm font-medium">{displayData.preferences?.dailyPracticeTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Напоминания:</span>
                  <span className="text-sm font-medium">{displayData.preferences?.reminderFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Стиль поддержки:</span>
                  <span className="text-sm font-medium">{displayData.preferences?.supportStyle}</span>
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