
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardGreeting from '@/components/dashboard/DashboardGreeting';
import DashboardContent from '@/components/dashboard/DashboardContent';
import DashboardBottomNav from '@/components/dashboard/DashboardBottomNav';
import AdaptiveNavigation from '@/components/navigation/AdaptiveNavigation';
import { useDashboardScroll } from '@/hooks/useDashboardScroll';
import OnboardingDialog from '@/components/onboarding/OnboardingDialog';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const Dashboard = () => {
  useDashboardScroll();
  const { isAuthenticated, user } = useSupabaseAuth();
  const [isOnboardingOpen, setIsOnboardingOpen] = React.useState(false);
  const [onboardingChecked, setOnboardingChecked] = React.useState(false);

  React.useEffect(() => {
    if (!isAuthenticated || !user || onboardingChecked) return;
    
    const checkOnboardingStatus = async () => {
      try {
        const localCompleted = localStorage.getItem('onboarding-completed') === 'true';
        const forced = localStorage.getItem('onboarding-force') === 'true';
        
        // Для существующих пользователей (созданы более 1 минуты назад) не показываем онбординг
        const userCreatedAt = new Date(user.created_at);
        const now = new Date();
        const isExistingUser = (now.getTime() - userCreatedAt.getTime()) > 60000; // 1 минута
        
        console.log('Checking onboarding status:', {
          localCompleted,
          forced,
          isExistingUser,
          userCreatedAt: userCreatedAt.toISOString(),
          userAge: now.getTime() - userCreatedAt.getTime()
        });
        
        // Показываем онбординг для новых пользователей или если явно запрошен
        const shouldShowOnboarding = forced || (!localCompleted && !isExistingUser);
        
        setIsOnboardingOpen(shouldShowOnboarding);
        setOnboardingChecked(true);
        
        // Если пользователь существующий и не было принудительного показа, помечаем онбординг как завершенный
        if (isExistingUser && !localCompleted && !forced) {
          localStorage.setItem('onboarding-completed', 'true');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsOnboardingOpen(false);
        setOnboardingChecked(true);
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated, user, onboardingChecked]);

  const handleOnboardingClose = () => {
    setIsOnboardingOpen(false);
    // Помечаем онбординг как завершенный при закрытии и убираем флаг принудительного показа
    try {
      localStorage.setItem('onboarding-completed', 'true');
      localStorage.removeItem('onboarding-force');
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-24">
      <DashboardHeader />
      <AdaptiveNavigation />
      <DashboardGreeting />
      <DashboardContent />
      <DashboardBottomNav />
      {onboardingChecked && (
        <OnboardingDialog 
          isOpen={isOnboardingOpen} 
          initialStep="welcome" 
          onClose={handleOnboardingClose} 
        />
      )}
    </div>
  );
};

export default Dashboard;
