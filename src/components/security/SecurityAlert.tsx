import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, X } from 'lucide-react';
import { securityLogger } from '@/utils/securityLogger';

export const SecurityAlert: React.FC = () => {
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lastAttempt, setLastAttempt] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const checkSecurityEvents = () => {
      // Check for recent failed login attempts
      const currentUser = localStorage.getItem('supabase.auth.token');
      if (!currentUser) return;

      const recentFailures = securityLogger.getEvents('auth_failure', 10);
      const recentAttempts = recentFailures.filter(
        event => Date.now() - event.timestamp < 60 * 60 * 1000 // Last hour
      );

      if (recentAttempts.length >= 3) {
        setFailedAttempts(recentAttempts.length);
        setLastAttempt(recentAttempts[0]?.timestamp || null);
        setShowAlert(true);
      }
    };

    // Check on mount and every 5 minutes
    checkSecurityEvents();
    const interval = setInterval(checkSecurityEvents, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const dismissAlert = () => {
    setShowAlert(false);
  };

  const viewSecurityLog = () => {
    const events = securityLogger.getEvents(undefined, 20);
    console.table(events.map(e => ({
      Type: e.type,
      Time: new Date(e.timestamp).toLocaleString('ru-RU'),
      Email: e.email || '-',
      Severity: e.severity,
      Details: JSON.stringify(e.details || {})
    })));
    alert('События безопасности выведены в консоль (F12 → Console)');
  };

  if (!showAlert) return null;

  return (
    <Alert className="border-psybalans-warning bg-psybalans-warning/10">
      <AlertTriangle className="h-4 w-4 text-psybalans-warning" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>
            Обнаружено {failedAttempts} неудачных попыток входа в последний час.
            {lastAttempt && (
              <span className="text-sm text-muted-foreground ml-2">
                Последняя: {new Date(lastAttempt).toLocaleTimeString('ru-RU')}
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={viewSecurityLog}>
            Просмотреть лог
          </Button>
          <Button size="sm" variant="ghost" onClick={dismissAlert}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};