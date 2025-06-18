
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Plus, Star, Info, Edit, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import CreateActivityDialog from './activity-timeline/CreateActivityDialog';
import ActivityDetailsDialog from '@/components/calendar/components/ActivityDetailsDialog';
import { useActivities } from '@/contexts/ActivitiesContext';

const ActivityTimelineComponent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  const { activities, toggleActivityComplete, deleteActivity } = useActivities();

  const handleActivityToggle = (activityId: number) => {
    toggleActivityComplete(activityId);
  };

  const handleInfoClick = (activity: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedActivity(activity);
    setIsDetailsDialogOpen(true);
  };

  const handleEditClick = (activity: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedActivity(activity);
    setIsDetailsDialogOpen(true);
  };

  const handleDeleteClick = (activity: any, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteActivity(activity.id);
  };

  return (
    <>
      <Card className="h-[600px] bg-white/70 backdrop-blur-lg border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span>Список активностей</span>
          </CardTitle>
          <Button 
            size="icon" 
            className="rounded-full bg-emerald-500 hover:bg-emerald-600"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6">
          <ScrollArea className="h-[480px]">
            <div className="space-y-3">
              {activities.map((activity) => (
                <div 
                  key={activity.id}
                  className={`${activity.color} rounded-lg p-4 border border-gray-200`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Checkbox 
                        checked={activity.completed}
                        onCheckedChange={() => handleActivityToggle(activity.id)}
                        className="w-5 h-5 rounded-sm mt-1 cursor-pointer"
                      />
                      <div className="flex flex-col space-y-2">
                        <span className="font-medium text-lg">{activity.name}</span>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="font-medium">[{activity.startTime}-{activity.endTime}]</span>
                          <span>[{activity.duration}]</span>
                          <div className="flex items-center">
                            {Array.from({ length: activity.importance }, (_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {activity.type}
                          </Badge>
                          <span className="text-2xl">{activity.emoji}</span>
                          {activity.type === 'восстановление' && activity.needEmoji && (
                            <span className="text-lg">{activity.needEmoji}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Кнопки в верхнем правом углу */}
                    <div className="flex space-x-1 ml-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6"
                        onClick={(e) => handleInfoClick(activity, e)}
                      >
                        <Info className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6"
                        onClick={(e) => handleEditClick(activity, e)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6"
                        onClick={(e) => handleDeleteClick(activity, e)}
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <CreateActivityDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      {selectedActivity && (
        <ActivityDetailsDialog 
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          activity={selectedActivity}
        />
      )}
    </>
  );
};

export default ActivityTimelineComponent;
