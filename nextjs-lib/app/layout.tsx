'use client';

import { Inter } from 'next/font/google';
import { Header } from './header/header';
import { TitleDisplay } from './TitleDisplay/TitleDisplay';
import './globals.css';
import './layout.css';
import { useTitleStore } from './lib/store';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const updateTitle = useTitleStore((state) => state.updateTitle);

  useEffect(() => {
    // Force the title to reset whenever the Home component mounts
    updateTitle("Home Dashboard", "Welcome back!");
  }, [updateTitle]);
  return (
    <html lang="en">
      <body className={inter.className}> 
        {/* Header containing your Sidebar/Modal */}
        <Header />
        
        <div className="page-layout">
          {/* 
              This component listens to the Zustand store. 
              It will update automatically when you navigate to /game 
              or back to / because it's a Client Component.
          */}
          <TitleDisplay /> 
          
          <main className="page-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
