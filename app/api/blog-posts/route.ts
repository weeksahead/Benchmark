import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      posts: posts || []
    })
  } catch (error: any) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({
      error: 'Failed to fetch blog posts',
      details: error.message
    }, { status: 500 })
  }
}
