import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Extend the request config to include retry flag
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// API configuration - PsyBalanceV2 backend
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Warn if using insecure API over HTTPS context
if (typeof window !== 'undefined') {
  const isHttps = window.location.protocol === 'https:';
  const isInsecureApi = API_BASE_URL.startsWith('http://') && !API_BASE_URL.includes('localhost');
  if (isHttps && isInsecureApi) {
    console.warn('Insecure API_BASE_URL over HTTP detected. Switch to HTTPS for production.');
  }
}

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      try {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
        });
      } catch {}
    }
    
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('🚨 Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      try {
        console.log('✅ API Response:', {
          status: response.status,
          url: response.config.url,
        });
      } catch {}
    }
    return response;
  },
  async (error: AxiosError) => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      try {
        console.error('❌ API Error:', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
          code: error.code,
        });
      } catch {}
    }
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Handle 401 errors and attempt token refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refresh_token: refreshToken
          });

          const { access_token, refresh_token: newRefreshToken } = response.data;
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', newRefreshToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            (originalRequest.headers as any)['Authorization'] = `Bearer ${access_token}`;
          } else {
            (originalRequest as any).headers = { Authorization: `Bearer ${access_token}` };
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('auth-user');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  detail?: string;
  status: number;
}

// Error handling utility
export const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    const responseData = error.response.data as any;
    return {
      message: responseData?.message || 'Server error occurred',
      detail: responseData?.detail,
      status: error.response.status,
    };
  } else if (error.request) {
    return {
      message: 'Network error - please check your connection',
      status: 0,
    };
  } else {
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
    };
  }
};

export default apiClient;