import React from 'react';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProfessionalSolutions from './components/EquipmentCategories';
import Services from './components/Services';
import Footer from './components/Footer';
import Contact from './components/Contact';
import About from './components/About';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Photos from './components/Photos';
import TylerAI from './components/TylerAI';
import Admin from './components/Admin';
import Blog from './components/Blog';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Auto-scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'photos':
        return <Photos />;
      case 'contact':
        return <Contact />;
      case 'about':
        return <About />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      case 'admin':
        return <Admin />;
      case 'blog':
        return <Blog />;
      default:
        return (
          <>
            <Hero />
            <ProfessionalSolutions />
            <Services />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
      <Footer setCurrentPage={setCurrentPage} />
      <TylerAI />
    </div>
  );
}

export default App;