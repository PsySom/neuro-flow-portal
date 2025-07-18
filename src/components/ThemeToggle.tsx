
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePersonalization } from '@/contexts/PersonalizationContext';

export function ThemeToggle() {
  const { settings, updateSettings } = usePersonalization();

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
  };

  return (
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
      <span className="sr-only">Переключить тему</span>
      
      {/* Subtle glow effect */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" 
        style={{ 
          background: `linear-gradient(to right, hsl(var(--psybalans-primary) / 0.1), hsl(var(--psybalans-secondary) / 0.1))` 
        }}
      />
    </Button>
  );
}
