import React from 'react';
import { Settings } from 'lucide-react';
import ProfileSection from '../ProfileSection';
import ProfileField from '../ProfileField';
import { UserProfileData } from '../types';

interface PreferencesSectionProps {
  data: UserProfileData;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({ data }) => {
  const mapTimeCommitment = (time: string) => {
    const mapping: Record<string, string> = {
      '5-10': '5-10 минут',
      '15-20': '15-20 минут',
      '30-45': '30-45 минут',
      '60+': 'Более часа'
    };
    return mapping[time] || time;
  };

  const mapReminderFrequency = (freq: string) => {
    const mapping: Record<string, string> = {
      '1-2': '1-2 раза в день',
      '3-4': '3-4 раза в день',
      'on-demand': 'По запросу',
      'minimal': 'Минимально'
    };
    return mapping[freq] || freq;
  };

  return (
    <ProfileSection icon={Settings} title="Предпочтения">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
        {data.preferences?.dailyPracticeTime && (
          <ProfileField 
            label="Время на практики" 
            value={mapTimeCommitment(data.preferences.dailyPracticeTime)} 
          />
        )}
        {data.preferences?.reminderFrequency && (
          <ProfileField 
            label="Частота напоминаний" 
            value={mapReminderFrequency(data.preferences.reminderFrequency)} 
          />
        )}
      </div>
    </ProfileSection>
  );
};

export default PreferencesSection;