import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    // List all files in the Blog-images bucket
    const { data: files, error } = await supabaseAdmin.storage
      .from('Blog-images')
      .list('', {
        limit: 200,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) {
      console.error('Error listing photos:', error)
      throw error
    }

    // Filter to only image files and build photo objects
    const photos = files
      .filter(file =>
        file.name.endsWith('.jpg') ||
        file.name.endsWith('.jpeg') ||
        file.name.endsWith('.png') ||
        file.name.endsWith('.webp')
      )
      .map((file, index) => {
        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('Blog-images')
          .getPublicUrl(file.name)

        // Try to extract category from filename or default to "Equipment"
        let category = 'Equipment'
        const nameLower = file.name.toLowerCase()
        if (nameLower.includes('excavator') || nameLower.includes('336') || nameLower.includes('320')) {
          category = 'Excavators'
        } else if (nameLower.includes('water') || nameLower.includes('truck')) {
          category = 'Water Trucks'
        } else if (nameLower.includes('wheel') || nameLower.includes('loader')) {
          category = 'Wheel Loaders'
        } else if (nameLower.includes('skid') || nameLower.includes('steer')) {
          category = 'Skid Steers'
        } else if (nameLower.includes('roller') || nameLower.includes('dynapac')) {
          category = 'Rollers'
        } else if (nameLower.includes('dozer') || nameLower.includes('d6') || nameLower.includes('d8')) {
          category = 'Dozers'
        } else if (nameLower.includes('dump') || nameLower.includes('730') || nameLower.includes('articulated')) {
          category = 'Articulated Trucks'
        }

        // Generate alt text from filename
        const alt = file.name
          .replace(/\.[^/.]+$/, '') // Remove extension
          .replace(/^gallery-/, '') // Remove gallery- prefix
          .replace(/-\d+$/, '') // Remove timestamp
          .replace(/-/g, ' ') // Replace dashes with spaces
          .replace(/\b\w/g, c => c.toUpperCase()) // Title case

        return {
          id: index + 1000, // Offset to avoid conflicts with static photos
          src: publicUrl,
          alt: alt || 'Equipment Photo',
          category
        }
      })

    return NextResponse.json({ photos })

  } catch (error: any) {
    console.error('Error fetching gallery photos:', error)
    return NextResponse.json({
      error: 'Failed to fetch photos',
      details: error.message
    }, { status: 500 })
  }
}
