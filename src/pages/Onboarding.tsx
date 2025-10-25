import React, { useEffect, useState } from 'react';
import OnboardingContainer from '@/components/onboarding/OnboardingContainer';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const OnboardingPage: React.FC = () => {
  const { isAuthenticated, user, isLoading: authLoading } = useSupabaseAuth();
  const navigate = useNavigate();
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [savedStep, setSavedStep] = useState<number | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

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

  // Check if user is authenticated and onboarding status
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (authLoading) return;
      
      // Redirect to auth if not authenticated
      if (!isAuthenticated || !user) {
        navigate('/auth?mode=signup');
        return;
      }

      try {
        // Check if onboarding already completed in profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.onboarding_completed) {
          // Check if we're forcing onboarding (e.g., after signup)
          const forceOnboarding = localStorage.getItem('onboarding-force');
          if (!forceOnboarding) {
            navigate('/dashboard');
            return;
          }
          localStorage.removeItem('onboarding-force');
        }

        // Check for saved progress in localStorage
        const savedData = localStorage.getItem('onboarding-data');
        if (savedData) {
          try {
            const data = JSON.parse(savedData);
            const step = data.currentStep || 1;
            if (step > 1) {
              setSavedStep(step);
              setShowRestoreDialog(true);
            }
          } catch (e) {
            console.error('Failed to parse saved onboarding data:', e);
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setCheckingProfile(false);
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated, user, authLoading, navigate]);

  const handleComplete = () => {
    // Сохраняем флаг завершения онбординга
    localStorage.setItem('onboarding-completed', 'true');
    // Переходим на дашборд
    navigate('/dashboard');
  };

  const handleSkip = () => {
    // Пользователь пропустил онбординг
    localStorage.setItem('onboarding-completed', 'true');
    localStorage.removeItem('onboarding-data');
    localStorage.removeItem('onboarding-force');
    // Если авторизован - на дашборд, иначе на главную
    navigate(isAuthenticated ? '/dashboard' : '/');
  };

  const handleRestoreContinue = () => {
    setShowRestoreDialog(false);
    // Progress will be restored from localStorage by the hook
  };

  const handleRestoreStart = () => {
    localStorage.removeItem('onboarding-data');
    setShowRestoreDialog(false);
  };

  // Show loading while checking auth and profile
  if (authLoading || checkingProfile) {
    return (
      <div className="onboarding-container">
        <div className="onboarding-loading" />
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <OnboardingContainer onComplete={handleComplete} onSkip={handleSkip} />
      
      {/* Restore Progress Dialog */}
      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Продолжить онбординг?</AlertDialogTitle>
            <AlertDialogDescription>
              Мы нашли незавершённый онбординг на шаге {savedStep}. Хотите продолжить с этого момента или начать заново?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleRestoreStart}>
              Начать заново
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleRestoreContinue}>
              Продолжить с шага {savedStep}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OnboardingPage;
