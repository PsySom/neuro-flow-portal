
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function Auth() {
  const { signIn, signUp, isAuthenticated } = useSupabaseAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      if (mode === 'login') {
        // Валидация только для обычного входа
        if (!email || !password) {
          toast({ title: 'Заполните поля', description: 'Введите email и пароль для входа.', variant: 'destructive' });
          return;
        }
        console.log('Attempting login...');
        await signIn(email, password);
        // Перенаправление выполнится в signIn
      } else {
        // Регистрация: после неё запускаем онбординг (после подтверждения email)
        if (!email || !password) {
          toast({ title: 'Заполните поля', description: 'Введите email и пароль для регистрации.', variant: 'destructive' });
          return;
        }
        console.log('Attempting signup...');
        await signUp(email, password, fullName);
        // Помечаем намерение пройти онбординг и не переключаемся на окно входа
        try {
          localStorage.setItem('onboarding-completed', 'false');
          localStorage.setItem('onboarding-force', 'true');
        } catch {}
        toast({ title: 'Подтвердите email', description: 'После подтверждения автоматически откроется онбординг.' });
        // Направляем пользователя к панели — после подтверждения email он окажется здесь и увидит онбординг
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const msg = err?.message?.includes('For security purposes')
        ? 'Слишком частые запросы. Повторите через ~1 минуту.'
        : err?.message || 'Произошла ошибка. Попробуйте снова.';
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
        options: { emailRedirectTo: redirectUrl }
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
              {mode === 'login' ? 'Войдите в аккаунт PsyBalans' : 'Создайте аккаунт PsyBalans'}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
              </div>
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
                <button className="underline" onClick={() => setMode('signup')}>Нет аккаунта? Регистрация</button>
              ) : (
                <button className="underline" onClick={() => setMode('login')}>Уже есть аккаунт? Войти</button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
