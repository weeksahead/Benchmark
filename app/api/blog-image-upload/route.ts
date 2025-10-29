import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const { image, filename } = await request.json()

    if (!image) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 })
    }

    // Extract base64 data
    const base64Data = image.split(',')[1]
    if (!base64Data) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
    }

    // Create blog images directory if it doesn't exist
    const blogImagesDir = path.join(process.cwd(), 'public', 'images', 'blog')
    try {
      await fs.access(blogImagesDir)
    } catch {
      await fs.mkdir(blogImagesDir, { recursive: true })
    }

    // Generate filename
    const timestamp = Date.now()
    const sanitizedFilename = (filename || 'blog-image').replace(/[^a-z0-9]/gi, '-').toLowerCase()
    const finalFilename = `${sanitizedFilename}-${timestamp}.jpg`
    const filepath = path.join(blogImagesDir, finalFilename)

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64')

    // Optimize image: resize to 1200x630 and compress to ~200KB
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 80,
        progressive: true
      })
      .toBuffer()

    // Save optimized image
    await fs.writeFile(filepath, optimizedBuffer)

    console.log(`Image optimized: Original size: ${(buffer.length / 1024 / 1024).toFixed(2)}MB, Optimized size: ${(optimizedBuffer.length / 1024).toFixed(0)}KB`)

    // Return the public path
    const publicPath = `/images/blog/${finalFilename}`

    console.log('Blog image uploaded successfully:', publicPath)

    return NextResponse.json({
      success: true,
      imagePath: publicPath
    })

  } catch (error: any) {
    console.error('Error uploading blog image:', error)
    return NextResponse.json({
      error: 'Failed to upload image',
      details: error.message
    }, { status: 500 })
  }
}
