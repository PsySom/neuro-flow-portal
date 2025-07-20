
import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarControls from '@/components/calendar/CalendarControls';
import DayView from '@/components/calendar/DayView';
import WeekView from '@/components/calendar/WeekView';
import MonthView from '@/components/calendar/MonthView';
import CreateActivityDialog from '@/components/calendar/components/CreateActivityDialog';
import AdaptiveNavigation from '@/components/navigation/AdaptiveNavigation';
import { useActivitySync } from '@/hooks/useActivitySync';
import { Activity } from '@/contexts/ActivitiesContext';
import { RecurringActivityOptions, DeleteRecurringOption } from '@/components/calendar/utils/recurringUtils';
import { useCalendarNavigation } from '@/hooks/useCalendarNavigation';

const Calendar = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { createActivity } = useActivitySync();
  
  const {
    currentDate,
    setCurrentDate,
    view,
    setView,
    navigateDate,
    getDateTitle
  } = useCalendarNavigation();

  const handleViewChange = useCallback((value: string) => {
    setView(value as 'day' | 'week' | 'month');
  }, [setView]);

  const handleActivityCreate = useCallback((newActivity: any, recurringOptions?: RecurringActivityOptions) => {
    console.log('Creating activity in Calendar:', newActivity, 'with recurring:', recurringOptions);
    createActivity(newActivity, recurringOptions)
      .then(() => setIsCreateDialogOpen(false))
      .catch(error => console.error('Failed to create activity:', error));
  }, [createActivity]);

  const handleDateChange = useCallback((newDate: Date) => {
    console.log('Date changed in Calendar:', newDate);
    setCurrentDate(newDate);
  }, [setCurrentDate]);

  const handleActivityUpdate = useCallback((activityId: number, updates: Partial<Activity>, recurringOptions?: RecurringActivityOptions) => {
    console.log('Calendar handleActivityUpdate:', activityId, updates, recurringOptions);
    // This is handled in DayView now
  }, []);

  const handleActivityDelete = useCallback((id: number, deleteOption?: DeleteRecurringOption) => {
    console.log('Calendar handleActivityDelete:', id, deleteOption);
    // This is handled in DayView now
  }, []);

  const handleNavigatePrev = useCallback(() => navigateDate('prev'), [navigateDate]);
  const handleNavigateNext = useCallback(() => navigateDate('next'), [navigateDate]);
  const handleToday = useCallback(() => setCurrentDate(new Date()), [setCurrentDate]);
  const handleCreateActivity = useCallback(() => setIsCreateDialogOpen(true), []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <CalendarHeader />
        <AdaptiveNavigation />
        
        <CalendarControls
          dateTitle={getDateTitle()}
          onNavigatePrev={handleNavigatePrev}
          onNavigateNext={handleNavigateNext}
          onToday={handleToday}
          onCreateActivity={handleCreateActivity}
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
