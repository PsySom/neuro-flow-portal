
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, Brain, Sparkles } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const Mascot = () => (
    <div className="relative group cursor-pointer">
      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
        <Sparkles className="w-6 h-6 text-white" />
      </div>
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Привет! Я ваш AI-помощник 🌱
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                PsyBalans
              </span>
            </Link>
          </div>

          {/* Десктоп навигация */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/about" className="text-gray-700 hover:text-emerald-600 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    О проекте
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/knowledge" className="text-gray-700 hover:text-emerald-600 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    База знаний
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/practices" className="text-gray-700 hover:text-emerald-600 transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    Практики
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Поиск */}
            <div className="relative">
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="hover:bg-emerald-50"
                >
                  <Search className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Кнопки авторизации */}
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-emerald-600"
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
            >
              <Search className="w-5 h-5" />
            </Button>
            <Mascot />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-6 mt-8">
                  <Link to="/about" className="text-lg font-medium text-gray-700 hover:text-emerald-600">
                    О проекте
                  </Link>
                  <Link to="/knowledge" className="text-lg font-medium text-gray-700 hover:text-emerald-600">
                    База знаний
                  </Link>
                  <Link to="/practices" className="text-lg font-medium text-gray-700 hover:text-emerald-600">
                    Практики
                  </Link>
                  <div className="pt-6 border-t">
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
                        Вход
                      </Button>
                      <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500" onClick={() => navigate('/register')}>
                        Регистрация
                      </Button>
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
