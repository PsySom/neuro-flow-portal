
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Play, Pause, Square } from 'lucide-react';

export interface DiaryStatus {
  id: string;
  isActive: boolean;
  isPaused: boolean;
  lastEntryDate: string | null;
  scheduledDate: string | null;
}

interface DiaryStatusManagerProps {
  diaryPath: string;
  title: string;
  onStatusChange?: (status: DiaryStatus) => void;
}

const DiaryStatusManager: React.FC<DiaryStatusManagerProps> = ({
  diaryPath,
  title,
  onStatusChange
}) => {
  // Инициализируем статус из localStorage или значениями по умолчанию
  const getInitialStatus = (): DiaryStatus => {
    const saved = localStorage.getItem(`diary-status-${diaryPath}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      id: diaryPath,
      isActive: false,
      isPaused: false,
      lastEntryDate: null,
      scheduledDate: null
    };
  };

  const [status, setStatus] = useState<DiaryStatus>(getInitialStatus());

  const updateStatus = (newStatus: Partial<DiaryStatus>) => {
    const updatedStatus = { ...status, ...newStatus };
    setStatus(updatedStatus);
    localStorage.setItem(`diary-status-${diaryPath}`, JSON.stringify(updatedStatus));
    onStatusChange?.(updatedStatus);
  };

  const handleActivate = () => {
    updateStatus({ isActive: true, isPaused: false });
  };

  const handlePause = () => {
    updateStatus({ isPaused: !status.isPaused });
  };

  const handleDeactivate = () => {
    updateStatus({ isActive: false, isPaused: false });
  };

  const handleSchedule = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const scheduledDate = tomorrow.toISOString().split('T')[0];
    updateStatus({ scheduledDate });
  };

  const getStatusBadge = () => {
    if (!status.isActive) {
      return <Badge variant="secondary">Не активен</Badge>;
    }
    if (status.isPaused) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Пауза</Badge>;
    }
    return <Badge variant="default" className="bg-green-600">Активен</Badge>;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Никогда';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className="space-y-3">
      {/* Статус и управление */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusBadge()}
          {status.scheduledDate && (
            <Badge variant="outline" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(status.scheduledDate)}
            </Badge>
          )}
        </div>
      </div>

      {/* Кнопки управления */}
      <div className="flex flex-wrap gap-2">
        {!status.isActive ? (
          <Button
            size="sm"
            variant="outline"
            onClick={handleActivate}
            className="text-green-600 border-green-600 hover:bg-green-50"
          >
            <Play className="w-3 h-3 mr-1" />
            Активировать
          </Button>
        ) : (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePause}
              className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
            >
              <Pause className="w-3 h-3 mr-1" />
              {status.isPaused ? 'Возобновить' : 'Пауза'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDeactivate}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <Square className="w-3 h-3 mr-1" />
              Отключить
            </Button>
          </>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSchedule}
          className="text-blue-600 hover:bg-blue-50"
        >
          <Calendar className="w-3 h-3 mr-1" />
          Запланировать
        </Button>
      </div>

      {/* Дата последней записи */}
      <div className="text-xs text-gray-500">
        Последняя запись: {formatDate(status.lastEntryDate)}
      </div>
    </div>
  );
};

export default DiaryStatusManager;
