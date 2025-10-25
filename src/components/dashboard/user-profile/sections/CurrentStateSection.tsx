import React from 'react';
import { Zap } from 'lucide-react';
import ProfileSection from '../ProfileSection';
import ProfileField from '../ProfileField';
import ProfileBadgeList from '../ProfileBadgeList';
import { UserProfileData } from '../types';

interface CurrentStateSectionProps {
  data: UserProfileData;
}

const CurrentStateSection: React.FC<CurrentStateSectionProps> = ({ data }) => {
  return (
    <ProfileSection icon={Zap} title="Текущее состояние">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
        {(data.currentState?.mood_score || data.currentState?.moodScore) && (
          <ProfileField 
            label="Настроение" 
            value={`${data.currentState?.mood_score || data.currentState?.moodScore}/10`} 
          />
        )}
        {(data.currentState?.energy_level || data.currentState?.energyLevel) && (
          <ProfileField 
            label="Уровень энергии" 
            value={data.currentState?.energy_level || data.currentState?.energyLevel} 
          />
        )}
        {(data.currentState?.stress_impact || data.currentState?.stressImpact) && (
          <ProfileField 
            label="Уровень стресса" 
            value={data.currentState?.stress_impact || data.currentState?.stressImpact} 
          />
        )}
      </div>
    </ProfileSection>
  );
};

export default CurrentStateSection;