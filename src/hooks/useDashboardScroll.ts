
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useDashboardScroll = () => {
  const location = useLocation();

  useEffect(() => {
    const greetingElement = document.getElementById('dashboard-greeting');
    if (greetingElement) {
      greetingElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);
};
