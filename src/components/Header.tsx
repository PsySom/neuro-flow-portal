
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Menu, X, Brain, Sparkles, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { SettingsButton } from './SettingsButton';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

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

  const Mascot = () => (
    <div className="relative group cursor-pointer">
      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
        <Sparkles className="w-6 h-6 text-white" />
      </div>
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Привет! Я ваш AI-помощник 🌱
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                PsyBalans
              </span>
            </Link>
          </div>

          {/* Десктоп навигация */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    Главная
                  </Link>
                </NavigationMenuItem>
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
                    Практики
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Поиск и настройки */}
            <div className="flex items-center space-x-2">
              {isSearchOpen ? (
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Поиск практик, статей..."
                    className="w-64 animate-scale-in"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(true)}
                    className="hover:bg-emerald-50 dark:hover:bg-gray-800"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                  <SettingsButton />
                  <ThemeToggle />
                </>
              )}
            </div>

            {/* Кнопки авторизации или навигации */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                    onClick={() => navigate('/dashboard')}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Дашборд
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-gray-700 dark:text-gray-300"
                    onClick={handleLogout}
                  >
                    Выход
                  </Button>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 font-medium">
                      {getUserInitial()}
                    </AvatarFallback>
                  </Avatar>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                    onClick={() => navigate('/login')}
                  >
                    Вход
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                    onClick={() => navigate('/register')}
                  >
                    Регистрация
                  </Button>
                </>
              )}
            </div>

            {/* Маскот */}
            <Mascot />
          </div>

          {/* Мобильное меню */}
          <div className="md:hidden flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:bg-emerald-50 dark:hover:bg-gray-800"
            >
              <Search className="w-5 h-5" />
            </Button>
            <SettingsButton />
            <ThemeToggle />
            {isAuthenticated && (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                  {getUserInitial()}
                </AvatarFallback>
              </Avatar>
            )}
            <Mascot />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="dark:bg-gray-900">
                <div className="flex flex-col space-y-6 mt-8">
                  <Link to="/" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                    Главная
                  </Link>
                  <Link to="/about" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                    О проекте
                  </Link>
                  <Link to="/knowledge" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                    База знаний
                  </Link>
                  <Link to="/practices" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                    Практики
                  </Link>
                  <div className="pt-6 border-t dark:border-gray-700">
                    <div className="space-y-3">
                      {isAuthenticated ? (
                        <>
                          <Button variant="outline" className="w-full" onClick={handleBack}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Назад
                          </Button>
                          <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500" onClick={() => navigate('/dashboard')}>
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
                          <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500" onClick={() => navigate('/register')}>
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

        {/* Мобильный поиск */}
        {isSearchOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            <Input placeholder="Поиск практик, статей..." />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
