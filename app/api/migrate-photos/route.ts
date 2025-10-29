import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

export async function POST() {
  try {
    // Read the photos.json file
    const photosJsonPath = path.join(process.cwd(), 'config', 'photos.json')
    const photosData = JSON.parse(fs.readFileSync(photosJsonPath, 'utf-8'))

    const results = []

    for (const photo of photosData) {
      try {
        // Read the local image file
        const imagePath = path.join(process.cwd(), 'public', photo.src)

        if (!fs.existsSync(imagePath)) {
          results.push({
            id: photo.id,
            src: photo.src,
            status: 'skipped',
            reason: 'File not found'
          })
          continue
        }

        const imageBuffer = fs.readFileSync(imagePath)

        // Optimize image
        const optimizedBuffer = await sharp(imageBuffer)
          .resize(1200, 800, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({
            quality: 85,
            progressive: true
          })
          .toBuffer()

        // Generate filename from the original path
        const filename = path.basename(photo.src)
        const supabaseFilename = `gallery-${filename.replace(/\s+/g, '-')}`

        console.log(`Uploading ${supabaseFilename}...`)

        // Upload to Supabase Storage
        const { data, error } = await supabaseAdmin.storage
          .from('Blog-images')
          .upload(supabaseFilename, optimizedBuffer, {
            contentType: 'image/jpeg',
            upsert: true
          })

        if (error) {
          results.push({
            id: photo.id,
            src: photo.src,
            status: 'error',
            error: error.message
          })
          continue
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('Blog-images')
          .getPublicUrl(supabaseFilename)

        results.push({
          id: photo.id,
          originalSrc: photo.src,
          newSrc: publicUrl,
          status: 'success'
        })

      } catch (photoError: any) {
        results.push({
          id: photo.id,
          src: photo.src,
          status: 'error',
          error: photoError.message
        })
      }
    }

    // Count successes
    const successCount = results.filter(r => r.status === 'success').length

    return NextResponse.json({
      success: true,
      message: `Migrated ${successCount} of ${photosData.length} photos`,
      results
    })

  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({
      error: 'Failed to migrate photos',
      details: error.message
    }, { status: 500 })
  }
}
