import apiClient, { handleApiError } from './api.client';

export interface LoginCredentials {
  username: string; // API expects email in username field
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirm_password: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  privacy_consent: boolean;
  terms_consent: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: string; // UUID
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  is_active: boolean;
  privacy_consent: boolean;
  terms_consent: boolean;
  privacy_consent_date?: string;
  terms_consent_date?: string;
  created_at: string;
  updated_at: string;
}

class BackendAuthService {
  // Проверить доступность сервера
  async checkServerHealth(): Promise<boolean> {
    try {
      if (import.meta.env.DEV) {
        console.log('🔍 Checking server health at:', 'http://localhost:8000/api/v1');
      }
      const response = await apiClient.get('/health', { timeout: 5000 });
      if (import.meta.env.DEV) {
        console.log('✅ Server is available:', response.status);
      }
      return true;
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('❌ Server is not available:', {
          message: error.message,
          code: error.code,
          baseURL: 'http://localhost:8000/api/v1'
        });
      }
      return false;
    }
  }

  // Регистрация
  async register(userData: RegisterData): Promise<User> {
    try {
      if (import.meta.env.DEV) {
        console.log('🔄 Registering user:', userData.email);
      }
      
      const response = await apiClient.post<User>('/auth/register', {
        email: userData.email,
        password: userData.password,
        confirm_password: userData.confirm_password,
        first_name: userData.first_name,
        last_name: userData.last_name,
        full_name: userData.full_name,
        privacy_consent: userData.privacy_consent,
        terms_consent: userData.terms_consent
      });
      
      if (import.meta.env.DEV) {
        console.log('✅ Registration successful');
      }
      return response.data;
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('❌ Registration failed:', error);
      }
      throw handleApiError(error);
    }
  }

  // Вход
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      if (import.meta.env.DEV) {
        console.log('🔄 Logging in user:', credentials.username);
        console.log('📤 Login data being sent:', {
          username: credentials.username,
          password: '***hidden***'
        });
      }
      
      const response = await apiClient.post<AuthResponse>('/auth/login-json', {
        username: credentials.username,
        password: credentials.password
      });
      
      if (import.meta.env.DEV) {
        console.log('✅ Login successful:', response.data);
      }
      
      // Сохраняем токены
      this.storeAuthTokens(response.data);
      
      return response.data;
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('❌ Login failed:', error);
        console.error('🔍 Error details:', {
          code: error.code,
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      }
      throw handleApiError(error);
    }
  }

  // Получить текущего пользователя
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/user/me');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Обновить профиль пользователя
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>('/user/me', userData);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Выход
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.warn('Logout request failed:', error);
      }
    } finally {
      this.clearAuthData();
    }
  }

  // Сохранить токены аутентификации
  storeAuthTokens(authResponse: AuthResponse): void {
    localStorage.setItem('access_token', authResponse.access_token);
    localStorage.setItem('refresh_token', authResponse.refresh_token);
  }

  // Сохранить данные пользователя отдельно
  storeUserData(user: User): void {
    localStorage.setItem('auth-user', JSON.stringify(user));
  }

  // Получить сохраненного пользователя
  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem('auth-user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error parsing stored user data:', error);
      }
      return null;
    }
  }

  // Получить токены
  getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem('access_token'),
      refreshToken: localStorage.getItem('refresh_token'),
    };
  }

  // Очистить данные аутентификации
  clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth-user');
  }

  // Проверить аутентификацию
  isAuthenticated(): boolean {
    const tokens = this.getStoredTokens();
    return !!(tokens.accessToken && tokens.refreshToken);
  }
}

export const backendAuthService = new BackendAuthService();
export default backendAuthService;
