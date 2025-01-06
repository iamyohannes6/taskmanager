import React, { useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        MainButton: {
          setParams: (params: {
            text?: string;
            color?: string;
            text_color?: string;
            is_visible?: boolean;
            is_active?: boolean;
          }) => void;
        };
        onEvent: (eventType: string, callback: () => void) => void;
      };
    };
  }
}

export function Layout({ children }: LayoutProps) {
  useEffect(() => {
    // Initialize Telegram Web App
    if (window.Telegram?.WebApp) {
      // Ready event
      window.Telegram.WebApp.ready();
      
      // Handle viewport changes
      window.Telegram.WebApp.onEvent('viewportChanged', () => {
        console.log('Viewport changed');
      });

      // Set the MainButton color
      window.Telegram.WebApp.MainButton.setParams({
        color: '#4C6FFF',
        text_color: '#FFFFFF'
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <div className="fixed inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent pointer-events-none" />
      <main className="relative container mx-auto px-4 py-6 animate-in">
        {children}
      </main>
    </div>
  );
} 