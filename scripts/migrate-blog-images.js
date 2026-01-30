// Run with: node scripts/migrate-blog-images.js
const SUPABASE_URL = 'https://xaxwhqpbwondvvmykfed.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheHdocXBid29uZHZ2bXlrZmVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc0OTAwNiwiZXhwIjoyMDc3MzI1MDA2fQ.hETpbeTFsGhBQRj7Yjtn3EyTkjXFGHgaVG-AOlZppR4';

async function migrateBlogImages() {
  console.log('Fetching blog posts...');

  // Get all blog posts
  const postsResponse = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=id,slug,image`, {
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
    }
  });

  const posts = await postsResponse.json();
  console.log(`Found ${posts.length} blog posts`);

  for (const post of posts) {
    if (!post.image) {
      console.log(`Skipping ${post.slug} - no image`);
      continue;
    }

    // Skip if already in blog-posts folder
    if (post.image.includes('/blog-posts/')) {
      console.log(`Skipping ${post.slug} - already migrated`);
      continue;
    }

    // Skip local /assets/ paths for now - they need manual handling
    if (post.image.startsWith('/assets/')) {
      console.log(`Skipping ${post.slug} - local asset path: ${post.image}`);
      continue;
    }

    // Extract filename from URL
    const urlParts = post.image.split('/');
    const originalFilename = urlParts[urlParts.length - 1];
    const newFilename = `blog-posts/${post.slug}-${Date.now()}.jpg`;

    console.log(`Migrating ${post.slug}...`);
    console.log(`  From: ${originalFilename}`);
    console.log(`  To: ${newFilename}`);

    try {
      // Download the original image
      const imageResponse = await fetch(post.image);
      if (!imageResponse.ok) {
        console.log(`  ERROR: Could not download image`);
        continue;
      }

      const imageBuffer = await imageResponse.arrayBuffer();

      // Upload to new location
      const uploadResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/Blog-images/${newFilename}`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'image/jpeg'
        },
        body: imageBuffer
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.text();
        console.log(`  ERROR uploading: ${error}`);
        continue;
      }

      // Get new public URL
      const newUrl = `${SUPABASE_URL}/storage/v1/object/public/Blog-images/${newFilename}`;

      // Update blog post with new URL
      const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${post.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ image: newUrl })
      });

      if (!updateResponse.ok) {
        console.log(`  ERROR updating blog post`);
        continue;
      }

      console.log(`  SUCCESS: Migrated to ${newFilename}`);

    } catch (error) {
      console.log(`  ERROR: ${error.message}`);
    }
  }

  console.log('\nMigration complete!');
  console.log('Note: Blog posts with /assets/ paths need manual migration or the images uploaded to Supabase.');
}

migrateBlogImages().catch(console.error);
