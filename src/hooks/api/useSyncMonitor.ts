import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGlobalActivitySync } from './useGlobalActivitySync';

export interface SyncStatus {
  isActive: boolean;
  lastSync: Date | null;
  pendingOperations: number;
  totalQueries: number;
}

/**
 * Monitor synchronization status across all activity-related queries
 * Provides real-time feedback about sync status to users
 */
export const useSyncMonitor = () => {
  const queryClient = useQueryClient();
  const { getSyncStatus } = useGlobalActivitySync();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isActive: false,
    lastSync: null,
    pendingOperations: 0,
    totalQueries: 0
  });

  const updateSyncStatus = useCallback(() => {
    const status = getSyncStatus();
    const currentMutations = queryClient.getMutationCache().getAll();
    const pendingMutations = currentMutations.filter(m => m.state.status === 'pending');
    
    setSyncStatus({
      isActive: pendingMutations.length > 0,
      lastSync: status.lastUpdate > 0 ? new Date(status.lastUpdate) : null,
      pendingOperations: pendingMutations.length,
      totalQueries: status.activeQueries
    });
  }, [queryClient, getSyncStatus]);

  // Monitor query and mutation changes
  useEffect(() => {
    // Update status immediately
    updateSyncStatus();

    // Subscribe to query client changes
    const unsubscribeQuery = queryClient.getQueryCache().subscribe(updateSyncStatus);
    const unsubscribeMutation = queryClient.getMutationCache().subscribe(updateSyncStatus);

    // Update periodically as backup
    const interval = setInterval(updateSyncStatus, 1000);

    return () => {
      unsubscribeQuery();
      unsubscribeMutation();
      clearInterval(interval);
    };
  }, [queryClient, updateSyncStatus]);

  // Helper functions for UI
  const isSyncing = syncStatus.isActive || syncStatus.pendingOperations > 0;
  
  const getLastSyncText = useCallback(() => {
    if (!syncStatus.lastSync) return 'Не синхронизировано';
    
    const now = new Date();
    const diffMs = now.getTime() - syncStatus.lastSync.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    
    if (diffSeconds < 10) return 'Только что';
    if (diffSeconds < 60) return `${diffSeconds} сек назад`;
    if (diffMinutes < 60) return `${diffMinutes} мин назад`;
    
    return syncStatus.lastSync.toLocaleTimeString();
  }, [syncStatus.lastSync]);

  const getSyncStatusText = useCallback(() => {
    if (syncStatus.isActive) return 'Синхронизация...';
    if (syncStatus.pendingOperations > 0) return `Операций: ${syncStatus.pendingOperations}`;
    return 'Синхронизировано';
  }, [syncStatus.isActive, syncStatus.pendingOperations]);

  return {
    syncStatus,
    isSyncing,
    getLastSyncText,
    getSyncStatusText,
    updateSyncStatus
  };
};