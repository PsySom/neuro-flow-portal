
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import DayViewFilters from './DayViewFilters';
import { Activity } from '@/contexts/ActivitiesContext';

interface DayViewSidebarProps {
  currentDate: Date;
  activities: Activity[];
  filteredTypes: Set<string>;
  onTypeFilterChange: (type: string, checked: boolean) => void;
}

const DayViewSidebar: React.FC<DayViewSidebarProps> = ({
  currentDate,
  activities,
  filteredTypes,
  onTypeFilterChange
}) => {
  return (
    <div className="w-64 space-y-4 flex-shrink-0">
      {/* Миниатюра календаря - компактнее */}
      <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
        <CardContent className="p-3">
          <h3 className="text-xs font-medium mb-2 text-gray-700">Календарь</h3>
          <Calendar
            mode="single"
            selected={currentDate}
            month={currentDate}
            className="rounded-md border-0 p-0 scale-90 origin-top-left"
            classNames={{
              months: "flex flex-col space-y-2",
              month: "space-y-2",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-xs font-medium",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-6 font-normal text-xs",
              row: "flex w-full mt-1",
              cell: "relative p-0 text-center text-xs focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
              day: "h-6 w-6 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground text-xs",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground font-semibold",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
            }}
          />
        </CardContent>
      </Card>

      <DayViewFilters
        activities={activities}
        filteredTypes={filteredTypes}
        onTypeFilterChange={onTypeFilterChange}
      />
    </div>
  );
};

export default DayViewSidebar;
