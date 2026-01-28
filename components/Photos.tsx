'use client'

import React, { useState, useEffect } from 'react';
import { Camera, Filter, Loader2 } from 'lucide-react';
import Breadcrumb from './Breadcrumb';

interface PhotoGalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

const Photos = () => {
  const [galleryImages, setGalleryImages] = useState<PhotoGalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<PhotoGalleryImage | null>(null);

  // Fetch photos from Supabase
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/gallery-photos');
        if (response.ok) {
          const data = await response.json();
          setGalleryImages(data.photos || []);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const categories = ['All', ...Array.from(new Set(galleryImages.map(img => img.category)))];

  const filteredImages = selectedCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <section className="bg-black text-white min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Photos' }]} />
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center">
            <Camera className="w-12 h-12 text-red-500 mr-4" />
            Equipment Photos
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Browse our fleet of professional-grade construction and heavy equipment
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
            <p className="text-gray-400">Loading photos...</p>
          </div>
        ) : (
          <>
            {/* Category Filter */}
            {galleryImages.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Filter className="w-5 h-5 text-red-500 mt-2" />
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      selectedCategory === category
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {/* Photo Grid */}
            {filteredImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{image.alt}</h3>
                      <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                        {image.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No photos found</h3>
                <p className="text-gray-500">No photos available yet.</p>
              </div>
            )}
          </>
        )}

        {/* Modal for enlarged image */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-4xl max-h-full relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-red-500 text-2xl font-bold"
              >
                ×
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <div className="text-center mt-4">
                <h3 className="text-xl font-semibold text-white mb-2">{selectedImage.alt}</h3>
                <span className="inline-block bg-red-600 text-white px-4 py-2 rounded-full">
                  {selectedImage.category}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-12">
            <h3 className="text-3xl font-bold mb-4">Need Equipment?</h3>
            <p className="text-xl mb-8 text-red-100">
              Contact us today to rent any of the equipment shown above
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://rent.benchmarkequip.com/items"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Browse Equipment Rentals
              </a>
              <a
                href="tel:8174034334"
                className="bg-red-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-900 transition-colors"
              >
                Call (817) 403-4334
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Photos;
