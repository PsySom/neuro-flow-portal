
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { calculateActivityLayouts, generateTimeMarkers } from './utils/timeUtils';
import TimeMarkers from './components/TimeMarkers';
import ActivityCard from './components/ActivityCard';
import CurrentTimeIndicator from './components/CurrentTimeIndicator';
import CreateActivityDialog from './components/CreateActivityDialog';
import { useActivities } from '@/contexts/ActivitiesContext';

interface DayViewProps {
  currentDate: Date;
}

const DayView: React.FC<DayViewProps> = ({ currentDate }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [filteredTypes, setFilteredTypes] = useState<Set<string>>(new Set());
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { activities, toggleActivityComplete, addActivity } = useActivities();

  const currentTimeString = new Date().toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Функция автоскроллинга к текущему времени
  const scrollToCurrentTime = () => {
    if (!scrollAreaRef.current) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Рассчитываем позицию текущего времени (90px на час)
    const currentTimePosition = currentHour * 90 + (currentMinute / 60) * 90;
    
    const containerHeight = scrollAreaRef.current.clientHeight;
    let scrollTop;

    // Логика позиционирования: в первой половине дня (до 12:00) - в верхней трети
    if (currentHour < 12) {
      scrollTop = Math.max(0, currentTimePosition - containerHeight / 3);
    } else {
      // После полудня постепенно двигаемся к центру и ниже
      const progressAfterNoon = (currentHour - 12) / 12; // от 0 до 1
      const targetPosition = containerHeight / 3 + (progressAfterNoon * containerHeight / 3);
      scrollTop = Math.max(0, currentTimePosition - targetPosition);
    }

    scrollAreaRef.current.scrollTo({
      top: scrollTop,
      behavior: 'smooth'
    });
  };

  // Автоскроллинг при загрузке компонента
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToCurrentTime();
    }, 100); // Небольшая задержка для корректного рендеринга

    return () => clearTimeout(timer);
  }, [currentDate]);

  // Обработчик переключения состояния активности
  const handleActivityToggle = (activityId: number) => {
    toggleActivityComplete(activityId);
  };

  // Фильтруем активности по выбранным типам
  const visibleActivities = activities.filter(activity => 
    !filteredTypes.has(activity.type)
  );

  const activityLayouts = calculateActivityLayouts(visibleActivities);
  const timeMarkers = generateTimeMarkers();

  // Получаем все возможные типы активностей
  const allActivityTypes = ['восстановление', 'нейтральная', 'смешанная', 'задача'];

  const handleEmptyAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    if (target.closest('[data-activity-card]')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    
    // Используем новое соотношение 90px на час
    const hourFromTop = Math.floor(clickY / 90);
    const minuteFromTop = Math.floor((clickY % 90) * (60 / 90));
    
    const clickTime = `${hourFromTop.toString().padStart(2, '0')}:${Math.round(minuteFromTop).toString().padStart(2, '0')}`;
    
    setSelectedTime(clickTime);
    setIsCreateDialogOpen(true);
  };

  const handleActivityCreate = (newActivity: any) => {
    addActivity(newActivity);
  };

  const handleTypeFilterChange = (type: string, checked: boolean) => {
    setFilteredTypes(prev => {
      const newFiltered = new Set(prev);
      if (checked) {
        newFiltered.delete(type);
      } else {
        newFiltered.add(type);
      }
      return newFiltered;
    });
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'восстановление': return 'Восстанавливающие';
      case 'нейтральная': return 'Нейтральные';
      case 'смешанная': return 'Смешанные';
      case 'задача': return 'Истощающие';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'восстановление': return 'bg-green-100 text-green-800';
      case 'нейтральная': return 'bg-gray-100 text-gray-800';
      case 'смешанная': return 'bg-yellow-100 text-yellow-800';
      case 'задача': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <>
      <div className="flex gap-4">
        {/* Левая панель с календарем и фильтрами - уменьшена на 20% */}
        <div className="w-64 space-y-4 flex-shrink-0">
          {/* Миниатюра календаря - компактнее */}
          <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
            <CardContent className="p-3">
              <h3 className="text-xs font-medium mb-2 text-gray-700">Календарь</h3>
              <Calendar
                mode="single"
                selected={currentDate}
                month={currentDate}
                className="rounded-md border-0 p-0 scale-90 origin-top-left"
                classNames={{
                  months: "flex flex-col space-y-2",
                  month: "space-y-2",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-xs font-medium",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-6 font-normal text-xs",
                  row: "flex w-full mt-1",
                  cell: "relative p-0 text-center text-xs focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
                  day: "h-6 w-6 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground text-xs",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground font-semibold",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                }}
              />
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
            <CardContent className="p-3">
              <h3 className="text-xs font-medium mb-2 text-gray-700">Фильтры активностей</h3>
              <div className="space-y-2">
                {allActivityTypes.map((type) => {
                  const count = activities.filter(a => a.type === type).length;
                  return (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-${type}`}
                        checked={!filteredTypes.has(type)}
                        onCheckedChange={(checked) => handleTypeFilterChange(type, checked as boolean)}
                        className="w-3 h-3"
                      />
                      <label
                        htmlFor={`filter-${type}`}
                        className="flex-1 flex items-center justify-between cursor-pointer"
                      >
                        <span className="text-xs text-gray-700">{getTypeDisplayName(type)}</span>
                        <Badge variant="secondary" className={`text-xs px-1 py-0 ${getTypeColor(type)}`}>
                          {count}
                        </Badge>
                      </label>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Основная область календаря - расширена */}
        <Card className="flex-1 h-[700px] bg-white/70 backdrop-blur-lg border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center space-x-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>Активности дня</span>
              </h2>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-red-500 text-white">
                  Сейчас: {currentTimeString}
                </Badge>
                <button
                  onClick={scrollToCurrentTime}
                  className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                >
                  К текущему времени
                </button>
              </div>
            </div>

            <div 
              ref={scrollAreaRef}
              className="flex h-[600px] overflow-y-auto"
            >
              {/* Временная шкала слева */}
              <TimeMarkers timeMarkers={timeMarkers} />

              {/* Область активностей */}
              <div 
                className="flex-1 relative pl-4 cursor-pointer" 
                style={{ height: '2160px' }} // Увеличено с 1440px до 2160px (24 * 90)
                onClick={handleEmptyAreaClick}
              >
                {/* Сетка часов */}
                {timeMarkers.slice(0, 24).map(({ hour, position }) => (
                  <div
                    key={hour}
                    className="absolute w-full border-t border-gray-100 hover:border-gray-200 transition-colors"
                    style={{ top: `${position}px` }}
                  />
                ))}

                {/* Активности */}
                {activityLayouts.map((layout) => (
                  <div key={layout.activity.id} data-activity-card>
                    <ActivityCard 
                      layout={layout} 
                      onToggleComplete={handleActivityToggle}
                    />
                  </div>
                ))}

                {/* Индикатор текущего времени */}
                <CurrentTimeIndicator />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateActivityDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        initialTime={selectedTime}
        onActivityCreate={handleActivityCreate}
      />
    </>
  );
};

export default DayView;
