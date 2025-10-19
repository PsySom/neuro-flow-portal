import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Save, Loader2, Plus, X } from "lucide-react";
import { diaryService, CreateStructuredInput } from "@/services/diary.service";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface StructuredDraft {
  topic: string;
  context: string;
  metrics: Record<string, number>;
  emotions: Array<{ label: string; intensity: number }>;
}

interface StructuredPanelProps {
  draft: StructuredDraft;
  onDraftChange: (draft: StructuredDraft) => void;
  onClearDraft: () => void;
}

const TOPICS = [
  { value: "sleep", label: "Сон" },
  { value: "mood", label: "Настроение" },
  { value: "stress", label: "Стресс" },
  { value: "energy", label: "Энергия" },
  { value: "anxiety", label: "Тревога" },
  { value: "other", label: "Другое" },
];

const METRIC_CONFIGS: Record<string, { label: string; min: number; max: number }> = {
  mood: { label: "Настроение", min: 0, max: 10 },
  stress: { label: "Уровень стресса", min: 0, max: 10 },
  energy: { label: "Энергия", min: 0, max: 10 },
  sleep_quality: { label: "Качество сна", min: 0, max: 10 },
  anxiety: { label: "Тревожность", min: 0, max: 10 },
};

const COMMON_EMOTIONS = [
  "Радость", "Грусть", "Тревога", "Спокойствие",
  "Раздражение", "Усталость", "Энергичность", "Уверенность"
];

