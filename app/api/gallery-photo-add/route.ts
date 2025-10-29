import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const { image, alt, category } = await request.json()

    if (!image || !alt) {
      return NextResponse.json({ error: 'Image and alt text are required' }, { status: 400 })
    }

    // Extract base64 data
    const base64Data = image.split(',')[1]
    if (!base64Data) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
    }

    // Generate filename
    const timestamp = Date.now()
    const sanitizedAlt = alt.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    const filename = `gallery-${sanitizedAlt}-${timestamp}.jpg`

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64')

    // Optimize image with auto-rotation based on EXIF
    const optimizedBuffer = await sharp(buffer)
      .rotate() // Auto-rotate based on EXIF orientation
      .resize(1200, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        quality: 85,
        progressive: true
      })
      .toBuffer()

    console.log(`Image optimized: Original size: ${(buffer.length / 1024 / 1024).toFixed(2)}MB, Optimized size: ${(optimizedBuffer.length / 1024).toFixed(0)}KB`)

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('Blog-images')
      .upload(filename, optimizedBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      })

    if (error) {
      console.error('Supabase upload error:', error)
      throw new Error(`Failed to upload to Supabase: ${error.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('Blog-images')
      .getPublicUrl(filename)

    console.log('Gallery photo uploaded successfully:', publicUrl)

    return NextResponse.json({
      success: true,
      photo: {
        src: publicUrl,
        alt,
        category: category || 'Other'
      }
    })

  } catch (error: any) {
    console.error('Error uploading gallery photo:', error)
    return NextResponse.json({
      error: 'Failed to upload photo',
      details: error.message
    }, { status: 500 })
  }
}
