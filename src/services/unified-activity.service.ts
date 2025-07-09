import { Activity as UiActivity } from '@/contexts/ActivitiesContext';
import { Activity as ApiActivity, CreateActivityRequest, UpdateActivityRequest } from '@/types/api.types';
import { activityService } from './activity.service';
import { convertApiActivityToUi, convertUiActivityToApi } from '@/utils/activityAdapter';
import { 
  RecurringActivityOptions, 
  generateRecurringActivities, 
  DeleteRecurringOption 
} from '@/components/calendar/utils/recurringUtils';

class UnifiedActivityService {
  // Create activity with recurring support
  async createActivity(
    uiActivity: UiActivity, 
    recurringOptions?: RecurringActivityOptions
  ): Promise<UiActivity[]> {
    try {
      // Convert UI activity to API format
      const apiRequest = convertUiActivityToApi(uiActivity, this.getActivityTypeId(uiActivity.type));
      
      // Ensure status is properly typed
      const createRequest: CreateActivityRequest = {
        ...apiRequest,
        status: uiActivity.completed ? 'completed' : 'planned'
      };
      
      // Create the main activity
      const createdApiActivity = await activityService.createActivity(createRequest);
      const createdUiActivity = convertApiActivityToUi(createdApiActivity);
      
      // Handle recurring activities
      if (recurringOptions && recurringOptions.type !== 'none') {
        const startDate = new Date(createdUiActivity.date);
        const recurringActivities = generateRecurringActivities(
          createdUiActivity, 
          recurringOptions, 
          startDate
        );
        
        // Create recurring activities in the database
        const recurringPromises = recurringActivities.slice(1).map(async (activity) => {
          const recurringApiRequest = convertUiActivityToApi(activity, this.getActivityTypeId(activity.type));
          const createRequest: CreateActivityRequest = {
            ...recurringApiRequest,
            status: activity.completed ? 'completed' : 'planned'
          };
          const createdRecurring = await activityService.createActivity(createRequest);
          return convertApiActivityToUi(createdRecurring);
        });
        
        const allRecurringActivities = await Promise.all(recurringPromises);
        return [createdUiActivity, ...allRecurringActivities];
      }
      
      return [createdUiActivity];
    } catch (error) {
      console.error('Error creating activity with recurring:', error);
      throw error;
    }
  }

  // Update activity with recurring support
  async updateActivity(
    id: number, 
    updates: Partial<UiActivity>, 
    recurringOptions?: RecurringActivityOptions
  ): Promise<UiActivity> {
    try {
      const updateRequest: UpdateActivityRequest = {
        title: updates.name,
        description: updates.note,
        activity_type_id: updates.type ? this.getActivityTypeId(updates.type) : undefined,
        start_time: updates.date && updates.startTime ? 
          `${updates.date}T${this.convertTimeToISO(updates.startTime)}` : undefined,
        end_time: updates.date && updates.endTime ? 
          `${updates.date}T${this.convertTimeToISO(updates.endTime)}` : undefined,
        status: updates.completed ? 'completed' : 'planned',
        metadata: {
          importance: updates.importance,
          color: updates.color,
          emoji: updates.emoji,
          recurring: updates.recurring,
        }
      };

      const updatedApiActivity = await activityService.updateActivity(id, updateRequest);
      return convertApiActivityToUi(updatedApiActivity);
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  }

  // Delete activity with recurring support
  async deleteActivity(id: number, deleteOption?: DeleteRecurringOption): Promise<void> {
    try {
      await activityService.deleteActivity(id);
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  }

  // Get activities for date
  async getActivitiesForDate(date: string): Promise<UiActivity[]> {
    try {
      const apiActivities = await activityService.getActivities(date);
      return apiActivities.map(convertApiActivityToUi);
    } catch (error) {
      console.error('Error fetching activities for date:', error);
      return [];
    }
  }

  // Get activities for date range
  async getActivitiesForDateRange(startDate: string, endDate: string): Promise<UiActivity[]> {
    try {
      const apiActivities = await activityService.getActivitiesRange(startDate, endDate);
      return apiActivities.map(convertApiActivityToUi);
    } catch (error) {
      console.error('Error fetching activities for date range:', error);
      return [];
    }
  }

  // Toggle activity completion
  async toggleActivityCompletion(id: number): Promise<UiActivity> {
    try {
      // First get the current activity
      const activities = await activityService.getActivities();
      const currentActivity = activities.find(a => a.id === id);
      
      if (!currentActivity) {
        throw new Error('Activity not found');
      }

      const newStatus = currentActivity.status === 'completed' ? 'planned' : 'completed';
      const updatedApiActivity = await activityService.updateActivity(id, { status: newStatus });
      return convertApiActivityToUi(updatedApiActivity);
    } catch (error) {
      console.error('Error toggling activity completion:', error);
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

  private convertTimeToISO(timeString: string): string {
    return `${timeString}:00.000Z`;
  }
}

export const unifiedActivityService = new UnifiedActivityService();