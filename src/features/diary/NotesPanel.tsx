import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, Loader2, Lightbulb, HelpCircle } from "lucide-react";
import { diaryService, CreateNoteInput } from "@/services/diary.service";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface NotesPanelProps {
  draft: string;
  onDraftChange: (text: string) => void;
  onClearDraft: () => void;
}

export function NotesPanel({
  draft,
  onDraftChange,
  onClearDraft,
}: NotesPanelProps) {
  const queryClient = useQueryClient();
  const [showSuggestions] = useState(true);

  const { data: notes = [], isLoading: isLoadingNotes } = useQuery({
    queryKey: ["diary-notes"],
    queryFn: () => diaryService.listNotes(20),
  });

  const createNoteMutation = useMutation({
    mutationFn: (input: CreateNoteInput) => diaryService.createNote(input),
    onMutate: async (newNote) => {
      await queryClient.cancelQueries({ queryKey: ["diary-notes"] });
      const previousNotes = queryClient.getQueryData(["diary-notes"]);

      queryClient.setQueryData(["diary-notes"], (old: any[] = []) => [
        {
          id: "temp-" + Date.now(),
          user_id: "temp",
          text: newNote.text,
          topics: newNote.topics || [],
          ai_suggestions: [],
          ai_followups: [],
          metadata: {},
          created_at: new Date().toISOString(),
        },
        ...old,
      ]);

      return { previousNotes };
    },
    onError: (err, newNote, context) => {
      queryClient.setQueryData(["diary-notes"], context?.previousNotes);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить заметку",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diary-notes"] });
      onClearDraft();
      toast({
        title: "Сохранено",
        description: "Заметка успешно добавлена",
      });
    },
  });

  const handleSave = () => {
    if (!draft.trim()) {
      toast({
        title: "Ошибка",
        description: "Заметка не может быть пустой",
        variant: "destructive",
      });
      return;
    }

    createNoteMutation.mutate({ text: draft });
  };

  // Mock AI suggestions (in real app would come from AI service)
  const aiSuggestions = showSuggestions && draft.length > 50
    ? ["Как вы себя чувствуете?", "Что вызвало эти мысли?"]
    : [];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Textarea
          placeholder="Начните писать свои мысли..."
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          className="min-h-[200px] resize-none"
        />

        {aiSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lightbulb className="h-4 w-4" />
              AI подсказки:
            </div>
            {aiSuggestions.map((suggestion, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => onDraftChange(draft + "\n\n" + suggestion)}
              >
                <HelpCircle className="h-3 w-3 mr-1" />
                {suggestion}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClearDraft}
            disabled={!draft.trim()}
          >
            Очистить
          </Button>
          <Button
            onClick={handleSave}
            disabled={!draft.trim() || createNoteMutation.isPending}
          >
            {createNoteMutation.isPending ? (
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

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">История заметок</h3>
        {isLoadingNotes ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : notes.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Пока нет заметок
          </p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <Card key={note.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">
                    {format(new Date(note.created_at), "dd.MM.yyyy HH:mm")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{note.text}</p>
                  {note.topics && note.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {note.topics.map((topic, idx) => (
                        <Badge key={idx} variant="outline">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
