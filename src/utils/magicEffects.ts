// Mouse tracking utility for spotlight effect
export const initializeSpotlightEffect = () => {
  const elements = document.querySelectorAll('.spotlight-effect');
  
  elements.forEach(element => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      (element as HTMLElement).style.setProperty('--mouse-x', `${x}%`);
      (element as HTMLElement).style.setProperty('--mouse-y', `${y}%`);
    };
    
    element.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup function
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
    };
  });
};

// Magnetism effect utility
export const initializeMagnetismEffect = () => {
  const elements = document.querySelectorAll('.magnetism');
  
  elements.forEach(element => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * 0.1;
      const deltaY = (e.clientY - centerY) * 0.1;
      
      (element as HTMLElement).style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };
    
    const handleMouseLeave = () => {
      (element as HTMLElement).style.transform = 'translate(0px, 0px)';
    };
    
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
  });
};

// Initialize all effects
export const initializeMagicEffects = () => {
  initializeSpotlightEffect();
  initializeMagnetismEffect();
};

export default initializeMagicEffects;