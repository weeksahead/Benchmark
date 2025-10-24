'use client'

import React, { useState, useEffect } from 'react';
import { FileText, Eye, Send, Loader2 } from 'lucide-react';

interface Draft {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  keywords: string;
  createdDate: string;
  status: string;
  excerpt: string;
  content: string;
  hasImage: boolean;
}

const BlogDrafts = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [expandedDraft, setExpandedDraft] = useState<string | null>(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/blog-drafts');
      const data = await response.json();

      if (data.success) {
        setDrafts(data.drafts);
      } else {
        setMessage('❌ Failed to load drafts');
      }
    } catch (error) {
      console.error('Error fetching drafts:', error);
      setMessage('❌ Failed to load drafts');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async (draft: Draft) => {
    setPublishingId(draft.id);
    setMessage(`Publishing "${draft.title}"...`);

    try {
      const response = await fetch('/api/blog-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draft.title,
          excerpt: draft.excerpt,
          content: draft.content,
          category: draft.category,
          readTime: draft.readTime,
          slug: draft.slug,
          featuredImage: null // Image was not saved to Monday, would need to be re-uploaded
        })
      });

      if (!response.ok) {
        throw new Error('Failed to publish blog post');
      }

      const data = await response.json();
      setMessage(`🎉 Blog post published! View at /blog/${data.post.slug}`);

      // Refresh drafts list
      setTimeout(() => {
        fetchDrafts();
      }, 2000);
    } catch (error) {
      console.error('Publish error:', error);
      setMessage('❌ Failed to publish blog post. Please try again.');
    } finally {
      setPublishingId(null);
    }
  };

  const toggleExpanded = (draftId: string) => {
    setExpandedDraft(expandedDraft === draftId ? null : draftId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        <span className="ml-3 text-lg">Loading drafts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="w-8 h-8 text-red-500 mr-3" />
          <div>
            <h2 className="text-2xl font-bold">Blog Drafts</h2>
            <p className="text-gray-400 text-sm">Review and publish your AI-generated blog posts</p>
          </div>
        </div>
        <button
          onClick={fetchDrafts}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('✅') || message.includes('🎉')
            ? 'bg-green-900/30 text-green-400'
            : message.includes('❌')
            ? 'bg-red-900/30 text-red-400'
            : 'bg-blue-900/30 text-blue-400'
        }`}>
          {message}
        </div>
      )}

      {drafts.length === 0 ? (
        <div className="bg-gray-900 p-12 rounded-lg text-center">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No drafts found</p>
          <p className="text-gray-500 text-sm mt-2">Generate a blog post and save it to see it here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div key={draft.id} className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{draft.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="px-2 py-1 bg-gray-800 rounded">{draft.category}</span>
                      <span>{draft.readTime}</span>
                      {draft.hasImage && <span className="text-green-400">📷 Has Image</span>}
                      {draft.createdDate && <span>Created: {draft.createdDate}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleExpanded(draft.id)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      title="Preview content"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handlePublish(draft)}
                      disabled={publishingId === draft.id}
                      className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg transition-colors"
                    >
                      {publishingId === draft.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Publish
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{draft.excerpt}</p>

                {draft.keywords && (
                  <div className="text-sm text-gray-500">
                    <strong>Keywords:</strong> {draft.keywords}
                  </div>
                )}
              </div>

              {expandedDraft === draft.id && (
                <div className="border-t border-gray-800 p-6 bg-gray-950">
                  <h4 className="font-semibold mb-3 text-red-500">Full Content Preview</h4>
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: draft.content }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogDrafts;
