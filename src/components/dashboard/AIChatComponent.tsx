import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Calendar, Sparkles } from 'lucide-react';
import AIDiaryScenarios from './AIDiaryScenarios';
import FreeChat from './FreeChat';

const AIChatComponent = () => {
  const [activeTab, setActiveTab] = useState('free-chat');

  return (
    <div className="h-[600px] flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="flex-shrink-0 px-6 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))`
                }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">AI Дневник</span>
            </div>
          </div>

          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="free-chat" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Свободное общение</span>
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Сценарии рефлексии</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 px-6 pb-6">
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
