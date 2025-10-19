import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  createActivitySchema,
  CreateActivityInput,
  Activity,
  ActivityKind,
} from "@/services/activities.service";

interface ActivityEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity?: Activity;
  onSave: (data: CreateActivityInput) => void;
  isLoading?: boolean;
}

const KIND_LABELS: Record<ActivityKind, string> = {
  restorative: "Восстанавливающая",
  neutral: "Нейтральная",
  mixed: "Смешанная",
  depleting: "Истощающая",
};

export function ActivityEditor({
  open,
  onOpenChange,
  activity,
  onSave,
  isLoading,
}: ActivityEditorProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateActivityInput>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      activity_type_id: 1,
      start_time: new Date().toISOString(),
    },
  });

  const kind = watch("kind");

  useEffect(() => {
    if (activity) {
      reset({
        title: activity.title,
        activity_type_id: activity.activity_type_id,
        kind: activity.kind || undefined,
        description: activity.description || undefined,
        start_time: activity.start_time,
        end_time: activity.end_time || undefined,
        planned_at: activity.planned_at || undefined,
      });
    } else {
      reset({
        activity_type_id: 1,
        start_time: new Date().toISOString(),
      });
    }
  }, [activity, reset]);

  const onSubmit = (data: CreateActivityInput) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {activity ? "Редактировать активность" : "Новая активность"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Название *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Название активности"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="kind">Тип активности</Label>
            <Select
              value={kind || ""}
              onValueChange={(value) => setValue("kind", value as ActivityKind)}
            >
              <SelectTrigger id="kind">
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(KIND_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="start_time">Начало *</Label>
              <Input
                id="start_time"
                type="datetime-local"
                {...register("start_time")}
              />
              {errors.start_time && (
                <p className="text-sm text-destructive mt-1">
                  {errors.start_time.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="end_time">Окончание</Label>
              <Input
                id="end_time"
                type="datetime-local"
                {...register("end_time")}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="planned_at">Запланировано на</Label>
            <Input
              id="planned_at"
              type="datetime-local"
              {...register("planned_at")}
            />
          </div>

          <div>
            <Label htmlFor="description">Заметки</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Добавьте заметки об активности..."
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                "Сохранить"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
