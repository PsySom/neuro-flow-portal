import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, User } from 'lucide-react';
import { useSupabaseAuth as useAuth } from '@/contexts/SupabaseAuthContext';
import { onboardingService } from '@/services/onboarding.service';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { UserProfileData, UserProfileDialogProps } from './user-profile/types';
import {
  BasicInfoSection,
  NaturalRhythmsSection,
  CurrentStateSection,
  ChallengesSection,
  GoalsSection,
  PreferencesSection,
  SecuritySection
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
      
      if (response.success && response.data) {
        setProfileData(response.data);
      }
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

  // Show loading if data is not yet loaded
  if (isLoading) {
    return null;
  }

  // If no profile data, don't display anything
  if (!profileData) {
    return null;
  }

  const displayData = profileData;
  
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Загрузка данных...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <BasicInfoSection 
                data={displayData}
                userEmail={user?.email}
                userCreatedAt={undefined}
                formatDate={formatDate}
              />

              <Separator />

              <SecuritySection />

              {displayData.naturalRhythms && (
                <>
                  <Separator />
                  <NaturalRhythmsSection data={displayData} />
                </>
              )}

              {displayData.currentState && (
                <>
                  <Separator />
                  <CurrentStateSection data={displayData} />
                </>
              )}

              {displayData.challenges && displayData.challenges.length > 0 && (
                <>
                  <Separator />
                  <ChallengesSection data={displayData} />
                </>
              )}

              {displayData.goals && displayData.goals.length > 0 && (
                <>
                  <Separator />
                  <GoalsSection data={displayData} />
                </>
              )}

              {displayData.preferences && (
                <>
                  <Separator />
                  <PreferencesSection data={displayData} />
                </>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;