import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      readTime,
      slug,
      featuredImage
    } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Get current date
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Create new blog post object
    const newPost = {
      title: title,
      excerpt: excerpt || title,
      content: content,
      author: 'Benchmark Equipment',
      date: today,
      category: category || 'Equipment Guides',
      image: featuredImage || '/images/equipment/cat-excavator-default.jpg',
      read_time: readTime || '5 min read',
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }

    // Insert into Supabase
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert([newPost])
      .select()
      .single()

    if (error) {
      throw error
    }

    console.log('Blog post published successfully:', data.title, 'with ID:', data.id)

    return NextResponse.json({
      success: true,
      message: 'Blog post published successfully!',
      post: {
        id: data.id,
        title: data.title,
        slug: data.slug
      }
    })

  } catch (error: any) {
    console.error('Error publishing blog post:', error)
    return NextResponse.json({
      error: 'Failed to publish blog post',
      details: error.message
    }, { status: 500 })
  }
}
