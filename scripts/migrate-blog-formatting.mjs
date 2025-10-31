/**
 * Migration Script: Convert Old Blog Posts from Markdown to HTML
 *
 * This script converts blog posts from September 16 and earlier
 * from markdown format to HTML format to match newer posts.
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env file FIRST
const envPath = resolve(process.cwd(), '.env')
const envFile = readFileSync(envPath, 'utf-8')
envFile.split('\n').forEach(line => {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) return

  const [key, ...valueParts] = trimmed.split('=')
  if (key && valueParts.length > 0) {
    const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
    process.env[key.trim()] = value
  }
})

// Now create Supabase client with loaded env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Convert markdown-style content to HTML
function convertMarkdownToHTML(content) {
  let html = content

  // Convert ## headings to <h2> tags
  html = html.replace(/## (.+?)(\n|$)/g, '<h2 style="font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; color: #ffffff;">$1</h2>\n')

  // Convert **bold** to <strong> tags
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Convert bullet points (- item) to <ul><li> tags
  // First, find all bullet point sections
  const bulletSections = html.match(/((?:^|\n)- .+?(?:\n|$))+/gm)
  if (bulletSections) {
    bulletSections.forEach(section => {
      const items = section.trim().split('\n').filter(line => line.trim().startsWith('-'))
      const listItems = items.map(item => {
        const text = item.replace(/^-\s*/, '').trim()
        return `  <li style="margin-bottom: 0.5rem;">${text}</li>`
      }).join('\n')
      const list = `<ul style="margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc;">\n${listItems}\n</ul>`
      html = html.replace(section, list + '\n')
    })
  }

  // Convert double newlines to paragraph breaks
  const paragraphs = html.split('\n\n').filter(p => p.trim())
  const htmlParagraphs = paragraphs.map(p => {
    p = p.trim()
    // Skip if already wrapped in HTML tags
    if (p.startsWith('<h2') || p.startsWith('<ul') || p.startsWith('<ol')) {
      return p
    }
    return `<p style="margin-bottom: 1rem;">${p}</p>`
  })

  return htmlParagraphs.join('\n\n')
}

async function migrateBlogPosts() {
  console.log('🔄 Starting blog post migration...\n')

  try {
    // Fetch all blog posts
    const { data: posts, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      throw error
    }

    if (!posts || posts.length === 0) {
      console.log('❌ No blog posts found')
      return
    }

    console.log(`📊 Found ${posts.length} total blog posts\n`)

    // Show all post dates first
    console.log('All blog post dates:')
    posts.forEach(post => {
      console.log(`  - ${post.date}: ${post.title}`)
    })

    // Filter posts before October 29, 2025 (when HTML rendering started)
    const cutoffDate = new Date('2025-10-29')
    const oldPosts = posts.filter(post => new Date(post.date) < cutoffDate)

    console.log(`📅 Found ${oldPosts.length} posts before Oct 29 (HTML change):\n`)

    oldPosts.forEach(post => {
      console.log(`  - ${post.date}: ${post.title}`)
    })

    if (oldPosts.length === 0) {
      console.log('\n✅ No old posts to migrate!')
      return
    }

    console.log('\n🔍 Analyzing content...\n')

    // Check which posts need conversion (don't have HTML tags)
    const postsToConvert = oldPosts.filter(post => {
      const hasHTML = post.content.includes('<p') || post.content.includes('<h2')
      return !hasHTML
    })

    console.log(`🔧 ${postsToConvert.length} posts need conversion\n`)

    if (postsToConvert.length === 0) {
      console.log('✅ All old posts already have HTML formatting!')
      return
    }

    // Convert and update each post
    for (const post of postsToConvert) {
      console.log(`\n📝 Converting: ${post.title}`)
      console.log(`   Date: ${post.date}`)

      const originalLength = post.content.length
      const convertedContent = convertMarkdownToHTML(post.content)

      console.log(`   Original length: ${originalLength} chars`)
      console.log(`   Converted length: ${convertedContent.length} chars`)

      // Preview first 200 chars of converted content
      console.log(`   Preview: ${convertedContent.substring(0, 200)}...`)

      // Update in database
      const { error: updateError } = await supabaseAdmin
        .from('blog_posts')
        .update({ content: convertedContent })
        .eq('id', post.id)

      if (updateError) {
        console.log(`   ❌ Error updating post: ${updateError.message}`)
      } else {
        console.log(`   ✅ Updated successfully`)
      }
    }

    console.log('\n\n🎉 Migration complete!')
    console.log(`✅ Converted ${postsToConvert.length} blog posts to HTML format`)

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    throw error
  }
}

// Run the migration
migrateBlogPosts()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })
