import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET - Fetch all photos from database (for admin)
export async function GET() {
  try {
    const { data: photos, error } = await supabaseAdmin
      .from('gallery_photos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching photos:', error)
      throw error
    }

    return NextResponse.json({ photos })

  } catch (error: any) {
    console.error('Error fetching gallery photos:', error)
    return NextResponse.json({
      error: 'Failed to fetch photos',
      details: error.message
    }, { status: 500 })
  }
}

// PATCH - Update a photo's metadata/visibility
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Photo ID required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('gallery_photos')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating photo:', error)
      throw error
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Error updating photo:', error)
    return NextResponse.json({
      error: 'Failed to update photo',
      details: error.message
    }, { status: 500 })
  }
}

// DELETE - Remove photo from storage and database
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id, filename } = body

    console.log('Delete request received:', { id, filename })

    if (!id || !filename) {
      console.error('Missing id or filename:', { id, filename })
      return NextResponse.json({ error: 'Photo ID and filename required' }, { status: 400 })
    }

    // Delete from storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('Blog-images')
      .remove([filename])

    if (storageError) {
      console.error('Error deleting from storage:', storageError)
      // Continue anyway - file might not exist in storage
    } else {
      console.log('Deleted from storage:', filename)
    }

    // Delete from database
    const { data: deletedData, error: dbError } = await supabaseAdmin
      .from('gallery_photos')
      .delete()
      .eq('id', id)
      .select()

    if (dbError) {
      console.error('Error deleting from database:', dbError)
      throw dbError
    }

    console.log('Deleted from database:', deletedData)

    return NextResponse.json({ success: true, deleted: deletedData })

  } catch (error: any) {
    console.error('Error deleting photo:', error)
    return NextResponse.json({
      error: 'Failed to delete photo',
      details: error.message
    }, { status: 500 })
  }
}
