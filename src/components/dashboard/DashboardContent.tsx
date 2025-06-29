
import React from 'react';
import AIChatComponent from './AIChatComponent';
import ActivityTimelineComponent from './ActivityTimelineComponent';
import BalanceWheelComponent from './BalanceWheelComponent';
import QuickStatsComponent from './QuickStatsComponent';
import RecommendationsComponent from './RecommendationsComponent';

const DashboardContent = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column - AI Chat (40%) */}
        <div className="lg:col-span-2">
          <AIChatComponent />
        </div>

        {/* Right Column - Activity Timeline (60%) */}
        <div className="lg:col-span-3">
          <ActivityTimelineComponent />
        </div>

        {/* Balance Wheel - Full Width Below */}
        <div className="lg:col-span-5">
          <BalanceWheelComponent />
        </div>

        {/* Quick Stats and Recommendations - Full Width Below */}
        <div className="lg:col-span-5">
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
