import { Activity as UiActivity } from '@/contexts/ActivitiesContext';
import { CreateActivityRequest } from '@/types/api.types';
import { activityService } from './activity.service';
import { convertApiActivityToUi } from '@/utils/activityAdapter';
import { 
  RecurringActivityOptions, 
  generateRecurringActivities, 
  DeleteRecurringOption 
} from '@/components/calendar/utils/recurringUtils';

class CalendarService {
  // Create activity with recurring support specifically for calendar
  async createActivity(
    activityData: any, 
    recurringOptions?: RecurringActivityOptions
  ): Promise<UiActivity[]> {
    try {
      console.log('CalendarService: Creating activity:', activityData, 'recurring:', recurringOptions);
      
      // Create the main activity first
      const createRequest: CreateActivityRequest = {
        title: activityData.title,
        description: activityData.description,
        activity_type_id: activityData.activity_type_id,
        start_time: activityData.start_time,
        end_time: activityData.end_time,
        status: 'planned',
        metadata: {
          ...activityData.metadata,
          recurring: recurringOptions
        }
      };

      const createdApiActivity = await activityService.createActivity(createRequest);
      const mainUiActivity = convertApiActivityToUi(createdApiActivity);
      
      console.log('CalendarService: Main activity created:', mainUiActivity);
      
      // Handle recurring activities
      if (recurringOptions && recurringOptions.type !== 'none') {
        const startDate = new Date(mainUiActivity.date);
        const recurringActivities = generateRecurringActivities(
          mainUiActivity, 
          recurringOptions, 
          startDate
        );
        
        console.log('CalendarService: Generated recurring activities:', recurringActivities.length);
        
        // Create recurring activities in the database (skip the first one as it's already created)
        const recurringPromises = recurringActivities.slice(1).map(async (activity, index) => {
          try {
            const recurringRequest: CreateActivityRequest = {
              title: activity.name,
              description: activity.note,
              activity_type_id: this.getActivityTypeId(activity.type),
              start_time: `${activity.date}T${activity.startTime}:00.000Z`,
              end_time: activity.endTime ? `${activity.date}T${activity.endTime}:00.000Z` : undefined,
              status: 'planned',
              metadata: {
                importance: activity.importance,
                color: activity.color,
                emoji: activity.emoji,
                recurring: {
                  originalId: mainUiActivity.id,
                  type: recurringOptions.type,
                  interval: recurringOptions.interval,
                  occurrenceNumber: index + 2
                }
              }
            };
            
            const createdRecurring = await activityService.createActivity(recurringRequest);
            console.log(`CalendarService: Created recurring activity ${index + 2}:`, createdRecurring.id);
            return convertApiActivityToUi(createdRecurring);
          } catch (error) {
            console.error(`CalendarService: Error creating recurring activity ${index + 2}:`, error);
            return null;
          }
        });
        
        const allRecurringActivities = await Promise.all(recurringPromises);
        const validRecurringActivities = allRecurringActivities.filter(Boolean) as UiActivity[];
        
        console.log('CalendarService: Created recurring activities:', validRecurringActivities.length);
        return [mainUiActivity, ...validRecurringActivities];
      }
      
      return [mainUiActivity];
    } catch (error) {
      console.error('CalendarService: Error creating activity:', error);
      throw error;
    }
  }

  // Update activity
  async updateActivity(id: number, updates: any): Promise<UiActivity> {
    try {
      console.log('CalendarService: Updating activity:', id, updates);
      
      const updateRequest = {
        title: updates.title,
        description: updates.description,
        status: updates.status,
        metadata: updates.metadata
      };

      const updatedApiActivity = await activityService.updateActivity(id, updateRequest);
      return convertApiActivityToUi(updatedApiActivity);
    } catch (error) {
      console.error('CalendarService: Error updating activity:', error);
      throw error;
    }
  }

  // Delete activity
  async deleteActivity(id: number, deleteOption?: DeleteRecurringOption): Promise<void> {
    try {
      console.log('CalendarService: Deleting activity:', id, deleteOption);
      await activityService.deleteActivity(id);
    } catch (error) {
      console.error('CalendarService: Error deleting activity:', error);
      throw error;
    }
  }

  // Helper methods
  private getActivityTypeId(type: string): number {
    const typeMapping: Record<string, number> = {
      'задача': 1,
      'восстановление': 2,
      'нейтральная': 3,
      'смешанная': 4
    };
    return typeMapping[type] || 1;
  }
}

export const calendarService = new CalendarService();