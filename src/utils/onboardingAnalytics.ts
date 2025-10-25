// Onboarding Analytics Tracking
// Track user behavior and progression through onboarding

interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
}

class OnboardingAnalytics {
  private events: AnalyticsEvent[] = [];
  private sessionStartTime: number = Date.now();
  private stepStartTimes: Map<number, number> = new Map();

  // Track step entry
  trackStepView(step: number, data?: any) {
    this.stepStartTimes.set(step, Date.now());
    this.logEvent('onboarding_step_view', {
      step,
      data,
      time_from_start: this.getTimeFromStart(),
    });
  }

  // Track step completion
  trackStepComplete(step: number, data?: any) {
    const timeSpent = this.getStepTimeSpent(step);
    this.logEvent('onboarding_step_complete', {
      step,
      data,
      time_spent_seconds: timeSpent,
      time_from_start: this.getTimeFromStart(),
    });
  }

  // Track navigation (back/forward)
  trackNavigation(from: number, to: number, method: 'next' | 'back' | 'skip') {
    this.logEvent('onboarding_navigation', {
      from_step: from,
      to_step: to,
      method,
      time_from_start: this.getTimeFromStart(),
    });
  }

  // Track validation errors
  trackValidationError(step: number, field: string, error: string) {
    this.logEvent('onboarding_validation_error', {
      step,
      field,
      error,
      time_from_start: this.getTimeFromStart(),
    });
  }

  // Track onboarding completion
  trackCompletion(totalTimeSeconds: number, data: any) {
    this.logEvent('onboarding_complete', {
      total_time_seconds: totalTimeSeconds,
      data,
      step_times: this.getStepTimes(),
    });
  }

  // Track onboarding skip
  trackSkip(step: number, reason?: string) {
    this.logEvent('onboarding_skip', {
      step,
      reason,
      time_from_start: this.getTimeFromStart(),
    });
  }

  // Track drop-off (user leaves)
  trackDropOff(step: number) {
    this.logEvent('onboarding_drop_off', {
      step,
      time_from_start: this.getTimeFromStart(),
      step_times: this.getStepTimes(),
    });
  }

  // Track errors
  trackError(step: number, error: string, context?: any) {
    this.logEvent('onboarding_error', {
      step,
      error,
      context,
      time_from_start: this.getTimeFromStart(),
    });
  }

  // Track retry attempts
  trackRetry(step: number, attemptNumber: number) {
    this.logEvent('onboarding_retry', {
      step,
      attempt: attemptNumber,
      time_from_start: this.getTimeFromStart(),
    });
  }

  // Get completion metrics
  getCompletionMetrics() {
    return {
      totalTimeSeconds: this.getTimeFromStart(),
      stepTimes: this.getStepTimes(),
      dropOffRate: this.calculateDropOffRate(),
      averageStepTime: this.calculateAverageStepTime(),
    };
  }

  // Private helper methods
  private logEvent(event: string, properties: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now(),
    };
    
    this.events.push(analyticsEvent);
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('[Analytics]', event, properties);
    }

    // In production, you would send this to your analytics service
    // Example: sendToAnalytics(analyticsEvent);
  }

  private getTimeFromStart(): number {
    return Math.floor((Date.now() - this.sessionStartTime) / 1000);
  }

  private getStepTimeSpent(step: number): number {
    const startTime = this.stepStartTimes.get(step);
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  }

  private getStepTimes(): Record<number, number> {
    const times: Record<number, number> = {};
    this.stepStartTimes.forEach((startTime, step) => {
      times[step] = Math.floor((Date.now() - startTime) / 1000);
    });
    return times;
  }

  private calculateDropOffRate(): number {
    const completionEvents = this.events.filter(e => e.event === 'onboarding_complete');
    const totalStarts = this.events.filter(e => e.event === 'onboarding_step_view' && e.properties.step === 1);
    
    if (totalStarts.length === 0) return 0;
    return 1 - (completionEvents.length / totalStarts.length);
  }

  private calculateAverageStepTime(): number {
    const completionEvents = this.events.filter(e => e.event === 'onboarding_step_complete');
    if (completionEvents.length === 0) return 0;
    
    const totalTime = completionEvents.reduce((sum, e) => sum + (e.properties.time_spent_seconds || 0), 0);
    return Math.floor(totalTime / completionEvents.length);
  }

  // Export events for debugging/analysis
  exportEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  // Clear tracking data
  reset() {
    this.events = [];
    this.sessionStartTime = Date.now();
    this.stepStartTimes.clear();
  }
}

// Singleton instance
export const onboardingAnalytics = new OnboardingAnalytics();

// Utility function to check if user is online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Retry utility with exponential backoff
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
};
