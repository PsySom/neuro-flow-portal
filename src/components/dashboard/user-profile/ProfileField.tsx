import React from 'react';

interface ProfileFieldProps {
  label: string;
  value: string | number | undefined;
  fallback?: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value, fallback = 'Не указано' }) => {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}:</span>
      <span className="text-sm font-medium">{value || fallback}</span>
    </div>
  );
};

export default ProfileField;