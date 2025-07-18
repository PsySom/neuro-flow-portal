
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import AIChatHeader from './ai-chat/AIChatHeader';
import AIChatTabs from './ai-chat/AIChatTabs';
import FreeChat from './ai-chat/FreeChat';
import AIDiaryScenarios from './AIDiaryScenarios';

const AIChatComponent = () => {
  const [activeTab, setActiveTab] = useState('free-chat');

  return (
    <div className="h-[600px] flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="flex-shrink-0 px-6 pt-6">
          <AIChatHeader />
          <AIChatTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="flex-1 min-h-0 px-6 pb-6">
          <TabsContent value="free-chat" className="h-full mt-4">
            <Card className="h-full flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <FreeChat />
            </Card>
          </TabsContent>

          <TabsContent value="scenarios" className="h-full mt-4">
            <AIDiaryScenarios />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AIChatComponent;
