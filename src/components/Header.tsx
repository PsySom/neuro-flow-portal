
import React, { useState } from 'react';
import Logo from './header/Logo';
import Navigation from './header/Navigation';
import UserActions from './header/UserActions';
import SideMenu from './header/SideMenu';
import MobileMenu from './header/MobileMenu';

const Header = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Logo />
          </div>

          <Navigation />

          <div className="flex items-center space-x-3">
            <UserActions />
            <SideMenu isOpen={isSideMenuOpen} onOpenChange={setIsSideMenuOpen} />
            <MobileMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
