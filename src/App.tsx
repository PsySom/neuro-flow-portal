
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
import { AuthProvider } from './contexts/AuthContext';
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

function App() {
  return (
    <PersonalizationProvider>
      <ActivitiesProvider>
        <DiaryStatusProvider>
          <AuthProvider>
            <Router>
              <div className="App">
                <Toaster />
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/calendar" element={<Calendar />} />
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
                </Routes>
              </div>
            </Router>
          </AuthProvider>
        </DiaryStatusProvider>
      </ActivitiesProvider>
    </PersonalizationProvider>
  );
}

export default App;
