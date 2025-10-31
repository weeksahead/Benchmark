import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    console.log('Generating image with prompt:', prompt)

    // Call OpenAI DALL-E API to generate image
    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1792x1024', // Wide format, good for blog headers
        quality: 'standard'
      })
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json()
      console.error('OpenAI API error:', error)
      throw new Error('Failed to generate image with OpenAI')
    }

    const openaiData = await openaiResponse.json()
    const imageUrl = openaiData.data[0].url

    console.log('Image generated, downloading from OpenAI...')

    // Download the image from OpenAI
    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()
    const imageBlob = Buffer.from(imageBuffer)

    // Generate a unique filename
    const timestamp = Date.now()
    const filename = `ai-generated-${timestamp}.png`

    console.log('Uploading to Supabase:', filename)

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('Blog-images')
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
      .from('Blog-images')
      .getPublicUrl(filename)

    const publicUrl = publicUrlData.publicUrl

    console.log('Image uploaded successfully:', publicUrl)

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      filename: filename
    })

  } catch (error: any) {
    console.error('Error generating image:', error)
    return NextResponse.json({
      error: 'Failed to generate image',
      details: error.message
    }, { status: 500 })
  }
}
