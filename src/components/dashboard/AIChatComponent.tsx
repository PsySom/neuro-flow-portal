
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { MessageCircle } from 'lucide-react';
import AIChatTabs from './ai-chat/AIChatTabs';
import FreeChat from './ai-chat/FreeChat';
import AIDiaryStatsTab from './ai-chat/AIDiaryStatsTab';

const AIChatComponent = () => {
  const [activeTab, setActiveTab] = useState('free-chat');

  return (
    <div className="h-[600px] flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="flex-shrink-0 px-6 pt-6">
          {/* Общий заголовок */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold">Свободное общение с AI</span>
              </CardTitle>
            </CardHeader>
          </Card>
          
          <AIChatTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="flex-1 min-h-0 px-6 pb-6">
          <TabsContent value="free-chat" className="h-full mt-4">
            <Card className="h-full flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <FreeChat />
            </Card>
          </TabsContent>

          <TabsContent value="scenarios" className="h-full mt-4">
            <AIDiaryStatsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AIChatComponent;
