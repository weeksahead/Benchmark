import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Wrench, Truck, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id?: number;
  image: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_url: string;
}

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch slides from database
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/hero-slides');
        const data = await response.json();
        if (data.slides && data.slides.length > 0) {
          setSlides(data.slides);
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Show loading state or handle empty slides
  if (loading || slides.length === 0) {
    return (
      <section className="bg-black text-white relative overflow-hidden h-screen">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Benchmark Equipment Rental</h1>
            <p className="text-xl text-gray-300">Quality Equipment for Every Job</p>
          </div>
        </div>
        {/* Bottom Section with Features */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3 justify-center">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Professional Grade</h3>
                  <p className="text-gray-300 text-sm">Quality equipment</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 justify-center">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Delivery Available</h3>
                  <p className="text-gray-300 text-sm">To your job site</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 justify-center">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Flexible Rental</h3>
                  <p className="text-gray-300 text-sm">Daily to monthly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black text-white relative overflow-hidden h-screen">
      {/* Carousel Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                style={slide.image === '/assets/Benchmark-wheel-loader.jpg' ? { objectPosition: '50% 30%' } : {}}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center max-w-4xl mx-auto px-6 sm:px-8 pb-20">
                {index === currentSlide ? (
                  <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-white drop-shadow-lg leading-tight">
                    {slide.title}
                  </h1>
                ) : (
                  <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-white drop-shadow-lg leading-tight" aria-hidden="true">
                    {slide.title}
                  </span>
                )}
                <p className="text-base sm:text-xl md:text-2xl lg:text-3xl mb-8 sm:mb-12 text-white drop-shadow-lg">
                  {slide.subtitle}
                </p>
                <a
                  href={slide.button_url || "https://rent.benchmarkequip.com/items"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors inline-flex items-center group"
                >
                  {slide.button_text}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators - Hidden on mobile */}
        <div className="hidden sm:flex absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20 space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-red-600' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Section with Features */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 justify-center">
              <div className="bg-red-600 p-2 rounded-lg">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Professional Grade</h3>
                <p className="text-gray-300 text-sm">Quality equipment</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 justify-center">
              <div className="bg-red-600 p-2 rounded-lg">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Delivery Available</h3>
                <p className="text-gray-300 text-sm">To your job site</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 justify-center">
              <div className="bg-red-600 p-2 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Flexible Rental</h3>
                <p className="text-gray-300 text-sm">Daily to monthly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;