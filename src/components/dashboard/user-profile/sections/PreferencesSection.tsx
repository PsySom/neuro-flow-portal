import React from 'react';
import { Settings } from 'lucide-react';
import ProfileSection from '../ProfileSection';
import ProfileField from '../ProfileField';
import { UserProfileData } from '../types';

interface PreferencesSectionProps {
  data: UserProfileData;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({ data }) => {
  return (
    <ProfileSection icon={Settings} title="Предпочтения приложения">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
        <ProfileField 
          label="Время практик" 
          value={data.preferences?.daily_practice_time || data.preferences?.dailyPracticeTime} 
        />
        <ProfileField 
          label="Напоминания" 
          value={data.preferences?.reminder_frequency || data.preferences?.reminderFrequency} 
        />
        <ProfileField 
          label="Время рекомендаций" 
          value={data.preferences?.recommendation_time || data.preferences?.recommendationTime} 
        />
        <ProfileField 
          label="Подход к развитию" 
          value={data.preferences?.development_approach || data.preferences?.developmentApproach} 
        />
        <ProfileField 
          label="Структура дня" 
          value={data.preferences?.day_structure || data.preferences?.dayStructure} 
        />
      </div>
    </ProfileSection>
  );
};

export default PreferencesSection;