
import React from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
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
  );
};

export default Navigation;
