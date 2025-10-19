import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { NotesPanel } from "./NotesPanel";
import { StructuredPanel } from "./StructuredPanel";
import { BookText, ListChecks } from "lucide-react";

interface DraftState {
  notes: string;
  structured: {
    topic: string;
    context: string;
    metrics: Record<string, number>;
    emotions: Array<{ label: string; intensity: number }>;
  };
}

const DRAFT_STORAGE_KEY = "ai-diary-draft";

export function AIDiaryWindow() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "notes";

  const [draft, setDraft] = useState<DraftState>(() => {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {
          notes: "",
          structured: {
            topic: "",
            context: "",
            metrics: {},
            emotions: [],
          },
        };
      }
    }
    return {
      notes: "",
      structured: {
        topic: "",
        context: "",
        metrics: {},
        emotions: [],
      },
    };
  });

  // Save draft to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  const handleModeChange = (newMode: string) => {
    setSearchParams({ mode: newMode });
  };

  const clearDraft = (type: "notes" | "structured") => {
    if (type === "notes") {
      setDraft((prev) => ({ ...prev, notes: "" }));
    } else {
      setDraft((prev) => ({
        ...prev,
        structured: {
          topic: "",
          context: "",
          metrics: {},
          emotions: [],
        },
      }));
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">AI Дневник</h1>
          <p className="text-muted-foreground">
            Выберите режим работы с дневником
          </p>
        </div>

        <Tabs value={mode} onValueChange={handleModeChange}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <BookText className="h-4 w-4" />
              Свободные заметки
            </TabsTrigger>
            <TabsTrigger value="structured" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              Структурированные записи
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="mt-0">
            <NotesPanel
              draft={draft.notes}
              onDraftChange={(text) =>
                setDraft((prev) => ({ ...prev, notes: text }))
              }
              onClearDraft={() => clearDraft("notes")}
            />
          </TabsContent>

          <TabsContent value="structured" className="mt-0">
            <StructuredPanel
              draft={draft.structured}
              onDraftChange={(structured) =>
                setDraft((prev) => ({ ...prev, structured }))
              }
              onClearDraft={() => clearDraft("structured")}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
