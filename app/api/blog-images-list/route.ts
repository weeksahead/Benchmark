import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    // Get bucket name from query params, default to 'Blog-images'
    const searchParams = request.nextUrl.searchParams
    const bucket = searchParams.get('bucket') || 'Blog-images'

    console.log(`Listing images from bucket: ${bucket}`)

    // List all files in the specified bucket
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
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
          .from(bucket)
          .getPublicUrl(file.name)
        return publicUrl
      })

    console.log(`Found ${imageUrls.length} images in ${bucket} bucket`)

    return NextResponse.json({
      success: true,
      images: imageUrls,
      bucket: bucket
    })

  } catch (error: any) {
    console.error('Error listing blog images:', error)
    return NextResponse.json({
      error: 'Failed to list images',
      details: error.message
    }, { status: 500 })
  }
}
