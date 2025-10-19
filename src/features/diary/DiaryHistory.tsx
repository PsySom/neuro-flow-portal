import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Loader2,
  Tag,
} from "lucide-react";
import { diaryService, DiaryHistoryFilters } from "@/services/diary.service";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const TOPICS = [
  { value: "all", label: "Все темы" },
  { value: "sleep", label: "Сон" },
  { value: "mood", label: "Настроение" },
  { value: "stress", label: "Стресс" },
  { value: "energy", label: "Энергия" },
  { value: "anxiety", label: "Тревога" },
  { value: "other", label: "Другое" },
];

export function DiaryHistory() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<DiaryHistoryFilters>({
    type: "all",
    limit: 20,
    offset: 0,
  });

  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    itemId: string;
    type: "note" | "structured";
    content: string;
    topics?: string[];
  }>({
    isOpen: false,
    itemId: "",
    type: "note",
    content: "",
  });

  const { data: historyData, isLoading } = useQuery({
    queryKey: ["diary-history", filters],
    queryFn: () => diaryService.getDiaryHistory(filters),
  });

  const updateTopicsMutation = useMutation({
    mutationFn: ({ noteId, topics }: { noteId: string; topics: string[] }) =>
      diaryService.updateNoteTopics(noteId, topics),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diary-history"] });
      queryClient.invalidateQueries({ queryKey: ["diary-notes"] });
      toast({ title: "Теги обновлены" });
      setEditDialog({ ...editDialog, isOpen: false });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить теги",
        variant: "destructive",
      });
    },
  });

  const updateContextMutation = useMutation({
    mutationFn: ({ entryId, context }: { entryId: string; context: string }) =>
      diaryService.updateEntryContext(entryId, context),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diary-history"] });
      queryClient.invalidateQueries({ queryKey: ["diary-entries"] });
      toast({ title: "Контекст обновлен" });
      setEditDialog({ ...editDialog, isOpen: false });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить контекст",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (
    itemId: string,
    type: "note" | "structured",
    content: string,
    topics?: string[]
  ) => {
    setEditDialog({
      isOpen: true,
      itemId,
      type,
      content,
      topics,
    });
  };

  const handleSaveEdit = () => {
    if (editDialog.type === "note" && editDialog.topics) {
      updateTopicsMutation.mutate({
        noteId: editDialog.itemId,
        topics: editDialog.topics,
      });
    } else if (editDialog.type === "structured") {
      updateContextMutation.mutate({
        entryId: editDialog.itemId,
        context: editDialog.content,
      });
    }
  };

  const handlePageChange = (direction: "prev" | "next") => {
    const newOffset =
      direction === "next"
        ? (filters.offset || 0) + (filters.limit || 20)
        : Math.max(0, (filters.offset || 0) - (filters.limit || 20));

    setFilters({ ...filters, offset: newOffset });
  };

  const currentPage = Math.floor((filters.offset || 0) / (filters.limit || 20)) + 1;
  const totalPages = Math.ceil((historyData?.total || 0) / (filters.limit || 20));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>История дневника</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={filters.type || "all"}
            onValueChange={(value) =>
              setFilters({ ...filters, type: value as any, offset: 0 })
            }
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="notes">Заметки</TabsTrigger>
              <TabsTrigger value="structured">Структурированные</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="topic-filter">Тема</Label>
              <Select
                value={filters.topic || "all"}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    topic: value === "all" ? undefined : value,
                    offset: 0,
                  })
                }
              >
                <SelectTrigger id="topic-filter">
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

            <div className="space-y-2">
              <Label htmlFor="date-filter">Дата</Label>
              <Input
                id="date-filter"
                type="date"
                value={filters.startDate || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    startDate: e.target.value || undefined,
                    offset: 0,
                  })
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="out-of-norm"
              checked={filters.onlyOutOfNorm || false}
              onCheckedChange={(checked) =>
                setFilters({
                  ...filters,
                  onlyOutOfNorm: checked === true,
                  offset: 0,
                })
              }
            />
            <Label htmlFor="out-of-norm" className="cursor-pointer">
              Только записи вне нормы
            </Label>
          </div>

          <Separator />

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : !historyData || historyData.items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Нет записей
            </p>
          ) : (
            <div className="space-y-3">
              {historyData.items.map((item) => (
                <Card key={item.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(item.created_at), "dd.MM.yyyy HH:mm")}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {item.type === "note" ? "Заметка" : "Структурированная"}
                          </Badge>
                          {item.hasOutOfNormMetrics && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Вне нормы
                            </Badge>
                          )}
                        </div>
                        {item.topic && (
                          <Badge variant="secondary" className="text-xs">
                            {TOPICS.find((t) => t.value === item.topic)?.label ||
                              item.topic}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleEdit(
                            item.id,
                            item.type === "note" ? "note" : "structured",
                            item.content,
                            item.topics
                          )
                        }
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {item.content && (
                      <p className="text-sm whitespace-pre-wrap mb-2">
                        {item.content}
                      </p>
                    )}
                    {item.topics && item.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.topics.map((topic, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {item.metrics && item.metrics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.metrics.map((metric) => (
                          <Badge
                            key={metric.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {metric.key}: {metric.value}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {historyData && historyData.items.length > 0 && (
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Назад
              </Button>
              <span className="text-sm text-muted-foreground">
                Страница {currentPage} из {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange("next")}
                disabled={currentPage >= totalPages}
              >
                Вперёд
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editDialog.isOpen} onOpenChange={(open) => 
        setEditDialog({ ...editDialog, isOpen: open })
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editDialog.type === "note" ? "Редактировать теги" : "Редактировать контекст"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editDialog.type === "note" ? (
              <div>
                <Label htmlFor="tags">Теги (через запятую)</Label>
                <Input
                  id="tags"
                  value={editDialog.topics?.join(", ") || ""}
                  onChange={(e) =>
                    setEditDialog({
                      ...editDialog,
                      topics: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter((t) => t),
                    })
                  }
                  placeholder="сон, настроение, работа"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="context">Контекст</Label>
                <Textarea
                  id="context"
                  value={editDialog.content}
                  onChange={(e) =>
                    setEditDialog({ ...editDialog, content: e.target.value })
                  }
                  className="min-h-[100px]"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialog({ ...editDialog, isOpen: false })}
            >
              Отмена
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={
                updateTopicsMutation.isPending || updateContextMutation.isPending
              }
            >
              {updateTopicsMutation.isPending || updateContextMutation.isPending ? (
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
    </div>
  );
}
