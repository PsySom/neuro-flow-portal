import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import backendAuthService, { LoginCredentials, RegisterData, User } from '../services/backend-auth.service';
import { useToast } from '@/hooks/use-toast';

interface BackendAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const BackendAuthContext = createContext<BackendAuthContextType | undefined>(undefined);

export function BackendAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    return backendAuthService.getStoredUser();
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const isAuthenticated = !!user && backendAuthService.isAuthenticated();

  // Получить текущего пользователя с сервера
  const { isLoading: isUserLoading, data: userData, error } = useQuery({
    queryKey: ['backend-auth', 'user'],
    queryFn: backendAuthService.getCurrentUser,
    enabled: backendAuthService.isAuthenticated() && !user,
    retry: false,
  });

  // Обработка данных пользователя
  useEffect(() => {
    if (userData && !user) {
      setUser(userData);
    }
    
    if (error && backendAuthService.isAuthenticated()) {
      console.error('Failed to get current user:', error);
      backendAuthService.clearAuthData();
      setUser(null);
    }
  }, [userData, error, user]);

  // Мутация входа
  const loginMutation = useMutation({
    mutationFn: backendAuthService.login,
    onSuccess: async (authResponse) => {
      // Сначала получаем данные пользователя
      try {
        const userData = await backendAuthService.getCurrentUser();
        backendAuthService.storeUserData(userData);
        setUser(userData);
        queryClient.setQueryData(['backend-auth', 'user'], userData);
        toast({
          title: "Добро пожаловать!",
          description: "Вы успешно вошли в систему.",
        });
      } catch (error) {
        console.error('Failed to get user data after login:', error);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка входа",
        description: error.message || "Не удалось войти в систему. Проверьте данные.",
        variant: "destructive",
      });
    },
  });

  // Мутация регистрации
  const registerMutation = useMutation({
    mutationFn: backendAuthService.register,
    onSuccess: (userData) => {
      backendAuthService.storeUserData(userData);
      setUser(userData);
      queryClient.setQueryData(['backend-auth', 'user'], userData);
      toast({
        title: "Регистрация завершена!",
        description: "Добро пожаловать в PsyBalans!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка регистрации",
        description: error.message || "Не удалось создать аккаунт. Попробуйте еще раз.",
        variant: "destructive",
      });
    },
  });

  // Функция входа
  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  // Функция регистрации
  const register = async (userData: RegisterData) => {
    await registerMutation.mutateAsync(userData);
  };

  // Функция выхода
  const logout = () => {
    backendAuthService.logout();
    setUser(null);
    queryClient.clear();
    toast({
      title: "До свидания!",
      description: "Вы успешно вышли из системы.",
    });
  };

  // Инициализация
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const isLoading = !isInitialized || isUserLoading || loginMutation.isPending || registerMutation.isPending;

  return (
    <BackendAuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading,
      login, 
      register,
      logout, 
      setUser 
    }}>
      {children}
    </BackendAuthContext.Provider>
  );
}

export function useBackendAuth() {
  const context = useContext(BackendAuthContext);
  if (!context) {
    throw new Error('useBackendAuth must be used within BackendAuthProvider');
  }
  return context;
}