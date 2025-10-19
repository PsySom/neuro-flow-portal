import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { scenarioService } from '@/services/scenario.service';
import type { TherapyScenario, TherapyQuestion } from '@/types/scenario.types';
import { ScaleInput } from './question-inputs/ScaleInput';
import { ChipsInput } from './question-inputs/ChipsInput';
import { TimeInput } from './question-inputs/TimeInput';
import { NumberInput } from './question-inputs/NumberInput';
import { TextAreaInput } from './question-inputs/TextAreaInput';

interface ScenarioRunnerProps {
  scenarioSlug: string;
  onComplete?: () => void;
}

export const ScenarioRunner = ({ scenarioSlug, onComplete }: ScenarioRunnerProps) => {
  const [scenario, setScenario] = useState<TherapyScenario | null>(null);
  const [questions, setQuestions] = useState<TherapyQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadScenario();
  }, [scenarioSlug]);

  const loadScenario = async () => {
    setLoading(true);
    try {
      const scenarioData = await scenarioService.getScenario(scenarioSlug);
      if (!scenarioData) {
        toast.error('Сценарий не найден');
        return;
      }

      const questionsData = await scenarioService.getScenarioQuestions(scenarioData.id);
      setScenario(scenarioData);
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error loading scenario:', error);
      toast.error('Ошибка загрузки сценария');
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canGoNext = responses[currentQuestion?.question_code] !== undefined;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleResponse = (value: any) => {
    if (!currentQuestion) return;
    setResponses({
      ...responses,
      [currentQuestion.question_code]: value
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSave = async () => {
    if (!scenario) return;

    setSaving(true);
    try {
      const result = await scenarioService.saveStructuredEntry(
        scenarioSlug,
        responses,
        questions
      );

      if (result.success) {
        toast.success('Запись успешно сохранена!');
        setResponses({});
        setCurrentQuestionIndex(0);
        onComplete?.();
      } else {
        toast.error(result.error || 'Ошибка сохранения');
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error('Ошибка сохранения записи');
    } finally {
      setSaving(false);
    }
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    const value = responses[currentQuestion.question_code];
    const metadata = currentQuestion.metadata;

    switch (currentQuestion.question_type) {
      case 'scale':
        return (
          <ScaleInput
            value={value ?? metadata.min ?? 0}
            onChange={handleResponse}
            min={metadata.min}
            max={metadata.max}
            step={metadata.step}
            labels={metadata.labels}
          />
        );

      case 'chips':
      case 'multiple_choice':
        return (
          <ChipsInput
            value={value ?? []}
            onChange={handleResponse}
            options={metadata.options || []}
            maxSelect={metadata.maxSelect}
          />
        );

      case 'time':
        return (
          <TimeInput
            value={value ?? ''}
            onChange={handleResponse}
          />
        );

      case 'number':
        return (
          <NumberInput
            value={value ?? metadata.min ?? 0}
            onChange={handleResponse}
            min={metadata.min}
            max={metadata.max}
            unit={metadata.unit}
          />
        );

      case 'text':
        return (
          <TextAreaInput
            value={value ?? ''}
            onChange={handleResponse}
            placeholder="Введите ваш ответ..."
          />
        );

      default:
        return <p className="text-muted-foreground">Неподдерживаемый тип вопроса</p>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!scenario || questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Сценарий не найден или не содержит вопросов</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl">{scenario.name}</CardTitle>
            <span className="text-sm text-muted-foreground">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          {currentQuestion && (
            <>
              <div>
                <h3 className="text-lg font-medium mb-4">
                  {currentQuestion.question_text}
                </h3>
                {renderQuestionInput()}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Назад
                </Button>

                {!isLastQuestion ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canGoNext}
                  >
                    Дальше
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSave}
                    disabled={!canGoNext || saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Сохранить
                      </>
                    )}
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
