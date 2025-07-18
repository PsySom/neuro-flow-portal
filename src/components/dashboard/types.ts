import { LucideIcon } from 'lucide-react';

export interface DiaryEntry {
  name: string;
  icon: LucideIcon;
  status: 'completed' | 'pending' | 'available';
  lastEntry: string;
  streak: number;
}

export interface Reminder {
  title: string;
  time: string;
  icon: LucideIcon;
  type: 'routine' | 'care';
  status: 'completed' | 'pending' | 'upcoming';
}

export type StatusColorMap = {
  readonly [K in DiaryEntry['status']]: string;
};

export type ReminderStatusColorMap = {
  readonly [K in Reminder['status']]: string;
};

export type TypeColorMap = {
  readonly [K in Reminder['type']]: string;
};