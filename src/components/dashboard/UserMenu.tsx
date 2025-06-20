
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search, Settings, Palette, Sun, Moon, Monitor } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePersonalization, AccentColor, Theme } from '@/contexts/PersonalizationContext';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { settings, updateSettings, applySettings } = usePersonalization();

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const accentColors: { value: AccentColor; label: string; color: string }[] = [
    { value: 'emerald', label: 'Изумрудный', color: 'bg-emerald-500' },
    { value: 'blue', label: 'Синий', color: 'bg-blue-500' },
    { value: 'purple', label: 'Фиолетовый', color: 'bg-purple-500' },
    { value: 'pink', label: 'Розовый', color: 'bg-pink-500' },
    { value: 'orange', label: 'Оранжевый', color: 'bg-orange-500' },
    { value: 'teal', label: 'Бирюзовый', color: 'bg-teal-500' },
  ];

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Светлая', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Тёмная', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: 'Системная', icon: <Monitor className="w-4 h-4" /> },
  ];

  const handleColorChange = (color: AccentColor) => {
    updateSettings({ accentColor: color });
    applySettings();
  };

  const handleThemeChange = (theme: Theme) => {
    updateSettings({ theme: theme });
    applySettings();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto">
          <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-psybalans-primary/20 transition-all">
            <AvatarFallback 
              className="font-medium text-white"
              style={{ 
                backgroundColor: `hsl(var(--psybalans-primary))`,
              }}
            >
              {getUserInitial()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-80 dark:bg-gray-900">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback 
                className="font-medium text-white text-sm"
                style={{ 
                  backgroundColor: `hsl(var(--psybalans-primary))`,
                }}
              >
                {getUserInitial()}
              </AvatarFallback>
            </Avatar>
            <span>Меню пользователя</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col space-y-6 mt-8">
          {/* Поиск */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Search className="w-4 h-4" />
              <span>Поиск</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <Input 
                placeholder="Поиск по дашборду..." 
                className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>
          </div>

          <Separator />

          {/* Настройки пользователя */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Settings className="w-4 h-4" />
              <span>Настройки пользователя</span>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => console.log('Открыть настройки пользователя')}
            >
              Профиль и аккаунт
            </Button>
          </div>

          <Separator />

          {/* Настройки цвета */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Palette className="w-4 h-4" />
              <span>Цветовая схема</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {accentColors.map((color) => (
                <Button
                  key={color.value}
                  variant={settings.accentColor === color.value ? "default" : "outline"}
                  size="sm"
                  className="flex items-center space-x-1 h-10"
                  onClick={() => handleColorChange(color.value)}
                  style={settings.accentColor === color.value ? {
                    backgroundColor: `hsl(var(--psybalans-primary))`,
                    borderColor: `hsl(var(--psybalans-primary))`,
                    color: 'white'
                  } : {}}
                >
                  <div className={`w-3 h-3 rounded-full ${color.color}`} />
                  <span className="text-xs">{color.label.slice(0, 3)}</span>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Тема */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Sun className="w-4 h-4" />
              <span>Тема</span>
            </div>
            <div className="space-y-2">
              {themes.map((theme) => (
                <Button
                  key={theme.value}
                  variant={settings.theme === theme.value ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start h-10"
                  onClick={() => handleThemeChange(theme.value)}
                  style={settings.theme === theme.value ? {
                    backgroundColor: `hsl(var(--psybalans-primary))`,
                    borderColor: `hsl(var(--psybalans-primary))`,
                    color: 'white'
                  } : {}}
                >
                  <div className="flex items-center space-x-2">
                    {theme.icon}
                    <span>{theme.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserMenu;
