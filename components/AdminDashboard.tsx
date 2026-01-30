'use client'

import React, { useState, useEffect } from 'react';
import { Upload, Image, Trash2, Save, LogOut, Home, Camera, Link, Search, ExternalLink, Calculator, Archive, Wand2, FileText } from 'lucide-react';
import slidesData from '../config/slides.json';
import PurchaseCalculator from './PurchaseCalculator';
import SavedCalculations from './SavedCalculations';
import ContentFactory from './ContentFactory';
import PostedBlogs from './PostedBlogs';
import ImageCropModal from './ImageCropModal';

interface SavedCalculation {
  id: string;
  equipmentName: string;
  price: number;
  rental: number;
  utilization: number;
  monthlyROI: number;
  effectiveMonthlyRevenue: number;
  meetsTarget: boolean;
  timestamp: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

interface SlideImage {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl?: string;
}

interface PhotoGalleryImage {
  id: string;
  filename: string;
  url: string;
  alt_text: string;
  category: string;
  show_on_photos: boolean;
  show_on_hero: boolean;
  hero_title?: string;
  hero_subtitle?: string;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'slider' | 'gallery' | 'machines' | 'calculator' | 'saved' | 'content' | 'posted'>('slider');
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isLoadingCalculations, setIsLoadingCalculations] = useState(false);

  // Load from JSON configs
  const [sliderImages, setSliderImages] = useState<SlideImage[]>(slidesData);
  const [galleryImages, setGalleryImages] = useState<PhotoGalleryImage[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);

