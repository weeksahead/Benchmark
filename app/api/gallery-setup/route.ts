import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST() {
  try {
    // Create the gallery_photos table if it doesn't exist
    const { error: createError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS gallery_photos (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          filename TEXT NOT NULL,
          url TEXT NOT NULL,
          alt_text TEXT,
          category TEXT DEFAULT 'Equipment',
          show_on_photos BOOLEAN DEFAULT false,
          show_on_hero BOOLEAN DEFAULT false,
          hero_title TEXT,
          hero_subtitle TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    // If RPC doesn't exist, the table might already exist or we need another approach
    // Let's try to select from it to check
    const { data: existingPhotos, error: selectError } = await supabaseAdmin
      .from('gallery_photos')
      .select('id')
      .limit(1)

    if (selectError && selectError.code === '42P01') {
      // Table doesn't exist - return instructions
      return NextResponse.json({
        success: false,
        message: 'Table does not exist. Please create it manually in Supabase SQL editor.',
        sql: `
CREATE TABLE gallery_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  category TEXT DEFAULT 'Equipment',
  show_on_photos BOOLEAN DEFAULT false,
  show_on_hero BOOLEAN DEFAULT false,
  hero_title TEXT,
  hero_subtitle TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access
CREATE POLICY "Authenticated access" ON gallery_photos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow anon users to read photos marked as visible
CREATE POLICY "Public read visible photos" ON gallery_photos
  FOR SELECT TO anon USING (show_on_photos = true OR show_on_hero = true);
        `
      }, { status: 400 })
    }

    // Table exists, now sync photos from storage
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from('Blog-images')
      .list('', {
        limit: 200,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (listError) {
      throw listError
    }

    // Filter to only image files
    const imageFiles = files.filter(file =>
      file.name.endsWith('.jpg') ||
      file.name.endsWith('.jpeg') ||
      file.name.endsWith('.png') ||
      file.name.endsWith('.webp')
    )

    // Check which files are already in the database
    const { data: existingRecords } = await supabaseAdmin
      .from('gallery_photos')
      .select('filename')

    const existingFilenames = new Set(existingRecords?.map(r => r.filename) || [])

    // Insert new photos
    const newPhotos = imageFiles
      .filter(file => !existingFilenames.has(file.name))
      .map(file => {
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('Blog-images')
          .getPublicUrl(file.name)

        // Extract category from filename
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
          .replace(/\.[^/.]+$/, '')
          .replace(/^gallery-/, '')
          .replace(/-\d+$/, '')
          .replace(/-/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase())

        return {
          filename: file.name,
          url: publicUrl,
          alt_text: alt || 'Equipment Photo',
          category,
          show_on_photos: true, // Default existing photos to visible
          show_on_hero: false
        }
      })

    if (newPhotos.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from('gallery_photos')
        .insert(newPhotos)

      if (insertError) {
        throw insertError
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${newPhotos.length} new photos. ${existingFilenames.size} already existed.`,
      newCount: newPhotos.length,
      existingCount: existingFilenames.size
    })

  } catch (error: any) {
    console.error('Gallery setup error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
