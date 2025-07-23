import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DiaryStatus } from '@/components/diaries/DiaryStatusManager';

interface MoodDiaryConfig {
  entriesPerDay: number;
  fillingTimes: string[];
  reminderTimes: string[];
  activationDate: string;
  fillDays: number;
}

interface DiaryData {
  title: string;
  emoji: string;
  path: string;
  description: string;
  color: string;
  config?: MoodDiaryConfig;
}

interface DiaryStatusContextType {
  activeDiaries: (DiaryStatus & DiaryData)[];
  updateDiaryStatus: (diaryPath: string, status: DiaryStatus, diaryData: DiaryData) => void;
  removeDiary: (diaryPath: string) => void;
}

export type { MoodDiaryConfig, DiaryData };

const DiaryStatusContext = createContext<DiaryStatusContextType | undefined>(undefined);

export const useDiaryStatus = () => {
  const context = useContext(DiaryStatusContext);
  if (!context) {
    throw new Error('useDiaryStatus must be used within a DiaryStatusProvider');
  }
  return context;
};

interface DiaryStatusProviderProps {
  children: ReactNode;
}

export const DiaryStatusProvider: React.FC<DiaryStatusProviderProps> = ({ children }) => {
  const [activeDiaries, setActiveDiaries] = useState<(DiaryStatus & DiaryData)[]>([]);

  // Загружаем активные дневники из localStorage при инициализации
  useEffect(() => {
    const loadActiveDiaries = () => {
      const keys = Object.keys(localStorage);
      const diaryKeys = keys.filter(key => key.startsWith('diary-status-'));
      
      const active: (DiaryStatus & DiaryData)[] = [];
      
      diaryKeys.forEach(key => {
        try {
          const status = JSON.parse(localStorage.getItem(key) || '{}') as DiaryStatus;
          if (status.isActive) {
            // Получаем данные дневника из ключа localStorage
            const diaryPath = key.replace('diary-status-', '');
            const diaryData = getDiaryDataByPath(diaryPath);
            if (diaryData) {
              active.push({ ...status, ...diaryData });
            }
          }
        } catch (error) {
          console.error('Error loading diary status:', error);
        }
      });
      
      setActiveDiaries(active);
    };

    loadActiveDiaries();

    // Слушаем изменения в localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('diary-status-')) {
        loadActiveDiaries();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Также слушаем кастомное событие для изменений в том же окне
    const handleCustomEvent = () => {
      loadActiveDiaries();
    };
    
    window.addEventListener('diary-status-changed', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('diary-status-changed', handleCustomEvent);
    };
  }, []);

  const updateDiaryStatus = (diaryPath: string, status: DiaryStatus, diaryData: DiaryData) => {
    if (status.isActive) {
      setActiveDiaries(prev => {
        const existing = prev.find(d => d.path === diaryPath);
        if (existing) {
          return prev.map(d => d.path === diaryPath ? { ...status, ...diaryData } : d);
        } else {
          return [...prev, { ...status, ...diaryData }];
        }
      });
    } else {
      setActiveDiaries(prev => prev.filter(d => d.path !== diaryPath));
    }
    
    // Отправляем кастомное событие для синхронизации
    window.dispatchEvent(new CustomEvent('diary-status-changed'));
  };

  const removeDiary = (diaryPath: string) => {
    setActiveDiaries(prev => prev.filter(d => d.path !== diaryPath));
    localStorage.removeItem(`diary-status-${diaryPath}`);
    window.dispatchEvent(new CustomEvent('diary-status-changed'));
  };

  return (
    <DiaryStatusContext.Provider value={{ activeDiaries, updateDiaryStatus, removeDiary }}>
      {children}
    </DiaryStatusContext.Provider>
  );
};

// Получение данных дневника по пути
const getDiaryDataByPath = (path: string): DiaryData | null => {
  const diaryTypes = [
    {
      title: 'Дневник настроения',
      emoji: '😊',
      path: '/mood-diary',
      description: 'Отслеживайте свои эмоции и настроение',
      color: 'from-pink-100 to-pink-200'
    },
    {
      title: 'Дневник мыслей',
      emoji: '💭',
      path: '/thoughts-diary',
      description: 'Анализируйте и переосмысливайте свои мысли',
      color: 'from-blue-100 to-blue-200'
    },
    {
      title: 'Дневник самооценки',
      emoji: '✨',
      path: '/self-esteem-diary',
      description: 'Укрепляйте уверенность в себе',
      color: 'from-emerald-100 to-emerald-200'
    },
    {
      title: 'Дневник работы с прокрастинацией',
      emoji: '⏰',
      path: '/procrastination-diary',
      description: 'Преодолевайте откладывание дел',
      color: 'from-orange-100 to-orange-200'
    },
    {
      title: 'Дневник работы с ОКР',
      emoji: '🔄',
      path: '/ocd-diary',
      description: 'Работа с обсессивно-компульсивными расстройствами',
      color: 'from-purple-100 to-purple-200'
    },
    {
      title: 'Дневник работы с депрессией',
      emoji: '🌱',
      path: '/depression-care-diary',
      description: 'Поддержка в работе с депрессивными состояниями',
      color: 'from-green-100 to-green-200'
    },
    {
      title: 'Дневник сна и отдыха',
      emoji: '😴',
      path: '/sleep-diary',
      description: 'Отслеживайте качество сна и восстановления',
      color: 'from-indigo-100 to-indigo-200'
    }
  ];

  return diaryTypes.find(diary => diary.path === path) || null;
};