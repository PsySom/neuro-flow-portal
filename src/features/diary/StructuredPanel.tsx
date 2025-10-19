import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronLeft } from "lucide-react";
import { ScenarioRunner } from "./ScenarioRunner";

const SCENARIOS = [
  { 
    slug: 'mood_diary_flow', 
    name: 'Дневник настроения', 
    description: 'Отслеживание настроения, эмоций, триггеров и телесных ощущений',
    icon: '😊'
  },
  // Можно добавить другие сценарии позже
  // { slug: 'sleep_diary_flow', name: 'Дневник сна', description: 'Качество и продолжительность сна', icon: '😴' },
];

interface StructuredPanelProps {
  draft?: any;
  onDraftChange?: (draft: any) => void;
  onClearDraft?: () => void;
}

export const StructuredPanel = ({ onClearDraft }: StructuredPanelProps) => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const handleComplete = () => {
    setSelectedScenario(null);
    onClearDraft?.();
  };

  if (selectedScenario) {
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedScenario(null)}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Назад к выбору сценария
        </Button>
        <ScenarioRunner 
          scenarioSlug={selectedScenario} 
          onComplete={handleComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Выберите тип дневника
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SCENARIOS.map(scenario => (
            <Card 
              key={scenario.slug}
              className="cursor-pointer hover:bg-accent/50 transition-colors border-2"
              onClick={() => setSelectedScenario(scenario.slug)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{scenario.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{scenario.name}</h3>
                    <p className="text-sm text-muted-foreground">{scenario.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
