import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff, CheckCircle2, AlertCircle, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSyncMonitor } from '@/hooks/api/useSyncMonitor';
import { useGlobalActivitySync } from '@/hooks/api/useGlobalActivitySync';

interface ActivitySyncIndicatorProps {
  className?: string;
}

export const ActivitySyncIndicator: React.FC<ActivitySyncIndicatorProps> = ({ className }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  
  // Use new sync monitoring system
  const { syncStatus, isSyncing: isSystemSyncing, getLastSyncText, getSyncStatusText } = useSyncMonitor();
  const { forceRefreshAll } = useGlobalActivitySync();

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

    try {
      await forceRefreshAll();
      toast({
        title: "Синхронизация завершена",
        description: "Все активности обновлены"
      });
    } catch (error) {
      toast({
        title: "Ошибка синхронизации",
        description: "Не удалось обновить активности",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const isActiveSync = isSyncing || isSystemSyncing;
  
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

      {/* Enhanced sync status */}
      <div className="flex items-center space-x-1">
        {isActiveSync ? (
          <>
            <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
            <span className="text-xs text-blue-600">{getSyncStatusText()}</span>
          </>
        ) : syncStatus.lastSync ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-xs text-green-600">Синхронизировано</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 text-orange-500" />
            <span className="text-xs text-orange-600">Требуется синхронизация</span>
          </>
        )}
      </div>

      {/* Enhanced last sync info */}
      <span className="text-xs text-gray-500">
        {getLastSyncText()}
      </span>

      {/* Queries info (for debugging) */}
      {syncStatus.totalQueries > 0 && (
        <span className="text-xs text-gray-400">
          ({syncStatus.totalQueries} кэшей)
        </span>
      )}

      {/* Manual sync button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleManualSync}
        disabled={isActiveSync || !isOnline}
        className="h-8 px-2"
        title={isActiveSync ? 'Идет синхронизация...' : 'Принудительно обновить все активности'}
      >
        <RefreshCw className={`w-4 h-4 ${isActiveSync ? 'animate-spin' : ''}`} />
        {isSyncing && <span className="ml-1 text-xs">Обновление...</span>}
      </Button>
    </div>
  );
};

export default ActivitySyncIndicator;