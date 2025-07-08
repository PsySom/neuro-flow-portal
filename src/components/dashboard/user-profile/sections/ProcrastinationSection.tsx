import React from 'react';
import { Clock } from 'lucide-react';
import ProfileSection from '../ProfileSection';
import ProfileField from '../ProfileField';
import ProfileBadgeList from '../ProfileBadgeList';
import { UserProfileData } from '../types';

interface ProcrastinationSectionProps {
  data: UserProfileData;
}

const ProcrastinationSection: React.FC<ProcrastinationSectionProps> = ({ data }) => {
  return (
    <ProfileSection icon={Clock} title="Прокрастинация">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
        <ProfileField 
          label="Частота" 
          value={data.procrastination?.frequency} 
        />
        <ProfileField 
          label="Подход к задачам" 
          value={data.procrastination?.task_approach || data.procrastination?.taskApproach} 
        />
        <ProfileBadgeList 
          label="Барьеры" 
          items={data.procrastination?.barriers}
        />
      </div>
    </ProfileSection>
  );
};

export default ProcrastinationSection;