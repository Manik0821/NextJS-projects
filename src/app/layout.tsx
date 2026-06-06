'use client';

import { Inter } from 'next/font/google';
import './globals.css';

import {Header} from '../components/layout-header/header'; 
import {TitleDisplay} from '../components/TitleDisplay/TitleDisplay'; 


const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({ children }: { children: React.ReactNode }) {
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
