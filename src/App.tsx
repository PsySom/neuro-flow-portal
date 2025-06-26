
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import KnowledgeBase from './pages/KnowledgeBase';
import Practices from './pages/Practices';
import { AuthProvider } from './contexts/AuthContext';
import { PersonalizationProvider } from './contexts/PersonalizationContext';
import { ActivitiesProvider } from './contexts/ActivitiesContext';
import ArticleView from './pages/ArticleView';

function App() {
  return (
    <AuthProvider>
      <PersonalizationProvider>
        <ActivitiesProvider>
          <Router>
            <div className="App">
              <Toaster />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/knowledge" element={<KnowledgeBase />} />
                <Route path="/practices" element={<Practices />} />
                <Route path="/article/:id" element={<ArticleView />} />
              </Routes>
            </div>
          </Router>
        </ActivitiesProvider>
      </PersonalizationProvider>
    </AuthProvider>
  );
}

export default App;
