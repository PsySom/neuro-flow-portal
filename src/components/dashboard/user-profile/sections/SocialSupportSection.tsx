import React from 'react';
import { Users } from 'lucide-react';
import ProfileSection from '../ProfileSection';
import ProfileField from '../ProfileField';
import ProfileBadgeList from '../ProfileBadgeList';
import { UserProfileData } from '../types';

interface SocialSupportSectionProps {
  data: UserProfileData;
}

const SocialSupportSection: React.FC<SocialSupportSectionProps> = ({ data }) => {
  return (
    <ProfileSection icon={Users} title="Социальная поддержка">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
        <ProfileField 
          label="Качество отношений" 
          value={data.socialSupport?.relationship_quality || data.socialSupport?.relationshipQuality} 
        />
        <ProfileField 
          label="Частота одиночества" 
          value={data.socialSupport?.loneliness_frequency || data.socialSupport?.lonelinessFrequency} 
        />
        <ProfileBadgeList 
          label="Источники поддержки" 
          items={data.socialSupport?.support_sources || data.socialSupport?.supportSources}
          variant="default"
        />
        <ProfileBadgeList 
          label="Барьеры поддержки" 
          items={data.socialSupport?.barriers_to_support || data.socialSupport?.barriers}
        />
        <ProfileBadgeList 
          label="Ситуации одиночества" 
          items={data.socialSupport?.loneliness_situations || data.socialSupport?.lonelinessSituations}
          variant="secondary"
        />
      </div>
    </ProfileSection>
  );
};

export default SocialSupportSection;