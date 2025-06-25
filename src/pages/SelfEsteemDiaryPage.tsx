
import React from 'react';
import SelfEsteemDiary from '@/components/diaries/SelfEsteemDiary';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SelfEsteemDiaryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <SelfEsteemDiary />
      </main>
      <Footer />
    </div>
  );
};

export default SelfEsteemDiaryPage;
