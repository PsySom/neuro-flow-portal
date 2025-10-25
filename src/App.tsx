
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Diaries from './pages/Diaries';
import KnowledgeBase from './pages/KnowledgeBase';
import Practices from './pages/Practices';
import DashboardPractices from './pages/DashboardPractices';
import Statistics from './pages/Statistics';
import State from './pages/State';
import Recommendations from './pages/Recommendations';
import About from './pages/About';
import { PersonalizationProvider } from './contexts/PersonalizationContext';
import { ActivitiesProvider } from './contexts/ActivitiesContext';
import { DiaryStatusProvider } from './contexts/DiaryStatusContext';
import ArticleView from './pages/ArticleView';
import MoodDiaryPage from './pages/MoodDiaryPage';
import ThoughtsDiaryPage from './pages/ThoughtsDiaryPage';
import SelfEsteemDiaryPage from './pages/SelfEsteemDiaryPage';
import ProcrastinationDiaryPage from './pages/ProcrastinationDiaryPage';
import OCDDiaryPage from './pages/OCDDiaryPage';
import DepressionCareDiaryPage from './pages/DepressionCareDiaryPage';
import SleepDiaryPage from './pages/SleepDiaryPage';
import Diary from './pages/Diary';
import MoodScenarioDiaryPage from './pages/MoodScenarioDiaryPage';
import Activities from './pages/Activities';
import Analytics from './pages/Analytics';
import Auth from './pages/Auth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';
import Onboarding from './pages/Onboarding';

function App() {
  return (
    <SupabaseAuthProvider>
      <PersonalizationProvider>
        <ActivitiesProvider>
          <DiaryStatusProvider>
            <Router>
              <div className="App">
                <Toaster />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                  <Route path="/diaries" element={<Diaries />} />
                  <Route path="/knowledge" element={<KnowledgeBase />} />
                  <Route path="/practices" element={<Practices />} />
                  <Route path="/dashboard/practices" element={<DashboardPractices />} />
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="/state" element={<State />} />
                  <Route path="/recommendations" element={<Recommendations />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/article/:id" element={<ArticleView />} />
                  <Route path="/mood-diary" element={<MoodDiaryPage />} />
                  <Route path="/thoughts-diary" element={<ThoughtsDiaryPage />} />
                  <Route path="/self-esteem-diary" element={<SelfEsteemDiaryPage />} />
                  <Route path="/procrastination-diary" element={<ProcrastinationDiaryPage />} />
                  <Route path="/ocd-diary" element={<OCDDiaryPage />} />
                  <Route path="/depression-care-diary" element={<DepressionCareDiaryPage />} />
                  <Route path="/sleep-diary" element={<SleepDiaryPage />} />
                  <Route path="/mood-scenario-diary" element={<ProtectedRoute><MoodScenarioDiaryPage /></ProtectedRoute>} />
                  <Route path="/diary" element={<ProtectedRoute><Diary /></ProtectedRoute>} />
                  <Route path="/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                  <Route path="/onboarding" element={<Onboarding />} />
                </Routes>
              </div>
            </Router>
          </DiaryStatusProvider>
        </ActivitiesProvider>
      </PersonalizationProvider>
    </SupabaseAuthProvider>
  );
}

export default App;
