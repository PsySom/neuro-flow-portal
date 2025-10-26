import { useState, useEffect, useRef } from "react";
import { scenarioService } from "@/services/scenario.service";
import { TherapyScenario, TherapyQuestion } from "@/types/scenario.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScaleInput } from "./question-inputs/ScaleInput";
import { ChipsInput } from "./question-inputs/ChipsInput";
import { TimeInput } from "./question-inputs/TimeInput";
import { NumberInput } from "./question-inputs/NumberInput";
import { TextAreaInput } from "./question-inputs/TextAreaInput";
import { EmotionsWithIntensityInput } from "./question-inputs/EmotionsWithIntensityInput";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
  questionType?: string;
}

interface ChatLikeScenarioRunnerProps {
  scenarioSlug: string;
  onComplete?: () => void;
  onBack?: () => void;
}

export const ChatLikeScenarioRunner = ({ 
  scenarioSlug, 
  onComplete,
  onBack 
}: ChatLikeScenarioRunnerProps) => {
  const [scenario, setScenario] = useState<TherapyScenario | null>(null);
  const [questions, setQuestions] = useState<TherapyQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentResponse, setCurrentResponse] = useState<any>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  };

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, currentQuestionIndex]);

  useEffect(() => {
    loadScenario();
  }, [scenarioSlug]);

  useEffect(() => {
    // Load draft from localStorage
    const draft = localStorage.getItem(`scenario_draft_${scenarioSlug}`);
    if (draft) {
      const parsed = JSON.parse(draft);
      setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
      setResponses(parsed.responses || {});
      setMessages(parsed.messages || []);
    }
  }, [scenarioSlug]);

  useEffect(() => {
    // Save draft to localStorage
    if (scenario) {
      localStorage.setItem(`scenario_draft_${scenarioSlug}`, JSON.stringify({
        currentQuestionIndex,
        responses,
        messages
      }));
    }
  }, [currentQuestionIndex, responses, messages, scenarioSlug, scenario]);

  const loadScenario = async () => {
    try {
      setLoading(true);
      const scenarioData = await scenarioService.getScenario(scenarioSlug);
      if (!scenarioData) {
        toast({
          title: "Ошибка",
          description: "Сценарий не найден",
          variant: "destructive",
        });
        return;
      }

      const questionsData = await scenarioService.getScenarioQuestions(scenarioData.id);
      setScenario(scenarioData);
      setQuestions(questionsData);
      
      // Add first question as assistant message if no messages yet
      if (messages.length === 0 && questionsData.length > 0) {
        setMessages([{
          role: 'assistant',
          content: questionsData[0].question_text,
          questionType: questionsData[0].question_type
        }]);
      }
    } catch (error) {
      console.error('Error loading scenario:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить сценарий",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendResponse = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    // Validate response
    if (currentResponse === "" || currentResponse === null || currentResponse === undefined) {
      toast({
        title: "Внимание",
        description: "Пожалуйста, введите ответ",
        variant: "destructive",
      });
      return;
    }

    // Save response
    const newResponses = {
      ...responses,
      [currentQuestion.question_code]: currentResponse
    };
    setResponses(newResponses);

    // Format user message based on question type
    const metadata = currentQuestion.metadata || {};
    let userMessage = "";
    
    // Special handling for emotions with intensity
    if (currentQuestion.question_code === 'emotions' && Array.isArray(currentResponse)) {
      const emotionLabels = currentResponse.map((emotion: any) => {
        const option = metadata.options?.find((o: any) => o.id === emotion.id);
        return option ? `${option.emoji} ${option.label} (${emotion.intensity}/10)` : '';
      }).filter(Boolean);
      userMessage = emotionLabels.join(", ");
    } else if (currentQuestion.question_type === 'chips' || currentQuestion.question_type === 'multiple_choice') {
      if (Array.isArray(currentResponse)) {
        userMessage = currentResponse.join(", ");
      } else {
        userMessage = currentResponse.toString();
      }
    } else if (currentQuestion.question_type === 'scale' || currentQuestion.question_type === 'number') {
      userMessage = currentResponse.toString();
    } else {
      userMessage = currentResponse;
    }

    // Add user message
    const newMessages = [
      ...messages,
      { role: 'user' as const, content: userMessage }
    ];

    // Check if there's a next question
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      const nextQuestion = questions[nextIndex];
      newMessages.push({
        role: 'assistant',
        content: nextQuestion.question_text,
        questionType: nextQuestion.question_type
      });
      setCurrentQuestionIndex(nextIndex);
      setCurrentResponse("");
    }

    setMessages(newMessages);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const result = await scenarioService.saveStructuredEntry(
        scenarioSlug,
        responses,
        questions
      );

      if (result.success) {
        toast({
          title: "Успешно",
          description: "Запись сохранена",
        });
        // Clear draft
        localStorage.removeItem(`scenario_draft_${scenarioSlug}`);
        onComplete?.();
      } else {
        toast({
          title: "Ошибка",
          description: result.error || "Не удалось сохранить запись",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить запись",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderInput = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;

    const metadata = currentQuestion.metadata || {};

    // Special handling for emotions question
    if (currentQuestion.question_code === 'emotions') {
      return (
        <EmotionsWithIntensityInput
          value={Array.isArray(currentResponse) ? currentResponse : []}
          onChange={setCurrentResponse}
          options={metadata.options || []}
          maxSelect={metadata.maxSelect}
        />
      );
    }

    switch (currentQuestion.question_type) {
      case 'scale':
        return (
          <ScaleInput
            value={typeof currentResponse === 'number' ? currentResponse : metadata.min || 0}
            onChange={setCurrentResponse}
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
            value={Array.isArray(currentResponse) ? currentResponse : []}
            onChange={setCurrentResponse}
            options={metadata.options || []}
            maxSelect={metadata.maxSelect}
          />
        );
      case 'time':
        return (
          <TimeInput
            value={currentResponse || ""}
            onChange={setCurrentResponse}
          />
        );
      case 'number':
        return (
          <NumberInput
            value={typeof currentResponse === 'number' ? currentResponse : metadata.min || 0}
            onChange={setCurrentResponse}
            min={metadata.min}
            max={metadata.max}
            unit={metadata.unit}
          />
        );
      case 'text':
        return (
          <TextAreaInput
            value={currentResponse || ""}
            onChange={setCurrentResponse}
            placeholder="Введите ваш ответ..."
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!scenario || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">Сценарий не найден</p>
        {onBack && (
          <Button onClick={onBack} variant="outline">
            Назад
          </Button>
        )}
      </div>
    );
  }

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canGoNext = currentResponse !== "" && currentResponse !== null && currentResponse !== undefined;

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-200px)]">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollBehavior: 'smooth' }}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex animate-slide-up-fade",
              message.role === 'assistant' ? "justify-start" : "justify-end"
            )}
          >
            <Card
              className={cn(
                "max-w-[80%]",
                message.role === 'assistant'
                  ? "bg-muted"
                  : "bg-primary text-primary-foreground"
              )}
            >
              <CardContent className="p-3">
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </CardContent>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      {currentQuestionIndex < questions.length && (
        <div className="border-t bg-background p-4 space-y-4 shrink-0">
          <div className="animate-fade-in">
            {renderInput()}
          </div>
          
          <div className="flex gap-2">
            {!isLastQuestion ? (
              <Button
                onClick={handleSendResponse}
                disabled={!canGoNext}
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                Ответить
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={!canGoNext || saving}
                className="flex-1"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Сохранить запись
              </Button>
            )}
            
            {onBack && (
              <Button onClick={onBack} variant="outline">
                Отмена
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
