
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getGreeting, getUserDisplayName } from '@/utils/dateUtils';

const DashboardGreeting = () => {
  const { user } = useAuth();
  const greeting = getGreeting();
  const userName = getUserDisplayName(user);

  return (
    <div id="dashboard-greeting" className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-gray-200/30 dark:border-gray-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {greeting}, {userName}! 👋
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Как дела? Готовы поработать над своим внутренним балансом?
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardGreeting;
