import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, ArrowRight, Tag } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getBlogPost, getAllBlogSlugs } from '@/data/blogPosts'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params
  const post = getBlogPost(params.slug)

  if (!post) {
    return {
      title: 'Blog Post Not Found'
    }
  }

  const postUrl = `https://benchmarkequip.com/blog/${post.slug}`
  const postImageUrl = `https://benchmarkequip.com${post.image}`

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      url: postUrl,
      title: post.title,
      description: post.excerpt,
      images: [postImageUrl],
      publishedTime: post.date,
      authors: [post.author],
      section: post.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [postImageUrl],
    },
    alternates: {
      canonical: postUrl,
    },
  }
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const post = getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const postUrl = `https://benchmarkequip.com/blog/${post.slug}`
  const postImageUrl = `https://benchmarkequip.com${post.image}`

  return (
    <>
      <Header />
      <section className="bg-black text-white min-h-screen py-20">
        {/* BlogPosting Schema */}
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
                "@type": "Person",
                "name": post.author
              },
              "publisher": {
                "@type": "Organization",
                "name": "Benchmark Equipment Rental & Sales",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://benchmarkequip.com/assets/Benchmark%20Logo%20(RGB%20Color%20Reverse).png"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": postUrl
              },
              "articleSection": post.category,
              "keywords": `construction equipment, heavy equipment, equipment rental, Cat equipment, ${post.category.toLowerCase()}`
            })
          }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/blog"
            className="mb-8 text-red-500 hover:text-red-400 transition-colors flex items-center space-x-2 inline-flex"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Back to Blog</span>
          </Link>

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
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="text-gray-300 leading-relaxed space-y-6">
              {post.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return null

                // Handle headings
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-white mt-10 mb-6 first:mt-0">
                      {paragraph.replace('## ', '')}
                    </h2>
                  )
                }

                // Handle regular paragraphs
                return (
                  <p key={index} className="text-gray-300 leading-relaxed mb-6 font-normal">
                    {paragraph}
                  </p>
                )
              })}
            </div>
          </div>

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
