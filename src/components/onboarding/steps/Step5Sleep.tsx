import React, { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Moon, Sun, Sunrise, Sparkles, Info } from 'lucide-react';
import { OnboardingData } from '../hooks/useOnboardingState';

interface Step5SleepProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const getSleepQualityEmoji = (value: number) => {
  if (value <= 3) return '😴';
  if (value <= 6) return '😐';
  return '😊';
};

const timeToMinutes = (time: string): number => {
  if (!time) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const calculateSleepHours = (bedTime: string, wakeTime: string): number => {
  if (!bedTime || !wakeTime) return 0;
  
  let bedMinutes = timeToMinutes(bedTime);
  let wakeMinutes = timeToMinutes(wakeTime);
  
  // If wake time is earlier in the day, assume it's the next day
  if (wakeMinutes <= bedMinutes) {
    wakeMinutes += 24 * 60;
  }
  
  const sleepMinutes = wakeMinutes - bedMinutes;
  return Math.round((sleepMinutes / 60) * 10) / 10;
};

const getSleepFeedback = (hours: number) => {
  if (hours === 0) return null;
  if (hours < 6) return { emoji: '⚠️', text: `${hours} часов - меньше рекомендуемой нормы`, color: 'text-orange-500' };
  if (hours >= 6 && hours <= 8) return { emoji: '💤', text: `${hours} часов сна ✅ Отличная продолжительность!`, color: 'text-green-500' };
  if (hours > 8 && hours <= 10) return { emoji: '😴', text: `${hours} часов - немного больше нормы`, color: 'text-blue-500' };
  return { emoji: '⚠️', text: `${hours} часов - слишком много`, color: 'text-orange-500' };
};

const getBedTimeIcon = (time: string) => {
  if (!time) return '🌙';
  const hour = parseInt(time.split(':')[0]);
  if (hour >= 22 || hour <= 2) return '🌙';
  return '🌌';
};

const getWakeTimeIcon = (time: string) => {
  if (!time) return '☀️';
  const hour = parseInt(time.split(':')[0]);
  if (hour >= 5 && hour < 7) return '🌅';
  return '☀️';
};

const Step5Sleep: React.FC<Step5SleepProps> = ({ data, updateData }) => {
  // Initialize times if not set
  React.useEffect(() => {
    if (!data.bedTime) updateData({ bedTime: '23:00' });
    if (!data.wakeTime) updateData({ wakeTime: '07:00' });
  }, []);

  const sleepHours = useMemo(() => 
    calculateSleepHours(data.bedTime, data.wakeTime),
    [data.bedTime, data.wakeTime]
  );

  const feedback = useMemo(() => 
    getSleepFeedback(sleepHours),
    [sleepHours]
  );

  const bedTimeSliderValue = timeToMinutes(data.bedTime || '23:00');
  const wakeTimeSliderValue = timeToMinutes(data.wakeTime || '07:00');

  const handleBedTimeChange = (minutes: number) => {
    updateData({ bedTime: minutesToTime(minutes) });
  };

  const handleWakeTimeChange = (minutes: number) => {
    updateData({ wakeTime: minutesToTime(minutes) });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">😴 Расскажите о вашем сне</h2>
        <p className="text-muted-foreground">
          Это поможет нам настроить рекомендации
        </p>
      </div>

      {/* Night-themed card */}
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white">
        <div className="space-y-6">
          {/* Sleep Quality */}
          <div className="space-y-4">
            <Label className="text-white text-base font-semibold">
              Качество сна:
            </Label>
            
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-4xl">{getSleepQualityEmoji(data.sleepQuality)}</span>
                <p className="text-sm text-slate-300 mt-2">
                  {data.sleepQuality}/10
                </p>
              </div>

              <Slider
                value={[data.sleepQuality]}
                onValueChange={([value]) => updateData({ sleepQuality: value })}
                min={0}
                max={10}
                step={1}
                className="py-4"
              />
              
              <div className="flex justify-between text-xs text-slate-300">
                <span>😴 Плохое</span>
                <span>😐 Нормальное</span>
                <span>😊 Отличное</span>
              </div>
            </div>
          </div>

          {/* Bed Time */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-white text-base font-semibold flex items-center gap-2">
                <Moon className="w-4 h-4" />
                Засыпаю:
              </Label>
              <span className="text-2xl">{getBedTimeIcon(data.bedTime)}</span>
              <span className="text-lg font-mono text-slate-200">
                {data.bedTime || '23:00'}
              </span>
            </div>
            
            <Slider
              value={[bedTimeSliderValue]}
              onValueChange={([value]) => handleBedTimeChange(value)}
              min={22 * 60}
              max={30 * 60}
              step={15}
              className="py-4"
            />
            
            <div className="flex justify-between text-xs text-slate-300">
              <span>22:00</span>
              <span>06:00</span>
            </div>
          </div>

          {/* Wake Time */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-white text-base font-semibold flex items-center gap-2">
                <Sunrise className="w-4 h-4" />
                Просыпаюсь:
              </Label>
              <span className="text-2xl">{getWakeTimeIcon(data.wakeTime)}</span>
              <span className="text-lg font-mono text-slate-200">
                {data.wakeTime || '07:00'}
              </span>
            </div>
            
            <Slider
              value={[wakeTimeSliderValue]}
              onValueChange={([value]) => handleWakeTimeChange(value)}
              min={5 * 60}
              max={12 * 60}
              step={15}
              className="py-4"
            />
            
            <div className="flex justify-between text-xs text-slate-300">
              <span>05:00</span>
              <span>12:00</span>
            </div>
          </div>

          {/* Live Feedback */}
          {feedback && (
            <div className={`text-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 ${feedback.color}`}>
              <p className="text-sm font-medium">
                {feedback.emoji} {feedback.text}
              </p>
            </div>
          )}

          {/* Duration Chips */}
          <div className="space-y-3">
            <Label className="text-white text-base font-semibold">
              Продолжительность:
            </Label>
            
            <RadioGroup
              value={data.sleepDuration}
              onValueChange={(value) => updateData({ sleepDuration: value })}
              className="flex flex-wrap gap-3"
            >
              {[
                { id: 'less-6', label: 'Меньше 6 часов' },
                { id: '6-8', label: '6-8 часов' },
                { id: 'more-8', label: 'Больше 8 часов' }
              ].map((option) => (
                <div key={option.id} className="flex-1 min-w-[140px]">
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={option.id}
                    className="flex items-center justify-center px-4 py-3 bg-slate-800 border-2 border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/20 transition-all text-sm font-medium text-center"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </Card>

      {/* Info Box */}
      <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-900 dark:text-blue-300">
          💡 Мы используем эти данные для настройки напоминаний и рекомендаций практик для сна
        </p>
      </div>
    </div>
  );
};

export default Step5Sleep;
