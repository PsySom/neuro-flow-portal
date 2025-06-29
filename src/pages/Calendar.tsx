
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarControls from '@/components/calendar/CalendarControls';
import DayView from '@/components/calendar/DayView';
import WeekView from '@/components/calendar/WeekView';
import MonthView from '@/components/calendar/MonthView';
import CreateActivityDialog from '@/components/calendar/components/CreateActivityDialog';
import AdaptiveNavigation from '@/components/navigation/AdaptiveNavigation';
import { useActivities } from '@/contexts/ActivitiesContext';
import { Activity } from '@/contexts/ActivitiesContext';
import { RecurringActivityOptions, DeleteRecurringOption } from '@/components/calendar/utils/recurringUtils';
import { useCalendarNavigation } from '@/hooks/useCalendarNavigation';

const Calendar = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { addActivity, updateActivity, deleteActivity } = useActivities();
  
  const {
    currentDate,
    setCurrentDate,
    view,
    setView,
    navigateDate,
    getDateTitle
  } = useCalendarNavigation();

  const handleViewChange = (value: string) => {
    setView(value as 'day' | 'week' | 'month');
  };

  const handleActivityCreate = (newActivity: any, recurringOptions?: RecurringActivityOptions) => {
    const activityWithDate = {
      ...newActivity,
      date: newActivity.date || currentDate.toISOString().split('T')[0]
    };
    console.log('Creating activity in Calendar:', activityWithDate, 'with recurring:', recurringOptions);
    addActivity(activityWithDate, recurringOptions);
  };

  const handleDateChange = (newDate: Date) => {
    console.log('Date changed in Calendar:', newDate);
    setCurrentDate(newDate);
  };

  const handleActivityUpdate = (activityId: number, updates: Partial<Activity>, recurringOptions?: RecurringActivityOptions) => {
    console.log('Calendar handleActivityUpdate:', activityId, updates, recurringOptions);
    updateActivity(activityId, updates, recurringOptions);
  };

  const handleActivityDelete = (id: number, deleteOption?: DeleteRecurringOption) => {
    console.log('Calendar handleActivityDelete:', id, deleteOption);
    deleteActivity(id, deleteOption);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <CalendarHeader />
        <AdaptiveNavigation />
        
        <CalendarControls
          dateTitle={getDateTitle()}
          onNavigatePrev={() => navigateDate('prev')}
          onNavigateNext={() => navigateDate('next')}
          onToday={() => setCurrentDate(new Date())}
          onCreateActivity={() => setIsCreateDialogOpen(true)}
        />

        {/* Calendar Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Tabs value={view} onValueChange={handleViewChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="day">День</TabsTrigger>
              <TabsTrigger value="week">Неделя</TabsTrigger>
              <TabsTrigger value="month">Месяц</TabsTrigger>
            </TabsList>
            
            <TabsContent value="day" className="mt-0">
              <DayView 
                currentDate={currentDate} 
                onUpdateActivity={handleActivityUpdate}
                onDeleteActivity={handleActivityDelete}
                onDateChange={handleDateChange}
              />
            </TabsContent>
            
            <TabsContent value="week" className="mt-0">
              <WeekView 
                currentDate={currentDate} 
                onDateChange={handleDateChange}
              />
            </TabsContent>
            
            <TabsContent value="month" className="mt-0">
              <MonthView currentDate={currentDate} />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <CreateActivityDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onActivityCreate={handleActivityCreate}
        initialDate={currentDate.toISOString().split('T')[0]}
      />
    </>
  );
};

export default Calendar;
