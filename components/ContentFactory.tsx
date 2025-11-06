'use client'

import React, { useState } from 'react';
import { Wand2, FileText, Eye, Save, Loader2, Lightbulb, RefreshCw, Upload, Image as ImageIcon, X } from 'lucide-react';
import ImageCropModal from './ImageCropModal';

interface GeneratedContent {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  slug: string;
  keywords: string[];
}

const ContentFactory = () => {
  const [mode, setMode] = useState<'blog' | 'image'>('blog');
  const [topic, setTopic] = useState('');
  const [equipmentModel, setEquipmentModel] = useState('');
  const [contentAngle, setContentAngle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState<'Blog-images' | 'AI generated photos'>('Blog-images');

  // Image generation states
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSavingToSupabase, setIsSavingToSupabase] = useState(false);
  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);

  // Image crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentCropImage, setCurrentCropImage] = useState<string>('');
  const [currentCropFileName, setCurrentCropFileName] = useState<string>('');

  const contentAngles = [
    'Specifications & Features',
    'Best Use Cases & Applications',
    'vs. Competitor Comparison',
    'Operator Tips & Techniques',
    'Maintenance Guide',
    'ROI & Rental Analysis',
    'Industry-Specific Uses',
    'Technology Features',
    'Safety Features & Protocols',
    'Fuel Efficiency Strategies',
    'Attachment Guide',
    'Project Case Study',
    'Seasonal Considerations',
    'Model Evolution & History',
    'Troubleshooting Guide'
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setSaveMessage('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setSaveMessage('Generating content with Claude AI...');
    setGeneratedContent(null);

    try {
      const response = await fetch('/api/blog-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          equipmentModel,
          contentAngle
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data.content);
      setShowPreview(true);
      setSaveMessage('✅ Content generated successfully!');
    } catch (error) {
      console.error('Content generation error:', error);
      setSaveMessage('❌ Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedContent) return;

    setIsPublishing(true);
    setSaveMessage('Publishing blog post to site...');

    try {
      // Publish to site first
      const response = await fetch('/api/blog-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generatedContent.title,
          excerpt: generatedContent.excerpt,
          content: generatedContent.content,
          category: generatedContent.category,
          readTime: generatedContent.readTime,
          slug: generatedContent.slug,
          featuredImage: featuredImage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to publish blog post');
      }

      const data = await response.json();

      // After successful publish, track in Monday.com (don't await, fire and forget)
      fetch('/api/blog-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generatedContent.title,
          topic,
          equipmentModel,
          contentAngle,
          category: generatedContent.category,
          keywords: generatedContent.keywords,
          wordCount: generatedContent.content.split(/\s+/).length,
          slug: generatedContent.slug,
          excerpt: generatedContent.excerpt,
          content: generatedContent.content.substring(0, 1000), // Just first 1000 chars for reference
          featuredImage: featuredImage ? 'published' : null
        })
      }).catch(err => console.log('Monday tracking failed (non-critical):', err));

      setSaveMessage(`🎉 Blog post published successfully! View at /blog/${data.post.slug}`);

      // Reset form after a delay
      setTimeout(() => {
        setTopic('');
        setEquipmentModel('');
        setContentAngle('');
        setGeneratedContent(null);
        setShowPreview(false);
        setSaveMessage('');
        setFeaturedImage(null);
        setImagePreview(null);
        setIsEditing(false);
      }, 3000);
    } catch (error) {
      console.error('Publish error:', error);
      setSaveMessage('❌ Failed to publish blog post. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSuggestTopic = async () => {
    setIsSuggesting(true);
    setSaveMessage('AI is analyzing existing blogs and suggesting a topic...');
    setSuggestion(null);

    try {
      const response = await fetch('/api/blog-suggest-topic');

      if (!response.ok) {
        throw new Error('Failed to get topic suggestion');
      }

      const data = await response.json();
      setSuggestion(data.suggestion);

      // Auto-fill the form with the suggestion
      setTopic(data.suggestion.topic);
      setEquipmentModel(data.suggestion.equipmentModel);
      setContentAngle(data.suggestion.contentAngle);

      setSaveMessage('✅ Topic suggested! Click "Generate Blog Post" or refresh for a new idea.');
    } catch (error) {
      console.error('Suggestion error:', error);
      setSaveMessage('❌ Failed to suggest topic. Please try again.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSaveMessage('❌ Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setCurrentCropImage(imageData);
      setCurrentCropFileName(file.name);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  const handleCropSave = (croppedImage: string) => {
    setFeaturedImage(croppedImage);
    setImagePreview(croppedImage);
    setCropModalOpen(false);
    setSaveMessage('✅ Image cropped! It will be included when you save.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setCurrentCropImage('');
    setCurrentCropFileName('');
    setSaveMessage('Upload cancelled');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const loadExistingImages = async (bucket: 'Blog-images' | 'AI generated photos') => {
    setLoadingImages(true);
    setSelectedBucket(bucket);
    try {
      const response = await fetch(`/api/blog-images-list?bucket=${encodeURIComponent(bucket)}`);
      if (!response.ok) throw new Error('Failed to load images');

      const data = await response.json();
      setExistingImages(data.images || []);
      setShowImagePicker(true);
    } catch (error) {
      console.error('Error loading images:', error);
      setSaveMessage('❌ Failed to load existing images');
    } finally {
      setLoadingImages(false);
    }
  };

  const selectExistingImage = (imageUrl: string) => {
    setFeaturedImage(imageUrl);
    setImagePreview(imageUrl);
    setShowImagePicker(false);
    setSaveMessage('✅ Image selected!');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      setSaveMessage('Please enter an image description');
      return;
    }

    setIsGeneratingImage(true);
    setSaveMessage('Generating image with AI...');
    setGeneratedImageUrl(null);
    setSavedImageUrl(null);

    try {
      const response = await fetch('/api/image-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt })
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImageUrl(data.imageUrl);
      setSaveMessage('✅ Image generated! Review it below and click "Save to Supabase" when ready.');
    } catch (error) {
      console.error('Image generation error:', error);
      setSaveMessage('❌ Failed to generate image. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSaveImageToSupabase = async () => {
    if (!generatedImageUrl) return;

    setIsSavingToSupabase(true);
    setSaveMessage('Saving image to Supabase...');

    try {
      const response = await fetch('/api/image-save-to-supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: generatedImageUrl })
      });

      if (!response.ok) {
        throw new Error('Failed to save image to Supabase');
      }

      const data = await response.json();
      setSavedImageUrl(data.imageUrl);
      setSaveMessage('✅ Image saved to Supabase! You can now use it in your blogs.');
    } catch (error) {
      console.error('Save to Supabase error:', error);
      setSaveMessage('❌ Failed to save image to Supabase. Please try again.');
    } finally {
      setIsSavingToSupabase(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <div className="flex items-center mb-6">
          <Wand2 className="w-6 h-6 text-red-500 mr-3" />
          <h2 className="text-2xl font-bold">AI Content Factory</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMode('blog')}
            className={`p-6 rounded-lg border-2 transition-all ${
              mode === 'blog'
                ? 'border-red-500 bg-red-900/20'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}
          >
            <FileText className={`w-12 h-12 mx-auto mb-3 ${mode === 'blog' ? 'text-red-500' : 'text-gray-400'}`} />
            <h3 className="text-lg font-bold mb-2">Create Blog</h3>
            <p className="text-sm text-gray-400">Generate AI-powered blog posts</p>
          </button>

          <button
            onClick={() => setMode('image')}
            className={`p-6 rounded-lg border-2 transition-all ${
              mode === 'image'
                ? 'border-red-500 bg-red-900/20'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}
          >
            <ImageIcon className={`w-12 h-12 mx-auto mb-3 ${mode === 'image' ? 'text-red-500' : 'text-gray-400'}`} />
            <h3 className="text-lg font-bold mb-2">Create Image</h3>
            <p className="text-sm text-gray-400">Generate AI images for your content</p>
          </button>
        </div>
      </div>

      {/* Blog Creation Section */}
      {mode === 'blog' && (
        <>
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="space-y-4">
          {/* AI Topic Suggester */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-lg border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Lightbulb className="w-6 h-6 text-yellow-400 mr-3" />
                <h3 className="text-lg font-bold">AI Topic Suggester</h3>
              </div>
              {suggestion && (
                <button
                  onClick={handleSuggestTopic}
                  disabled={isSuggesting}
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isSuggesting ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              )}
            </div>

            {suggestion && (
              <div className="mb-4 p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-300 mb-2"><span className="font-semibold text-white">AI Reasoning:</span> {suggestion.reasoning}</p>
              </div>
            )}

            <button
              onClick={handleSuggestTopic}
              disabled={isSuggesting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center"
            >
              {isSuggesting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  AI Analyzing Existing Blogs...
                </>
              ) : (
                <>
                  <Lightbulb className="w-5 h-5 mr-2" />
                  {suggestion ? 'Get New Suggestion' : 'Suggest Blog Topic with AI'}
                </>
              )}
            </button>
          </div>

          {/* Topic Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Blog Topic {suggestion && <span className="text-purple-400">(AI Suggested)</span>}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Benefits of Cat 336 Excavator for Construction Projects"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
            />
          </div>

          {/* Equipment Model */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Equipment Model (Optional - only used if specified)
            </label>
            <input
              type="text"
              value={equipmentModel}
              onChange={(e) => setEquipmentModel(e.target.value)}
              placeholder="e.g., Cat 320, Cat D8, Cat 938M Wheel Loader"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
            />
          </div>

          {/* Content Angle */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Content Angle (Optional)
            </label>
            <select
              value={contentAngle}
              onChange={(e) => setContentAngle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
            >
              <option value="">Select an angle...</option>
              {contentAngles.map((angle) => (
                <option key={angle} value={angle}>{angle}</option>
              ))}
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Blog Post
              </>
            )}
          </button>

          {/* Status Message */}
          {saveMessage && (
            <div className={`p-3 rounded-lg ${saveMessage.includes('✅') ? 'bg-green-900/30 text-green-400' : saveMessage.includes('❌') ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'}`}>
              {saveMessage}
            </div>
          )}
          </div>
        </div>

        {/* Generated Content Preview */}
        {generatedContent && (
        <div className="bg-gray-900 p-6 rounded-lg space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-xl font-bold">Generated Content</h3>
            </div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center text-red-500 hover:text-red-400"
            >
              <Eye className="w-5 h-5 mr-2" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
          </div>

          {showPreview && (
            <div className="space-y-4">
              {/* Edit Mode Toggle */}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  {isEditing ? 'Done Editing' : 'Edit Content'}
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={generatedContent.title}
                    onChange={(e) => setGeneratedContent({ ...generatedContent, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">
                    {generatedContent.title}
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Excerpt</label>
                {isEditing ? (
                  <textarea
                    value={generatedContent.excerpt}
                    onChange={(e) => setGeneratedContent({ ...generatedContent, excerpt: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">
                    {generatedContent.excerpt}
                  </div>
                )}
              </div>

              {/* Category & Read Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                  <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">
                    {generatedContent.category}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Read Time</label>
                  <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">
                    {generatedContent.readTime}
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">SEO Keywords</label>
                <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">
                  {generatedContent.keywords.join(', ')}
                </div>
              </div>

              {/* Featured Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Featured Image</label>
                {imagePreview ? (
                  <div className="space-y-2">
                    <img src={imagePreview} alt="Featured" className="w-full max-h-64 object-cover rounded-lg" />
                    <button
                      onClick={() => {
                        setFeaturedImage(null);
                        setImagePreview(null);
                      }}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-400">Upload New</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => loadExistingImages('Blog-images')}
                      disabled={loadingImages}
                      className="flex flex-col items-center justify-center h-32 border-2 border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-400 text-center px-2">
                        {loadingImages ? 'Loading...' : 'Blog Images'}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => loadExistingImages('AI generated photos')}
                      disabled={loadingImages}
                      className="flex flex-col items-center justify-center h-32 border-2 border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      <Wand2 className="w-8 h-8 mb-2 text-purple-400" />
                      <p className="text-sm text-gray-400 text-center px-2">
                        {loadingImages ? 'Loading...' : 'AI Generated'}
                      </p>
                    </button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Content (HTML)</label>
                {isEditing ? (
                  <textarea
                    value={generatedContent.content}
                    onChange={(e) => setGeneratedContent({ ...generatedContent, content: e.target.value })}
                    rows={20}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Edit HTML content here..."
                  />
                ) : (
                  <div
                    className="px-4 py-3 bg-gray-800 rounded-lg text-white max-h-96 overflow-y-auto"
                    style={{ lineHeight: '1.8' }}
                    dangerouslySetInnerHTML={{ __html: generatedContent.content }}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Publish to Site
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setTopic('');
                    setEquipmentModel('');
                    setContentAngle('');
                    setGeneratedContent(null);
                    setShowPreview(false);
                    setSaveMessage('');
                    setFeaturedImage(null);
                    setImagePreview(null);
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Start New
                </button>
              </div>
            </div>
          )}
        </div>
        )}
        </>
      )}

      {/* Image Generation Section */}
      {mode === 'image' && (
        <div className="bg-gray-900 p-6 rounded-lg">
          <div className="flex items-center mb-6">
            <ImageIcon className="w-6 h-6 text-red-500 mr-3" />
            <h2 className="text-2xl font-bold">AI Image Generator</h2>
          </div>

          <div className="space-y-4">
            {/* Image Prompt */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Image Description
              </label>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe the image you want to create... e.g., 'A Caterpillar 320 excavator working at a construction site in North Texas, professional photography, golden hour lighting'"
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
              />
              <p className="mt-2 text-sm text-gray-400">
                💡 Tip: Be specific about equipment model, setting, lighting, and style for best results
              </p>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateImage}
              disabled={isGeneratingImage}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Image...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate Image with AI
                </>
              )}
            </button>

            {/* Status Message */}
            {saveMessage && (
              <div className={`p-3 rounded-lg ${saveMessage.includes('✅') ? 'bg-green-900/30 text-green-400' : saveMessage.includes('❌') ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'}`}>
                {saveMessage}
              </div>
            )}

            {/* Generated Image Preview */}
            {generatedImageUrl && (
              <div className="space-y-4">
                <div className={`border-2 rounded-lg p-4 ${savedImageUrl ? 'border-green-500 bg-green-900/10' : 'border-yellow-500 bg-yellow-900/10'}`}>
                  <h3 className={`text-lg font-bold mb-3 flex items-center ${savedImageUrl ? 'text-green-400' : 'text-yellow-400'}`}>
                    <ImageIcon className="w-5 h-5 mr-2" />
                    {savedImageUrl ? 'Image Saved to Supabase!' : 'Image Generated - Review Before Saving'}
                  </h3>
                  <img
                    src={generatedImageUrl}
                    alt="Generated"
                    className="w-full rounded-lg mb-4"
                  />

                  {!savedImageUrl ? (
                    <>
                      <div className="bg-gray-800 p-3 rounded-lg mb-4">
                        <p className="text-sm text-gray-400 mb-2">Temporary OpenAI URL (will expire):</p>
                        <p className="text-sm text-white font-mono break-all">{generatedImageUrl}</p>
                      </div>
                      <button
                        onClick={handleSaveImageToSupabase}
                        disabled={isSavingToSupabase}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center mb-3"
                      >
                        {isSavingToSupabase ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Saving to Supabase...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5 mr-2" />
                            Save to Supabase
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <div className="bg-gray-800 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-400 mb-2">Permanent Supabase URL:</p>
                      <p className="text-sm text-white font-mono break-all">{savedImageUrl}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {savedImageUrl && (
                      <button
                        onClick={() => setMode('blog')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        Create Blog with This Image
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setImagePrompt('');
                        setGeneratedImageUrl(null);
                        setSavedImageUrl(null);
                        setSaveMessage('');
                      }}
                      className={`${savedImageUrl ? '' : 'flex-1'} bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors`}
                    >
                      Generate Another
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Picker Modal */}
      {showImagePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Choose Existing Image</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {selectedBucket === 'AI generated photos' ? (
                    <span className="flex items-center">
                      <Wand2 className="w-4 h-4 mr-1 text-purple-400" />
                      AI Generated Photos
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <ImageIcon className="w-4 h-4 mr-1" />
                      Blog Images
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => setShowImagePicker(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {existingImages.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No images found in storage</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {existingImages.map((imageUrl, index) => (
                    <div
                      key={index}
                      onClick={() => selectExistingImage(imageUrl)}
                      className="relative group cursor-pointer rounded-lg overflow-hidden hover:ring-2 hover:ring-red-500 transition-all"
                    >
                      <img
                        src={imageUrl}
                        alt={`Image ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 font-semibold">
                          Select
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Crop Modal */}
      {cropModalOpen && (
        <ImageCropModal
          image={currentCropImage}
          fileName={currentCropFileName}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default ContentFactory;
