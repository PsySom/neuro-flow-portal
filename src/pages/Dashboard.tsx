
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
  const { isAuthenticated } = useSupabaseAuth();
  const [isOnboardingOpen, setIsOnboardingOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) return;
    try {
      const completed = localStorage.getItem('onboarding-completed') === 'true';
      setIsOnboardingOpen(!completed);
    } catch {
      setIsOnboardingOpen(true);
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-24">
      <DashboardHeader />
      <AdaptiveNavigation />
      <DashboardGreeting />
      <DashboardContent />
      <DashboardBottomNav />
      <OnboardingDialog isOpen={isOnboardingOpen} initialStep="welcome" onClose={() => setIsOnboardingOpen(false)} />
    </div>
  );
};

export default Dashboard;
