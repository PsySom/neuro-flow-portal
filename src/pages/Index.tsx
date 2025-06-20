
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AIDiary from '../components/AIDiary';
import GoalSelector from '../components/GoalSelector';
import MoodTimeline from '../components/MoodTimeline';
import KnowledgePreview from '../components/KnowledgePreview';
import PracticesPreview from '../components/PracticesPreview';
import ProfessionalNote from '../components/ProfessionalNote';
import NewsletterForm from '../components/NewsletterForm';
import Footer from '../components/Footer';

const Index = () => {
  const location = useLocation();

  // Auto-scroll to hero section when navigating to main page
  useEffect(() => {
    const heroElement = document.getElementById('hero-section');
    if (heroElement) {
      heroElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-psybalans-bg via-white to-psybalans-muted dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <Header />
      <main className="overflow-hidden">
        <div id="hero-section" className="animate-slide-up-fade">
          <HeroSection />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 py-20">
          <div className="animate-slide-in-left">
            <AIDiary />
          </div>
          <div className="animate-slide-in-right">
            <GoalSelector />
          </div>
          <div className="animate-scale-up">
            <MoodTimeline />
          </div>
          <div className="grid lg:grid-cols-2 gap-16 animate-slide-up-fade">
            <div className="animate-slide-in-left">
              <KnowledgePreview />
            </div>
            <div className="animate-slide-in-right">
              <PracticesPreview />
            </div>
          </div>
          <div className="animate-scale-up">
            <ProfessionalNote />
          </div>
          <div className="animate-slide-up-fade">
            <NewsletterForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
