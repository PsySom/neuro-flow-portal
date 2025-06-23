
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Star, Search, Sun, Moon } from 'lucide-react';
import { SettingsButton } from '../SettingsButton';
import { usePersonalization } from '@/contexts/PersonalizationContext';

interface SideMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onOpenChange }) => {
  const { settings, updateSettings, applySettings } = usePersonalization();

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
    applySettings();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative overflow-hidden group hover:bg-emerald-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-xl"
        >
          <Star className="w-5 h-5" style={{ color: `hsl(var(--psybalans-primary))` }} />
          <div 
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" 
            style={{ 
              background: `linear-gradient(to right, hsl(var(--psybalans-primary) / 0.1), hsl(var(--psybalans-secondary) / 0.1))` 
            }}
          />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80 dark:bg-gray-900">
        <div className="flex flex-col space-y-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Дополнительно</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Поиск</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <Input 
                placeholder="Поиск практик, статей..." 
                className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Настройки</label>
            <SettingsButton />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Тема</label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {settings.theme === 'light' ? 'Светлая' : settings.theme === 'dark' ? 'Темная' : 'Системная'}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="relative overflow-hidden group hover:bg-emerald-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-xl"
              >
                <div className="relative w-5 h-5">
                  <Sun 
                    className="absolute inset-0 w-5 h-5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" 
                    style={{ color: `hsl(var(--psybalans-primary))` }}
                  />
                  <Moon 
                    className="absolute inset-0 w-5 h-5 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" 
                    style={{ color: `hsl(var(--psybalans-primary))` }}
                  />
                </div>
                <div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" 
                  style={{ 
                    background: `linear-gradient(to right, hsl(var(--psybalans-primary) / 0.1), hsl(var(--psybalans-secondary) / 0.1))` 
                  }}
                />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
