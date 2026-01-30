import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogPostClient from './BlogPostClient'
import { supabase } from '@/lib/supabase'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  image: string
  read_time: string
  slug: string
  faqs?: string | null
  keywords?: string | null
}

// Revalidate blog posts every 60 seconds to show updates
export const revalidate = 60

export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug')

  return posts?.map((post) => ({ slug: post.slug })) || []
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!post) {
    return {
      title: 'Blog Post Not Found'
    }
  }

  const postUrl = `https://benchmarkequip.com/blog/${post.slug}`
  // Handle both relative paths and full URLs for images
  const postImageUrl = post.image.startsWith('http')
    ? post.image
    : `https://benchmarkequip.com${post.image}`

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

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!post) {
    notFound()
  }

  // Transform read_time to readTime for compatibility with BlogPostClient
  const postWithReadTime = {
    ...post,
    readTime: post.read_time
  }

  return <BlogPostClient post={postWithReadTime} />
}
