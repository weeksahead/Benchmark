'use client'

import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Linkedin } from 'lucide-react';

interface FooterProps {
  setCurrentPage?: (page: string) => void;
}

const Footer = ({ setCurrentPage }: FooterProps) => {
  const handleNavClick = (page: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (setCurrentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <img 
              src="/assets/Benchmark Logo (RGB Color Reverse).png" 
              alt="Benchmark Equipment Rental & Sales" 
              className="h-12 w-auto mb-6"
            />
            <p className="text-gray-400 mb-6 leading-relaxed">
              You're trusted partner for Professional heavy equipment rental and sales serving the State of Texas, Oklahoma, Arkansas, Louisiana and surrounding regions.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/p/Benchmark-Equipment-LLC-61574591473313/" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-lg hover:bg-red-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/benchmark-equipment-llc/" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-lg hover:bg-red-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="https://rent.benchmarkequip.com/items" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">Equipment Rentals</a></li>
              <li><button onClick={() => handleNavClick('sales')} className="text-gray-400 hover:text-red-500 transition-colors">Sales</button></li>
              <li><button onClick={() => handleNavClick('photos')} className="text-gray-400 hover:text-red-500 transition-colors">Photos</button></li>
              <li><button onClick={() => handleNavClick('blog')} className="text-gray-400 hover:text-red-500 transition-colors">Blog</button></li>
              <li><button onClick={() => handleNavClick('about')} className="text-gray-400 hover:text-red-500 transition-colors">About</button></li>
              <li><button onClick={() => handleNavClick('contact')} className="text-gray-400 hover:text-red-500 transition-colors">Contact</button></li>
            </ul>
          </div>

          {/* Equipment Categories */}
          <div>
            <h3 className="text-lg font-bold mb-6">Equipment</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Construction</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Material Handling</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Landscaping</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Water Trucks</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Road Construction</a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Horizontal</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">3310 Fort Worth Dr</p>
                  <p className="text-gray-400">Denton, TX 76205</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
                <a href="tel:8174034334" className="text-gray-400 hover:text-red-500 transition-colors">
                  817-403-4334
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-500 flex-shrink-0" />
                <a href="mailto:tyler@benchmarkequip.com" className="text-gray-400 hover:text-red-500 transition-colors">
                  tyler@benchmarkequip.com
                </a>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Mon - Fri: 7:00 AM - 5:00 PM CST</p>
                  <p className="text-gray-400">Saturday: Closed</p>
                  <p className="text-gray-400">Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Benchmark Equipment Rental & Sales. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button onClick={() => handleNavClick('privacy')} className="text-gray-400 hover:text-red-500 text-sm transition-colors">Privacy Policy</button>
              <button onClick={() => handleNavClick('terms')} className="text-gray-400 hover:text-red-500 text-sm transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;