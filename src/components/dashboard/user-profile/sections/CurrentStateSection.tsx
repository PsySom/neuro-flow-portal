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
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
        <ProfileField 
          label="Настроение (1-10)" 
          value={`${data.currentState?.mood_score || data.currentState?.moodScore}/10`} 
        />
        <ProfileField 
          label="Уровень энергии" 
          value={data.currentState?.energy_level || data.currentState?.energyLevel} 
        />
        <ProfileField 
          label="Частота усталости" 
          value={data.currentState?.fatigue_frequency || data.currentState?.fatigueFrequency} 
        />
        <ProfileField 
          label="Влияние стресса" 
          value={data.currentState?.stress_impact || data.currentState?.stressImpact} 
        />
        <ProfileBadgeList 
          label="Стратегии совладания" 
          items={data.currentState?.coping_strategies || data.currentState?.copingStrategies}
        />
      </div>
    </ProfileSection>
  );
};

export default CurrentStateSection;