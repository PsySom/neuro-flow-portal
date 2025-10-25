import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Sparkles, Mail, Lock, Loader2 } from 'lucide-react';
import { OnboardingData } from '../hooks/useOnboardingState';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/hooks/use-toast';

interface Step1WelcomeProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const Step1Welcome: React.FC<Step1WelcomeProps> = ({ onNext }) => {
  const { signUp, isAuthenticated } = useSupabaseAuth();
  const [showRegistration, setShowRegistration] = useState(!isAuthenticated);
  const [isLoading, setIsLoading] = useState(false);
  
  // Registration form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; terms?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; terms?: string } = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email обязателен';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Неверный формат email';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Пароль обязателен';
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    // Terms validation
    if (!agreeToTerms) {
      newErrors.terms = 'Необходимо согласиться с политикой';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      await signUp(email, password);
      toast({
        title: 'Регистрация успешна!',
        description: 'Добро пожаловать в Mental Balance',
      });
      setShowRegistration(false);
    } catch (error: any) {
      toast({
        title: 'Ошибка регистрации',
        description: error.message || 'Попробуйте еще раз',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setErrors({ email: 'Введите email для Magic Link' });
      return;
    }
    
    toast({
      title: 'Magic Link отправлен',
      description: 'Проверьте вашу почту',
    });
  };

  // Экран А: Регистрация
  if (showRegistration) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Создайте аккаунт</h2>
          <p className="text-muted-foreground">
            Начните свой путь к балансу
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: undefined }));
                }}
                className="pl-10"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: undefined }));
                }}
                className="pl-10"
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => {
                  setAgreeToTerms(checked as boolean);
                  setErrors(prev => ({ ...prev, terms: undefined }));
                }}
              />
              <Label
                htmlFor="terms"
                className="text-sm font-normal leading-tight cursor-pointer"
              >
                Я согласен с{' '}
                <a href="/privacy" className="text-primary underline">
                  политикой конфиденциальности
                </a>
              </Label>
            </div>
            {errors.terms && (
              <p className="text-sm text-destructive">{errors.terms}</p>
            )}
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Регистрация...
              </>
            ) : (
              'Начать путь'
            )}
          </Button>
        </form>

        {/* Magic Link */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">или</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleMagicLink}
          disabled={isLoading}
        >
          <Mail className="w-4 h-4 mr-2" />
          Войти через Magic Link
        </Button>

        {/* Login link */}
        <p className="text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{' '}
          <a href="/auth" className="text-primary underline font-medium">
            Войти
          </a>
        </p>
      </div>
    );
  }

  // Экран Б: Приветствие
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Heart className="w-10 h-10 text-primary" />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold">
          👋 Добро пожаловать!
        </h1>
        <p className="text-lg text-muted-foreground">
          Мы создадим персональный план всего за 2 минуты.<br />
          Вы всегда сможете изменить настройки позже.
        </p>
      </div>

      <div className="space-y-4 py-6">
        <div className="flex items-start gap-3 text-left">
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium">Персональные рекомендации</p>
            <p className="text-sm text-muted-foreground">
              На основе ваших ответов мы подберем практики специально для вас
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-left">
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium">Отслеживание прогресса</p>
            <p className="text-sm text-muted-foreground">
              Наблюдайте за изменениями вашего состояния день за днем
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-left">
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium">Научно обоснованные методы</p>
            <p className="text-sm text-muted-foreground">
              Все практики основаны на когнитивно-поведенческой терапии
            </p>
          </div>
        </div>
      </div>

      <Button
        size="lg"
        onClick={onNext}
        className="w-full"
      >
        Продолжить
      </Button>

      <button
        onClick={onNext}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
      >
        Пропустить и начать
      </button>
    </div>
  );
};

export default Step1Welcome;
