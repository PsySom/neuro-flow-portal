import apiClient, { handleApiError } from './api.client';
import { User } from './backend-auth.service';

export interface UserStats {
  total: number;
  confirmed: number;
  active: number;
  unconfirmed: number;
}

class BackendUserService {
  // Получить всех пользователей (для админов)
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>('/user/admin/users');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Получить пользователя по ID
  async getUser(userId: number): Promise<User> {
    try {
      const response = await apiClient.get<User>(`/user/admin/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Удалить пользователя
  async deleteUser(userId: number): Promise<void> {
    try {
      await apiClient.delete(`/user/admin/users/${userId}`);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Активировать пользователя
  async activateUser(userId: number): Promise<User> {
    try {
      const response = await apiClient.put<User>(`/user/admin/users/${userId}/activate`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Деактивировать пользователя
  async deactivateUser(userId: number): Promise<User> {
    try {
      const response = await apiClient.put<User>(`/user/admin/users/${userId}/deactivate`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Проверить существование пользователя по email
  async checkUserExists(email: string): Promise<boolean> {
    try {
      // Предполагаем, что есть эндпоинт для проверки
      // Если нет, можно реализовать через получение всех пользователей
      const users = await this.getAllUsers();
      return users.some(user => user.email === email);
    } catch (error: any) {
      console.error('Error checking user existence:', error);
      return false;
    }
  }

  // Получить статистику пользователей
  async getUserStats(): Promise<UserStats> {
    try {
      const users = await this.getAllUsers();
      return {
        total: users.length,
        confirmed: users.length, // Все пользователи считаются подтвержденными
        active: users.length,
        unconfirmed: 0
      };
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Тестовый маршрут
  async testRoute(): Promise<any> {
    try {
      const response = await apiClient.get('/user/test');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

export const backendUserService = new BackendUserService();
export default backendUserService;