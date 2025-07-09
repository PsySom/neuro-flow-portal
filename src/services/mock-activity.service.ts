import { 
  Activity, 
  CreateActivityRequest, 
  UpdateActivityRequest,
  ActivityState,
  UpdateActivityStateRequest,
  ActivityType,
  ActivityStatus
} from '../types/api.types';

// Mock activity service for testing in Lovable environment
class MockActivityService {
  private mockActivities: Activity[] = [];
  private mockActivityTypes: ActivityType[] = [
    { id: 1, name: 'задача', description: 'Истощающие активности (дела)', color: '#EF4444', icon: '📋' },
    { id: 2, name: 'восстановление', description: 'Восстанавливающие активности', color: '#10B981', icon: '🌱' },
    { id: 3, name: 'нейтральная', description: 'Нейтральные активности', color: '#3B82F6', icon: '⚪' },
    { id: 4, name: 'смешанная', description: 'Смешанные активности', color: '#F59E0B', icon: '🔄' }
  ];
  private currentId = 1;

  constructor() {
    this.initializeSampleActivities();
  }

  // Initialize with sample activities for today
  private initializeSampleActivities() {
    const today = new Date().toISOString().split('T')[0];
    this.initializeSampleActivitiesForDate(today);
  }

  // Initialize sample activities for a specific date
  private initializeSampleActivitiesForDate(targetDate: string) {
    const sampleActivities: Omit<Activity, 'id' | 'created_at' | 'updated_at'>[] = [
      {
        user_id: 1,
        title: 'Сон',
        description: 'Ночной отдых и восстановление',
        activity_type: this.mockActivityTypes[1], // восстановление
        start_time: `${targetDate}T00:00:00.000Z`,
        end_time: `${targetDate}T08:00:00.000Z`,
        status: 'completed',
        metadata: { importance: 5, color: 'bg-indigo-200', emoji: '😴', needEmoji: '🛌' }
      },
      {
        user_id: 1,
        title: 'Пробуждение',
        description: 'Утреннее пробуждение и начало дня',
        activity_type: this.mockActivityTypes[1], // восстановление
        start_time: `${targetDate}T08:00:00.000Z`,
        end_time: `${targetDate}T08:30:00.000Z`,
        status: 'completed',
        metadata: { importance: 3, color: 'bg-yellow-200', emoji: '☀️', needEmoji: '⚡' }
      },
      {
        user_id: 1,
        title: 'Зарядка',
        description: 'Утренняя физическая активность',
        activity_type: this.mockActivityTypes[1], // восстановление
        start_time: `${targetDate}T08:30:00.000Z`,
        end_time: `${targetDate}T09:30:00.000Z`,
        status: 'completed',
        metadata: { importance: 4, color: 'bg-green-200', emoji: '🏃‍♂️', needEmoji: '💪' }
      },
      {
        user_id: 1,
        title: 'Душ, завтрак, гигиена',
        description: 'Утренние процедуры',
        activity_type: this.mockActivityTypes[1], // восстановление
        start_time: `${targetDate}T09:30:00.000Z`,
        end_time: `${targetDate}T10:00:00.000Z`,
        status: 'completed',
        metadata: { importance: 4, color: 'bg-blue-200', emoji: '🚿', needEmoji: '🧼' }
      },
      {
        user_id: 1,
        title: 'Работа за компьютером',
        description: 'Основная рабочая деятельность',
        activity_type: this.mockActivityTypes[0], // задача
        start_time: `${targetDate}T10:00:00.000Z`,
        end_time: `${targetDate}T13:00:00.000Z`,
        status: 'in_progress',
        metadata: { importance: 5, color: 'bg-red-200', emoji: '💻' }
      },
      {
        user_id: 1,
        title: 'Обед',
        description: 'Обеденный перерыв',
        activity_type: this.mockActivityTypes[1], // восстановление
        start_time: `${targetDate}T13:00:00.000Z`,
        end_time: `${targetDate}T14:00:00.000Z`,
        status: 'planned',
        metadata: { importance: 4, color: 'bg-green-200', emoji: '🍽️', needEmoji: '🥗' }
      },
      {
        user_id: 1,
        title: 'Работа после обеда',
        description: 'Продолжение рабочих задач',
        activity_type: this.mockActivityTypes[0], // задача
        start_time: `${targetDate}T14:00:00.000Z`,
        end_time: `${targetDate}T18:00:00.000Z`,
        status: 'planned',
        metadata: { importance: 4, color: 'bg-red-200', emoji: '📋' }
      },
      {
        user_id: 1,
        title: 'Прогулка',
        description: 'Вечерняя прогулка на свежем воздухе',
        activity_type: this.mockActivityTypes[2], // нейтральная
        start_time: `${targetDate}T18:00:00.000Z`,
        end_time: `${targetDate}T19:00:00.000Z`,
        status: 'planned',
        metadata: { importance: 3, color: 'bg-blue-200', emoji: '🚶‍♂️' }
      },
      {
        user_id: 1,
        title: 'Ужин',
        description: 'Вечерний прием пищи',
        activity_type: this.mockActivityTypes[1], // восстановление
        start_time: `${targetDate}T19:00:00.000Z`,
        end_time: `${targetDate}T20:00:00.000Z`,
        status: 'planned',
        metadata: { importance: 4, color: 'bg-green-200', emoji: '🍽️', needEmoji: '🍲' }
      }
    ];

    // Add sample activities with unique IDs
    sampleActivities.forEach(activity => {
      const completeActivity: Activity = {
        id: this.currentId++,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...activity
      };
      this.mockActivities.push(completeActivity);
    });
  }

