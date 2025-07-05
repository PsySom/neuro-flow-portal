import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  RefreshTokenRequest,
  User 
} from '../types/api.types';

// Mock authentication service for testing in Lovable environment
class MockAuthService {
  private mockUsers: Array<{ id: number; email: string; password: string; full_name: string }> = [];
  private currentId = 1;

  // Simulate API delay
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    await this.delay(500); // Simulate network delay
    
    const user = this.mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (!user) {
      throw {
        message: 'Неверный email или пароль',
        status: 401
      };
    }

    const mockUser: User = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return {
      access_token: `mock_access_token_${user.id}_${Date.now()}`,
      refresh_token: `mock_refresh_token_${user.id}_${Date.now()}`,
      token_type: 'bearer',
      user: mockUser
    };
  }

  // Mock register
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    await this.delay(500); // Simulate network delay
    
    // Check if user already exists
    const existingUser = this.mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw {
        message: 'Пользователь с таким email уже существует',
        status: 400
      };
    }

    // Create new user
    const newUser = {
      id: this.currentId++,
      email: userData.email,
      password: userData.password,
      full_name: userData.full_name
    };
    
    this.mockUsers.push(newUser);
    
    const mockUser: User = {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return {
      access_token: `mock_access_token_${newUser.id}_${Date.now()}`,
      refresh_token: `mock_refresh_token_${newUser.id}_${Date.now()}`,
      token_type: 'bearer',
      user: mockUser
    };
  }

  // Mock refresh token
  async refreshToken(refreshTokenData: RefreshTokenRequest): Promise<AuthResponse> {
    await this.delay(300);
    
    // Simple mock - just return new tokens
    return {
      access_token: `mock_access_token_refresh_${Date.now()}`,
      refresh_token: `mock_refresh_token_refresh_${Date.now()}`,
      token_type: 'bearer',
      user: {
        id: 1,
        email: 'mock@example.com',
        full_name: 'Mock User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };
  }

  // Mock get current user
  async getCurrentUser(): Promise<User> {
    await this.delay(200);
    
    return {
      id: 1,
      email: 'mock@example.com',
      full_name: 'Mock User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  // Store auth data locally (same as real service)
  storeAuthData(authResponse: AuthResponse): void {
    localStorage.setItem('access_token', authResponse.access_token);
    localStorage.setItem('refresh_token', authResponse.refresh_token);
    localStorage.setItem('auth-user', JSON.stringify(authResponse.user));
  }

  // Get stored user data (same as real service)
  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem('auth-user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  // Get stored tokens (same as real service)
  getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem('access_token'),
      refreshToken: localStorage.getItem('refresh_token'),
    };
  }

  // Clear all auth data (same as real service)
  clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth-user');
  }

  // Check if user is authenticated (same as real service)
  isAuthenticated(): boolean {
    const tokens = this.getStoredTokens();
    return !!(tokens.accessToken && tokens.refreshToken);
  }

  // Mock logout
  async logout(): Promise<void> {
    await this.delay(200);
    this.clearAuthData();
  }
}

export const mockAuthService = new MockAuthService();
export default mockAuthService;