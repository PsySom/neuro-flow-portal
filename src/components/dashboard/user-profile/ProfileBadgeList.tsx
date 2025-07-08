import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProfileBadgeListProps {
  label: string;
  items: string[] | undefined;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  emptyMessage?: string;
}

const ProfileBadgeList: React.FC<ProfileBadgeListProps> = ({ 
  label, 
  items, 
  variant = 'outline',
  emptyMessage = 'Нет' 
}) => {
  return (
    <div className="space-y-1">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}:</span>
      <div className="flex flex-wrap gap-1">
        {items && items.length > 0 ? (
          items.map((item: string, index: number) => (
            <Badge key={index} variant={variant} className="text-xs">
              {item}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-gray-500">{emptyMessage}</span>
        )}
      </div>
    </div>
  );
};

export default ProfileBadgeList;