'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const navLinks = [
    { href: 'https://rent.benchmarkequip.com/items', label: 'Equipment Rentals', external: true },
    { href: '/rent-vs-buy', label: 'Rent/Buy Calculator' },
    { href: '/photos', label: 'Photos' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left - Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex items-center space-x-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              <span className="hidden sm:inline text-sm font-medium">Menu</span>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50">
                <nav className="py-2">
                  {navLinks.map((link) => (
                    link.external ? (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-3 hover:bg-gray-800 hover:text-red-500 transition-colors font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-3 hover:bg-gray-800 hover:text-red-500 transition-colors font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )
                  ))}
                </nav>
              </div>
            )}
          </div>

          {/* Center - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/">
              <img
                src="/assets/Benchmark Logo (RGB Color Reverse).png"
                alt="Benchmark Equipment Rental & Sales"
                className="h-10 sm:h-12 w-auto cursor-pointer"
              />
            </Link>
          </div>

          {/* Right - Phone */}
          <a
            href="tel:8174034334"
            className="flex items-center space-x-2 hover:text-red-500 transition-colors"
          >
            <Phone className="w-5 h-5 text-red-500" />
            <span className="hidden sm:inline text-sm font-medium">817-403-4334</span>
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
