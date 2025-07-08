import React from 'react';
import { Moon } from 'lucide-react';
import ProfileSection from '../ProfileSection';
import ProfileField from '../ProfileField';
import { UserProfileData } from '../types';

interface NaturalRhythmsSectionProps {
  data: UserProfileData;
}

const NaturalRhythmsSection: React.FC<NaturalRhythmsSectionProps> = ({ data }) => {
  return (
    <ProfileSection icon={Moon} title="Естественные ритмы">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
        <ProfileField 
          label="Тип активности" 
          value={data.naturalRhythms?.activity_preference || data.naturalRhythms?.activityPreference} 
        />
        <ProfileField 
          label="Время пробуждения" 
          value={data.naturalRhythms?.wake_time || data.naturalRhythms?.wakeTime} 
        />
        <ProfileField 
          label="Время сна" 
          value={data.naturalRhythms?.sleep_time || data.naturalRhythms?.sleepTime} 
        />
        <ProfileField 
          label="Качество сна" 
          value={data.naturalRhythms?.sleep_quality || data.naturalRhythms?.sleepQuality} 
        />
      </div>
    </ProfileSection>
  );
};

export default NaturalRhythmsSection;