  // Machine Trader search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Image crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentCropImage, setCurrentCropImage] = useState<string>('');
  const [currentCropFileName, setCurrentCropFileName] = useState<string>('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  // Gallery picker modal state (for selecting photos for hero slides)
  const [galleryPickerOpen, setGalleryPickerOpen] = useState(false);

  // Load calculations from Monday.com when component mounts
  useEffect(() => {
    fetchCalculations();
    fetchGalleryPhotos();
  }, []);

  // Fetch gallery photos from Supabase
  const fetchGalleryPhotos = async () => {
    setIsLoadingGallery(true);
    try {
      const response = await fetch('/api/gallery-photos-admin');
      if (response.ok) {
        const data = await response.json();
        setGalleryImages(data.photos || []);
      } else {
        console.error('Failed to fetch gallery photos');
      }
    } catch (error) {
      console.error('Error fetching gallery photos:', error);
    } finally {
      setIsLoadingGallery(false);
    }
  };

  // Fetch calculations from Monday.com
  const fetchCalculations = async () => {
    setIsLoadingCalculations(true);
    try {
      const response = await fetch('/api/roi-calculation-fetch');
      if (response.ok) {
        const data = await response.json();
        setSavedCalculations(data.calculations || []);
      } else {
        console.error('Failed to fetch calculations');
      }
    } catch (error) {
      console.error('Error fetching calculations:', error);
    } finally {
      setIsLoadingCalculations(false);
    }
  };

  // Handle saving calculations to Monday.com
  const handleSaveCalculation = async (calculation: SavedCalculation) => {
    setIsSaving(true);
    setSaveMessage('Saving to Monday.com...');

    try {
      const response = await fetch('/api/roi-calculation-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentName: calculation.equipmentName,
          price: calculation.price,
          rental: calculation.rental,
          utilization: calculation.utilization,
          monthlyROI: calculation.monthlyROI,
          effectiveMonthlyRevenue: calculation.effectiveMonthlyRevenue,
          meetsTarget: calculation.meetsTarget
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSaveMessage('✅ Calculation saved to Monday.com successfully!');

        // Refresh calculations from Monday.com
        await fetchCalculations();
      } else {
        const error = await response.json();
        setSaveMessage('❌ Error: ' + (error.error || 'Failed to save'));
      }
    } catch (error) {
      console.error('Error saving calculation:', error);
      setSaveMessage('❌ Error: Failed to connect to server');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  // Handle deleting calculations
  const handleDeleteCalculation = (id: string) => {
    setSavedCalculations(prev => prev.filter(calc => calc.id !== id));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'slider' | 'gallery') => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    console.log(`Uploading ${files.length} files for ${type}`);
    const fileArray = Array.from(files);

    // For gallery uploads, open crop modal for first image
    if (type === 'gallery') {
      const firstFile = fileArray[0];

      if (!firstFile.type.startsWith('image/')) {
        alert(`${firstFile.name} is not an image file`);
        e.target.value = '';
        return;
      }

      try {
        const reader = new FileReader();
        const imageData = await new Promise<string>((resolve, reject) => {
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(firstFile);
        });

        // Store all files and open crop modal for the first one
        setPendingFiles(fileArray);
        setCurrentFileIndex(0);
        setCurrentCropImage(imageData);
        setCurrentCropFileName(firstFile.name);
        setCropModalOpen(true);
      } catch (error) {
        console.error('Error reading file:', error);
        setSaveMessage(`❌ Error reading ${firstFile.name}`);
        setTimeout(() => setSaveMessage(''), 3000);
      }

      e.target.value = '';
      return;
    }

    // For slider, keep existing immediate upload behavior
    for (const file of fileArray) {
      console.log('Processing file:', file.name, file.type, file.size);

      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        continue;
      }

      try {
        const reader = new FileReader();
        const imageData = await new Promise<string>((resolve, reject) => {
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });

        const newSlide: SlideImage = {
          id: Date.now() + Math.random(),
          image: imageData,
          title: 'New Slide Title',
          subtitle: 'New Slide Subtitle',
          buttonText: 'View Equipment'
        };
        setSliderImages(prev => [...prev, newSlide]);
      } catch (error) {
        console.error('Error uploading file:', error);
        setSaveMessage(`❌ Error uploading ${file.name}`);
        setTimeout(() => setSaveMessage(''), 3000);
      }
    }

    e.target.value = '';
  };

  const handleCropSave = async (croppedImage: string) => {
    const currentFile = pendingFiles[currentFileIndex];

    try {
      setSaveMessage('Uploading to Supabase...');

      const response = await fetch('/api/gallery-photo-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: croppedImage,
          alt: currentFile.name.replace(/\.[^/.]+$/, ""), // Remove file extension
          category: 'Other'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();

      // Refresh gallery from database to get the new photo with proper ID
      await fetchGalleryPhotos();
      setSaveMessage('✅ Photo uploaded successfully!');
      setTimeout(() => setSaveMessage(''), 3000);

      // Check if there are more files to process
      const nextIndex = currentFileIndex + 1;
      if (nextIndex < pendingFiles.length) {
        // Process next file
        const nextFile = pendingFiles[nextIndex];

        if (!nextFile.type.startsWith('image/')) {
          alert(`${nextFile.name} is not an image file`);
          // Skip to next file
          setCurrentFileIndex(nextIndex);
          handleCropSave(croppedImage);
          return;
        }

        const reader = new FileReader();
        const imageData = await new Promise<string>((resolve, reject) => {
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(nextFile);
        });

        setCurrentFileIndex(nextIndex);
        setCurrentCropImage(imageData);
        setCurrentCropFileName(nextFile.name);
      } else {
        // All files processed, close modal
        setCropModalOpen(false);
        setPendingFiles([]);
        setCurrentFileIndex(0);
        setCurrentCropImage('');
        setCurrentCropFileName('');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setSaveMessage(`❌ Error uploading ${currentFile.name}`);
      setTimeout(() => setSaveMessage(''), 3000);
      setCropModalOpen(false);
    }
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setPendingFiles([]);
    setCurrentFileIndex(0);
    setCurrentCropImage('');
    setCurrentCropFileName('');
    setSaveMessage('Upload cancelled');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const updateSliderImage = (id: number, field: keyof SlideImage, value: string) => {
    setSliderImages(prev => 
      prev.map(slide => 
        slide.id === id ? { ...slide, [field]: value } : slide
      )
    );
  };

  const updateGalleryImage = async (id: string, field: keyof PhotoGalleryImage, value: string | boolean) => {
    // Optimistic update
    setGalleryImages(prev =>
      prev.map(image =>
        image.id === id ? { ...image, [field]: value } : image
      )
    );

    // Save to database
    try {
      console.log('Updating photo:', { id, field, value });
      const response = await fetch('/api/gallery-photos-admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: value })
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Update failed:', data);
        fetchGalleryPhotos();
        setSaveMessage(`❌ Update failed: ${data.error || 'Unknown error'}`);
        setTimeout(() => setSaveMessage(''), 5000);
      }
    } catch (error: any) {
      console.error('Error updating photo:', error);
      fetchGalleryPhotos();
      setSaveMessage(`❌ Error: ${error.message || 'Failed to connect to server'}`);
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  const deleteSliderImage = (id: number) => {
    setSliderImages(prev => prev.filter(slide => slide.id !== id));
  };

  // Add a new hero slide from a gallery photo
  const addSlideFromGallery = (photo: PhotoGalleryImage) => {
    const newSlide: SlideImage = {
      id: Date.now() + Math.random(),
      image: photo.url,
      title: 'New Slide Title',
      subtitle: 'Edit this subtitle',
      buttonText: 'View Equipment'
    };
    setSliderImages(prev => [...prev, newSlide]);
    setGalleryPickerOpen(false);
    setSaveMessage('✅ Slide added from gallery! Remember to save changes.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const deleteGalleryImage = async (id: string, filename: string) => {
    if (!confirm('Are you sure you want to delete this photo? This cannot be undone.')) {
      return;
    }

    console.log('Deleting photo:', { id, filename });

    // Optimistic update
    setGalleryImages(prev => prev.filter(image => image.id !== id));
    setSaveMessage('Deleting photo...');

    try {
      const response = await fetch('/api/gallery-photos-admin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, filename })
      });

      const data = await response.json();
      console.log('Delete response:', data);

      if (response.ok) {
        setSaveMessage('✅ Photo deleted');
      } else {
        // Revert on error
        console.error('Delete failed:', data);
        fetchGalleryPhotos();
        setSaveMessage(`❌ Failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      fetchGalleryPhotos();
      setSaveMessage('❌ Network error - check console');
    }
    setTimeout(() => setSaveMessage(''), 5000);
  };

  const handleMachineSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch('/api/machine-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results.machines || []);
      } else {
        console.error('Search failed');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSave = async () => {
    const password = prompt('Enter admin password:');
    if (!password) return;
    
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Save slider images
      const slidesResponse = await fetch('/api/admin-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'slides',
          data: sliderImages,
          password: password
        })
      });
      
      // Save gallery images
      const photosResponse = await fetch('/api/admin-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'photos',
          data: galleryImages,
          password: password
        })
      });
      
      if (slidesResponse.ok && photosResponse.ok) {
        setSaveMessage('✅ Changes saved! They will be live in 1-2 minutes.');
        setTimeout(() => setSaveMessage(''), 5000);
      } else {
        const error = !slidesResponse.ok ? await slidesResponse.json() : await photosResponse.json();
        setSaveMessage('❌ Error: ' + (error.error || 'Failed to save'));
      }
    } catch (error) {
      setSaveMessage('❌ Error: Failed to connect to server');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Home className="w-6 h-6 text-red-500" />
              <h1 className="text-xl font-bold">Benchmark Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              {saveMessage && (
                <span className="text-sm">{saveMessage}</span>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
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

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-gray-900 border-r border-gray-800 flex-shrink-0 overflow-y-auto">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('slider')}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-3 ${
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
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-3 ${
                activeTab === 'gallery'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Camera className="w-5 h-5" />
              <span>Photo Gallery</span>
            </button>
            <button
              onClick={() => setActiveTab('machines')}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-3 ${
                activeTab === 'machines'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Search className="w-5 h-5" />
              <span>Equipment Research</span>
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-3 ${
                activeTab === 'calculator'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Calculator className="w-5 h-5" />
              <span>Purchase Calculator</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-3 ${
                activeTab === 'saved'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Archive className="w-5 h-5" />
              <span>Saved Calculations</span>
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-3 ${
                activeTab === 'content'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Wand2 className="w-5 h-5" />
              <span>Content Factory</span>
            </button>
            <button
              onClick={() => setActiveTab('posted')}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-3 ${
                activeTab === 'posted'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Posted Blogs</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">

        {/* Slider Management */}
        {activeTab === 'slider' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Hero Slider Images</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (galleryImages.length === 0) {
                      fetchGalleryPhotos();
                    }
                    setGalleryPickerOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <Image className="w-4 h-4" />
                  <span>Add from Gallery</span>
                </button>
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
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Button URL</label>
                      <div className="flex items-center space-x-2">
                        <Link className="w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={slide.buttonUrl || ''}
                          onChange={(e) => updateSliderImage(slide.id, 'buttonUrl', e.target.value)}
                          placeholder="https://rent.benchmarkequip.com/items/..."
                          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                        />
                      </div>
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
              <div className="flex gap-2">
                <button
                  onClick={fetchGalleryPhotos}
                  disabled={isLoadingGallery}
                  className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <Archive className="w-4 h-4" />
                  <span>{isLoadingGallery ? 'Loading...' : 'Refresh'}</span>
                </button>
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
            </div>

            {isLoadingGallery ? (
              <div className="text-center py-12 text-gray-400">Loading photos...</div>
            ) : galleryImages.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No photos in gallery. Upload some photos to get started.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((image) => (
                  <div key={image.id} className="bg-gray-900 rounded-lg p-4">
                    <div className="aspect-[4/3] mb-4 rounded-lg overflow-hidden bg-gray-800">
                      <img
                        src={image.url}
                        alt={image.alt_text}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="space-y-3">
                      {/* Visibility Checkboxes */}
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={image.show_on_photos}
                            onChange={(e) => updateGalleryImage(image.id, 'show_on_photos', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-red-500 focus:ring-red-500"
                          />
                          <span className="text-sm">Photos Page</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={image.show_on_hero}
                            onChange={(e) => updateGalleryImage(image.id, 'show_on_hero', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-red-500 focus:ring-red-500"
                          />
                          <span className="text-sm">Hero Slider</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Alt Text</label>
                        <input
                          type="text"
                          value={image.alt_text}
                          onChange={(e) => updateGalleryImage(image.id, 'alt_text', e.target.value)}
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
                          <option value="Dozers">Dozers</option>
                          <option value="Articulated Trucks">Articulated Trucks</option>
                          <option value="Equipment">Equipment</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Hero fields - only show when hero is checked */}
                      {image.show_on_hero && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-1">Hero Title</label>
                            <input
                              type="text"
                              value={image.hero_title || ''}
                              onChange={(e) => updateGalleryImage(image.id, 'hero_title', e.target.value)}
                              placeholder="Heavy Equipment Rentals"
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
                            <input
                              type="text"
                              value={image.hero_subtitle || ''}
                              onChange={(e) => updateGalleryImage(image.id, 'hero_subtitle', e.target.value)}
                              placeholder="Serving North Texas since 2010"
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white text-sm"
                            />
                          </div>
                        </>
                      )}

                      <button
                        onClick={() => deleteGalleryImage(image.id, image.filename)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Machine Research */}
        {activeTab === 'machines' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Equipment Market Research</h2>
              
              {/* Search Bar */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for machines (e.g., Caterpillar 320 excavator, Bobcat S650 skid steer)"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleMachineSearch()}
                  />
                </div>
                <button
                  onClick={handleMachineSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>{isSearching ? 'Searching...' : 'Search'}</span>
                </button>
              </div>

              {/* Search Instructions */}
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-2">Equipment Market Research Tool</h3>
                <p className="text-sm text-gray-300 mb-3">
                  This tool provides market analysis data including typical pricing, availability, and buying insights for construction equipment.
                </p>
                <h4 className="font-semibold mb-2 text-sm">Search Tips:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Be specific: "Caterpillar 320 excavator" works better than just "excavator"</li>
                  <li>• Include model numbers: "Bobcat S650", "CAT 336", "Dynapac CA250"</li>
                  <li>• Try different variations: "skid steer", "skid loader", "compact loader"</li>
                  <li>• Use manufacturer names: Caterpillar, Bobcat, John Deere, Dynapac, etc.</li>
                </ul>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Found {searchResults.length} machine{searchResults.length !== 1 ? 's' : ''}
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {searchResults.map((machine, index) => (
                    <div key={index} className="bg-gray-900 rounded-lg p-6">
                      {machine.image && (
                        <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-gray-800">
                          <img
                            src={machine.image}
                            alt={machine.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <h4 className="font-bold text-lg">{machine.title}</h4>
                        
                        {machine.price && (
                          <p className="text-red-400 font-semibold text-xl">{machine.price}</p>
                        )}
                        
                        {machine.location && (
                          <p className="text-gray-300">📍 {machine.location}</p>
                        )}
                        
                        {machine.year && (
                          <p className="text-gray-300">📅 Year: {machine.year}</p>
                        )}
                        
                        {machine.hours && (
                          <p className="text-gray-300">⏱️ Hours: {machine.hours}</p>
                        )}
                        
                        {machine.description && (
                          <p className="text-gray-400 text-sm">{machine.description}</p>
                        )}
                        
                        <div className="inline-flex items-center space-x-2 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg font-semibold">
                          <Search className="w-4 h-4" />
                          <span>Market Analysis Data</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.length === 0 && searchQuery && !isSearching && (
              <div className="text-center py-12 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No machines found for "{searchQuery}"</p>
                <p className="text-sm mt-2">Try a different search term or check the tips above</p>
              </div>
            )}
          </div>
        )}

        {/* Purchase Calculator */}
        {activeTab === 'calculator' && (
          <div>
            <PurchaseCalculator onSaveCalculation={handleSaveCalculation} />
          </div>
        )}

        {/* Saved Calculations */}
        {activeTab === 'saved' && (
          <div>
            {isLoadingCalculations ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Loading calculations from Monday.com...</p>
              </div>
            ) : (
              <SavedCalculations
                calculations={savedCalculations}
                onDeleteCalculation={handleDeleteCalculation}
              />
            )}
          </div>
        )}

        {/* Content Factory */}
        {activeTab === 'content' && (
          <div>
            <ContentFactory />
          </div>
        )}

        {/* Posted Blogs */}
        {activeTab === 'posted' && (
          <div>
            <PostedBlogs />
          </div>
        )}
          </div>
        </main>
      </div>

      {/* Image Crop Modal */}
      {cropModalOpen && (
        <ImageCropModal
          image={currentCropImage}
          fileName={currentCropFileName}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
        />
      )}

      {/* Gallery Picker Modal */}
      {galleryPickerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold">Select Photo for Hero Slide</h3>
              <button
                onClick={() => setGalleryPickerOpen(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {galleryImages.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  {isLoadingGallery ? 'Loading photos...' : 'No photos in gallery. Upload some photos first.'}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryImages.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => addSlideFromGallery(photo)}
                      className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-800 hover:ring-2 hover:ring-red-500 transition-all"
                    >
                      <img
                        src={photo.url}
                        alt={photo.alt_text}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;