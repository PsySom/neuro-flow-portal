import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, XCircle, Loader2 } from "lucide-react";
import { userActiveDiariesService } from "@/services/user-active-diaries.service";
import { scenarioService } from "@/services/scenario.service";
import { TherapyScenario } from "@/types/scenario.types";
import { useToast } from "@/hooks/use-toast";
import { ChatLikeScenarioRunner } from "@/features/diary/ChatLikeScenarioRunner";

interface ActiveDiaryWithScenario {
  id: string;
  scenario_slug: string;
  scenario?: TherapyScenario;
}

export const ActiveDiariesTab = () => {
  const [activeDiaries, setActiveDiaries] = useState<ActiveDiaryWithScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadActiveDiaries();
  }, []);

  const loadActiveDiaries = async () => {
    try {
      setLoading(true);
      const diaries = await userActiveDiariesService.listUserActiveDiaries();
      
      // Load scenario details for each active diary
      const diariesWithScenarios = await Promise.all(
        diaries.map(async (diary) => {
          const scenario = await scenarioService.getScenario(diary.scenario_slug);
          return {
            ...diary,
            scenario
          };
        })
      );

      setActiveDiaries(diariesWithScenarios.filter(d => d.scenario));
    } catch (error) {
      console.error('Error loading active diaries:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить активные дневники",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (scenarioSlug: string) => {
    try {
      await userActiveDiariesService.deactivateScenario(scenarioSlug);
      toast({
        title: "Успешно",
        description: "Дневник деактивирован",
      });
      loadActiveDiaries();
    } catch (error) {
      console.error('Error deactivating diary:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось деактивировать дневник",
        variant: "destructive",
      });
    }
  };

  const handleComplete = () => {
    setCurrentScenario(null);
    loadActiveDiaries();
    toast({
      title: "Успешно",
      description: "Запись сохранена",
    });
  };

  if (currentScenario) {
    return (
      <div className="h-full">
        <ChatLikeScenarioRunner
          scenarioSlug={currentScenario}
          onComplete={handleComplete}
          onBack={() => setCurrentScenario(null)}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (activeDiaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <p className="text-muted-foreground">У вас нет активных дневников</p>
        <p className="text-sm text-muted-foreground">
          Активируйте дневник в разделе "Дневники"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeDiaries.map((diary) => (
        <Card key={diary.id}>
          <CardHeader>
            <CardTitle className="text-base">{diary.scenario?.name || diary.scenario_slug}</CardTitle>
            {diary.scenario?.description && (
              <CardDescription>{diary.scenario.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentScenario(diary.scenario_slug)}
                className="flex-1"
                size="sm"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Начать/Продолжить
              </Button>
              <Button
                onClick={() => handleDeactivate(diary.scenario_slug)}
                variant="outline"
                size="sm"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Завершить
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
