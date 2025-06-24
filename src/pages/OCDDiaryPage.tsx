
import React from 'react';
import OCDDiary from '@/components/diaries/OCDDiary';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const OCDDiaryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <OCDDiary />
      </main>
      <Footer />
    </div>
  );
};

export default OCDDiaryPage;
