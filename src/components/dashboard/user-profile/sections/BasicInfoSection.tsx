import React from 'react';
import { User } from 'lucide-react';
import ProfileSection from '../ProfileSection';
import ProfileField from '../ProfileField';
import { UserProfileData } from '../types';

interface BasicInfoSectionProps {
  data: UserProfileData;
  userEmail?: string;
  userCreatedAt?: string;
  formatDate: (dateString?: string) => string;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ 
  data, 
  userEmail, 
  userCreatedAt, 
  formatDate 
}) => {
  return (
    <ProfileSection icon={User} title="Основная информация">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
        <ProfileField label="Имя" value={data.basicInfo?.name} />
        <ProfileField label="Email" value={userEmail} />
        {data.basicInfo?.age && (
          <ProfileField label="Возраст" value={`${data.basicInfo.age} лет`} />
        )}
        {data.basicInfo?.timezone && (
          <ProfileField label="Часовой пояс" value={data.basicInfo.timezone} />
        )}
      </div>
    </ProfileSection>
  );
};

export default BasicInfoSection;