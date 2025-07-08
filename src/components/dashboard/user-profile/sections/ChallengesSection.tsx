import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ProfileSection from '../ProfileSection';
import { UserProfileData } from '../types';

interface ChallengesSectionProps {
  data: UserProfileData;
}

const ChallengesSection: React.FC<ChallengesSectionProps> = ({ data }) => {
  return (
    <ProfileSection icon={AlertCircle} title="Основные вызовы">
      <div className="flex flex-wrap gap-2">
        {data.challenges?.map((challenge: string, index: number) => (
          <Badge 
            key={index} 
            variant="destructive"
            className="text-xs"
          >
            {challenge}
          </Badge>
        ))}
      </div>
    </ProfileSection>
  );
};

export default ChallengesSection;