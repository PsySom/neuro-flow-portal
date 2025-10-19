import { Brain, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import UserMenu from '@/components/dashboard/UserMenu';
import { ScenarioRunner } from '@/features/diary/ScenarioRunner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const MoodScenarioDiaryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-pink-900/20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="w-8 h-8" style={{ color: `hsl(var(--psybalans-primary))` }} />
              <span 
                className="text-2xl font-bold bg-clip-text text-transparent"
                style={{ 
                  backgroundImage: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))` 
                }}
              >
                PsyBalans
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/diaries')}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                К дневникам
              </Button>
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">😊</span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Дневник настроения
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Структурированный дневник для отслеживания настроения, эмоций и самочувствия
          </p>
        </div>

        <ScenarioRunner 
          scenarioSlug="mood_diary_flow"
          onComplete={() => {
            // Можно добавить редирект или показать сообщение
          }}
        />
      </main>
    </div>
  );
};

export default MoodScenarioDiaryPage;
