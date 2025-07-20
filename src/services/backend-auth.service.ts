import apiClient, { handleApiError } from './api.client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    full_name?: string;
  };
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
}

class BackendAuthService {
  // Проверить доступность сервера
  async checkServerHealth(): Promise<boolean> {
    try {
      console.log('🔍 Checking server health at:', 'http://localhost:8000/api/v1');
      const response = await apiClient.get('/health', { timeout: 5000 });
      console.log('✅ Server is available:', response.status);
      return true;
    } catch (error: any) {
      console.error('❌ Server is not available:', {
        message: error.message,
        code: error.code,
        baseURL: 'http://localhost:8000/api/v1'
      });
      return false;
    }
  }

  // Регистрация
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      console.log('🔄 Registering user:', userData.email);
      
      const response = await apiClient.post<AuthResponse>('/user/register', {
        email: userData.email,
        password: userData.password,
        full_name: userData.full_name
      });
      
      console.log('✅ Registration successful');
      return response.data;
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      throw handleApiError(error);
    }
  }

  // Вход
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔄 Logging in user:', credentials.email);
      console.log('📤 Login data being sent:', {
        email: credentials.email,
        password: '***hidden***'
      });
      
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      console.log('✅ Login successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      console.error('🔍 Error details:', {
        code: error.code,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
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
      console.warn('Logout request failed:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // Сохранить данные аутентификации
  storeAuthData(authResponse: AuthResponse): void {
    localStorage.setItem('access_token', authResponse.access_token);
    localStorage.setItem('refresh_token', authResponse.refresh_token);
    localStorage.setItem('auth-user', JSON.stringify(authResponse.user));
  }

  // Получить сохраненного пользователя
  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem('auth-user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
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