  // Get all activities
  async getActivities(date?: string): Promise<Activity[]> {
    await this.simulateDelay();
    
    if (date) {
      return this.mockActivities.filter(activity => {
        const activityDate = activity.start_time.split('T')[0];
        return activityDate === date;
      });
    }
    
    return [...this.mockActivities];
  }

  // Get activities for a specific date range (alias for compatibility)
  async getActivitiesRange(startDate: string, endDate: string): Promise<Activity[]> {
    return this.getActivitiesByDateRange(startDate, endDate);
  }

  // Get activities for a specific date range
  async getActivitiesByDateRange(startDate: string, endDate: string): Promise<Activity[]> {
    await this.simulateDelay();
    
    const filteredActivities = this.mockActivities.filter(activity => {
      const activityDate = activity.start_time.split('T')[0];
      return activityDate >= startDate && activityDate <= endDate;
    });
    
    console.log(`MockActivityService: Found ${filteredActivities.length} activities for range ${startDate} to ${endDate}`);
    return filteredActivities;
  }

  // Get activities for today
  async getTodayActivities(): Promise<Activity[]> {
    await this.simulateDelay();
    
    const today = new Date().toISOString().split('T')[0];
    
    // Filter activities for today
    const todayActivities = this.mockActivities.filter(activity => {
      const activityDate = activity.start_time.split('T')[0];
      return activityDate === today;
    });

    // If no activities for today, initialize sample activities
    if (todayActivities.length === 0) {
      console.log('No activities found for today, initializing sample activities');
      this.initializeSampleActivitiesForDate(today);
      return this.mockActivities.filter(activity => {
        const activityDate = activity.start_time.split('T')[0];
        return activityDate === today;
      });
    }

    return todayActivities;
  }

  // Create new activity with recurring support
  async createActivity(request: CreateActivityRequest): Promise<Activity> {
    await this.simulateDelay();

    const activityType = this.mockActivityTypes.find(t => t.id === request.activity_type_id) || this.mockActivityTypes[0];
    
    const newActivity: Activity = {
      id: this.currentId++,
      user_id: 1,
      title: request.title,
      description: request.description,
      activity_type: activityType,
      start_time: request.start_time,
      end_time: request.end_time,
      status: request.status || 'planned',
      metadata: request.metadata,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.mockActivities.push(newActivity);
    
    // Handle recurring activities
    if (request.metadata?.recurring && request.metadata.recurring.type !== 'none') {
      console.log('MockService: Creating recurring activities:', request.metadata.recurring);
      this.createRecurringActivities(newActivity, request.metadata.recurring);
    }
    
    console.log('MockActivityService: Created activity:', newActivity.id, newActivity.title);
    console.log('MockActivityService: Total activities:', this.mockActivities.length);
    
    return newActivity;
  }

  // Create recurring activities
  private createRecurringActivities(baseActivity: Activity, recurringOptions: any) {
    const { type, interval = 1, maxOccurrences = 10 } = recurringOptions;
    const startDate = new Date(baseActivity.start_time);
    
    for (let i = 1; i < maxOccurrences; i++) {
      const nextDate = new Date(startDate);
      
      switch (type) {
        case 'daily':
          nextDate.setDate(nextDate.getDate() + (i * interval));
          break;
        case 'weekly':
          nextDate.setDate(nextDate.getDate() + (i * 7 * interval));
          break;
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + (i * interval));
          break;
        default:
          return;
      }
      
      const recurringActivity: Activity = {
        ...baseActivity,
        id: this.currentId++,
        start_time: nextDate.toISOString().replace(/\.\d{3}Z$/, '.000Z'),
        end_time: baseActivity.end_time ? 
          new Date(new Date(baseActivity.end_time).getTime() + (nextDate.getTime() - startDate.getTime())).toISOString().replace(/\.\d{3}Z$/, '.000Z') :
          undefined,
        metadata: {
          ...baseActivity.metadata,
          recurring: {
            originalId: baseActivity.id,
            type,
            interval,
            occurrenceNumber: i + 1
          }
        }
      };
      
      this.mockActivities.push(recurringActivity);
      console.log(`MockService: Created recurring activity ${i + 1}:`, recurringActivity.id, nextDate.toISOString().split('T')[0]);
    }
  }

