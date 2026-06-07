// src/app/layout.tsx

import { Inter } from 'next/font/google';
import './globals.css';

// Absolute aliases preferred for clean resumes
import { Header } from '@/components/layout-header/header'; 
import { TitleDisplay } from '@/components/TitleDisplay/TitleDisplay'; 

const inter = Inter({ subsets: ['latin'] });

// Professional touch: Add standard SEO metadata block
export const metadata = {
  title: 'Full-Stack Modular Playground',
  description: 'Next.js application featuring domain-driven architecture and Nvidia Llama 3.3 execution pipelines.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}> 
        <Header />
        
        <div className="page-layout max-w-8xl mx-auto p-6">
          {/* Safely mounts as a client shell inside a server timeline */}
          <TitleDisplay /> 
          
          <main className="page-content mt-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
