import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { scenarioService } from '@/services/scenario.service';
import type { DiaryEntry, DiaryMetric, DiaryEmotion } from '@/types/scenario.types';

export const StructuredHistory = () => {
  const [entries, setEntries] = useState<Array<DiaryEntry & { 
    hasAbnormalMetrics?: boolean;
    metrics?: DiaryMetric[];
    emotions?: DiaryEmotion[];
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<typeof entries[0] | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await scenarioService.getRecentEntries(20);
      setEntries(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTopicLabel = (topic: string) => {
    const labels: Record<string, string> = {
      'mood_diary_flow': 'Настроение',
      'sleep': 'Сон',
      'thoughts': 'Мысли'
    };
    return labels[topic] || topic;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Пока нет сохранённых записей</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {entries.map(entry => (
          <Card 
            key={entry.id}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => setSelectedEntry(entry)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">
                      {getTopicLabel(entry.topic)}
                    </Badge>
                    {entry.hasAbnormalMetrics && (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {format(new Date(entry.created_at), 'd MMMM yyyy, HH:mm', { locale: ru })}
                    </span>
                  </div>
                  {entry.context && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {entry.context}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedEntry && (
                <>
                  <Badge variant="secondary">
                    {getTopicLabel(selectedEntry.topic)}
                  </Badge>
                  {selectedEntry.hasAbnormalMetrics && (
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  )}
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedEntry && (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(selectedEntry.created_at), 'd MMMM yyyy, HH:mm', { locale: ru })}
                </p>
              </div>

              {selectedEntry.context && (
                <div>
                  <h4 className="font-medium mb-2">Контекст</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedEntry.context}
                  </p>
                </div>
              )}

              {selectedEntry.metrics && selectedEntry.metrics.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Метрики</h4>
                  <div className="space-y-2">
                    {selectedEntry.metrics.map((metric) => {
                      const isAbnormal = 
                        (metric.norm_min !== null && metric.value < metric.norm_min) ||
                        (metric.norm_max !== null && metric.value > metric.norm_max);

                      return (
                        <div 
                          key={metric.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{metric.key}</span>
                            {isAbnormal && (
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                          <div className="text-sm">
                            <span className={`font-bold ${isAbnormal ? 'text-destructive' : ''}`}>
                              {metric.value}
                            </span>
                            {(metric.norm_min !== null || metric.norm_max !== null) && (
                              <span className="text-muted-foreground ml-2">
                                (норма: {metric.norm_min ?? '—'}–{metric.norm_max ?? '—'})
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedEntry.emotions && selectedEntry.emotions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Эмоции</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.emotions.map((emotion) => (
                      <Badge key={emotion.id} variant="outline">
                        {emotion.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
