import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    console.log('Downloading image from OpenAI...')

    // Download the image from OpenAI
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error('Failed to download image from OpenAI')
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const imageBlob = Buffer.from(imageBuffer)

    // Generate a unique filename
    const timestamp = Date.now()
    const filename = `ai-generated-${timestamp}.png`

    console.log('Uploading to Supabase:', filename)

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('AI generated photos')
      .upload(filename, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      throw uploadError
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin
      .storage
      .from('AI generated photos')
      .getPublicUrl(filename)

    const publicUrl = publicUrlData.publicUrl

    console.log('Image uploaded successfully:', publicUrl)

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      filename: filename
    })

  } catch (error: any) {
    console.error('Error saving image to Supabase:', error)
    return NextResponse.json({
      error: 'Failed to save image to Supabase',
      details: error.message
    }, { status: 500 })
  }
}
