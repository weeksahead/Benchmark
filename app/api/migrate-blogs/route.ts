import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getAllBlogPosts } from '@/data/blogPosts'

// One-time migration endpoint to copy blogs from file to Supabase
export async function POST() {
  try {
    // Get all existing blog posts from the file
    const filePosts = getAllBlogPosts()

    console.log(`Found ${filePosts.length} blog posts to migrate`)

    // Transform to match database schema
    const postsToInsert = filePosts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      date: post.date,
      category: post.category,
      image: post.image,
      read_time: post.readTime,
      slug: post.slug
    }))

    // Insert all posts into Supabase
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .upsert(postsToInsert, { onConflict: 'id' })
      .select()

    if (error) {
      throw error
    }

    console.log(`Successfully migrated ${data.length} blog posts to Supabase`)

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${data.length} blog posts to Supabase!`,
      posts: data
    })

  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({
      error: 'Failed to migrate blog posts',
      details: error.message
    }, { status: 500 })
  }
}
