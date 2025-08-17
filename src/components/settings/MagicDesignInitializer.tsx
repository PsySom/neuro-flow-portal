import React, { useEffect } from 'react';
import { initializeMagicEffects } from '@/utils/magicEffects';

export const MagicDesignInitializer: React.FC = () => {
  useEffect(() => {
    // Initialize Magic Design System from localStorage
    const savedScheme = localStorage.getItem('magic-design-scheme') || 'scheme1';
    const savedIntensity = localStorage.getItem('magic-design-intensity') || 'max';
    const savedDark = localStorage.getItem('magic-design-dark') === 'true';
    
    // Apply to body
    document.body.setAttribute('data-scheme', savedScheme);
    document.body.setAttribute('data-intensity', savedIntensity);
    
    // Apply theme
    if (savedDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply default variables if not set
    if (!document.documentElement.style.getPropertyValue('--radius')) {
      document.documentElement.style.setProperty('--radius', '1.3rem');
      document.documentElement.style.setProperty('--shadow-distance', '5px');
      document.documentElement.style.setProperty('--shadow-blur', '4px');
      document.documentElement.style.setProperty('--shadow-opacity', '0.18');
    }
    
    // Enable default effects
    document.body.classList.add('particle-effects', 'border-glow');
    
    // Initialize interactive effects
    setTimeout(() => {
      initializeMagicEffects();
    }, 100);
  }, []);

  return null;
};

export default MagicDesignInitializer;