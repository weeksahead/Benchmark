'use client'

import Link from 'next/link'
import { Calendar, User, ArrowRight, Tag } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import { BlogPost } from '@/data/blogPosts'

interface BlogPostClientProps {
  post: BlogPost
}

// Helper to parse JSON fields that may be strings or objects
function parseJsonField<T>(field: string | T | null | undefined): T | null {
  if (!field) return null
  if (typeof field === 'string') {
    try {
      return JSON.parse(field)
    } catch {
      return null
    }
  }
  return field as T
}

interface FAQ {
  question: string
  answer: string
}

interface Keywords {
  short?: string[]
  medium?: string[]
  longtail?: string[]
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const postUrl = `https://benchmarkequip.com/blog/${post.slug}`
  // Handle both relative paths and full URLs for images
  const postImageUrl = post.image.startsWith('http')
    ? post.image
    : `https://benchmarkequip.com${post.image}`

  // Parse FAQs and keywords from JSON strings (GEO optimization)
  const faqs = parseJsonField<FAQ[]>(post.faqs)
  const keywords = parseJsonField<Keywords>(post.keywords)

  // Build keywords string for schema
  const keywordsList = keywords
    ? [
        ...(keywords.short || []),
        ...(keywords.medium || []),
        ...(keywords.longtail || [])
      ].join(', ')
    : `construction equipment, heavy equipment, equipment rental, Cat equipment, ${post.category.toLowerCase()}`

  return (
    <>
      <Header />
      <section className="bg-black text-white min-h-screen py-20">
        {/* BlogPosting Schema - Enhanced for GEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "image": postImageUrl,
              "datePublished": post.date,
              "dateModified": post.date,
              "author": {
                "@type": "Organization",
                "name": post.author,
                "url": "https://benchmarkequip.com/about",
                "description": "Heavy equipment rental specialists serving North Texas since 2020",
                "knowsAbout": [
                  "CAT excavators",
                  "heavy equipment rental",
                  "construction equipment",
                  "earthmoving equipment",
                  "North Texas construction"
                ]
              },
              "publisher": {
                "@type": "Organization",
                "name": "Benchmark Equipment Rental & Sales",
                "url": "https://benchmarkequip.com",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://benchmarkequip.com/assets/Benchmark%20Logo%20(RGB%20Color%20Reverse).png"
                },
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Denton",
                  "addressRegion": "TX",
                  "addressCountry": "US"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": postUrl
              },
              "articleSection": post.category,
              "keywords": keywordsList,
              "inLanguage": "en-US",
              "isAccessibleForFree": true
            })
          }}
        />

        {/* FAQPage Schema - For AI answer engines (GEO optimization) */}
        {faqs && faqs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqs.map(faq => ({
                  "@type": "Question",
                  "name": faq.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                  }
                }))
              })
            }}
          />
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: 'Blog', href: '/blog' },
            { label: post.title }
          ]} />

          {/* Article Header */}
          <div className="mb-8">
            <div className="aspect-video mb-6 rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center space-x-4 text-gray-400 text-sm mb-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4" />
                <span>{post.category}</span>
              </div>
              <span>{post.readTime}</span>
            </div>

            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          </div>

          {/* Article Content */}
          <div
            className="text-gray-300 blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.8'
            }}
          />

          {/* Call to Action */}
          <div className="mt-12 bg-gray-900 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Need Equipment for Your Project?</h3>
            <p className="text-gray-300 mb-6">
              Contact Benchmark Equipment today for professional equipment rental solutions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://rent.benchmarkequip.com/items"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Equipment
              </a>
              <a
                href="tel:8174034334"
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Call (817) 403-4334
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
