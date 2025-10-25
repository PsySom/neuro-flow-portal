import { useState, useEffect } from 'react';

export interface OnboardingData {
  step: number;
  name: string;
  age: number;
  timezone: string;
  primaryGoal: string;
  challenges: string[];
  mood: number;
  energy: string;
  sleepQuality: number;
  bedTime: string;
  wakeTime: string;
  sleepDuration: string;
  chronotype: string;
  timeCommitment: string;
  reminders: string;
}

const STORAGE_KEY = 'psybalans_onboarding_data';

const initialData: OnboardingData = {
  step: 1,
  name: '',
  age: 25,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  primaryGoal: '',
  challenges: [],
  mood: 5,
  energy: '',
  sleepQuality: 5,
  bedTime: '',
  wakeTime: '',
  sleepDuration: '',
  chronotype: '',
  timeCommitment: '',
  reminders: ''
};

export const useOnboardingState = () => {
  const [data, setData] = useState<OnboardingData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setData(prev => ({ ...prev, step: Math.min(prev.step + 1, 7) }));
  };

  const prevStep = () => {
    setData(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  };

  const goToStep = (step: number) => {
    setData(prev => ({ ...prev, step: Math.max(1, Math.min(step, 7)) }));
  };

  const resetData = () => {
    setData(initialData);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    data,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    resetData
  };
};
