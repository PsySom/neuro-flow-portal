import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Cake, Clock } from 'lucide-react';
import { OnboardingData } from '../hooks/useOnboardingState';

interface Step2AboutYouProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

// Common timezones with their GMT offsets
const TIMEZONES = [
  { value: 'Pacific/Honolulu', label: 'Honolulu (GMT-10)', offset: -10 },
  { value: 'America/Anchorage', label: 'Alaska (GMT-9)', offset: -9 },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)', offset: -8 },
  { value: 'America/Denver', label: 'Denver (GMT-7)', offset: -7 },
  { value: 'America/Chicago', label: 'Chicago (GMT-6)', offset: -6 },
  { value: 'America/New_York', label: 'New York (GMT-5)', offset: -5 },
  { value: 'America/Sao_Paulo', label: 'São Paulo (GMT-3)', offset: -3 },
  { value: 'Atlantic/Cape_Verde', label: 'Cape Verde (GMT-1)', offset: -1 },
  { value: 'Europe/London', label: 'London (GMT+0)', offset: 0 },
  { value: 'Europe/Paris', label: 'Paris (GMT+1)', offset: 1 },
  { value: 'Europe/Istanbul', label: 'Istanbul (GMT+3)', offset: 3 },
  { value: 'Asia/Dubai', label: 'Dubai (GMT+4)', offset: 4 },
  { value: 'Asia/Karachi', label: 'Karachi (GMT+5)', offset: 5 },
  { value: 'Asia/Dhaka', label: 'Dhaka (GMT+6)', offset: 6 },
  { value: 'Asia/Bangkok', label: 'Bangkok (GMT+7)', offset: 7 },
  { value: 'Asia/Shanghai', label: 'Shanghai (GMT+8)', offset: 8 },
  { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)', offset: 9 },
  { value: 'Australia/Sydney', label: 'Sydney (GMT+10)', offset: 10 },
  { value: 'Pacific/Auckland', label: 'Auckland (GMT+12)', offset: 12 },
];

const Step2AboutYou: React.FC<Step2AboutYouProps> = ({ data, updateData }) => {
  const [showTimezoneSelect, setShowTimezoneSelect] = useState(false);
  const [nameError, setNameError] = useState('');

  // Auto-detect timezone on mount
  useEffect(() => {
    if (!data.timezone) {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      updateData({ timezone: detectedTimezone });
    }
  }, []);

  const getTimezoneLabel = (timezone: string) => {
    const found = TIMEZONES.find(tz => tz.value === timezone);
    if (found) return found.label;
    
    // Fallback: try to show a nice label for detected timezone
    try {
      const offset = new Date().getTimezoneOffset() / -60;
      const sign = offset >= 0 ? '+' : '';
      return `${timezone.split('/').pop()} (GMT${sign}${offset})`;
    } catch {
      return timezone;
    }
  };

  const handleNameChange = (value: string) => {
    updateData({ name: value });
    if (value.length > 0 && value.length < 2) {
      setNameError('Минимум 2 символа');
    } else {
      setNameError('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Расскажите о себе</h2>
        <p className="text-muted-foreground">
          Это поможет нам персонализировать ваш опыт
        </p>
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div className="space-y-3">
          <Label htmlFor="name" className="flex items-center gap-2 text-base font-semibold">
            <User className="w-4 h-4 text-primary" />
            Как к вам обращаться?
          </Label>
          <Input
            id="name"
            placeholder="Введите ваше имя"
            value={data.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={nameError ? 'border-destructive' : ''}
          />
          {nameError && (
            <p className="text-sm text-destructive">{nameError}</p>
          )}
        </div>

        {/* Age Slider */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-base font-semibold">
            <Cake className="w-4 h-4 text-primary" />
            Сколько вам лет?
          </Label>
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-4xl font-bold text-primary">
                {data.age || 25}
              </span>
              <span className="text-muted-foreground ml-2">лет</span>
            </div>
            <Slider
              value={[data.age || 25]}
              onValueChange={([value]) => updateData({ age: value })}
              min={16}
              max={80}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>16</span>
              <span>80</span>
            </div>
          </div>
        </div>

        {/* Timezone */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-base font-semibold">
            <Clock className="w-4 h-4 text-primary" />
            Часовой пояс
          </Label>
          
          {!showTimezoneSelect ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 bg-muted rounded-md text-sm">
                {getTimezoneLabel(data.timezone)}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowTimezoneSelect(true)}
              >
                Изменить
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Select
                value={data.timezone}
                onValueChange={(value) => {
                  updateData({ timezone: value });
                  setShowTimezoneSelect(false);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите часовой пояс" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowTimezoneSelect(false)}
                className="w-full"
              >
                Отмена
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Определяется автоматически
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step2AboutYou;
