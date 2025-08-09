
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useSupabaseAuth as useAuth } from '@/contexts/SupabaseAuthContext';
import UserMenu from '@/components/dashboard/UserMenu';
import SelfEsteemDiary from '@/components/diaries/SelfEsteemDiary';

const SelfEsteemDiaryPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
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
              
              <Link to="/diaries">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  К дневникам
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <SelfEsteemDiary />
      </main>
    </div>
  );
};

export default SelfEsteemDiaryPage;
