import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const MockDataInspector = () => {
  const [moodEntries, setMoodEntries] = useState<any[]>([]);
  const [diaryStatus, setDiaryStatus] = useState<any>({});

  const loadData = () => {
    // Загружаем данные из localStorage
    const moodData = localStorage.getItem('mock_mood_entries');
    const statusData = localStorage.getItem('diary-status-/mood-diary');
    
    console.log('🔍 Загруженные данные из localStorage:');
    console.log('Mock mood entries:', moodData);
    console.log('Diary status:', statusData);
    
    setMoodEntries(moodData ? JSON.parse(moodData) : []);
    setDiaryStatus(statusData ? JSON.parse(statusData) : {});
  };

  const clearData = () => {
    localStorage.removeItem('mock_mood_entries');
    localStorage.removeItem('diary-status-/mood-diary');
    setMoodEntries([]);
    setDiaryStatus({});
    console.log('🗑️ Данные очищены');
    
    // Уведомляем график об изменении
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'mock_mood_entries',
      newValue: null,
      storageArea: localStorage
    }));
  };

  useEffect(() => {
    loadData();
    
    // Обновляем при изменениях в localStorage
    const handleStorageChange = () => {
      loadData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('mood-data-updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('mood-data-updated', handleStorageChange);
    };
  }, []);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🔍 Инспектор данных дневника (Mock режим)</span>
          <div className="space-x-2">
            <Button onClick={loadData} variant="outline" size="sm">
              🔄 Обновить
            </Button>
            <Button onClick={clearData} variant="destructive" size="sm">
              🗑️ Очистить
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Статус дневника */}
          <div>
            <h4 className="font-medium mb-2">📅 Статус дневника:</h4>
            <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
              {JSON.stringify(diaryStatus, null, 2)}
            </pre>
          </div>

          {/* Записи настроения */}
          <div>
            <h4 className="font-medium mb-2">
              📊 Записи настроения: 
              <Badge variant="secondary" className="ml-2">
                {moodEntries.length} записей
              </Badge>
            </h4>
            
            {moodEntries.length === 0 ? (
              <p className="text-muted-foreground">Нет сохраненных записей</p>
            ) : (
              <div className="space-y-3">
                {moodEntries.map((entry, index) => (
                  <div key={index} className="bg-muted p-3 rounded-md">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <strong>ID:</strong> {entry.id}
                      </div>
                      <div>
                        <strong>Настроение:</strong> {entry.mood_score}
                      </div>
                      <div>
                        <strong>Время:</strong> {new Date(entry.timestamp).toLocaleString()}
                      </div>
                      <div>
                        <strong>Эмоции:</strong> {entry.emotions?.length || 0}
                      </div>
                    </div>
                    <div className="mt-2">
                      <details>
                        <summary className="cursor-pointer text-sm text-muted-foreground">
                          Показать полные данные
                        </summary>
                        <pre className="mt-2 text-xs bg-background p-2 rounded border overflow-x-auto">
                          {JSON.stringify(entry, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MockDataInspector;