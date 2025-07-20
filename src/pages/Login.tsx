
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useBackendAuth } from '@/contexts/BackendAuthContext';
import { backendAuthService } from '@/services/backend-auth.service';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useBackendAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email && password) {
      setIsLoading(true);
      
      try {
        // Сначала проверим доступность сервера
        console.log('🔍 Checking server availability before login...');
        const isServerAvailable = await backendAuthService.checkServerHealth();
        
        if (!isServerAvailable) {
          toast({
            title: "Ошибка подключения",
            description: "Сервер недоступен по адресу http://localhost:8000. Убедитесь, что бэкенд запущен.",
            variant: "destructive",
          });
          return;
        }
        
        console.log('✅ Server is available, attempting login...');
        await login({ email, password });
        
        toast({
          title: "Успешный вход",
          description: "Добро пожаловать!",
        });
        
        // Redirect to dashboard after successful login
        navigate('/dashboard');
      } catch (error: any) {
        console.error('Login failed:', error);
        toast({
          title: "Ошибка входа",
          description: error.message || "Проверьте email и пароль",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <Header />
      <main className="max-w-md mx-auto px-4 py-16">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Добро пожаловать обратно!</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input 
                  type="email" 
                  placeholder="ваш@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Пароль</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500"
                disabled={isLoading}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </Button>
            </form>
            <div className="text-center text-sm text-gray-600 mt-4">
              Нет аккаунта?{' '}
              <Link to="/register" className="text-emerald-600 hover:text-emerald-700">
                Зарегистрируйтесь
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
