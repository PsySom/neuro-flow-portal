
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useDashboardScroll = () => {
  const location = useLocation();

  useEffect(() => {
    // Only scroll on initial load, not on navigation
    const hasScrolled = sessionStorage.getItem('dashboard-scrolled');
    
    if (!hasScrolled) {
      const greetingElement = document.getElementById('dashboard-greeting');
      if (greetingElement) {
        greetingElement.scrollIntoView({ behavior: 'smooth' });
        sessionStorage.setItem('dashboard-scrolled', 'true');
      }
    }
  }, []); // Remove location dependency to prevent re-scrolling
};
