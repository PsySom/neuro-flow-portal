import React, { useEffect } from 'react';
import OnboardingContainer from '@/components/onboarding/OnboardingContainer';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';

const OnboardingPage: React.FC = () => {
  const { isAuthenticated } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // SEO basics
    document.title = 'Онбординг — Добро пожаловать | Mental Balance';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Добро пожаловать в Mental Balance: начните персональный онбординг с экрана приветствия.');
    const linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const href = window.location.origin + '/onboarding';
    if (linkCanonical) linkCanonical.href = href; else {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      l.setAttribute('href', href);
      document.head.appendChild(l);
    }
  }, []);

  const handleComplete = () => {
    // Сохраняем флаг завершения онбординга
    localStorage.setItem('onboarding-completed', 'true');
    // Переходим на дашборд
    navigate('/dashboard');
  };

  const handleSkip = () => {
    // Пользователь пропустил онбординг
    localStorage.setItem('onboarding-completed', 'true');
    // Если авторизован - на дашборд, иначе на главную
    navigate(isAuthenticated ? '/dashboard' : '/');
  };

  return (
    <OnboardingContainer onComplete={handleComplete} onSkip={handleSkip} />
  );
};

export default OnboardingPage;
