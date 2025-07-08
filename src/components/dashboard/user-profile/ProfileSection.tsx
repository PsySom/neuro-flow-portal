import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ProfileSectionProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ icon: Icon, title, children }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <Icon className="w-4 h-4" />
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
};

export default ProfileSection;