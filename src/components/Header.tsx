import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Menu, X, Brain, Sparkles, ArrowLeft, LayoutDashboard, Star, Settings, Sun, Moon } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { SettingsButton } from './SettingsButton';
import { useAuth } from '@/contexts/AuthContext';
import { usePersonalization } from '@/contexts/PersonalizationContext';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const { settings, updateSettings, applySettings } = usePersonalization();

  const handleBack = () => {
    window.history.back();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
    applySettings();
  };

  return (
    <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 transition-colors duration-200">
      {/* Основная строка навигации */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="w-8 h-8" style={{ color: `hsl(var(--psybalans-primary))` }} />
              <span 
                className="text-2xl font-bold bg-clip-text text-transparent"
                style={{ 
                  backgroundImage: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))` 
                }}
              >
                PsyBalans
              </span>
            </Link>
          </div>

          {/* Центральная навигация - только на десктопе */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    О проекте
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/knowledge" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    База знаний
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/practices" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    Упражнения и тесты
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Правая часть */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Button 
                  className="text-white"
                  style={{ 
                    background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))` 
                  }}
                  onClick={() => navigate('/dashboard')}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Дашборд
                </Button>
                <Avatar className="w-10 h-10">
                  <AvatarFallback 
                    className="font-medium"
                    style={{ 
                      backgroundColor: `hsl(var(--psybalans-primary) / 0.1)`,
                      color: `hsl(var(--psybalans-primary))`
                    }}
                  >
                    {getUserInitial()}
                  </AvatarFallback>
                </Avatar>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-gray-700 dark:text-gray-300"
                  style={{ 
                    '--hover-color': `hsl(var(--psybalans-primary))`
                  } as React.CSSProperties}
                  onClick={() => navigate('/login')}
                >
                  Вход
                </Button>
                <Button 
                  className="text-white"
                  style={{ 
                    background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))` 
                  }}
                  onClick={() => navigate('/register')}
                >
                  Регистрация
                </Button>
              </>
            )}

            {/* Кнопка звездочки для бокового меню */}
            <Sheet open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen}>
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
                  
                  {/* Поиск */}
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

                  {/* Настройки */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Настройки</label>
                    <SettingsButton />
                  </div>

                  {/* Тема */}
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

            {/* Мобильное меню бургер */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="dark:bg-gray-900">
                  <div className="flex flex-col space-y-6 mt-8">
                    <Link to="/about" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                      О проекте
                    </Link>
                    <Link to="/knowledge" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                      База знаний
                    </Link>
                    <Link to="/practices" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                      Упражнения и тесты
                    </Link>
                    <div className="pt-6 border-t dark:border-gray-700">
                      <div className="space-y-3">
                        {isAuthenticated ? (
                          <>
                            <Button 
                              className="w-full text-white"
                              style={{ 
                                background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))` 
                              }}
                              onClick={() => navigate('/dashboard')}
                            >
                              <LayoutDashboard className="w-4 h-4 mr-2" />
                              Дашборд
                            </Button>
                            <Button variant="outline" className="w-full" onClick={handleLogout}>
                              Выход
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
                              Вход
                            </Button>
                            <Button 
                              className="w-full text-white"
                              style={{ 
                                background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))` 
                              }}
                              onClick={() => navigate('/register')}
                            >
                              Регистрация
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
