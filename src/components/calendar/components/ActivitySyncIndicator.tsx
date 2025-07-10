import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff, CheckCircle2 } from 'lucide-react';
import { useActivitiesSync } from '@/hooks/api/useActivities';
import { useToast } from '@/hooks/use-toast';

interface ActivitySyncIndicatorProps {
  className?: string;
}

export const ActivitySyncIndicator: React.FC<ActivitySyncIndicatorProps> = ({ className }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncStatus, setLastSyncStatus] = useState<'success' | 'error' | null>(null);
  const { syncActivities, getLastSyncTime } = useActivitiesSync();
  const { toast } = useToast();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = async () => {
    if (!isOnline) {
      toast({
        title: "Нет подключения",
        description: "Проверьте интернет-соединение",
        variant: "destructive"
      });
      return;
    }

    setIsSyncing(true);
    setLastSyncStatus(null);

    try {
      await syncActivities();
      setLastSyncStatus('success');
      toast({
        title: "Синхронизация завершена",
        description: "Активности обновлены"
      });
    } catch (error) {
      setLastSyncStatus('error');
      toast({
        title: "Ошибка синхронизации",
        description: "Не удалось обновить активности",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const lastSync = getLastSyncTime();
  const timeSinceSync = lastSync ? Math.floor((Date.now() - lastSync.getTime()) / 60000) : null;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Connection status */}
      <div className="flex items-center space-x-1">
        {isOnline ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
        <span className={`text-xs font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
          {isOnline ? 'Онлайн' : 'Офлайн'}
        </span>
      </div>

      {/* Sync status */}
      {lastSyncStatus === 'success' && (
        <div className="flex items-center space-x-1">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-600">Синхронизировано</span>
        </div>
      )}

      {/* Last sync time */}
      {timeSinceSync !== null && (
        <span className="text-xs text-gray-500">
          {timeSinceSync === 0 ? 'только что' : 
           timeSinceSync === 1 ? '1 мин назад' : 
           timeSinceSync < 60 ? `${timeSinceSync} мин назад` : 'давно'}
        </span>
      )}

      {/* Manual sync button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleManualSync}
        disabled={isSyncing || !isOnline}
        className="h-8 px-2"
      >
        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing && <span className="ml-1 text-xs">Обновление...</span>}
      </Button>
    </div>
  );
};

export default ActivitySyncIndicator;