import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Check } from "lucide-react";
import {
  activityTemplatesService,
  ActivityTemplate,
  CreateTemplateInput,
} from "@/services/activity-templates.service";
import { Activity, ActivityKind } from "@/services/activities.service";
import { toast } from "@/hooks/use-toast";

interface TemplatesPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: ActivityTemplate) => void;
  currentActivity?: Activity;
}

const KIND_LABELS: Record<ActivityKind, string> = {
  restorative: "Восстанавливающая",
  neutral: "Нейтральная",
  mixed: "Смешанная",
  depleting: "Истощающая",
};

export function TemplatesPicker({
  open,
  onOpenChange,
  onSelectTemplate,
  currentActivity,
}: TemplatesPickerProps) {
  const queryClient = useQueryClient();
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [templateTitle, setTemplateTitle] = useState("");

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["activity-templates"],
    queryFn: () => activityTemplatesService.list(),
  });

  const saveTemplateMutation = useMutation({
    mutationFn: (input: CreateTemplateInput) =>
      activityTemplatesService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-templates"] });
      toast({
        title: "Шаблон сохранён",
        description: "Шаблон успешно добавлен",
      });
      setShowSaveForm(false);
      setTemplateTitle("");
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить шаблон",
        variant: "destructive",
      });
    },
  });

  const handleSaveAsTemplate = () => {
    if (!currentActivity || !templateTitle.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите название шаблона",
        variant: "destructive",
      });
      return;
    }

    if (!currentActivity.kind) {
      toast({
        title: "Ошибка",
        description: "Выберите тип активности",
        variant: "destructive",
      });
      return;
    }

    saveTemplateMutation.mutate({
      title: templateTitle,
      kind: currentActivity.kind,
      default_notes: currentActivity.description || undefined,
      is_public: false,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Шаблоны активностей</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {currentActivity && (
            <>
              <div className="space-y-2">
                {!showSaveForm ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowSaveForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Сохранить как шаблон
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="template-title">Название шаблона</Label>
                    <div className="flex gap-2">
                      <Input
                        id="template-title"
                        value={templateTitle}
                        onChange={(e) => setTemplateTitle(e.target.value)}
                        placeholder="Введите название..."
                      />
                      <Button
                        onClick={handleSaveAsTemplate}
                        disabled={saveTemplateMutation.isPending}
                      >
                        {saveTemplateMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowSaveForm(false);
                          setTemplateTitle("");
                        }}
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <Separator />
            </>
          )}

          <div>
            <h3 className="text-sm font-medium mb-3">Доступные шаблоны</h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : templates.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Нет доступных шаблонов
              </p>
            ) : (
              <div className="grid gap-3">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => {
                      onSelectTemplate(template);
                      onOpenChange(false);
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">
                          {template.title}
                        </CardTitle>
                        <Badge variant="secondary">
                          {KIND_LABELS[template.kind]}
                        </Badge>
                      </div>
                    </CardHeader>
                    {template.default_notes && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {template.default_notes}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
