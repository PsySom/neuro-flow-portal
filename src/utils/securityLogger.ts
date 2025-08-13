// Security event logging utilities

export interface SecurityEvent {
  type: 'auth_attempt' | 'auth_success' | 'auth_failure' | 'profile_update' | 'rate_limit' | 'suspicious_activity';
  timestamp: number;
  userId?: string;
  email?: string;
  details?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class SecurityLogger {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000; // Keep last 1000 events

  log(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now(),
    };

    this.events.push(securityEvent);

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('security_events', JSON.stringify(this.events.slice(-100))); // Keep last 100 in storage
    } catch {
      // Ignore storage errors
    }

    // Log critical events to console for debugging
    if (event.severity === 'critical' || event.severity === 'high') {
      console.warn('Security Event:', securityEvent);
    }
  }

  logAuthAttempt(email: string, details?: Record<string, any>): void {
    this.log({
      type: 'auth_attempt',
      email,
      details,
      severity: 'low',
    });
  }

  logAuthSuccess(email: string, userId: string): void {
    this.log({
      type: 'auth_success',
      email,
      userId,
      severity: 'low',
    });
  }

  logAuthFailure(email: string, error: string, details?: Record<string, any>): void {
    this.log({
      type: 'auth_failure',
      email,
      details: { error, ...details },
      severity: 'medium',
    });
  }

  logProfileUpdate(userId: string, fields: string[], details?: Record<string, any>): void {
    this.log({
      type: 'profile_update',
      userId,
      details: { fields, ...details },
      severity: 'low',
    });
  }

  logRateLimit(identifier: string, attemptType: string): void {
    this.log({
      type: 'rate_limit',
      details: { identifier, attemptType },
      severity: 'medium',
    });
  }

  logSuspiciousActivity(description: string, details?: Record<string, any>): void {
    this.log({
      type: 'suspicious_activity',
      details: { description, ...details },
      severity: 'high',
    });
  }

  getEvents(type?: SecurityEvent['type'], limit = 50): SecurityEvent[] {
    let filtered = this.events;
    
    if (type) {
      filtered = filtered.filter(event => event.type === type);
    }
    
    return filtered.slice(-limit).reverse(); // Most recent first
  }

  getFailedAttempts(email: string, timeWindow = 15 * 60 * 1000): SecurityEvent[] {
    const now = Date.now();
    return this.events.filter(event => 
      event.type === 'auth_failure' &&
      event.email === email &&
      now - event.timestamp < timeWindow
    );
  }

  clearEvents(): void {
    this.events = [];
    try {
      localStorage.removeItem('security_events');
    } catch {
      // Ignore storage errors
    }
  }

  // Load events from localStorage on initialization
  loadEvents(): void {
    try {
      const stored = localStorage.getItem('security_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch {
      // Ignore storage errors
    }
  }
}

// Singleton instance
export const securityLogger = new SecurityLogger();

// Initialize on import
securityLogger.loadEvents();
