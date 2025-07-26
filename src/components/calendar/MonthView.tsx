
import React, { memo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMonthView } from './hooks/useMonthView';
import { useActivitiesRealtime } from '@/hooks/api/useActivitiesRealtime';
import ActivitySyncIndicator from './components/ActivitySyncIndicator';
import EditActivityDialog from './components/EditActivityDialog';
import CreateActivityDialog from './components/CreateActivityDialog';
import { useActivitySync } from '@/hooks/useActivitySync';

interface MonthViewProps {
  currentDate: Date;
}

const MonthView: React.FC<MonthViewProps> = memo(({ currentDate }) => {
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const {
    days,
    isToday,
    isCurrentMonth,
    getActivitiesForDateObj,
    truncateText,
    isLoading
  } = useMonthView(currentDate);

  // Use unified activity sync hook
  const { createActivity, updateActivity, deleteActivity } = useActivitySync();

  // Enable realtime updates
  useActivitiesRealtime(true);

  const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

  const handleActivityClick = (activity: any) => {
    setSelectedActivity(activity);
    setIsEditDialogOpen(true);
  };

  const handleAddActivity = (date: Date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
    setIsCreateDialogOpen(true);
  };

  const handleActivityUpdateWrapper = (updatedActivity: any, recurringOptions?: any) => {
    console.log('MonthView: handleActivityUpdateWrapper called with:', updatedActivity, recurringOptions);
    updateActivity(updatedActivity.id, updatedActivity, recurringOptions)
      .then(() => setIsEditDialogOpen(false))
      .catch(error => console.error('Failed to update activity:', error));
  };

  const handleActivityCreateWrapper = (newActivity: any, recurringOptions?: any) => {
    createActivity(newActivity, recurringOptions)
      .then(() => setIsCreateDialogOpen(false))
      .catch(error => console.error('Failed to create activity:', error));
  };

  const handleActivityDeleteWrapper = (id: number | string, deleteOption?: any) => {
    deleteActivity(id, deleteOption)
      .then(() => setIsEditDialogOpen(false))
      .catch(error => console.error('Failed to delete activity:', error));
  };

  if (isLoading) {
    return (
      <Card className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Выберите месяц для просмотра</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-xl">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Календарь месяца</h3>
          <ActivitySyncIndicator />
        </div>
        <div className="p-6">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-px mb-2">
          {weekDays.map((day) => (
            <div 
              key={day} 
              className="h-10 flex items-center justify-center bg-gray-100 text-sm font-medium text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {days.map((date, index) => {
            const activities = getActivitiesForDateObj(date);
            const maxVisibleActivities = 3;
            const visibleActivities = activities.slice(0, maxVisibleActivities);
            const hiddenCount = activities.length - maxVisibleActivities;
            
            return (
              <div
                key={`${date.toISOString()}-${index}`}
                className={`bg-white min-h-[120px] p-2 flex flex-col ${
                  !isCurrentMonth(date) ? 'bg-gray-50 text-gray-400' : ''
                } ${isToday(date) ? 'bg-blue-50 border-2 border-blue-500' : ''}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm font-medium ${
                    isToday(date) ? 'text-blue-600 font-bold' : ''
                  }`}>
                    {date.getDate()}
                  </span>
                  {activities.length > 0 && (
                    <span className="text-xs text-gray-500 bg-gray-200 rounded-full px-1">
                      {activities.length}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 space-y-1 overflow-hidden">
                  {visibleActivities.map((activity, activityIndex) => (
                    <div
                      key={`${activity.id}-${activityIndex}`}
                      className={`${activity.color} text-white text-xs px-1 py-0.5 rounded truncate flex items-center space-x-1 cursor-pointer hover:opacity-80 transition-opacity`}
                      title={`${activity.emoji} ${activity.name} (${activity.startTime}-${activity.endTime})`}
                      onClick={() => handleActivityClick(activity)}
                    >
                      <span>{activity.emoji}</span>
                      <span className="flex-1 truncate">{truncateText(activity.name)}</span>
                      <span className="text-xs opacity-75">{activity.startTime}</span>
                    </div>
                  ))}
                  
                  {hiddenCount > 0 && (
                    <div className="text-xs text-gray-500 px-1">
                      +{hiddenCount} еще
                    </div>
                  )}
                </div>
                
                {/* Add event button for current month days */}
                {isCurrentMonth(date) && activities.length === 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-full text-xs text-gray-400 hover:text-gray-600 mt-1"
                    onClick={() => handleAddActivity(date)}
                  >
                    +
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-200 rounded"></div>
            <span className="text-sm text-gray-600">Задачи</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <span className="text-sm text-gray-600">Восстановление</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-200 rounded"></div>
            <span className="text-sm text-gray-600">Смешанные</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-200 rounded"></div>
            <span className="text-sm text-gray-600">Нейтральные</span>
          </div>
        </div>
        </div>
      </CardContent>

      {/* Edit Activity Dialog */}
      {selectedActivity && (
        <EditActivityDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          activity={selectedActivity}
          onActivityUpdate={handleActivityUpdateWrapper}
          onDelete={handleActivityDeleteWrapper}
        />
      )}

      {/* Create Activity Dialog */}
      <CreateActivityDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        initialDate={selectedDate}
        initialTime="09:00"
        onActivityCreate={handleActivityCreateWrapper}
      />
    </Card>
  );
});

MonthView.displayName = 'MonthView';

export default MonthView;
