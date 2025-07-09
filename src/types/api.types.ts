// User types
export interface User {
  id: number;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications_enabled: boolean;
  timezone?: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// Activity types
export interface Activity {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  activity_type: ActivityType;
  start_time: string;
  end_time?: string;
  status: ActivityStatus;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ActivityType {
  id: number;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export type ActivityStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'skipped';

export interface CreateActivityRequest {
  title: string;
  description?: string;
  activity_type_id: number;
  start_time: string;
  end_time?: string;
  status?: ActivityStatus;
  metadata?: Record<string, any>;
}

export interface UpdateActivityRequest {
  title?: string;
  description?: string;
  activity_type_id?: number;
  start_time?: string;
  end_time?: string;
  status?: ActivityStatus;
  metadata?: Record<string, any>;
}

// Activity State types
export interface ActivityState {
  id: string;
  activity_id: number;
  user_id: number;
  state: 'planned' | 'in_progress' | 'completed' | 'skipped';
  mood_before?: number;
  mood_after?: number;
  energy_before?: number;
  energy_after?: number;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UpdateActivityStateRequest {
  state?: ActivityState['state'];
  mood_before?: number;
  mood_after?: number;
  energy_before?: number;
  energy_after?: number;
  notes?: string;
  metadata?: Record<string, any>;
}

// Diary types
export interface DiaryEntry {
  id: string;
  user_id: number;
  type: DiaryType;
  content: Record<string, any>;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type DiaryType = 'morning' | 'midday' | 'evening' | 'mood' | 'thoughts' | 'procrastination' | 'self_esteem' | 'ocd' | 'depression_care';

export interface CreateDiaryEntryRequest {
  type: DiaryType;
  content: Record<string, any>;
  metadata?: Record<string, any>;
}

// Calendar types
export interface CalendarEvent {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  all_day: boolean;
  recurrence_rule?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateCalendarEventRequest {
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  all_day?: boolean;
  recurrence_rule?: string;
  metadata?: Record<string, any>;
}

// Recommendations types
export interface Recommendation {
  id: string;
  user_id: number;
  type: 'practice' | 'activity' | 'exercise';
  title: string;
  description: string;
  reason: string;
  metadata?: Record<string, any>;
  priority: number;
  expires_at?: string;
  created_at: string;
}

export interface Practice {
  id: number;
  title: string;
  description: string;
  category: string;
  duration_minutes: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  benefits: string[];
  metadata?: Record<string, any>;
}

// API response wrapper
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  detail?: string;
  errors?: ValidationError[];
}