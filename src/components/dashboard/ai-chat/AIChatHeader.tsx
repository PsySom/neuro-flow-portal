
import React from 'react';
import { Sparkles } from 'lucide-react';

const AIChatHeader = () => {
  return (
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
  );
};

export default AIChatHeader;
