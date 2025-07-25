
import React from 'react';
import AIChatComponent from './AIChatComponent';
import ActivityTimelineComponent from './ActivityTimelineComponent';
import BalanceWheelComponent from './BalanceWheelComponent';
import QuickStatsComponent from './QuickStatsComponent';
import RecommendationsComponent from './RecommendationsComponent';
import ActiveDiariesComponent from './ActiveDiariesComponent';
import RemindersComponent from './RemindersComponent';

const DashboardContent = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Top Row - AI Chat and Active Diaries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Chat - 2/3 width, left aligned */}
          <div className="lg:col-span-2">
            <AIChatComponent />
          </div>
          
          {/* Active Diaries - 1/3 width */}
          <div className="lg:col-span-1">
            <ActiveDiariesComponent />
          </div>
        </div>

        {/* Bottom Row - Activity Timeline and Reminders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Timeline - 2/3 width, left aligned */}
          <div className="lg:col-span-2">
            <ActivityTimelineComponent />
          </div>
          
          {/* Reminders - 1/3 width */}
          <div className="lg:col-span-1">
            <RemindersComponent />
          </div>
        </div>

        {/* Balance Wheel - Full Width Below */}
        <div className="w-full">
          <BalanceWheelComponent />
        </div>

        {/* Quick Stats and Recommendations - Full Width Below */}
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="lg:col-span-1">
              <QuickStatsComponent />
            </div>

            {/* Recommendations */}
            <div className="lg:col-span-2">
              <RecommendationsComponent />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;
