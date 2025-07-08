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
    { id: 1, name: 'Работа', description: 'Рабочие задачи', color: '#3B82F6', icon: '💼' },
    { id: 2, name: 'Спорт', description: 'Физическая активность', color: '#10B981', icon: '🏃‍♂️' },
    { id: 3, name: 'Отдых', description: 'Время для восстановления', color: '#8B5CF6', icon: '🛋️' },
    { id: 4, name: 'Обучение', description: 'Образовательная активность', color: '#F59E0B', icon: '📚' },
    { id: 5, name: 'Общение', description: 'Социальная активность', color: '#EF4444', icon: '👥' }
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
        title: 'Утренняя зарядка',
        description: 'Комплекс упражнений для бодрого начала дня',
        activity_type: this.mockActivityTypes[1], // Спорт
        start_time: `${targetDate}T07:00:00.000Z`,
        end_time: `${targetDate}T07:30:00.000Z`,
        status: 'completed',
        metadata: { importance: 4, color: '#10B981', emoji: '🏃‍♂️' }
      },
      {
        user_id: 1,
        title: 'Планирование дня',
        description: 'Определение приоритетов и задач на день',
        activity_type: this.mockActivityTypes[0], // Работа
        start_time: `${targetDate}T09:00:00.000Z`,
        end_time: `${targetDate}T09:30:00.000Z`,
        status: 'completed',
        metadata: { importance: 5, color: '#3B82F6', emoji: '📋' }
      },
      {
        user_id: 1,
        title: 'Работа над проектом',
        description: 'Разработка новой функциональности',
        activity_type: this.mockActivityTypes[0], // Работа
        start_time: `${targetDate}T10:00:00.000Z`,
        end_time: `${targetDate}T12:00:00.000Z`,
        status: 'in_progress',
        metadata: { importance: 5, color: '#3B82F6', emoji: '💻' }
      },
      {
        user_id: 1,
        title: 'Обеденный перерыв',
        description: 'Время для восстановления и питания',
        activity_type: this.mockActivityTypes[2], // Отдых
        start_time: `${targetDate}T13:00:00.000Z`,
        end_time: `${targetDate}T14:00:00.000Z`,
        status: 'planned',
        metadata: { importance: 3, color: '#8B5CF6', emoji: '🍽️' }
      },
      {
        user_id: 1,
        title: 'Изучение новых технологий',
        description: 'Чтение документации и практика',
        activity_type: this.mockActivityTypes[3], // Обучение
        start_time: `${targetDate}T15:00:00.000Z`,
        end_time: `${targetDate}T16:30:00.000Z`,
        status: 'planned',
        metadata: { importance: 4, color: '#F59E0B', emoji: '📚' }
      },
      {
        user_id: 1,
        title: 'Встреча с друзьями',
        description: 'Вечерняя прогулка и общение',
        activity_type: this.mockActivityTypes[4], // Общение
        start_time: `${targetDate}T19:00:00.000Z`,
        end_time: `${targetDate}T21:00:00.000Z`,
        status: 'planned',
        metadata: { importance: 4, color: '#EF4444', emoji: '👥' }
      }
    ];

    // Remove any existing activities for this date first
    this.mockActivities = this.mockActivities.filter(activity => 
      !activity.start_time.startsWith(targetDate)
    );

    // Add new activities for the target date
    const newActivities = sampleActivities.map(activity => ({
      ...activity,
      id: this.currentId++,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    this.mockActivities.push(...newActivities);
  }

  // Simulate API delay
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get activities for a specific date
  async getActivities(date?: string): Promise<Activity[]> {
    await this.delay(300);
    
    if (!date) {
      return this.mockActivities;
    }
    
    // If requesting today's activities but we don't have any for today, generate them
    const today = new Date().toISOString().split('T')[0];
    const activitiesForDate = this.mockActivities.filter(activity => 
      activity.start_time.startsWith(date)
    );
    
    // If no activities for the requested date and it's today, regenerate sample activities
    if (activitiesForDate.length === 0 && date === today) {
      this.initializeSampleActivitiesForDate(date);
      return this.mockActivities.filter(activity => 
        activity.start_time.startsWith(date)
      );
    }
    
    return activitiesForDate;
  }

  // Get activities for date range
  async getActivitiesRange(startDate: string, endDate: string): Promise<Activity[]> {
    await this.delay(300);
    
    return this.mockActivities.filter(activity => {
      const activityDate = activity.start_time.split('T')[0];
      return activityDate >= startDate && activityDate <= endDate;
    });
  }

  // Create new activity
  async createActivity(data: CreateActivityRequest): Promise<Activity> {
    await this.delay(500);
    
    const activityType = this.mockActivityTypes.find(type => type.id === data.activity_type_id) 
      || this.mockActivityTypes[0];
    
    const newActivity: Activity = {
      id: this.currentId++,
      user_id: 1,
      title: data.title,
      description: data.description,
      activity_type: activityType,
      start_time: data.start_time,
      end_time: data.end_time,
      status: 'planned',
      metadata: data.metadata,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.mockActivities.push(newActivity);
    return newActivity;
  }

  // Update activity
  async updateActivity(id: number, data: UpdateActivityRequest): Promise<Activity> {
    await this.delay(300);
    
    const activityIndex = this.mockActivities.findIndex(a => a.id === id);
    if (activityIndex === -1) {
      throw new Error('Activity not found');
    }
    
    const activity = this.mockActivities[activityIndex];
    const activityType = data.activity_type_id 
      ? this.mockActivityTypes.find(type => type.id === data.activity_type_id) || activity.activity_type
      : activity.activity_type;
    
    const updatedActivity: Activity = {
      ...activity,
      title: data.title ?? activity.title,
      description: data.description ?? activity.description,
      activity_type: activityType,
      start_time: data.start_time ?? activity.start_time,
      end_time: data.end_time ?? activity.end_time,
      status: data.status ?? activity.status,
      metadata: data.metadata ?? activity.metadata,
      updated_at: new Date().toISOString()
    };
    
    this.mockActivities[activityIndex] = updatedActivity;
    return updatedActivity;
  }

  // Delete activity
  async deleteActivity(id: number): Promise<void> {
    await this.delay(300);
    
    const activityIndex = this.mockActivities.findIndex(a => a.id === id);
    if (activityIndex === -1) {
      throw new Error('Activity not found');
    }
    
    this.mockActivities.splice(activityIndex, 1);
  }

  // Get activity types
  async getActivityTypes(): Promise<ActivityType[]> {
    await this.delay(200);
    return this.mockActivityTypes;
  }

  // Get activity state
  async getActivityState(activityId: number): Promise<ActivityState | null> {
    await this.delay(200);
    
    // Mock activity state - in real app this would be from database
    return {
      id: `state_${activityId}`,
      activity_id: activityId,
      user_id: 1,
      state: 'planned',
      mood_before: 7,
      mood_after: undefined,
      energy_before: 8,
      energy_after: undefined,
      notes: '',
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  // Update activity state
  async updateActivityState(activityId: number, data: UpdateActivityStateRequest): Promise<ActivityState> {
    await this.delay(300);
    
    return {
      id: `state_${activityId}`,
      activity_id: activityId,
      user_id: 1,
      state: data.state || 'planned',
      mood_before: data.mood_before,
      mood_after: data.mood_after,
      energy_before: data.energy_before,
      energy_after: data.energy_after,
      notes: data.notes,
      metadata: data.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  // Get today's activities
  async getTodayActivities(): Promise<Activity[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getActivities(today);
  }
}

export const mockActivityService = new MockActivityService();
export default mockActivityService;