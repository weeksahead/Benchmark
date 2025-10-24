'use client'

import React, { useState } from 'react';
import { Wand2, FileText, Eye, Save, Loader2, Lightbulb, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';

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
  const [topic, setTopic] = useState('');
  const [equipmentModel, setEquipmentModel] = useState('');
  const [contentAngle, setContentAngle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [savedToMonday, setSavedToMonday] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const equipmentModels = [
    'Cat 301.7 (Mini Excavator)',
    'Cat 315 (Small Excavator)',
    'Cat 320 (Medium Excavator)',
    'Cat 323 (Medium Excavator)',
    'Cat 336 (Medium Excavator)',
    'Cat 395 (Large Excavator)',
    'Cat 938M (Wheel Loader)',
    'Cat 950M (Wheel Loader)',
    'Cat 272D3 (Skid Steer)',
    'Cat CS54B (Compactor/Roller)',
    'Cat D8 (Dozer)',
    'General Equipment Topic'
  ];

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

  const handleSave = async () => {
    if (!generatedContent) return;

    setIsSaving(true);
    setSaveMessage('Saving draft to Monday.com...');

    try {
      const response = await fetch('/api/blog-save', {
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
          content: generatedContent.content,
          featuredImage: featuredImage ? 'image-included' : null // Don't send base64 data, just indicate presence
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save draft');
      }

      const data = await response.json();
      setSavedToMonday(true);
      setSaveMessage('✅ Draft saved to Monday.com! Ready to publish to site.');
    } catch (error) {
      console.error('Save error:', error);
      setSaveMessage('❌ Failed to save draft. Please try again.');
    } finally {
      setIsSaving(false);
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
      setFeaturedImage(imageData);
      setImagePreview(imageData);
      setSaveMessage('✅ Image uploaded! It will be included when you save.');
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = async () => {
    if (!generatedContent) return;

    setIsPublishing(true);
    setSaveMessage('Publishing blog post to site...');

    try {
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
      setSaveMessage(`🎉 Blog post published successfully! View at /blog/${data.post.slug}`);
    } catch (error) {
      console.error('Publish error:', error);
      setSaveMessage('❌ Failed to publish blog post. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-lg">
        <div className="flex items-center mb-6">
          <Wand2 className="w-6 h-6 text-red-500 mr-3" />
          <h2 className="text-2xl font-bold">AI Content Factory</h2>
        </div>

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
              Equipment Model (Optional)
            </label>
            <select
              value={equipmentModel}
              onChange={(e) => setEquipmentModel(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
            >
              <option value="">Select a model...</option>
              {equipmentModels.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
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
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">
                  {generatedContent.title}
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Excerpt</label>
                <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">
                  {generatedContent.excerpt}
                </div>
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
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-400">Click to upload featured image</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Content</label>
                <div
                  className="px-4 py-3 bg-gray-800 rounded-lg text-white max-h-96 overflow-y-auto"
                  style={{ lineHeight: '1.8' }}
                  dangerouslySetInnerHTML={{ __html: generatedContent.content }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {!savedToMonday ? (
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save to Monday.com
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
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
                )}
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
                    setSavedToMonday(false);
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
    </div>
  );
};

export default ContentFactory;
