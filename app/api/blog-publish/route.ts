import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      readTime,
      slug,
      featuredImage,
      faqs,
      keywords
    } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Get current date
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Build FAQ section HTML if FAQs provided
    let finalContent = content
    if (faqs && Array.isArray(faqs) && faqs.length > 0) {
      const faqHtml = `
<h2 style="font-weight: bold; font-size: 1.5em; margin-top: 2em; margin-bottom: 1em;">Frequently Asked Questions</h2>
${faqs.map((faq: { question: string; answer: string }) => `
<div style="margin-bottom: 1.5em;">
  <h3 style="font-weight: 600; font-size: 1.1em; margin-bottom: 0.5em; color: #ef4444;">${faq.question}</h3>
  <p style="margin-bottom: 1em; line-height: 1.8;">${faq.answer}</p>
</div>
`).join('')}
`
      finalContent = content + faqHtml
    }

    // Create new blog post object
    const newPost = {
      title: title,
      excerpt: excerpt || title,
      content: finalContent,
      author: 'Benchmark Equipment',
      date: today,
      category: category || 'Equipment Guides',
      image: featuredImage || '/images/equipment/cat-excavator-default.jpg',
      read_time: readTime || '5 min read',
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }

    // Insert into Supabase
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert([newPost])
      .select()
      .single()

    if (error) {
      throw error
    }

    console.log('Blog post published successfully:', data.title, 'with ID:', data.id)

    return NextResponse.json({
      success: true,
      message: 'Blog post published successfully!',
      post: {
        id: data.id,
        title: data.title,
        slug: data.slug
      }
    })

  } catch (error: any) {
    console.error('Error publishing blog post:', error)
    return NextResponse.json({
      error: 'Failed to publish blog post',
      details: error.message
    }, { status: 500 })
  }
}