export function StructuredPanel({
  draft,
  onDraftChange,
  onClearDraft,
}: StructuredPanelProps) {
  const queryClient = useQueryClient();
  const [newEmotion, setNewEmotion] = useState("");

  const { data: defaultNorms = [] } = useQuery({
    queryKey: ["default-norms"],
    queryFn: () => diaryService.getDefaultNorms(),
  });

  const createEntryMutation = useMutation({
    mutationFn: (input: CreateStructuredInput) => diaryService.createStructured(input),
    onMutate: async (newEntry) => {
      await queryClient.cancelQueries({ queryKey: ["diary-entries"] });
      const previousEntries = queryClient.getQueryData(["diary-entries"]);

      queryClient.setQueryData(["diary-entries"], (old: any[] = []) => [
        {
          id: "temp-" + Date.now(),
          user_id: "temp",
          topic: newEntry.topic,
          context: newEntry.context,
          ai_summary: null,
          metadata: {},
          created_at: new Date().toISOString(),
        },
        ...old,
      ]);

      return { previousEntries };
    },
    onError: (err, newEntry, context) => {
      queryClient.setQueryData(["diary-entries"], context?.previousEntries);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить запись",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diary-entries"] });
      queryClient.invalidateQueries({ queryKey: ["diary-history"] });
      queryClient.invalidateQueries({ queryKey: ["diary-metrics"] });
      onClearDraft();
      toast({
        title: "Сохранено",
        description: "Запись успешно добавлена",
      });
    },
  });

  const handleSave = () => {
    if (!draft.topic) {
      toast({
        title: "Ошибка",
        description: "Выберите тему записи",
        variant: "destructive",
      });
      return;
    }

    const metrics = Object.entries(draft.metrics).map(([key, value]) => {
      const norm = defaultNorms.find((n) => n.metric_key === key);
      return {
        key,
        value,
        norm_min: norm?.norm_min,
        norm_max: norm?.norm_max,
      };
    });

    if (metrics.length === 0) {
      toast({
        title: "Ошибка",
        description: "Добавьте хотя бы одну метрику",
        variant: "destructive",
      });
      return;
    }

    createEntryMutation.mutate({
      topic: draft.topic,
      context: draft.context,
      metrics,
      emotions: draft.emotions,
    });
  };

  const updateMetric = (key: string, value: number) => {
    onDraftChange({
      ...draft,
      metrics: { ...draft.metrics, [key]: value },
    });
  };

  const addEmotion = (label: string) => {
    if (draft.emotions.some((e) => e.label === label)) return;
    onDraftChange({
      ...draft,
      emotions: [...draft.emotions, { label, intensity: 5 }],
    });
    setNewEmotion("");
  };

  const removeEmotion = (label: string) => {
    onDraftChange({
      ...draft,
      emotions: draft.emotions.filter((e) => e.label !== label),
    });
  };

  const updateEmotionIntensity = (label: string, intensity: number) => {
    onDraftChange({
      ...draft,
      emotions: draft.emotions.map((e) =>
        e.label === label ? { ...e, intensity } : e
      ),
    });
  };

  const getNormBand = (key: string, value: number) => {
    const norm = defaultNorms.find((n) => n.metric_key === key);
    if (!norm) return null;

    const { norm_min, norm_max } = norm;
    const percentage = ((value - 0) / 10) * 100;
    const normStartPercentage = ((norm_min - 0) / 10) * 100;
    const normEndPercentage = ((norm_max - 0) / 10) * 100;

    const isInNorm = value >= norm_min && value <= norm_max;

    return (
      <div className="relative h-2 bg-muted rounded-full mt-2">
        <div
          className="absolute h-full bg-primary/20 rounded-full"
          style={{
            left: `${normStartPercentage}%`,
            width: `${normEndPercentage - normStartPercentage}%`,
          }}
        />
        <div
          className={`absolute h-3 w-3 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 ${
            isInNorm ? "bg-primary" : "bg-destructive"
          }`}
          style={{ left: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="topic">Тема записи</Label>
          <Select
            value={draft.topic}
            onValueChange={(value) => onDraftChange({ ...draft, topic: value })}
          >
            <SelectTrigger id="topic">
              <SelectValue placeholder="Выберите тему" />
            </SelectTrigger>
            <SelectContent>
              {TOPICS.map((topic) => (
                <SelectItem key={topic.value} value={topic.value}>
                  {topic.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="context">Контекст (опционально)</Label>
          <Textarea
            id="context"
            placeholder="Добавьте дополнительный контекст..."
            value={draft.context}
            onChange={(e) =>
              onDraftChange({ ...draft, context: e.target.value })
            }
            className="min-h-[100px] resize-none"
          />
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-3">Метрики</h4>
          <div className="space-y-4">
            {Object.entries(METRIC_CONFIGS).map(([key, config]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor={key}>{config.label}</Label>
                  <span className="text-sm font-medium">
                    {draft.metrics[key] || 0}
                  </span>
                </div>
                <Input
                  id={key}
                  type="range"
                  min={config.min}
                  max={config.max}
                  step={1}
                  value={draft.metrics[key] || 0}
                  onChange={(e) => updateMetric(key, Number(e.target.value))}
                  className="cursor-pointer"
                />
                {draft.metrics[key] !== undefined &&
                  getNormBand(key, draft.metrics[key])}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-3">Эмоции</h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {COMMON_EMOTIONS.map((emotion) => (
              <Badge
                key={emotion}
                variant={
                  draft.emotions.some((e) => e.label === emotion)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() =>
                  draft.emotions.some((e) => e.label === emotion)
                    ? removeEmotion(emotion)
                    : addEmotion(emotion)
                }
              >
                {emotion}
                {draft.emotions.some((e) => e.label === emotion) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>

          {draft.emotions.length > 0 && (
            <div className="space-y-3 mt-4">
              {draft.emotions.map((emotion) => (
                <div key={emotion.label}>
                  <div className="flex items-center justify-between mb-2">
                    <Label>{emotion.label}</Label>
                    <span className="text-sm font-medium">
                      {emotion.intensity}
                    </span>
                  </div>
                  <Input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={emotion.intensity}
                    onChange={(e) =>
                      updateEmotionIntensity(emotion.label, Number(e.target.value))
                    }
                    className="cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClearDraft}
            disabled={!draft.topic && Object.keys(draft.metrics).length === 0}
          >
            Очистить
          </Button>
          <Button
            onClick={handleSave}
            disabled={createEntryMutation.isPending}
          >
            {createEntryMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Сохранить
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
