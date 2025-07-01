
import { DiarySession, Question, PersonalNorms } from './types';
import { morningScenario } from './morningScenario';
import { middayScenario } from './middayScenario';
import { eveningScenario } from './eveningScenario';

export class DiaryScenarioEngine {
  private personalNorms: PersonalNorms;
  private currentSession: DiarySession | null = null;

  constructor(personalNorms: PersonalNorms) {
    this.personalNorms = personalNorms;
  }

  startSession(type: 'morning' | 'midday' | 'evening'): DiarySession {
    const scenario = this.getScenario(type);
    
    this.currentSession = {
      id: `${type}_${Date.now()}`,
      type,
      timestamp: new Date(),
      responses: {},
      currentStep: 0,
      totalSteps: scenario.questions.length,
      isCompleted: false
    };

    return this.currentSession;
  }

  getCurrentQuestion(): Question | null {
    if (!this.currentSession) return null;
    
    const scenario = this.getScenario(this.currentSession.type);
    const currentQuestionId = this.determineNextQuestion(scenario.questions, this.currentSession);
    
    return scenario.questions.find(q => q.id === currentQuestionId) || null;
  }

  processResponse(questionId: string, response: any): { nextQuestion: Question | null; isCompleted: boolean } {
    if (!this.currentSession) {
      return { nextQuestion: null, isCompleted: false };
    }

    // Сохраняем ответ
    this.currentSession.responses[questionId] = response;
    this.currentSession.currentStep++;

    // Определяем следующий вопрос на основе логики ветвления
    const scenario = this.getScenario(this.currentSession.type);
    const currentQuestion = scenario.questions.find(q => q.id === questionId);
    
    let nextQuestionId: string | null = null;
    
    if (currentQuestion?.followUpLogic) {
      nextQuestionId = currentQuestion.followUpLogic(response, this.currentSession.responses);
    }

    // Если нет специального следующего вопроса, берем следующий по порядку
    if (!nextQuestionId) {
      const currentIndex = scenario.questions.findIndex(q => q.id === questionId);
      if (currentIndex < scenario.questions.length - 1) {
        // Проверяем, нужно ли пропустить следующие вопросы
        nextQuestionId = this.findNextApplicableQuestion(scenario.questions, currentIndex + 1, this.currentSession);
      }
    }

    const nextQuestion = nextQuestionId ? scenario.questions.find(q => q.id === nextQuestionId) : null;
    const isCompleted = !nextQuestion;

    if (isCompleted) {
      this.currentSession.isCompleted = true;
    }

    return { nextQuestion, isCompleted };
  }

  getScenario(type: 'morning' | 'midday' | 'evening') {
    switch (type) {
      case 'morning':
        return morningScenario;
      case 'midday':
        return middayScenario;
      case 'evening':
        return eveningScenario;
      default:
        return morningScenario;
    }
  }

  private determineNextQuestion(questions: Question[], session: DiarySession): string {
    // Находим первый вопрос, на который еще не ответили
    for (const question of questions) {
      if (!(question.id in session.responses)) {
        return question.id;
      }
    }
    return questions[0].id; // Fallback
  }

  private findNextApplicableQuestion(questions: Question[], startIndex: number, session: DiarySession): string | null {
    for (let i = startIndex; i < questions.length; i++) {
      const question = questions[i];
      
      // Проверяем, применим ли этот вопрос на основе предыдущих ответов
      if (this.isQuestionApplicable(question, session.responses)) {
        return question.id;
      }
    }
    return null;
  }

  private isQuestionApplicable(question: Question, responses: Record<string, any>): boolean {
    // Логика для определения, нужно ли показывать вопрос
    // Например, followup вопросы показываются только при определенных условиях
    
    if (question.id.includes('_followup')) {
      // Это followup вопрос, проверяем условия
      const baseQuestionId = question.id.replace(/_followup.*$/, '');
      const baseResponse = responses[baseQuestionId];
      
      // Здесь можно добавить более сложную логику
      return baseResponse !== undefined;
    }
    
    return true; // По умолчанию показываем все вопросы
  }

  analyzeDeviations(responses: Record<string, any>): string[] {
    const recommendations: string[] = [];
    
    // Анализируем критические отклонения
    if (responses.morning_mood <= -7) {
      recommendations.push('Рекомендую перейти в дневник настроения для углубленной работы');
    }
    
    if (responses.anxiety_level >= 8) {
      recommendations.push('Высокий уровень тревоги. Попробуйте технику заземления 5-4-3-2-1');
    }
    
    if (responses.sleep_quality <= 3) {
      recommendations.push('Плохой сон влияет на весь день. Обратите внимание на гигиену сна');
    }
    
    if (responses.energy_level <= 3) {
      recommendations.push('Низкая энергия. Попробуйте короткую прогулку или здоровый перекус');
    }

    return recommendations;
  }

  generatePersonalizedMessage(session: DiarySession): string {
    const scenario = this.getScenario(session.type);
    const responses = session.responses;
    
    let message = scenario.completionMessage;
    
    // Добавляем персонализированные рекомендации
    const recommendations = this.analyzeDeviations(responses);
    if (recommendations.length > 0) {
      message += '\n\nРекомендации:\n' + recommendations.map(r => `• ${r}`).join('\n');
    }
    
    return message;
  }

  saveSession(session: DiarySession): void {
    // Сохраняем сессию в localStorage
    const sessions = this.getSavedSessions();
    sessions.push(session);
    localStorage.setItem('diary_sessions', JSON.stringify(sessions));
  }

  getSavedSessions(): DiarySession[] {
    const saved = localStorage.getItem('diary_sessions');
    return saved ? JSON.parse(saved) : [];
  }

  getTodaySessions(): DiarySession[] {
    const today = new Date().toDateString();
    return this.getSavedSessions().filter(session => 
      new Date(session.timestamp).toDateString() === today
    );
  }
}

// Экспортируем готовый экземпляр с базовыми нормами
const defaultNorms: PersonalNorms = {
  sleep: { quality: 7, duration: 8 },
  energy: 7,
  mood: 5,
  anxiety: 3,
  stress: 4,
  selfCare: 6,
  selfEsteem: 6
};

export const diaryEngine = new DiaryScenarioEngine(defaultNorms);
