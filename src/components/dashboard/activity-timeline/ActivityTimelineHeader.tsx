
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityTimelineHeaderProps {
  formattedDate: string;
  onAddClick: () => void;
}

const ActivityTimelineHeader: React.FC<ActivityTimelineHeaderProps> = ({
  formattedDate,
  onAddClick
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Лента активности
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {formattedDate}
        </p>
      </div>
      <Button
        onClick={onAddClick}
        size="sm"
        className="text-white hover:opacity-90 transition-opacity"
        style={{
          backgroundColor: `hsl(var(--psybalans-primary))`,
          borderColor: `hsl(var(--psybalans-primary))`
        }}
      >
        <Plus className="w-4 h-4 mr-1" />
        Создать
      </Button>
    </div>
  );
};

export default ActivityTimelineHeader;
