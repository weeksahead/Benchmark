// Run with: node scripts/sync-gallery.js
const SUPABASE_URL = 'https://xaxwhqpbwondvvmykfed.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheHdocXBid29uZHZ2bXlrZmVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc0OTAwNiwiZXhwIjoyMDc3MzI1MDA2fQ.hETpbeTFsGhBQRj7Yjtn3EyTkjXFGHgaVG-AOlZppR4';

async function syncPhotos() {
  // Get files from storage
  const listResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/list/Blog-images`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prefix: '', limit: 200 })
  });

  const files = await listResponse.json();
  console.log(`Found ${files.length} files in storage`);

  // Filter to only image files that start with 'gallery-'
  const galleryFiles = files.filter(f =>
    f.name.startsWith('gallery-') &&
    (f.name.endsWith('.jpg') || f.name.endsWith('.jpeg') || f.name.endsWith('.png') || f.name.endsWith('.webp'))
  );

  console.log(`Found ${galleryFiles.length} gallery images to sync`);

  // Build photo records
  const photos = galleryFiles.map(file => {
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/Blog-images/${file.name}`;

    // Extract category from filename
    let category = 'Equipment';
    const nameLower = file.name.toLowerCase();
    if (nameLower.includes('excavator') || nameLower.includes('336') || nameLower.includes('320') || nameLower.includes('313')) {
      category = 'Excavators';
    } else if (nameLower.includes('water') || nameLower.includes('truck')) {
      category = 'Water Trucks';
    } else if (nameLower.includes('wheel') || nameLower.includes('loader') || nameLower.includes('938') || nameLower.includes('950')) {
      category = 'Wheel Loaders';
    } else if (nameLower.includes('skid') || nameLower.includes('steer')) {
      category = 'Skid Steers';
    } else if (nameLower.includes('roller') || nameLower.includes('dynapac')) {
      category = 'Rollers';
    } else if (nameLower.includes('dozer') || nameLower.includes('d6') || nameLower.includes('d8') || nameLower.includes('850')) {
      category = 'Dozers';
    } else if (nameLower.includes('dump') || nameLower.includes('730') || nameLower.includes('articulated')) {
      category = 'Articulated Trucks';
    }

    // Generate alt text from filename
    const alt = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/^gallery-/, '')
      .replace(/-\d+$/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    return {
      filename: file.name,
      url: publicUrl,
      alt_text: alt || 'Equipment Photo',
      category,
      show_on_photos: true,  // Default to visible on photos page
      show_on_hero: false
    };
  });

  if (photos.length === 0) {
    console.log('No gallery photos to sync');
    return;
  }

  // Insert into database
  const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/gallery_photos`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(photos)
  });

  if (!insertResponse.ok) {
    const error = await insertResponse.text();
    console.error('Insert failed:', error);
    return;
  }

  const inserted = await insertResponse.json();
  console.log(`Successfully synced ${inserted.length} photos to database`);
}

syncPhotos().catch(console.error);
