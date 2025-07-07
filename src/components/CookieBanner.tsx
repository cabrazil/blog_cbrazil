
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const COOKIE_CONSENT_KEY = 'cookie_consent_is_given';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent !== 'true') {
      // Timeout to prevent layout shift issues on initial render
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 w-full bg-gray-900 text-white p-4 z-50 shadow-lg animate-slide-up"
      style={{ animation: 'slide-up 0.5s ease-out forwards' }}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-center md:text-left flex-grow">
          Utilizamos cookies para garantir que você tenha a melhor experiência em nosso site. 
          Para saber mais, acesse nossa{' '}
          <Link href="/privacidade" className="underline hover:text-gray-300 transition-colors">
            Política de Privacidade
          </Link>.
        </p>
        <Button 
          onClick={handleAccept}
          className="bg-white text-gray-900 hover:bg-gray-200 px-6 py-2 rounded-md text-sm font-semibold transition-colors"
        >
          OK
        </Button>
      </div>
      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
