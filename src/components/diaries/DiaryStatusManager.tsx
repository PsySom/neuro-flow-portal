import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Play, Pause, Square } from 'lucide-react';
import { useDiaryStatus } from '@/contexts/DiaryStatusContext';

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
  emoji: string;
  description: string;
  color: string;
  onStatusChange?: (status: DiaryStatus) => void;
}

const DiaryStatusManager: React.FC<DiaryStatusManagerProps> = ({
  diaryPath,
  title,
  emoji,
  description,
  color,
  onStatusChange
}) => {
  const { updateDiaryStatus } = useDiaryStatus();
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
    
    // Обновляем контекст с данными дневника
    updateDiaryStatus(diaryPath, updatedStatus, { title, emoji, description, color, path: diaryPath });
    
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
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {/* Статус */}
      {getStatusBadge()}
      
      {/* Запланированная дата */}
      {status.scheduledDate && (
        <Badge variant="outline" className="text-xs">
          <Calendar className="w-3 h-3 mr-1" />
          {formatDate(status.scheduledDate)}
        </Badge>
      )}

      {/* Кнопки управления */}
      {!status.isActive ? (
        <Button
          size="sm"
          variant="outline"
          onClick={handleActivate}
          className="text-green-600 border-green-600 hover:bg-green-50 h-6 px-2 text-xs"
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
            className="text-yellow-600 border-yellow-600 hover:bg-yellow-50 h-6 px-2 text-xs"
          >
            <Pause className="w-3 h-3 mr-1" />
            {status.isPaused ? 'Возобновить' : 'Пауза'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDeactivate}
            className="text-red-600 border-red-600 hover:bg-red-50 h-6 px-2 text-xs"
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
        className="text-blue-600 hover:bg-blue-50 h-6 px-2 text-xs"
      >
        <Calendar className="w-3 h-3 mr-1" />
        Запланировать
      </Button>

      {/* Дата последней записи */}
      <span className="text-gray-500 ml-2">
        Последняя: {formatDate(status.lastEntryDate)}
      </span>
    </div>
  );
};

export default DiaryStatusManager;
