
import React from 'react';
import DepressionCareDiary from '@/components/diaries/DepressionCareDiary';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const DepressionCareDiaryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <DepressionCareDiary />
      </main>
      <Footer />
    </div>
  );
};

export default DepressionCareDiaryPage;
