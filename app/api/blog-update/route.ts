import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      title,
      excerpt,
      content,
      category,
      image,
      read_time,
      slug
    } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 })
    }

    // Update the blog post in Supabase
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update({
        title,
        excerpt,
        content,
        category,
        image,
        read_time,
        slug
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    console.log('Blog post updated successfully:', title)

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully!',
      post: data
    })

  } catch (error: any) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({
      error: 'Failed to update blog post',
      details: error.message
    }, { status: 500 })
  }
}
