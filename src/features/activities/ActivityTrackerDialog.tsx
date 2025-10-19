import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  fourScaleTrackerService,
  TrackerScope,
  DayPart,
  CreateTrackerInput,
} from "@/services/four-scale-tracker.service";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ActivityTrackerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scope: TrackerScope;
  activityId?: string;
  date?: string;
}

const SCALE_LABELS = {
  process_satisfaction: "Удовлетворённость процессом",
  result_satisfaction: "Удовлетворённость результатом",
  energy_cost: "Энергозатраты",
  stress_level: "Уровень стресса",
};

export function ActivityTrackerDialog({
  open,
  onOpenChange,
  scope,
  activityId,
  date,
}: ActivityTrackerDialogProps) {
  const queryClient = useQueryClient();
  const [values, setValues] = useState({
    process_satisfaction: 5,
    result_satisfaction: 5,
    energy_cost: 5,
    stress_level: 5,
  });
  const [dayPart, setDayPart] = useState<DayPart>("morning");
  const [selectedDate, setSelectedDate] = useState(
    date || format(new Date(), "yyyy-MM-dd")
  );

  useEffect(() => {
    if (date) {
      setSelectedDate(date);
    }
  }, [date]);

  const createTrackerMutation = useMutation({
    mutationFn: (input: CreateTrackerInput) =>
      fourScaleTrackerService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["four-scale-trackers"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast({
        title: "Оценка сохранена",
        description: "Ваша оценка успешно записана",
      });
      onOpenChange(false);
      setValues({
        process_satisfaction: 5,
        result_satisfaction: 5,
        energy_cost: 5,
        stress_level: 5,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось сохранить оценку",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    const input: CreateTrackerInput = {
      scope,
      date: selectedDate,
      ...values,
    };

    if (scope === "activity" && activityId) {
      input.activity_id = activityId;
    } else if (scope === "day_part") {
      input.day_part = dayPart;
    }

    createTrackerMutation.mutate(input);
  };

  const getScopeTitle = () => {
    switch (scope) {
      case "activity":
        return "Оценка активности";
      case "day":
        return "Оценка дня";
      case "day_part":
        return "Оценка части дня";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{getScopeTitle()}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {scope === "day_part" && (
            <div>
              <Label htmlFor="day-part">Часть дня</Label>
              <Select value={dayPart} onValueChange={(v) => setDayPart(v as DayPart)}>
                <SelectTrigger id="day-part">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Утро</SelectItem>
                  <SelectItem value="afternoon">День</SelectItem>
                  <SelectItem value="evening">Вечер</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {scope !== "activity" && (
            <div>
              <Label htmlFor="date">Дата</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          )}

          {Object.entries(SCALE_LABELS).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={key}>{label}</Label>
                <span className="text-sm font-medium">
                  {values[key as keyof typeof values]}
                </span>
              </div>
              <Input
                id={key}
                type="range"
                min={0}
                max={10}
                step={1}
                value={values[key as keyof typeof values]}
                onChange={(e) =>
                  setValues({
                    ...values,
                    [key]: Number(e.target.value),
                  })
                }
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={createTrackerMutation.isPending}
          >
            {createTrackerMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Сохранение...
              </>
            ) : (
              "Сохранить"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
