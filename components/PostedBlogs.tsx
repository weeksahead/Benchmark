'use client'

import React, { useState, useEffect } from 'react';
import { FileText, Edit, Image as ImageIcon, Loader2, X, Save, Upload } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  slug: string;
}

const PostedBlogs = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateSort, setDateSort] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [posts, categoryFilter, dateSort]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/blog-posts');
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
      } else {
        setMessage('❌ Failed to load blog posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setMessage('❌ Failed to load blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...posts];

    // Category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    // Date sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateSort === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredPosts(filtered);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPost) return;

    if (!file.type.startsWith('image/')) {
      setMessage('❌ Please upload an image file');
      return;
    }

    setIsUploadingImage(true);
    const originalSizeMB = (file.size / 1024 / 1024).toFixed(2);
    setMessage(`Compressing image (${originalSizeMB}MB)...`);

    try {
      // Compress image on client side before uploading
      const options = {
        maxSizeMB: 1, // Max 1MB
        maxWidthOrHeight: 1920, // Max dimension
        useWebWorker: true,
        fileType: 'image/jpeg'
      };

      const compressedFile = await imageCompression(file, options);
      const compressedSizeMB = (compressedFile.size / 1024 / 1024).toFixed(2);
      setMessage(`Uploading (compressed to ${compressedSizeMB}MB)...`);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = event.target?.result as string;

        // Upload to server
        const response = await fetch('/api/blog-image-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: imageData,
            filename: editingPost.slug
          })
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();

        // Update editing post with new image path
        setEditingPost({
          ...editingPost,
          image: data.imagePath
        });

        setMessage(`✅ Image uploaded! (${originalSizeMB}MB → ${compressedSizeMB}MB)`);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Image upload error:', error);
      setMessage('❌ Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const loadExistingImages = async () => {
    setLoadingImages(true);
    try {
      const response = await fetch('/api/blog-images-list');
      if (!response.ok) throw new Error('Failed to load images');

      const data = await response.json();
      setExistingImages(data.images || []);
      setShowImagePicker(true);
    } catch (error) {
      console.error('Error loading images:', error);
      setMessage('❌ Failed to load existing images');
    } finally {
      setLoadingImages(false);
    }
  };

  const selectExistingImage = (imageUrl: string) => {
    if (editingPost) {
      setEditingPost({
        ...editingPost,
        image: imageUrl
      });
      setShowImagePicker(false);
      setMessage('✅ Image selected!');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleSave = async () => {
    if (!editingPost) return;

    setIsSaving(true);
    setMessage('Saving changes...');

    try {
      const response = await fetch('/api/blog-update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPost)
      });

      if (!response.ok) {
        throw new Error('Failed to update blog post');
      }

      const data = await response.json();
      setMessage(`✅ Blog post updated successfully!`);

      // Refresh posts list
      await fetchPosts();

      // Close modal after a delay
      setTimeout(() => {
        setEditingPost(null);
        setMessage('');
      }, 2000);
    } catch (error) {
      console.error('Save error:', error);
      setMessage('❌ Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        <span className="ml-3 text-lg">Loading blog posts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="w-8 h-8 text-red-500 mr-3" />
          <div>
            <h2 className="text-2xl font-bold">Posted Blogs</h2>
            <p className="text-gray-400 text-sm">Manage and edit your published blog posts</p>
          </div>
        </div>
        <button
          onClick={fetchPosts}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 p-4 rounded-lg flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Sort by Date</label>
          <select
            value={dateSort}
            onChange={(e) => setDateSort(e.target.value as 'newest' | 'oldest')}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
        <div className="flex items-end">
          <div className="text-sm text-gray-400">
            Showing {filteredPosts.length} of {posts.length} posts
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('✅')
            ? 'bg-green-900/30 text-green-400'
            : message.includes('❌')
            ? 'bg-red-900/30 text-red-400'
            : 'bg-blue-900/30 text-blue-400'
        }`}>
          {message}
        </div>
      )}

      {/* Blog Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-gray-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-red-500 transition-all">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 bg-gray-800 rounded">{post.category}</span>
                <span className="text-xs text-gray-400">{post.date}</span>
              </div>
              <h3 className="text-lg font-bold mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
              <button
                onClick={() => setEditingPost(post)}
                className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Post
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="bg-gray-900 p-12 rounded-lg text-center">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No blog posts found</p>
        </div>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-2xl font-bold">Edit Blog Post</h3>
              <button
                onClick={() => setEditingPost(null)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Featured Image</label>
                <div className="space-y-2">
                  <img
                    src={editingPost.image}
                    alt={editingPost.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="flex gap-2">
                    <label className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploadingImage ? 'Uploading...' : 'Upload New'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploadingImage}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={loadExistingImages}
                      disabled={loadingImages}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      {loadingImages ? 'Loading...' : 'Choose Existing'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Excerpt</label>
                <textarea
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              {/* Category & Read Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                  <input
                    type="text"
                    value={editingPost.category}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Read Time</label>
                  <input
                    type="text"
                    value={editingPost.readTime}
                    onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">URL Slug</label>
                <input
                  type="text"
                  value={editingPost.slug}
                  onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Content (HTML)</label>
                <textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  rows={20}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={() => setEditingPost(null)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Picker Modal */}
      {showImagePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-2xl font-bold">Choose Existing Image</h3>
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
    </div>
  );
};

export default PostedBlogs;
