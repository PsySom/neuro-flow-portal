import apiClient, { handleApiError } from './api.client';
import mockAuthService from './mock-auth.service';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  RefreshTokenRequest,
  User 
} from '../types/api.types';

// Use mock service for development in Lovable environment
const USE_MOCK = false;

class AuthService {
  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    if (USE_MOCK) {
      return mockAuthService.login(credentials);
    }
    
    try {
      // Adapt frontend format to backend format
      const backendCredentials = {
        username: credentials.email,
        password: credentials.password
      };
      const response = await apiClient.post<AuthResponse>('/auth/login', backendCredentials);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    if (USE_MOCK) {
      return mockAuthService.register(userData);
    }
    
    try {
      // Adapt frontend format to backend format
      const backendUserData = {
        username: userData.email,
        password: userData.password,
        full_name: userData.full_name
      };
      const response = await apiClient.post<AuthResponse>('/auth/register', backendUserData);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Refresh access token
  async refreshToken(refreshTokenData: RefreshTokenRequest): Promise<AuthResponse> {
    if (USE_MOCK) {
      return mockAuthService.refreshToken(refreshTokenData);
    }
    
    try {
      const response = await apiClient.post<AuthResponse>('/auth/refresh', refreshTokenData);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    if (USE_MOCK) {
      return mockAuthService.getCurrentUser();
    }
    
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Logout user
  async logout(): Promise<void> {
    if (USE_MOCK) {
      return mockAuthService.logout();
    }
    
    try {
      await apiClient.post('/auth/logout');
    } catch (error: any) {
      // Even if logout fails on server, we should clear local storage
      console.warn('Logout request failed:', error);
    } finally {
      // Clear local storage regardless of server response
      this.clearAuthData();
    }
  }

  // Store auth data locally
  storeAuthData(authResponse: AuthResponse): void {
    localStorage.setItem('access_token', authResponse.access_token);
    localStorage.setItem('refresh_token', authResponse.refresh_token);
    localStorage.setItem('auth-user', JSON.stringify(authResponse.user));
  }

  // Get stored user data
  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem('auth-user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  // Get stored tokens
  getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem('access_token'),
      refreshToken: localStorage.getItem('refresh_token'),
    };
  }

  // Clear all auth data
  clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth-user');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const tokens = this.getStoredTokens();
    return !!(tokens.accessToken && tokens.refreshToken);
  }
}

export const authService = new AuthService();
export default authService;