  // Update activity with recurring support
  async updateActivity(id: number, request: UpdateActivityRequest): Promise<Activity> {
    await this.simulateDelay();

    const activityIndex = this.mockActivities.findIndex(a => a.id === id);
    if (activityIndex === -1) {
      throw new Error(`Activity with id ${id} not found`);
    }

    const existingActivity = this.mockActivities[activityIndex];
    const activityType = request.activity_type_id 
      ? this.mockActivityTypes.find(t => t.id === request.activity_type_id) || existingActivity.activity_type
      : existingActivity.activity_type;

    // Merge metadata properly to preserve existing fields
    const mergedMetadata = {
      ...existingActivity.metadata,
      ...request.metadata
    };

    const updatedActivity: Activity = {
      ...existingActivity,
      title: request.title !== undefined ? request.title : existingActivity.title,
      description: request.description !== undefined ? request.description : existingActivity.description,
      activity_type: activityType,
      start_time: request.start_time !== undefined ? request.start_time : existingActivity.start_time,
      end_time: request.end_time !== undefined ? request.end_time : existingActivity.end_time,
      status: request.status !== undefined ? request.status : existingActivity.status,
      metadata: mergedMetadata,
      updated_at: new Date().toISOString()
    };

    this.mockActivities[activityIndex] = updatedActivity;
    
  // Handle recurring activities update
    if (request.metadata?.recurring && request.metadata.recurring.type && request.metadata.recurring.type !== 'none') {
      console.log('MockService: Updating recurring activities:', request.metadata.recurring);
      
      // Delete existing recurring activities for this original activity
      const originalId = existingActivity.metadata?.recurring?.originalId || id;
      this.mockActivities = this.mockActivities.filter(activity => 
        !(activity.metadata?.recurring?.originalId === originalId && activity.id !== id)
      );
      
      // Create new recurring activities
      this.createRecurringActivities(updatedActivity, request.metadata.recurring);
    } else {
      console.log('MockService: No recurring update needed, metadata.recurring:', request.metadata?.recurring);
    }
    
    console.log('MockActivityService: Updated activity:', updatedActivity.id, updatedActivity.title);
    console.log('MockActivityService: Total activities after update:', this.mockActivities.length);
    
    return updatedActivity;
  }

  // Delete activity
  async deleteActivity(id: number): Promise<void> {
    await this.simulateDelay();

    const activityIndex = this.mockActivities.findIndex(a => a.id === id);
    if (activityIndex === -1) {
      throw new Error(`Activity with id ${id} not found`);
    }

    this.mockActivities.splice(activityIndex, 1);
    console.log('MockActivityService: Deleted activity:', id);
    console.log('MockActivityService: Remaining activities:', this.mockActivities.length);
  }

  // Get single activity state 
  async getActivityState(activityId: number): Promise<ActivityState | null> {
    await this.simulateDelay();
    
    const activity = this.mockActivities.find(a => a.id === activityId);
    if (!activity) return null;
    
    return {
      id: `state_${activityId}`,
      activity_id: activityId,
      user_id: 1,
      state: activity.status === 'completed' ? 'completed' : 
             activity.status === 'in_progress' ? 'in_progress' : 'planned',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  // Get activity types
  async getActivityTypes(): Promise<ActivityType[]> {
    await this.simulateDelay();
    return [...this.mockActivityTypes];
  }

  // Get activity states
  async getActivityStates(): Promise<ActivityState[]> {
    await this.simulateDelay();
    const mockStates: ActivityState[] = [
      { 
        id: '1', 
        activity_id: 1,
        user_id: 1,
        state: 'planned',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: '2', 
        activity_id: 1,
        user_id: 1,
        state: 'in_progress',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: '3', 
        activity_id: 1,
        user_id: 1,
        state: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { 
        id: '4', 
        activity_id: 1,
        user_id: 1,
        state: 'skipped',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    return mockStates;
  }

  // Update activity state
  async updateActivityState(id: number, request: UpdateActivityStateRequest): Promise<ActivityState> {
    await this.simulateDelay();

    const activityIndex = this.mockActivities.findIndex(a => a.id === id);
    if (activityIndex === -1) {
      throw new Error(`Activity with id ${id} not found`);
    }

    // Update the activity status based on state
    if (request.state) {
      this.mockActivities[activityIndex] = {
        ...this.mockActivities[activityIndex],
        status: request.state === 'completed' ? 'completed' : 
               request.state === 'in_progress' ? 'in_progress' : 'planned',
        updated_at: new Date().toISOString()
      };
    }

    return {
      id: `state_${id}`,
      activity_id: id,
      user_id: 1,
      state: request.state || 'planned',
      mood_before: request.mood_before,
      mood_after: request.mood_after,
      energy_before: request.energy_before,
      energy_after: request.energy_after,
      notes: request.notes,
      metadata: request.metadata,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  // Simulate network delay
  private async simulateDelay(ms: number = 200): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockActivityService = new MockActivityService();