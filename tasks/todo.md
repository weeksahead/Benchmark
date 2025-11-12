# Fix 413 Payload Too Large Error on Blog Publish

## Problem
Getting a 413 (Payload Too Large) error when publishing blogs from ContentFactory with uploaded images. Base64 images in the JSON payload exceed Next.js's API route body limit.

## Solution
Upload base64 images to Supabase first, then publish the blog with the image URL instead of the base64 string.

## Todo Items

- [ ] Modify ContentFactory.tsx handlePublish function to upload base64 images before publishing
- [ ] Test publishing a blog with an uploaded image
- [ ] Test publishing a blog with an image from the picker (already a URL)

## Implementation Plan

### Changes to ContentFactory.tsx handlePublish

1. Before publishing, check if `featuredImage` is a base64 string (starts with "data:image")
2. If yes:
   - Update save message to show "Uploading image..."
   - Call `/api/blog-image-upload` with the base64 data
   - Extract the imagePath from the response
   - Use this URL when publishing the blog
3. If no (already a URL from picker), proceed normally
4. Publish blog with image URL

### Expected Flow
```
User clicks Publish →
  If image is base64: Upload to Supabase → Get URL →
  Publish blog with URL → Success
```
