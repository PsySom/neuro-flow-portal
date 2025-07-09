
import { useState, useEffect, useRef } from 'react';

export const useTimelineLogic = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const timeIndicatorRef = useRef<HTMLDivElement>(null);
  const lastInteractionRef = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkAutoScroll = () => {
      const timeSinceLastInteraction = Date.now() - lastInteractionRef.current;
      if (timeSinceLastInteraction >= 20000) {
        scrollToCurrentTime();
      }
    };

    const autoScrollTimer = setInterval(checkAutoScroll, 5000);
    return () => clearInterval(autoScrollTimer);
  }, []);

  const handleUserInteraction = () => {
    lastInteractionRef.current = Date.now();
  };

  const scrollToCurrentTime = () => {
    if (timeIndicatorRef.current && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        const currentTime = new Date();
        const timePosition = (currentTime.getHours() * 60) + currentTime.getMinutes();
        const containerHeight = scrollContainer.clientHeight;
        const scrollTop = timePosition - containerHeight / 2;
        
        scrollContainer.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: 'smooth'
        });
      }
    }
  };

  return {
    currentTime,
    scrollAreaRef,
    timeIndicatorRef,
    handleUserInteraction,
    scrollToCurrentTime
  };
};
