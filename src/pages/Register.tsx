
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingDialog from '../components/onboarding/OnboardingDialog';

const Register = () => {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email && password && name) {
      setIsLoading(true);
      
      try {
        // Simulate registration
        const newUser = {
          id: Date.now().toString(),
          email,
          name
        };
        
        setUser(newUser);
        localStorage.setItem('auth-user', JSON.stringify(newUser));
        
        // Open onboarding dialog
        setIsOnboardingOpen(true);
      } catch (error) {
        console.error('Registration failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOnboardingComplete = () => {
    setIsOnboardingOpen(false);
    navigate('/dashboard');
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
            <CardTitle className="text-2xl">Присоединяйтесь к PsyBalans</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Имя</label>
                <Input 
                  placeholder="Ваше имя" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                {isLoading ? 'Создание аккаунта...' : 'Создать аккаунт'}
              </Button>
            </form>
            <div className="text-center text-sm text-gray-600 mt-4">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700">
                Войдите
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />

      <OnboardingDialog
        isOpen={isOnboardingOpen}
        onClose={handleOnboardingComplete}
      />
    </div>
  );
};

export default Register;
