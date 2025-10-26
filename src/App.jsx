import React from 'react';
import Navbar from './components/Navbar';
import HeroSpline from './components/HeroSpline';
import ModulesGrid from './components/ModulesGrid';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white">
      <Navbar />
      <main className="flex-1">
        <HeroSpline />
        <ModulesGrid />
      </main>
      <Footer />
    </div>
  );
}
