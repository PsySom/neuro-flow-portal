import React from 'react';
import { Heart } from 'lucide-react';
import ProfileSection from '../ProfileSection';
import ProfileField from '../ProfileField';
import ProfileBadgeList from '../ProfileBadgeList';
import { UserProfileData } from '../types';

interface AnxietySectionProps {
  data: UserProfileData;
}

const AnxietySection: React.FC<AnxietySectionProps> = ({ data }) => {
  return (
    <ProfileSection icon={Heart} title="Тревожность">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
        <ProfileField 
          label="Частота" 
          value={data.anxiety?.frequency} 
        />
        <ProfileBadgeList 
          label="Триггеры" 
          items={data.anxiety?.triggers}
          variant="secondary"
        />
        <ProfileBadgeList 
          label="Проявления" 
          items={data.anxiety?.manifestations}
        />
        <ProfileBadgeList 
          label="Методы преодоления" 
          items={data.anxiety?.coping_methods || data.anxiety?.copingMethods}
          variant="default"
        />
      </div>
    </ProfileSection>
  );
};

export default AnxietySection;