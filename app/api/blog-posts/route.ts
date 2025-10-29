import { NextResponse } from 'next/server'
import { getAllBlogPosts } from '@/data/blogPosts'

export async function GET() {
  try {
    const posts = getAllBlogPosts()

    // Sort by date (most recent first)
    const sortedPosts = posts.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    return NextResponse.json({
      success: true,
      posts: sortedPosts
    })
  } catch (error: any) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({
      error: 'Failed to fetch blog posts',
      details: error.message
    }, { status: 500 })
  }
}
