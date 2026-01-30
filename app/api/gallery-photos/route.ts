import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    // Fetch photos from database where show_on_photos is true
    const { data: photos, error } = await supabaseAdmin
      .from('gallery_photos')
      .select('id, url, alt_text, category')
      .eq('show_on_photos', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching photos:', error)
      throw error
    }

    // Transform to match expected format
    const formattedPhotos = photos.map((photo, index) => ({
      id: index + 1000,
      src: photo.url,
      alt: photo.alt_text || 'Equipment Photo',
      category: photo.category || 'Equipment'
    }))

    return NextResponse.json({ photos: formattedPhotos })

  } catch (error: any) {
    console.error('Error fetching gallery photos:', error)
    return NextResponse.json({
      error: 'Failed to fetch photos',
      details: error.message
    }, { status: 500 })
  }
}
