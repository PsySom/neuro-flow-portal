
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
        className="relative overflow-hidden group hover:bg-psybalans-muted transition-all duration-300 hover:scale-105 focus-ring rounded-xl"
      >
        <Settings className="w-5 h-5 text-psybalans-primary transition-transform duration-300 group-hover:rotate-90" />
        <span className="sr-only">Настройки</span>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-psybalans-primary/10 to-psybalans-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      </Button>

      <SettingsDialog 
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </>
  );
}
