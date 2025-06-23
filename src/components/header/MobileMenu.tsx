
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const MobileMenu: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
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
  );
};

export default MobileMenu;
