import React from 'react';
import { Moon } from 'lucide-react';
import ProfileSection from '../ProfileSection';
import ProfileField from '../ProfileField';
import { UserProfileData } from '../types';

interface NaturalRhythmsSectionProps {
  data: UserProfileData;
}

const NaturalRhythmsSection: React.FC<NaturalRhythmsSectionProps> = ({ data }) => {
  const mapChronotype = (chronotype: string) => {
    const mapping: Record<string, string> = {
      'morning': 'Утренний тип',
      'day': 'Дневной тип',
      'evening': 'Вечерний тип',
      'varies': 'Смешанный тип'
    };
    return mapping[chronotype] || chronotype;
  };

  return (
    <ProfileSection icon={Moon} title="Естественные ритмы">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
        {data.naturalRhythms?.chronotype && (
          <ProfileField 
            label="Хронотип" 
            value={mapChronotype(data.naturalRhythms.chronotype)} 
          />
        )}
        {data.naturalRhythms?.wakeTime && (
          <ProfileField 
            label="Время пробуждения" 
            value={data.naturalRhythms.wakeTime} 
          />
        )}
        {data.naturalRhythms?.sleepTime && (
          <ProfileField 
            label="Время засыпания" 
            value={data.naturalRhythms.sleepTime} 
          />
        )}
        {data.naturalRhythms?.sleepQuality && (
          <ProfileField 
            label="Качество сна" 
            value={data.naturalRhythms.sleepQuality} 
          />
        )}
      </div>
    </ProfileSection>
  );
};

export default NaturalRhythmsSection;