
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DayViewFilters from './DayViewFilters';
import { Activity } from '@/contexts/ActivitiesContext';

interface DayViewSidebarProps {
  currentDate: Date;
  activities: Activity[];
  filteredTypes: Set<string>;
  onTypeFilterChange: (type: string, checked: boolean) => void;
  onDateSelect?: (date: Date) => void;
}

const DayViewSidebar: React.FC<DayViewSidebarProps> = ({
  currentDate,
  activities,
  filteredTypes,
  onTypeFilterChange,
  onDateSelect
}) => {
  const [calendarMonth, setCalendarMonth] = useState(currentDate);
  const today = new Date();
  
  // Устанавливаем время в 00:00:00 для корректного сравнения дат
  const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const currentDateNormalized = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

  const handleDateSelect = (date: Date | undefined) => {
    if (date && onDateSelect) {
      // Создаем новую дату с нормализованным временем
      const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      onDateSelect(normalizedDate);
    }
  };

  const handlePrevMonth = () => {
    const newMonth = new Date(calendarMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCalendarMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(calendarMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCalendarMonth(newMonth);
  };

  const handleTodayClick = () => {
    setCalendarMonth(today);
    if (onDateSelect) {
      onDateSelect(todayNormalized);
    }
  };

  // Проверяем, является ли дата сегодняшней
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  return (
    <div className="w-64 space-y-4 flex-shrink-0">
      {/* Миниатюра календаря */}
      <Card className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-xl">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-700">Календарь</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTodayClick}
              className="text-xs h-6 px-2"
            >
              Сегодня
            </Button>
          </div>
          
          {/* Навигация по месяцам */}
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevMonth}
              className="h-6 w-6 p-0"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            
            <span className="text-xs font-medium">
              {calendarMonth.toLocaleDateString('ru-RU', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className="h-6 w-6 p-0"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>

          <Calendar
            mode="single"
            selected={currentDateNormalized}
            onSelect={handleDateSelect}
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            weekStartsOn={1}
            className="rounded-md border-0 p-0 scale-90 origin-top-left"
            classNames={{
              months: "flex flex-col space-y-2",
              month: "space-y-2",
              caption: "flex justify-center pt-1 relative items-center opacity-0 h-0",
              caption_label: "text-xs font-medium",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-6 font-normal text-xs",
              row: "flex w-full mt-1",
              cell: "relative p-0 text-center text-xs focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
              day: "h-6 w-6 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground text-xs cursor-pointer",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-blue-100 text-blue-600 font-bold border border-blue-500",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
            }}
            modifiers={{
              today: todayNormalized,
              selected: currentDateNormalized
            }}
            modifiersClassNames={{
              today: "bg-blue-100 text-blue-600 font-bold border border-blue-500",
              selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
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
