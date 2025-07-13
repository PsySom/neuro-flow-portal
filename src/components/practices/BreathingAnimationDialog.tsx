import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface BreathingAnimationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BreathingAnimationDialog: React.FC<BreathingAnimationDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [isActive, setIsActive] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const phaseRef = useRef(0);
  const tickRef = useRef(1);
  const inPauseRef = useRef(false);
  const cycleRef = useRef(1);

  const phases = [
    {name: 'Вдох через нос', duration: 4, startR: 80, endR: 150},
    {name: 'Задержите дыхание', duration: 7, startR: 150, endR: 150},
    {name: 'Выдох через рот', duration: 8, startR: 150, endR: 80},
  ];
  const pauseSeconds = 1;
  const pauseBetweenCycles = 3;
  const maxCycles = 5;

  const animateRadius = useCallback((start: number, end: number, duration: number) => {
    const circle = document.getElementById('breatheCircle');
    if (!circle) return;

    const startTime = performance.now();
    
    const step = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      if (elapsed < duration && isActive) {
        const progress = elapsed / duration;
        const r = start + (end - start) * progress;
        circle.setAttribute('r', r.toString());
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        circle.setAttribute('r', end.toString());
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(step);
  }, [isActive]);

  const nextStep = useCallback(() => {
    console.log('nextStep called', { 
      isActive, 
      phase: phaseRef.current, 
      tick: tickRef.current, 
      inPause: inPauseRef.current,
      cycle: cycleRef.current 
    });

    if (!isActive) {
      console.log('Animation not active, stopping');
      return;
    }
    
    const phaseText = document.getElementById('phaseText');
    const countText = document.getElementById('countText');
    const circle = document.getElementById('breatheCircle');
    const doneText = document.getElementById('doneText');

    if (!phaseText || !countText || !circle || !doneText) {
      console.log('DOM elements not found, retrying in 100ms');
      animationRef.current = setTimeout(nextStep, 100);
      return;
    }

    doneText.setAttribute('opacity', '0.0');
    
    if (!inPauseRef.current) {
      // Активная фаза дыхания
      const currentPhase = phases[phaseRef.current];
      phaseText.textContent = currentPhase.name;
      countText.textContent = tickRef.current.toString();
      
      console.log(`Phase: ${currentPhase.name}, Tick: ${tickRef.current}`);
      
      // Запуск анимации радиуса только на первом тике фазы
      if (tickRef.current === 1) {
        if (currentPhase.startR !== currentPhase.endR) {
          animateRadius(currentPhase.startR, currentPhase.endR, currentPhase.duration);
        } else {
          circle.setAttribute('r', currentPhase.startR.toString());
        }
      }
      
      if (tickRef.current < currentPhase.duration) {
        tickRef.current++;
        animationRef.current = setTimeout(nextStep, 1000);
      } else if (tickRef.current === currentPhase.duration) {
        // Показываем последнюю цифру 1 секунду, затем пауза
        animationRef.current = setTimeout(() => {
          if (!isActive) return;
          inPauseRef.current = true;
          countText.textContent = "";
          tickRef.current = 1;
          animationRef.current = setTimeout(nextStep, pauseSeconds * 1000);
        }, 1000);
      }
    } else {
      // Пауза между фазами
      inPauseRef.current = false;
      phaseRef.current++;
      
      if (phaseRef.current >= phases.length) {
        // Завершен полный цикл
        phaseRef.current = 0;
        cycleRef.current++;
        
        if (cycleRef.current > maxCycles) {
          // Завершение всех циклов
          phaseText.textContent = '';
          countText.textContent = '';
          doneText.setAttribute('opacity', '1.0');
          console.log('Animation completed');
          return;
        } else {
          // Пауза между циклами
          console.log(`Starting cycle ${cycleRef.current}`);
          animationRef.current = setTimeout(nextStep, pauseBetweenCycles * 1000);
          return;
        }
      }
      
      // Переход к следующей фазе
      animationRef.current = setTimeout(nextStep, 0);
    }
  }, [isActive, animateRadius, phases]);

  const startBreathingAnimation = useCallback(() => {
    console.log('Starting breathing animation');
    
    // Сброс всех состояний
    phaseRef.current = 0;
    tickRef.current = 1;
    inPauseRef.current = false;
    cycleRef.current = 1;
    
    // Запуск анимации с небольшой задержкой для рендера DOM
    animationRef.current = setTimeout(nextStep, 100);
  }, [nextStep]);

  const stopAnimation = useCallback(() => {
    console.log('Stopping animation');
    setIsActive(false);
    
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (open) {
      console.log('Dialog opened, starting animation');
      setIsActive(true);
    } else {
      console.log('Dialog closed, stopping animation');
      stopAnimation();
    }

    return () => {
      stopAnimation();
    };
  }, [open, stopAnimation]);

  // Запуск анимации когда isActive становится true
  useEffect(() => {
    if (isActive && open) {
      startBreathingAnimation();
    }
  }, [isActive, open, startBreathingAnimation]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 bg-[#192045] border-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Дыхательная техника 4-7-8</DialogTitle>
          <DialogDescription>
            Интерактивная анимация для выполнения дыхательного упражнения 4-7-8
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10 text-white hover:bg-white/10"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex flex-col items-center justify-center min-h-[600px] p-8">
            <div className="text-center mb-8 max-w-md">
              <div className="text-[#ffdac9] text-base leading-relaxed mb-4">
                <div className="font-bold mb-2">Сделайте медленный выдох.</div>
                <div className="mb-1">Полностью выдохните воздух через рот со звуком, будто облегчённо вздыхаете.</div>
                <div className="font-bold mb-2">Дышите по схеме 4-7-8:</div>
                <div className="mb-3">вдох через нос на 4 счёта — задержка на 7 — выдох через рот на 8.</div>
                <div className="text-sm text-[#ffe4b3] opacity-84">
                  Повторите цикл 5 раз для глубокого расслабления.
                </div>
              </div>
            </div>

            <svg width="500" height="500" viewBox="0 0 500 500" className="mb-8">
              <defs>
                <radialGradient id="breathGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffd1df" />
                  <stop offset="55%" stopColor="#ffb8a6" />
                  <stop offset="100%" stopColor="#ff607f" />
                </radialGradient>
                <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#192045"/>
                  <stop offset="100%" stopColor="#21346e"/>
                </linearGradient>
              </defs>
              
              <rect x="0" y="0" width="500" height="500" fill="url(#bgGrad)"/>
              
              <text 
                id="phaseText" 
                x="250" 
                y="80" 
                fontSize="29" 
                fill="#ffe4b3" 
                textAnchor="middle" 
                dominantBaseline="middle"
                fontFamily="Arial, sans-serif"
                fontWeight="bold"
              >
                Вдох через нос
              </text>
              
              <circle 
                id="breatheCircle" 
                cx="250" 
                cy="250" 
                r="80" 
                fill="url(#breathGrad)" 
                opacity="0.97"
              />
              
              <text 
                id="countText" 
                x="250" 
                y="380" 
                fontSize="38" 
                fill="#ffecb3" 
                textAnchor="middle" 
                fontFamily="Arial, sans-serif"
                opacity="0.92"
              >
                1
              </text>
              
              <text 
                id="doneText" 
                x="250" 
                y="450" 
                fontSize="28" 
                fill="#ffe4b3" 
                textAnchor="middle" 
                fontFamily="Arial, sans-serif"
                opacity="0.0"
              >
                Упражнение завершено
              </text>
            </svg>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BreathingAnimationDialog;