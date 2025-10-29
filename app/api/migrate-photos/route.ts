import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

export async function POST() {
  console.log('🚀 MIGRATION API CALLED - Starting photo migration...')
  try {
    // Read the photos.json file
    const photosJsonPath = path.join(process.cwd(), 'config', 'photos.json')
    console.log('📂 Reading photos from:', photosJsonPath)
    const photosData = JSON.parse(fs.readFileSync(photosJsonPath, 'utf-8'))
    console.log(`📸 Found ${photosData.length} photos to migrate:`, photosData.map(p => p.src))

    const results = []

    for (const photo of photosData) {
      console.log(`\n🔄 Processing photo ${photo.id}: ${photo.src}`)
      try {
        // Read the local image file
        const imagePath = path.join(process.cwd(), 'public', photo.src)
        console.log(`   📁 Looking for file at: ${imagePath}`)

        if (!fs.existsSync(imagePath)) {
          console.log(`   ❌ File not found: ${imagePath}`)
          results.push({
            id: photo.id,
            src: photo.src,
            status: 'skipped',
            reason: 'File not found'
          })
          continue
        }

        console.log(`   ✅ File found, reading...`)
        const imageBuffer = fs.readFileSync(imagePath)
        console.log(`   📊 Original size: ${(imageBuffer.length / 1024 / 1024).toFixed(2)}MB`)

        // Optimize image with auto-rotation based on EXIF
        console.log(`   🔧 Optimizing image with Sharp...`)
        const optimizedBuffer = await sharp(imageBuffer)
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
        console.log(`   ✨ Optimized size: ${(optimizedBuffer.length / 1024).toFixed(0)}KB`)

        // Generate filename from the original path
        const filename = path.basename(photo.src)
        const supabaseFilename = `gallery-${filename.replace(/\s+/g, '-')}`

        console.log(`   ☁️  Uploading to Supabase as: ${supabaseFilename}`)

        // Upload to Supabase Storage
        const { data, error } = await supabaseAdmin.storage
          .from('Blog-images')
          .upload(supabaseFilename, optimizedBuffer, {
            contentType: 'image/jpeg',
            upsert: true
          })

        if (error) {
          console.log(`   ❌ Supabase upload error:`, error)
          results.push({
            id: photo.id,
            src: photo.src,
            status: 'error',
            error: error.message
          })
          continue
        }

        console.log(`   ✅ Upload successful! Data:`, data)

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('Blog-images')
          .getPublicUrl(supabaseFilename)

        console.log(`   🌐 Public URL: ${publicUrl}`)

        results.push({
          id: photo.id,
          originalSrc: photo.src,
          newSrc: publicUrl,
          status: 'success'
        })

      } catch (photoError: any) {
        console.log(`   ⚠️  Photo processing error:`, photoError)
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
    console.log(`\n✅ MIGRATION COMPLETE: ${successCount}/${photosData.length} photos migrated`)
    console.log('📋 Results:', results)

    return NextResponse.json({
      success: true,
      message: `Migrated ${successCount} of ${photosData.length} photos`,
      results
    })

  } catch (error: any) {
    console.error('❌ MIGRATION FATAL ERROR:', error)
    return NextResponse.json({
      error: 'Failed to migrate photos',
      details: error.message
    }, { status: 500 })
  }
}
