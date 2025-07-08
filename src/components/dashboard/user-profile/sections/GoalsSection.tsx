import React from 'react';
import { Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ProfileSection from '../ProfileSection';
import { UserProfileData } from '../types';

interface GoalsSectionProps {
  data: UserProfileData;
}

const GoalsSection: React.FC<GoalsSectionProps> = ({ data }) => {
  return (
    <ProfileSection icon={Target} title="Цели в PsyBalans">
      <div className="flex flex-wrap gap-2">
        {data.goals?.map((goal: string, index: number) => (
          <Badge 
            key={index} 
            variant="default"
            className="text-xs"
            style={{
              backgroundColor: `hsl(var(--psybalans-primary))`,
              color: 'white'
            }}
          >
            {goal}
          </Badge>
        ))}
      </div>
    </ProfileSection>
  );
};

export default GoalsSection;