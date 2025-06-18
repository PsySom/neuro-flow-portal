
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import SettingsDialog from './settings/SettingsDialog';

export function SettingsButton() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsSettingsOpen(true)}
        className="relative overflow-hidden group hover:bg-emerald-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-xl"
      >
        <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover:rotate-90" />
        <span className="sr-only">Настройки</span>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      </Button>

      <SettingsDialog 
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </>
  );
}
