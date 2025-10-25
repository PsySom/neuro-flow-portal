import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { onboardingSaveService } from '@/services/onboarding-save.service';

export type EnergyLevel = 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
export type SleepDuration = '<6' | '6-8' | '>8';
export type Chronotype = 'morning' | 'day' | 'evening' | 'varies';
export type TimeCommitment = '5-10' | '15-20' | '30-45' | '60+';
export type ReminderFrequency = '1-2' | '3-4' | 'on-demand' | 'minimal';

export interface OnboardingData {
  // Navigation
  step: number;
  
  // Step 2: About You
  name: string;
  age: number;
  timezone: string;
  
  // Step 3: Goals and Challenges
  primaryGoal: string;
  challenges: string[];
  
  // Step 4: Current State
  mood: number; // 0-10
  energy: string;
  
  // Step 5: Sleep
  sleepQuality: number; // 0-10
  bedTime: string; // HH:MM
  wakeTime: string; // HH:MM
  sleepDuration: string;
  
  // Step 6: Rhythm
  chronotype: string;
  timeCommitment: string;
  reminders: string;
  
  // Metadata
  completedAt?: string;
  skipped?: boolean;
}

const STORAGE_KEY = 'psybalans_onboarding_data';
const TOTAL_STEPS = 7;

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
  reminders: '',
  skipped: false
};

export const useOnboardingState = () => {
  // Load from localStorage once on mount
  const getInitialData = (): OnboardingData => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialData, ...parsed };
      }
    } catch (error) {
      console.error('Error loading onboarding from localStorage:', error);
    }
    return initialData;
  };

  const [data, setData] = useState<OnboardingData>(getInitialData);

  // Auto-save to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  /**
   * Load data from localStorage
   */
  const loadFromLocalStorage = (): OnboardingData => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialData, ...parsed };
      }
    } catch (error) {
      console.error('Error loading onboarding from localStorage:', error);
    }
    return initialData;
  };

  /**
   * Update onboarding data
   */
  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  /**
   * Validate current step
   */
  const isStepValid = (step?: number): boolean => {
    const currentStep = step || data.step;
    
    switch (currentStep) {
      case 1: // Welcome/Registration - handled separately in component
        return true;
      
      case 2: // About You
        return (
          data.name.trim().length >= 2 &&
          data.age >= 16 &&
          data.age <= 80 &&
          data.timezone.length > 0
        );
      
      case 3: // Challenges only (goals moved to step 7) - allow skip
        return (
          data.challenges.length === 0 || // Allow skip with no challenges
          (data.challenges.length >= 1 && data.challenges.length <= 3)
        );
      
      case 4: // Current State
        return (
          data.mood >= 0 &&
          data.mood <= 10 &&
          data.energy.length > 0
        );
      
      case 5: // Sleep
        return (
          data.sleepQuality >= 0 &&
          data.sleepQuality <= 10 &&
          data.bedTime.length > 0 &&
          data.wakeTime.length > 0 &&
          data.sleepDuration.length > 0
        );
      
      case 6: // Rhythm (chronotype and reminders only)
        return (
          data.chronotype.length > 0 &&
          data.reminders.length > 0
        );
      
      case 7: // Complete
        return true;
      
      default:
        return false;
    }
  };

  /**
   * Move to next step (with validation)
   */
  const nextStep = () => {
    if (!isStepValid()) {
      console.warn('Current step validation failed');
      return false;
    }
    
    setData(prev => ({ 
      ...prev, 
      step: Math.min(prev.step + 1, TOTAL_STEPS) 
    }));
    return true;
  };

  /**
   * Move to previous step
   */
  const prevStep = () => {
    setData(prev => ({ 
      ...prev, 
      step: Math.max(prev.step - 1, 1) 
    }));
  };

  /**
   * Go to specific step
   */
  const goToStep = (step: number) => {
    setData(prev => ({ 
      ...prev, 
      step: Math.max(1, Math.min(step, TOTAL_STEPS)) 
    }));
  };

  /**
   * Skip entire onboarding
   */
  const skipOnboarding = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const skippedData: OnboardingData = {
        ...data,
        skipped: true,
        completedAt: new Date().toISOString()
      };
      
      // Save to Supabase with skipped flag
      const result = await onboardingSaveService.saveOnboardingData(skippedData);
      
      if (result.success) {
        // Clear localStorage
        localStorage.removeItem(STORAGE_KEY);
        return { success: true };
      }
      
      return { success: false, error: result.error };
    } catch (error: any) {
      console.error('Error skipping onboarding:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Save to Supabase
   */
  const saveToSupabase = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const completeData: OnboardingData = {
        ...data,
        completedAt: new Date().toISOString(),
        skipped: false
      };
      
      const result = await onboardingSaveService.saveOnboardingData(completeData);
      
      if (result.success) {
        // Clear localStorage after successful save
        localStorage.removeItem(STORAGE_KEY);
      }
      
      return result;
    } catch (error: any) {
      console.error('Error saving to Supabase:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Reset all data
   */
  const resetData = () => {
    setData(initialData);
    localStorage.removeItem(STORAGE_KEY);
  };

  /**
   * Get current progress (0-100)
   */
  const progress = Math.round((data.step / TOTAL_STEPS) * 100);

  /**
   * Get current step number
   */
  const currentStep = data.step;

  return {
    // Data
    data,
    currentStep,
    progress,
    
    // Methods
    updateData,
    nextStep,
    prevStep,
    goToStep,
    resetData,
    
    // Validation
    isStepValid,
    
    // Persistence
    loadFromLocalStorage,
    saveToSupabase,
    skipOnboarding
  };
};
