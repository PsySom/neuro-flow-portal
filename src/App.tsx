import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Activities from './pages/Activities';
import KnowledgeBase from './pages/KnowledgeBase';
import { AuthProvider } from './context/AuthContext';
import { PersonalizationProvider } from './context/PersonalizationContext';
import { ActivitiesProvider } from './context/ActivitiesContext';
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
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/knowledge" element={<KnowledgeBase />} />
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
