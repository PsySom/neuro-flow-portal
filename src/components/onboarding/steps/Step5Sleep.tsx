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
    <div className="space-y-6" role="form" aria-label="Информация о сне">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">😴 Расскажите о вашем сне</h2>
        <p className="text-muted-foreground">
          Это поможет нам настроить рекомендации
        </p>
      </div>

      <Card className="p-6 bg-card border-border">
        <div className="space-y-6">
          {/* Sleep Quality */}
          <div className="space-y-4">
            <Label htmlFor="sleep-quality" className="text-base font-semibold">
              Качество сна:
            </Label>
            
            <div className="space-y-4">
              <div className="text-center" aria-live="polite" role="status">
                <span className="text-4xl emoji-scale" aria-hidden="true">
                  {getSleepQualityEmoji(data.sleepQuality)}
                </span>
                <p className="text-sm text-muted-foreground mt-2">
                  {data.sleepQuality}/10
                </p>
              </div>

              <Slider
                id="sleep-quality"
                value={[data.sleepQuality]}
                onValueChange={([value]) => updateData({ sleepQuality: value })}
                min={0}
                max={10}
                step={1}
                className="py-4"
                aria-label={`Качество сна: ${data.sleepQuality} из 10`}
                aria-valuemin={0}
                aria-valuemax={10}
                aria-valuenow={data.sleepQuality}
              />
              
              <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
                <span>😴 Плохое</span>
                <span>😐 Нормальное</span>
                <span>😊 Отличное</span>
              </div>
            </div>
          </div>

          {/* Bed Time */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="bed-time-slider" className="text-base font-semibold flex items-center gap-2">
                <Moon className="w-4 h-4" aria-hidden="true" />
                Засыпаю:
              </Label>
              <span className="text-2xl" aria-hidden="true">{getBedTimeIcon(data.bedTime)}</span>
              <span className="text-lg font-mono text-primary" aria-live="polite">
                {data.bedTime || '23:00'}
              </span>
            </div>
            
            <Slider
              id="bed-time-slider"
              value={[bedTimeSliderValue]}
              onValueChange={([value]) => handleBedTimeChange(value)}
              min={22 * 60}
              max={30 * 60}
              step={15}
              className="py-4"
              aria-label={`Время отхода ко сну: ${data.bedTime || '23:00'}`}
              aria-valuemin={22 * 60}
              aria-valuemax={30 * 60}
              aria-valuenow={bedTimeSliderValue}
            />
            
            <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
              <span>22:00</span>
              <span>06:00</span>
            </div>
          </div>

          {/* Wake Time */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="wake-time-slider" className="text-base font-semibold flex items-center gap-2">
                <Sunrise className="w-4 h-4" aria-hidden="true" />
                Просыпаюсь:
              </Label>
              <span className="text-2xl" aria-hidden="true">{getWakeTimeIcon(data.wakeTime)}</span>
              <span className="text-lg font-mono text-primary" aria-live="polite">
                {data.wakeTime || '07:00'}
              </span>
            </div>
            
            <Slider
              id="wake-time-slider"
              value={[wakeTimeSliderValue]}
              onValueChange={([value]) => handleWakeTimeChange(value)}
              min={5 * 60}
              max={12 * 60}
              step={15}
              className="py-4"
              aria-label={`Время пробуждения: ${data.wakeTime || '07:00'}`}
              aria-valuemin={5 * 60}
              aria-valuemax={12 * 60}
              aria-valuenow={wakeTimeSliderValue}
            />
            
            <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
              <span>05:00</span>
              <span>12:00</span>
            </div>
          </div>

          {/* Duration Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Сколько хотели бы спать:
            </Label>
            
            <RadioGroup
              value={data.sleepDuration}
              onValueChange={(value) => updateData({ sleepDuration: value })}
              className="grid grid-cols-2 gap-3"
              aria-label="Желаемая продолжительность сна"
            >
              {[
                { id: '5-6h', label: '5-6 часов' },
                { id: '6-7h', label: '6-7 часов' },
                { id: '7-8h', label: '7-8 часов' },
                { id: '8-9h', label: '8-9 часов' },
                { id: '9-10h', label: '9-10 часов' },
                { id: '10+h', label: '10+ часов' }
              ].map((option) => (
                <div key={option.id} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/30 cursor-pointer">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="cursor-pointer flex-1">{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </Card>

      {/* Info Box */}
      <div 
        className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg"
        role="note"
      >
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-blue-900 dark:text-blue-300">
          💡 Мы используем эти данные для настройки напоминаний и рекомендаций практик для сна
        </p>
      </div>
    </div>
  );
};

export default Step5Sleep;
