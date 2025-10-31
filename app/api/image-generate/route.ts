import { NextRequest, NextResponse } from 'next/server'

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

    console.log('Image generated successfully from OpenAI')

    // Return the OpenAI URL directly - don't upload to Supabase yet
    return NextResponse.json({
      success: true,
      imageUrl: imageUrl, // OpenAI temporary URL
      openaiUrl: imageUrl,
      message: 'Image generated. Review it and click "Save to Supabase" to store it.'
    })

  } catch (error: any) {
    console.error('Error generating image:', error)
    return NextResponse.json({
      error: 'Failed to generate image',
      details: error.message
    }, { status: 500 })
  }
}
