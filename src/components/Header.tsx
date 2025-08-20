import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';

interface HeaderProps {
  setCurrentPage: (page: string) => void;
}

const Header = ({ setCurrentPage }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (page: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-black text-white">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <button onClick={() => handleNavClick('home')}>
              <img 
                src="/assets/Benchmark Logo (RGB Color Reverse).png" 
                alt="Benchmark Equipment Rental & Sales" 
                className="h-12 w-auto"
              />
            </button>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Phone and Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <a href="https://rent.benchmarkequip.com/items" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors font-medium">Equipment Rentals</a>
              <button onClick={() => handleNavClick('photos')} className="hover:text-red-500 transition-colors font-medium">Photos</button>
              <button onClick={() => handleNavClick('blog')} className="hover:text-red-500 transition-colors font-medium">Blog</button>
              <button onClick={() => handleNavClick('about')} className="hover:text-red-500 transition-colors font-medium">About</button>
              <button onClick={() => handleNavClick('contact')} className="hover:text-red-500 transition-colors font-medium">Contact</button>
            </nav>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-red-500" />
              <span className="text-sm">817-403-4334</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <a href="https://rent.benchmarkequip.com/items" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors font-medium">Equipment Rentals</a>
              <button onClick={() => handleNavClick('photos')} className="hover:text-red-500 transition-colors font-medium text-left">Photos</button>
              <button onClick={() => handleNavClick('blog')} className="hover:text-red-500 transition-colors font-medium text-left">Blog</button>
              <button onClick={() => handleNavClick('about')} className="hover:text-red-500 transition-colors font-medium text-left">About</button>
              <button onClick={() => handleNavClick('contact')} className="hover:text-red-500 transition-colors font-medium text-left">Contact</button>
              <a href="tel:8174034334" className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                <Phone className="w-4 h-4 text-red-500" />
                <span className="text-sm">817-403-4334</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;