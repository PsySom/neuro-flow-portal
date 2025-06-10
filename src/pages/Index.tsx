
import React from 'react';
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <Header />
      <main className="overflow-hidden">
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-16">
          <AIDiary />
          <GoalSelector />
          <MoodTimeline />
          <div className="grid lg:grid-cols-2 gap-16">
            <KnowledgePreview />
            <PracticesPreview />
          </div>
          <ProfessionalNote />
          <NewsletterForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
