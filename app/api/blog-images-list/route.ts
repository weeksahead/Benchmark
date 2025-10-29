import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    // List all files in the Blog-images bucket
    const { data, error } = await supabaseAdmin.storage
      .from('Blog-images')
      .list()

    if (error) {
      console.error('Supabase list error:', error)
      throw new Error(`Failed to list images: ${error.message}`)
    }

    // Get public URLs for all images
    const imageUrls = data
      .filter(file => file.name !== '.emptyFolderPlaceholder') // Filter out placeholder files
      .map(file => {
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('Blog-images')
          .getPublicUrl(file.name)
        return publicUrl
      })

    console.log(`Found ${imageUrls.length} images in Blog-images bucket`)

    return NextResponse.json({
      success: true,
      images: imageUrls
    })

  } catch (error: any) {
    console.error('Error listing blog images:', error)
    return NextResponse.json({
      error: 'Failed to list images',
      details: error.message
    }, { status: 500 })
  }
}
