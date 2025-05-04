import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Removed container here, apply padding/margin in page components */}
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
} 