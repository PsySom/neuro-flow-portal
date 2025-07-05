
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/auth.service';
import { User, LoginRequest, RegisterRequest } from '../types/api.types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check if user is stored in localStorage
    return authService.getStoredUser();
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const isAuthenticated = !!user && authService.isAuthenticated();

  // Query to get current user from server (only if tokens exist)
  const { isLoading: isUserLoading, data: userData, error } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authService.getCurrentUser,
    enabled: authService.isAuthenticated() && !user,
    retry: false,
  });

  // Handle user data when query succeeds or fails
  useEffect(() => {
    if (userData && !user) {
      setUser(userData);
      authService.storeAuthData({
        access_token: '',
        refresh_token: '',
        token_type: 'bearer',
        user: userData
      });
    }
    
    if (error && authService.isAuthenticated()) {
      console.error('Failed to get current user:', error);
      // If getting user fails, clear auth data
      authService.clearAuthData();
      setUser(null);
    }
  }, [userData, error, user]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (authResponse) => {
      authService.storeAuthData(authResponse);
      setUser(authResponse.user);
      queryClient.setQueryData(['auth', 'user'], authResponse.user);
      toast({
        title: "Добро пожаловать!",
        description: "Вы успешно вошли в систему.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка входа",
        description: error.message || "Не удалось войти в систему. Проверьте данные.",
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (authResponse) => {
      authService.storeAuthData(authResponse);
      setUser(authResponse.user);
      queryClient.setQueryData(['auth', 'user'], authResponse.user);
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

  // Login function
  const login = async (credentials: LoginRequest) => {
    await loginMutation.mutateAsync(credentials);
  };

  // Register function  
  const register = async (userData: RegisterRequest) => {
    await registerMutation.mutateAsync(userData);
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    queryClient.clear();
    toast({
      title: "До свидания!",
      description: "Вы успешно вышли из системы.",
    });
  };

  // Initialize auth state on mount
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const isLoading = !isInitialized || isUserLoading || loginMutation.isPending || registerMutation.isPending;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading,
      login, 
      register,
      logout, 
      setUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
