import React from 'react';
import { Palette } from 'lucide-react';
import ProfileSection from '../ProfileSection';
import ProfileField from '../ProfileField';
import { UserProfileData } from '../types';

interface PersonalizationSectionProps {
  data: UserProfileData;
}

const PersonalizationSection: React.FC<PersonalizationSectionProps> = ({ data }) => {
  return (
    <ProfileSection icon={Palette} title="Персонализация поддержки">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
        <ProfileField 
          label="Стиль поддержки" 
          value={data.personalization?.support_style || data.personalization?.supportStyle} 
        />
        <ProfileField 
          label="Стиль обратной связи" 
          value={data.personalization?.feedback_style || data.personalization?.feedbackStyle} 
        />
      </div>
    </ProfileSection>
  );
};

export default PersonalizationSection;