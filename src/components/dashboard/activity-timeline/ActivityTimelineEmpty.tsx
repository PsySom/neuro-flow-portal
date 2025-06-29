
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ActivityTimelineEmptyProps {
  formattedDate: string;
}

const ActivityTimelineEmpty: React.FC<ActivityTimelineEmptyProps> = ({
  formattedDate
}) => {
  return (
    <CardContent className="p-6">
      <ScrollArea className="h-[480px]">
        <div className="text-center py-8 text-gray-500">
          <p>Нет активностей на {formattedDate}</p>
        </div>
      </ScrollArea>
    </CardContent>
  );
};

export default ActivityTimelineEmpty;
