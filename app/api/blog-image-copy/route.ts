import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL required' }, { status: 400 })
    }

    // If already in blog-posts folder, just return the same URL
    if (imageUrl.includes('/blog-posts/')) {
      return NextResponse.json({
        success: true,
        imageUrl,
        message: 'Image already in blog-posts folder'
      })
    }

    // If it's a local /assets/ path, can't copy - return as-is
    if (imageUrl.startsWith('/assets/')) {
      return NextResponse.json({
        success: true,
        imageUrl,
        message: 'Local asset - cannot copy'
      })
    }

    // Download the original image
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error('Failed to download original image')
    }

    const imageBuffer = await response.arrayBuffer()

    // Generate new filename
    const timestamp = Date.now()
    const newFilename = `blog-posts/blog-image-${timestamp}.jpg`

    // Upload to new location
    const { error: uploadError } = await supabaseAdmin.storage
      .from('Blog-images')
      .upload(newFilename, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error(`Failed to upload: ${uploadError.message}`)
    }

    // Get new public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('Blog-images')
      .getPublicUrl(newFilename)

    console.log(`Copied image to blog-posts folder: ${newFilename}`)

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      message: 'Image copied to blog-posts folder'
    })

  } catch (error: any) {
    console.error('Error copying image:', error)
    return NextResponse.json({
      error: 'Failed to copy image',
      details: error.message
    }, { status: 500 })
  }
}
