
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Plus } from 'lucide-react';

interface ActivityTimelineHeaderProps {
  formattedDate: string;
  onAddClick: () => void;
}

const ActivityTimelineHeader: React.FC<ActivityTimelineHeaderProps> = ({
  formattedDate,
  onAddClick
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-emerald-600" />
        <span>Активности на {formattedDate}</span>
      </CardTitle>
      <Button 
        size="icon" 
        className="rounded-full bg-emerald-500 hover:bg-emerald-600"
        onClick={onAddClick}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </CardHeader>
  );
};

export default ActivityTimelineHeader;
