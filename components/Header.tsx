'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-black text-white">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <img
                src="/assets/Benchmark Logo (RGB Color Reverse).png"
                alt="Benchmark Equipment Rental & Sales"
                className="h-12 w-auto cursor-pointer"
              />
            </Link>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Phone and Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <a href="https://rent.benchmarkequip.com/items" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors font-medium">Equipment Rentals</a>
              <Link href="/rent-vs-buy" className="hover:text-red-500 transition-colors font-medium">Rent/Buy Calculator</Link>
              <Link href="/photos" className="hover:text-red-500 transition-colors font-medium">Photos</Link>
              <Link href="/blog" className="hover:text-red-500 transition-colors font-medium">Blog</Link>
              <Link href="/about" className="hover:text-red-500 transition-colors font-medium">About</Link>
              <Link href="/contact" className="hover:text-red-500 transition-colors font-medium">Contact</Link>
            </nav>
            <a href="tel:8174034334" className="flex items-center space-x-2 hover:text-red-500 transition-colors">
              <Phone className="w-4 h-4 text-red-500" />
              <span className="text-sm">817-403-4334</span>
            </a>
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
              <Link href="/rent-vs-buy" onClick={() => setIsMenuOpen(false)} className="hover:text-red-500 transition-colors font-medium text-left block">Rent/Buy Calculator</Link>
              <Link href="/photos" onClick={() => setIsMenuOpen(false)} className="hover:text-red-500 transition-colors font-medium text-left block">Photos</Link>
              <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="hover:text-red-500 transition-colors font-medium text-left block">Blog</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-red-500 transition-colors font-medium text-left block">About</Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="hover:text-red-500 transition-colors font-medium text-left block">Contact</Link>
              <a href="tel:8174034334" className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                <Phone className="w-4 h-4 text-red-500" />
                <span className="text-sm">817-403-4334</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
