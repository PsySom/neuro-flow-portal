
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Calendar } from 'lucide-react';

interface AIChatTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const AIChatTabs = ({ activeTab, onTabChange }: AIChatTabsProps) => {
  return (
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
  );
};

export default AIChatTabs;
