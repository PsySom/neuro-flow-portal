
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';
import { PasswordStrength, validatePassword } from '@/components/ui/password-strength';
import { validateEmail, validatePasswordSecurity, checkRateLimit } from '@/utils/securityValidation';
import { securityLogger } from '@/utils/securityLogger';
import { Shield } from 'lucide-react';

export default function Auth() {
  const { signIn, signUp, isAuthenticated } = useSupabaseAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup'>(() => {
    const param = new URLSearchParams(window.location.search).get('mode');
    return param === 'signup' ? 'signup' : 'login';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupConfigError, setSignupConfigError] = useState<string | null>(null);
  const location = useLocation();

  // Синхронизация режима формы с query-параметром
  React.useEffect(() => {
    const param = new URLSearchParams(location.search).get('mode');
    setMode(param === 'signup' ? 'signup' : 'login');
  }, [location.search]);

  React.useEffect(() => {
    // Если пользователь уже аутентифицирован, перенаправляем на dashboard
    if (isAuthenticated) {
      console.log('User already authenticated, redirecting to dashboard');
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // Rate limiting check
    const rateLimitKey = mode === 'login' ? 'login' : 'signup';
    if (!checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
      securityLogger.logRateLimit(email, rateLimitKey);
      toast({ 
        title: 'Слишком частые попытки', 
        description: 'Подождите 15 минут перед следующей попыткой.', 
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);
    setSignupConfigError(null);

    // Enhanced validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      toast({ title: 'Ошибка валидации', description: emailValidation.message, variant: 'destructive' });
      setLoading(false);
      return;
    }

    const passwordValidation = validatePasswordSecurity(password);
    if (mode === 'signup' && !passwordValidation.isValid) {
      toast({ title: 'Ошибка пароля', description: passwordValidation.message, variant: 'destructive' });
      setLoading(false);
      return;
    }

    securityLogger.logAuthAttempt(email, { mode, userAgent: navigator.userAgent });

    try {
      if (mode === 'login') {
        if (!email || !password) {
          toast({ title: 'Заполните поля', description: 'Введите email и пароль для входа.', variant: 'destructive' });
          return;
        }
        console.log('Attempting login...');
        await signIn(email, password);
        securityLogger.logAuthSuccess(email, 'pending'); // userId will be updated by auth context
      } else {
        if (!email || !password) {
          toast({ title: 'Заполните поля', description: 'Введите email и пароль для регистрации.', variant: 'destructive' });
          return;
        }
        if (password !== confirmPassword) {
          toast({ title: 'Пароли не совпадают', description: 'Повторите пароль корректно.', variant: 'destructive' });
          return;
        }
        
        // Check password strength for signup
        const { score } = validatePassword(password);
        if (score < 3) {
          toast({ 
            title: 'Слабый пароль', 
            description: 'Для безопасности используйте более надёжный пароль.', 
            variant: 'destructive' 
          });
          return;
        }

        console.log('Attempting signup...');
        await signUp(email, password, fullName);
        securityLogger.logAuthSuccess(email, 'pending');
        
        try {
          localStorage.setItem('onboarding-completed', 'false');
          localStorage.setItem('onboarding-force', 'true');
        } catch {}
        window.location.href = '/onboarding';
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      securityLogger.logAuthFailure(email, err?.message || 'Unknown error', { mode, code: err?.code });
      
      let msg = err?.message || 'Произошла ошибка. Попробуйте снова.';
      if (err?.code === 'email_provider_disabled' || msg.includes('Email signups are disabled')) {
        msg = 'Регистрация по email отключена в настройках Supabase.';
        setSignupConfigError('Откройте в Supabase: Authentication → Providers → Email → включите Email provider и Allow email signups. Также проверьте: Authentication → URL Configuration (Site URL и Redirect URLs).');
      }
      if (msg.includes('For security purposes')) {
        msg = 'Слишком частые запросы. Повторите через ~1 минуту.';
      }
      if (msg.includes('Invalid login credentials')) {
        msg = 'Неверный email или пароль.';
      }
      toast({ title: 'Ошибка', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const onMagicLink = async () => {
    if (!email) {
      toast({ title: 'Введите email', description: 'Укажите email, чтобы отправить ссылку для входа.', variant: 'destructive' });
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` }
      });
      if (error) throw error;
      toast({ title: 'Письмо отправлено', description: 'Проверьте почту и перейдите по ссылке для входа.' });
    } catch (err: any) {
      const msg = err?.message || 'Не удалось отправить ссылку.';
      toast({ title: 'Ошибка', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Не показываем форму, если пользователь уже аутентифицирован
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg">Перенаправление на панель управления...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>{mode === 'login' ? 'Вход' : 'Регистрация'}</CardTitle>
            <CardDescription>
              {mode === 'login' ? 'Войдите в аккаунт PsyBalans' : 'Создайте аккаунт PsyBalans. После регистрации вы сразу перейдёте к онбордингу, подтверждение email можно сделать позже.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode === 'signup' && signupConfigError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Регистрация по email отключена</AlertTitle>
                <AlertDescription>{signupConfigError}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={onSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Имя</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
              )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {mode === 'signup' && password && (
                  <PasswordStrength password={password} className="mt-2" />
                )}
              </div>
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Повторите пароль</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  {password && confirmPassword && password !== confirmPassword && (
                    <div className="flex items-center gap-2 text-xs text-destructive">
                      <Shield className="h-3 w-3" />
                      <span>Пароли не совпадают</span>
                    </div>
                  )}
                </div>
              )}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Подождите...' : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')}
              </Button>
              {mode === 'login' && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading || !email}
                  onClick={onMagicLink}
                  className="w-full mt-2"
                >
                  Войти по ссылке на email
                </Button>
              )}
            </form>
            <div className="text-sm mt-4 text-center">
              {mode === 'login' ? (
                <button
                  className="underline"
                  onClick={() => {
                    setMode('signup');
                    try { window.history.replaceState(null, '', `${window.location.pathname}?mode=signup`); } catch {}
                  }}
                >
                  Нет аккаунта? Регистрация
                </button>
              ) : (
                <button
                  className="underline"
                  onClick={() => {
                    setMode('login');
                    try { window.history.replaceState(null, '', `${window.location.pathname}?mode=login`); } catch {}
                  }}
                >
                  Уже есть аккаунт? Войти
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
