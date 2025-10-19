import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2,
  Clock,
  Edit2,
  Loader2,
  MoreVertical,
  Star,
  Trash2,
} from "lucide-react";
import {
  activitiesService,
  Activity,
  ActivityKind,
  CreateActivityInput,
} from "@/services/activities.service";
import { ActivityEditor } from "./ActivityEditor";
import { ActivityTrackerDialog } from "./ActivityTrackerDialog";
import { TemplatesPicker } from "./TemplatesPicker";
import { ActivityTemplate } from "@/services/activity-templates.service";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const KIND_LABELS: Record<ActivityKind, string> = {
  restorative: "Восстанавливающая",
  neutral: "Нейтральная",
  mixed: "Смешанная",
  depleting: "Истощающая",
};

const KIND_COLORS: Record<ActivityKind, string> = {
  restorative: "bg-green-500/10 text-green-700 dark:text-green-400",
  neutral: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  mixed: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  depleting: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export function ActivityFeed() {
  const queryClient = useQueryClient();
  const [editorOpen, setEditorOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>();
  const [trackerActivityId, setTrackerActivityId] = useState<string | undefined>();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: () => activitiesService.list({ limit: 50 }),
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateActivityInput) => activitiesService.create(input),
    onMutate: async (newActivity) => {
      await queryClient.cancelQueries({ queryKey: ["activities"] });
      const previousActivities = queryClient.getQueryData(["activities"]);

      queryClient.setQueryData(["activities"], (old: Activity[] = []) => [
        {
          id: "temp-" + Date.now(),
          user_id: "temp",
          ...newActivity,
          status: "planned",
          metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Activity,
        ...old,
      ]);

      return { previousActivities };
    },
    onError: (err, newActivity, context) => {
      queryClient.setQueryData(["activities"], context?.previousActivities);
      toast({
        title: "Ошибка",
        description: "Не удалось создать активность",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      setEditorOpen(false);
      setSelectedActivity(undefined);
      toast({
        title: "Создано",
        description: "Активность успешно создана",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateActivityInput }) =>
      activitiesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      setEditorOpen(false);
      setSelectedActivity(undefined);
      toast({
        title: "Обновлено",
        description: "Активность успешно обновлена",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить активность",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => activitiesService.delete(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["activities"] });
      const previousActivities = queryClient.getQueryData(["activities"]);

      queryClient.setQueryData(["activities"], (old: Activity[] = []) =>
        old.filter((a) => a.id !== deletedId)
      );

      return { previousActivities };
    },
    onError: (err, deletedId, context) => {
      queryClient.setQueryData(["activities"], context?.previousActivities);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить активность",
        variant: "destructive",
      });
    },
    onSuccess: (_, deletedId, context) => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast({
        title: "Удалено",
        description: "Активность удалена",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              queryClient.setQueryData(["activities"], context?.previousActivities);
              queryClient.invalidateQueries({ queryKey: ["activities"] });
            }}
          >
            Отменить
          </Button>
        ),
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => activitiesService.updateStatus(id, "completed"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast({
        title: "Завершено",
        description: "Активность отмечена как выполненная",
      });
    },
  });

  const handleSave = (data: CreateActivityInput) => {
    if (selectedActivity) {
      updateMutation.mutate({ id: selectedActivity.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleTemplateSelect = (template: ActivityTemplate) => {
    setSelectedActivity({
      id: "",
      user_id: "",
      title: template.title,
      activity_type_id: 1,
      kind: template.kind,
      description: template.default_notes,
      start_time: new Date().toISOString(),
      end_time: null,
      planned_at: null,
      from_template_id: template.id,
      calendar_provider: null,
      calendar_event_id: null,
      calendar_sync_status: null,
      status: "planned",
      metadata: template.metadata,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setEditorOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => {
          setSelectedActivity(undefined);
          setEditorOpen(true);
        }}>
          Создать активность
        </Button>
        <Button variant="outline" onClick={() => setTemplatesOpen(true)}>
          <Star className="h-4 w-4 mr-2" />
          Из шаблона
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setTrackerActivityId(undefined);
            setTrackerOpen(true);
          }}
        >
          Оценить день
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : activities.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Нет активностей. Создайте первую!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <Card key={activity.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{activity.title}</h3>
                      {activity.kind && (
                        <Badge
                          variant="secondary"
                          className={KIND_COLORS[activity.kind]}
                        >
                          {KIND_LABELS[activity.kind]}
                        </Badge>
                      )}
                      {activity.status === "completed" && (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Выполнено
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {format(new Date(activity.start_time), "d MMMM, HH:mm", {
                        locale: ru,
                      })}
                    </p>
                    {activity.description && (
                      <p className="text-sm">{activity.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {activity.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => completeMutation.mutate(activity.id)}
                        disabled={completeMutation.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setTrackerActivityId(activity.id);
                        setTrackerOpen(true);
                      }}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedActivity(activity);
                            setEditorOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteMutation.mutate(activity.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <ActivityEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        activity={selectedActivity}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ActivityTrackerDialog
        open={trackerOpen}
        onOpenChange={setTrackerOpen}
        scope={trackerActivityId ? "activity" : "day"}
        activityId={trackerActivityId}
      />

      <TemplatesPicker
        open={templatesOpen}
        onOpenChange={setTemplatesOpen}
        onSelectTemplate={handleTemplateSelect}
        currentActivity={selectedActivity}
      />
    </div>
  );
}
