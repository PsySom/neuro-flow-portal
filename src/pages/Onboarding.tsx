import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OnboardingDialog from '@/components/onboarding/OnboardingDialog';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const OnboardingPage: React.FC = () => {
  const { isAuthenticated } = useSupabaseAuth();
  const [open, setOpen] = React.useState(true);

  useEffect(() => {
    // SEO basics
    document.title = 'Онбординг — Добро пожаловать | PsyBalans';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Добро пожаловать в PsyBalans: начните персональный онбординг с экрана приветствия.');
    const linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const href = window.location.origin + '/onboarding';
    if (linkCanonical) linkCanonical.href = href; else {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      l.setAttribute('href', href);
      document.head.appendChild(l);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    // Если пользователь уже вошёл — на дашборд, иначе — на главную
    window.location.href = isAuthenticated ? '/dashboard' : '/';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <OnboardingDialog isOpen={open} initialStep="welcome" onClose={handleClose} />
      </main>
      <Footer />
    </div>
  );
};

export default OnboardingPage;
