import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (open) {
      setIsActive(true);
      startBreathingAnimation();
    } else {
      setIsActive(false);
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [open]);

  const startBreathingAnimation = () => {
    const phases = [
      {name: 'Вдох через нос', duration: 4, startR: 80, endR: 150},
      {name: 'Задержите дыхание', duration: 7, startR: 150, endR: 150},
      {name: 'Выдох через рот', duration: 8, startR: 150, endR: 80},
    ];
    const pauseSeconds = 1;
    const pauseBetweenCycles = 3;
    const maxCycles = 5;

    let phase = 0;
    let tick = 1;
    let inPause = false;
    let cycle = 1;

    const phaseText = document.getElementById('phaseText');
    const countText = document.getElementById('countText');
    const circle = document.getElementById('breatheCircle');
    const doneText = document.getElementById('doneText');

    if (!phaseText || !countText || !circle || !doneText) return;

    function animateRadius(start: number, end: number, duration: number) {
      const startTime = performance.now();
      function step(now: number) {
        const elapsed = (now - startTime) / 1000;
        if (elapsed < duration) {
          const progress = elapsed / duration;
          const r = start + (end - start) * progress;
          circle.setAttribute('r', r.toString());
          requestAnimationFrame(step);
        } else {
          circle.setAttribute('r', end.toString());
        }
      }
      requestAnimationFrame(step);
    }

    function nextStep() {
      if (!isActive) return;
      
      doneText.setAttribute('opacity', '0.0');
      if (!inPause) {
        phaseText.textContent = phases[phase].name;
        countText.textContent = tick.toString();
        
        if (tick === 1) {
          if (phases[phase].startR !== phases[phase].endR) {
            animateRadius(phases[phase].startR, phases[phase].endR, phases[phase].duration);
          } else {
            circle.setAttribute('r', phases[phase].startR.toString());
          }
        }
        
        if (tick < phases[phase].duration) {
          tick++;
          animationRef.current = setTimeout(nextStep, 1000);
        } else if (tick === phases[phase].duration) {
          animationRef.current = setTimeout(() => {
            inPause = true;
            countText.textContent = "";
            tick = 1;
            animationRef.current = setTimeout(nextStep, pauseSeconds * 1000);
          }, 1000);
        }
      } else {
        inPause = false;
        phase++;
        if (phase >= phases.length) {
          phase = 0;
          cycle++;
          if (cycle > maxCycles) {
            phaseText.textContent = '';
            countText.textContent = '';
            doneText.setAttribute('opacity', '1.0');
            return;
          } else {
            animationRef.current = setTimeout(nextStep, pauseBetweenCycles * 1000);
            return;
          }
        }
        animationRef.current = setTimeout(nextStep, 0);
      }
    }

    nextStep();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 bg-[#192045] border-none">
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

            <svg width="400" height="400" viewBox="0 0 400 400" className="mb-8">
              <defs>
                <radialGradient id="breathGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffd1df" />
                  <stop offset="55%" stopColor="#ffb8a6" />
                  <stop offset="100%" stopColor="#ff607f" />
                </radialGradient>
              </defs>
              
              <text 
                id="phaseText" 
                x="200" 
                y="80" 
                fontSize="24" 
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
                cx="200" 
                cy="200" 
                r="80" 
                fill="url(#breathGrad)" 
                opacity="0.97"
              />
              
              <text 
                id="countText" 
                x="200" 
                y="320" 
                fontSize="32" 
                fill="#ffecb3" 
                textAnchor="middle" 
                fontFamily="Arial, sans-serif"
                opacity="0.92"
              >
                1
              </text>
              
              <text 
                id="doneText" 
                x="200" 
                y="370" 
                fontSize="20" 
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