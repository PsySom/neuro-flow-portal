import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export interface PasswordCriteria {
  label: string;
  regex: RegExp;
  met: boolean;
}

export const validatePassword = (password: string): { score: number; criteria: PasswordCriteria[] } => {
  const criteria: PasswordCriteria[] = [
    {
      label: 'Минимум 8 символов',
      regex: /.{8,}/,
      met: false,
    },
    {
      label: 'Содержит заглавную букву',
      regex: /[A-Z]/,
      met: false,
    },
    {
      label: 'Содержит строчную букву',
      regex: /[a-z]/,
      met: false,
    },
    {
      label: 'Содержит цифру',
      regex: /[0-9]/,
      met: false,
    },
    {
      label: 'Содержит спецсимвол',
      regex: /[^A-Za-z0-9]/,
      met: false,
    },
  ];

  criteria.forEach(criterion => {
    criterion.met = criterion.regex.test(password);
  });

  const score = criteria.filter(c => c.met).length;
  return { score, criteria };
};

export const getPasswordStrength = (score: number): { label: string; color: string } => {
  if (score === 0) return { label: '', color: '' };
  if (score <= 2) return { label: 'Слабый', color: 'text-destructive' };
  if (score <= 3) return { label: 'Средний', color: 'text-psybalans-warning' };
  if (score <= 4) return { label: 'Хороший', color: 'text-psybalans-accent' };
  return { label: 'Отличный', color: 'text-psybalans-success' };
};

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, className }) => {
  const { score, criteria } = validatePassword(password);
  const strength = getPasswordStrength(score);
  const progressValue = (score / criteria.length) * 100;

  if (!password) return null;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Надёжность пароля</span>
        <span className={cn('text-sm font-medium', strength.color)}>
          {strength.label}
        </span>
      </div>
      
      <Progress 
        value={progressValue} 
        className="h-2"
      />
      
      <div className="space-y-1">
        {criteria.map((criterion, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {criterion.met ? (
              <Check className="h-3 w-3 text-psybalans-success" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={cn(
              criterion.met ? 'text-psybalans-success' : 'text-muted-foreground'
            )}>
              {criterion.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};