import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Play, Pause, Square } from 'lucide-react';
import { useDiaryStatus, type MoodDiaryConfig } from '@/contexts/DiaryStatusContext';
import MoodDiaryConfigDialog from './MoodDiaryConfigDialog';
import { userActiveDiariesService } from '@/services/user-active-diaries.service';
import { useToast } from '@/hooks/use-toast';

export interface DiaryStatus {
  id: string;
  isActive: boolean;
  isPaused: boolean;
  lastEntryDate: string | null;
  scheduledDate: string | null;
  config?: MoodDiaryConfig;
}

interface DiaryStatusManagerProps {
  diaryPath: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
  scenarioSlug?: string;
  onStatusChange?: (status: DiaryStatus) => void;
}

const DiaryStatusManager: React.FC<DiaryStatusManagerProps> = ({
  diaryPath,
  title,
  emoji,
  description,
  color,
  scenarioSlug,
  onStatusChange
}) => {
  const { updateDiaryStatus } = useDiaryStatus();
  const { toast } = useToast();
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
  const [showConfigDialog, setShowConfigDialog] = useState(false);

  const isMoodDiary = diaryPath === '/mood-diary';

  const updateStatus = (newStatus: Partial<DiaryStatus>) => {
    const updatedStatus = { ...status, ...newStatus };
    setStatus(updatedStatus);
    localStorage.setItem(`diary-status-${diaryPath}`, JSON.stringify(updatedStatus));
    
    // Обновляем контекст с данными дневника
    updateDiaryStatus(diaryPath, updatedStatus, { title, emoji, description, color, path: diaryPath });
    
    onStatusChange?.(updatedStatus);
  };

  const handleActivate = () => {
    // Все дневники теперь используют конфигурацию
    setShowConfigDialog(true);
  };

  const handleMoodDiaryConfig = async (config: MoodDiaryConfig) => {
    updateStatus({ 
      isActive: true, 
      isPaused: false, 
      config,
      lastEntryDate: null,
      scheduledDate: new Date().toISOString().split('T')[0]
    });

    // Активируем сценарий в БД, если указан scenarioSlug
    if (scenarioSlug) {
      try {
        await userActiveDiariesService.activateScenario(scenarioSlug);
        toast({
          title: "Успешно",
          description: "Дневник активирован и добавлен в раздел 'Активные'",
        });
      } catch (error) {
        console.error('Error activating scenario:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось активировать дневник в базе данных",
          variant: "destructive",
        });
      }
    }
  };

  const handlePause = () => {
    updateStatus({ isPaused: !status.isPaused });
  };

  const handleDeactivate = async () => {
    updateStatus({ isActive: false, isPaused: false });

    // Деактивируем сценарий в БД, если указан scenarioSlug
    if (scenarioSlug) {
      try {
        await userActiveDiariesService.deactivateScenario(scenarioSlug);
        toast({
          title: "Успешно",
          description: "Дневник деактивирован",
        });
      } catch (error) {
        console.error('Error deactivating scenario:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось деактивировать дневник в базе данных",
          variant: "destructive",
        });
      }
    }
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

      {/* Диалог конфигурации для всех дневников */}
      <MoodDiaryConfigDialog
        open={showConfigDialog}
        onOpenChange={setShowConfigDialog}
        onSave={handleMoodDiaryConfig}
      />
    </div>
  );
};

export default DiaryStatusManager;
