import React, { useState } from 'react';
import { Upload, Image, Trash2, Save, LogOut, Home, Camera } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface SlideImage {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

interface PhotoGalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'slider' | 'gallery'>('slider');
  
  // Current slider images (you'll want to make this dynamic later)
  const [sliderImages, setSliderImages] = useState<SlideImage[]>([
    {
      id: 1,
      image: '/assets/Cat 336.jpeg',
      title: 'Driven by Relationships',
      subtitle: 'Powered By Reliability',
      buttonText: 'View Our Fleet'
    },
    {
      id: 2,
      image: '/assets/cat skid steer.jpeg',
      title: 'Professional Equipment Rental',
      subtitle: '& Sales',
      buttonText: 'Browse Equipment'
    }
  ]);

  // Sample gallery images (you'll want to make this dynamic later)
  const [galleryImages, setGalleryImages] = useState<PhotoGalleryImage[]>([
    {
      id: 1,
      src: '/assets/Cat 336.jpeg',
      alt: 'Cat 336 Excavator',
      category: 'Excavators'
    },
    {
      id: 2,
      src: '/assets/cat skid steer.jpeg',
      alt: 'Cat Skid Steer',
      category: 'Skid Steers'
    },
    {
      id: 3,
      src: '/assets/wheel loader.jpg',
      alt: 'Cat Wheel Loader',
      category: 'Wheel Loaders'
    }
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'slider' | 'gallery') => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    console.log(`Uploading ${files.length} files for ${type}`);

    // Process each uploaded file
    Array.from(files).forEach(file => {
      console.log('Processing file:', file.name, file.type, file.size);
      
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const imageUrl = event.target?.result as string;
          console.log('File read successfully, creating new entry');
        
          if (type === 'slider') {
            const newSlide: SlideImage = {
              id: Date.now() + Math.random(),
              image: imageUrl,
              title: 'New Slide Title',
              subtitle: 'New Slide Subtitle',
              buttonText: 'View Equipment'
            };
            setSliderImages(prev => {
              console.log('Adding new slide');
              return [...prev, newSlide];
            });
          } else {
            const newImage: PhotoGalleryImage = {
              id: Date.now() + Math.random(),
              src: imageUrl,
              alt: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
              category: 'Other'
            };
            setGalleryImages(prev => {
              console.log('Adding new gallery image');
              return [...prev, newImage];
            });
          }
        } catch (error) {
          console.error('Error processing file result:', error);
          alert(`Error processing ${file.name}. Please try again.`);
        }
      };
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert(`Error reading ${file.name}. Please try again.`);
      };
      
      console.log('Starting to read file as data URL');
      reader.readAsDataURL(file);
    });
    
    // Clear the input so the same file can be uploaded again if needed
    e.target.value = '';
  };

  const updateSliderImage = (id: number, field: keyof SlideImage, value: string) => {
    setSliderImages(prev => 
      prev.map(slide => 
        slide.id === id ? { ...slide, [field]: value } : slide
      )
    );
  };

  const updateGalleryImage = (id: number, field: keyof PhotoGalleryImage, value: string) => {
    setGalleryImages(prev => 
      prev.map(image => 
        image.id === id ? { ...image, [field]: value } : image
      )
    );
  };

  const deleteSliderImage = (id: number) => {
    setSliderImages(prev => prev.filter(slide => slide.id !== id));
  };

  const deleteGalleryImage = (id: number) => {
    setGalleryImages(prev => prev.filter(image => image.id !== id));
  };

  const handleSave = () => {
    // In a real implementation, you'd save to a database
    alert('Changes saved! (In production, this would save to your database)');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Home className="w-6 h-6 text-red-500" />
              <h1 className="text-xl font-bold">Benchmark Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={onLogout}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('slider')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
              activeTab === 'slider' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Image className="w-5 h-5" />
            <span>Hero Slider</span>
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
              activeTab === 'gallery' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Camera className="w-5 h-5" />
            <span>Photo Gallery</span>
          </button>
        </div>

        {/* Slider Management */}
        {activeTab === 'slider' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Hero Slider Images</h2>
              <label className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload New Slide</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'slider')}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sliderImages.map((slide) => (
                <div key={slide.id} className="bg-gray-900 rounded-lg p-6">
                  <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => updateSliderImage(slide.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => updateSliderImage(slide.id, 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Button Text</label>
                      <input
                        type="text"
                        value={slide.buttonText}
                        onChange={(e) => updateSliderImage(slide.id, 'buttonText', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                      />
                    </div>
                    
                    <button
                      onClick={() => deleteSliderImage(slide.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Slide</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Management */}
        {activeTab === 'gallery' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Photo Gallery</h2>
              <label className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload Photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'gallery')}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image) => (
                <div key={image.id} className="bg-gray-900 rounded-lg p-4">
                  <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Alt Text</label>
                      <input
                        type="text"
                        value={image.alt}
                        onChange={(e) => updateGalleryImage(image.id, 'alt', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select
                        value={image.category}
                        onChange={(e) => updateGalleryImage(image.id, 'category', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white text-sm"
                      >
                        <option value="Excavators">Excavators</option>
                        <option value="Skid Steers">Skid Steers</option>
                        <option value="Rollers">Rollers</option>
                        <option value="Wheel Loaders">Wheel Loaders</option>
                        <option value="Water Trucks">Water Trucks</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <button
                      onClick={() => deleteGalleryImage(image.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;