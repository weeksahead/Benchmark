import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 })
    }

    // Delete the blog post from Supabase
    const { error } = await supabaseAdmin
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    console.log('Blog post deleted successfully:', id)

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully!'
    })

  } catch (error: any) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({
      error: 'Failed to delete blog post',
      details: error.message
    }, { status: 500 })
  }
}
