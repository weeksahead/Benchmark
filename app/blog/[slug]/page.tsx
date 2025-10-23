import { Metadata } from 'next'
import { getBlogPost, getAllBlogSlugs } from '@/data/blogPosts'
import { notFound } from 'next/navigation'
import BlogPostClient from './BlogPostClient'

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

  return <BlogPostClient post={post} />
}
