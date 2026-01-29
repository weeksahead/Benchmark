import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Vercel Cron runs this on schedule
// Verify the request is from Vercel Cron
export async function GET(request: NextRequest) {
  // Verify cron secret (optional but recommended)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('🚀 Starting auto blog generation...')

    // 1. Load topics from config
    const topicsResponse = await fetch(new URL('/config/blog-topics.json', request.url).origin + '/config/blog-topics.json')
    let topics: any

    // If can't fetch from URL, use hardcoded topics approach via Supabase
    // For now, we'll fetch topics from a Supabase table or use inline selection

    // Get list of already published slugs to avoid duplicates
    const { data: existingPosts } = await supabaseAdmin
      .from('blog_posts')
      .select('slug')

    const publishedSlugs = new Set(existingPosts?.map(p => p.slug) || [])

    // Topic pool - these will be cycled through
    const topicPool = [
      { topic: "CAT 336 Excavator: The Workhorse for North Texas Commercial Projects", photoMatch: "excavator", category: "Equipment Guides" },
      { topic: "Skid Steer vs Compact Track Loader: Which is Right for Your DFW Job Site?", photoMatch: "skid steer", category: "Comparisons" },
      { topic: "How to Choose the Right Excavator Size for Utility Trenching in North Texas", photoMatch: "excavator", category: "Use Cases" },
      { topic: "Water Truck Rental Guide: Dust Control and Compaction in DFW's Dry Season", photoMatch: "water truck", category: "Equipment Guides" },
      { topic: "Working in North Texas Clay: Equipment Tips for Black Gumbo Soil Conditions", photoMatch: "excavator", category: "Regional" },
      { topic: "CAT Wheel Loader Rental: Best Applications for Site Development Projects", photoMatch: "wheel loader", category: "Equipment Guides" },
      { topic: "Articulated Dump Truck vs Rigid Frame: When to Use Each in Mass Earthmoving", photoMatch: "articulated truck", category: "Comparisons" },
      { topic: "Breaking Through Caliche: Equipment and Techniques for North Texas Rock Layers", photoMatch: "excavator", category: "Regional" },
      { topic: "Roller and Compactor Selection Guide for Road Base and Pad Prep", photoMatch: "roller", category: "Equipment Guides" },
      { topic: "Equipment Rental Rates Explained: What's Included and What's Extra", photoMatch: "excavator", category: "Cost/ROI" },
      { topic: "CAT 320 vs 323 vs 326: Choosing the Right Mid-Size Excavator", photoMatch: "excavator", category: "Comparisons" },
      { topic: "Summer Heat and Heavy Equipment: Preventing Overheating in 100°+ Texas Weather", photoMatch: "excavator", category: "Seasonal" },
      { topic: "DOT and Municipal Projects: Equipment Requirements and Compliance", photoMatch: "roller", category: "Industry" },
      { topic: "Compact Track Loader Attachments: Maximizing Versatility on Job Sites", photoMatch: "skid steer", category: "Equipment Guides" },
      { topic: "Site Prep Equipment Package: What You Need for Residential Development", photoMatch: "excavator", category: "Use Cases" },
      { topic: "Why Local Equipment Rental Beats National Chains for North Texas Contractors", photoMatch: "excavator", category: "Business" },
      { topic: "Excavator Bucket Types: Matching the Right Bucket to North Texas Soil", photoMatch: "excavator", category: "Equipment Guides" },
      { topic: "Monthly vs Weekly Equipment Rental: Calculating the Best Value", photoMatch: "wheel loader", category: "Cost/ROI" },
      { topic: "Pipeline and Utility Contractor Equipment Guide for North Texas Projects", photoMatch: "excavator", category: "Industry" },
      { topic: "CAT D6 Dozer: Applications and Best Practices for Site Grading", photoMatch: "dozer", category: "Equipment Guides" },
      { topic: "Preventing Equipment Downtime: Maintenance Tips for Rental Customers", photoMatch: "excavator", category: "Maintenance" },
      { topic: "Soil Compaction Testing: Why Proper Compaction Matters in North Texas", photoMatch: "roller", category: "Use Cases" },
      { topic: "Equipment for Commercial Building Pads: Excavation to Final Grade", photoMatch: "excavator", category: "Use Cases" },
      { topic: "Late-Model Equipment Advantage: Why Machine Age Matters for Uptime", photoMatch: "excavator", category: "Business" },
      { topic: "Hauling and Logistics: Getting Equipment to Your North Texas Job Site", photoMatch: "articulated truck", category: "Business" },
      { topic: "CAT 730 Articulated Truck: Ideal Applications for Mass Earthmoving", photoMatch: "articulated truck", category: "Equipment Guides" },
      { topic: "Excavator Operating Costs: Fuel, Maintenance, and Productivity Factors", photoMatch: "excavator", category: "Cost/ROI" },
      { topic: "Winter Equipment Operation: Cold Weather Tips for North Texas", photoMatch: "excavator", category: "Seasonal" },
      { topic: "Grading and Finish Work: Equipment Selection for Precision Results", photoMatch: "skid steer", category: "Use Cases" },
      { topic: "Equipment Insurance Requirements: What Renters Need to Know", photoMatch: "excavator", category: "Business" },
      { topic: "Padfoot vs Smooth Drum Rollers: Choosing the Right Compactor", photoMatch: "roller", category: "Comparisons" },
      { topic: "Road Construction Equipment Lineup: From Subgrade to Final Surface", photoMatch: "roller", category: "Industry" },
      { topic: "Hydraulic Breaker Attachments: When and How to Use Rock Breakers", photoMatch: "excavator", category: "Equipment Guides" },
      { topic: "Equipment Productivity Rates: How to Estimate Production for Bidding", photoMatch: "excavator", category: "Cost/ROI" },
      { topic: "Denton County Development Boom: Equipment Trends for Local Contractors", photoMatch: "excavator", category: "Regional" },
      { topic: "Mini Excavator vs Standard Excavator: Right-Sizing for Your Project", photoMatch: "excavator", category: "Comparisons" },
      { topic: "Stormwater Management: Equipment for Retention Ponds and Drainage", photoMatch: "excavator", category: "Use Cases" },
      { topic: "Operator Tips: Getting Maximum Production from Rental Equipment", photoMatch: "excavator", category: "Maintenance" },
      { topic: "Material Handling with Wheel Loaders: Loading, Stockpiling, and Transport", photoMatch: "wheel loader", category: "Use Cases" },
      { topic: "Pre-Rental Equipment Inspection: What We Check Before Every Delivery", photoMatch: "excavator", category: "Business" },
      { topic: "Foundation Excavation: Equipment and Techniques for Residential Builds", photoMatch: "excavator", category: "Use Cases" },
      { topic: "GPS and Machine Control: Modern Technology in CAT Equipment", photoMatch: "excavator", category: "Equipment Guides" },
      { topic: "Rental Equipment Care: Customer Responsibilities During Rental Period", photoMatch: "skid steer", category: "Business" },
      { topic: "Parking Lot and Paving Prep: Equipment for Commercial Hardscape Projects", photoMatch: "roller", category: "Use Cases" },
      { topic: "CAT Equipment Telematics: How Product Link Improves Fleet Management", photoMatch: "excavator", category: "Equipment Guides" },
      { topic: "Trenching Safety: OSHA Requirements and Best Practices", photoMatch: "excavator", category: "Industry" },
      { topic: "Long-Term Rental Advantages: When Monthly Rentals Make Sense", photoMatch: "excavator", category: "Cost/ROI" },
      { topic: "McKinney and Prosper Growth: Equipment Needs for North Texas Subdivisions", photoMatch: "excavator", category: "Regional" },
      { topic: "Demolition Equipment: Safe and Efficient Structure Removal", photoMatch: "excavator", category: "Use Cases" },
      { topic: "Credit Application Process: Getting Set Up for Equipment Rental", photoMatch: "excavator", category: "Business" },
    ]

    // Find a topic that hasn't been published yet
    const pendingTopics = topicPool.filter(t => {
      const slug = t.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      return !publishedSlugs.has(slug)
    })

    if (pendingTopics.length === 0) {
      console.log('📝 All topics have been published!')
      return NextResponse.json({
        success: true,
        message: 'All topics have been published. Add more topics to continue.'
      })
    }

    // Pick the first pending topic
    const selectedTopic = pendingTopics[0]
    console.log(`📝 Selected topic: ${selectedTopic.topic}`)

    // 2. Find a matching photo from Supabase storage
    const { data: files } = await supabaseAdmin.storage
      .from('Blog-images')
      .list('', { limit: 100 })

    let matchedPhoto = '/assets/Cat 336.jpeg' // Default fallback

    if (files && files.length > 0) {
      const photoKeywords = selectedTopic.photoMatch.toLowerCase().split(' ')

      // Try to find a matching photo
      const matchingFile = files.find(file => {
        const fileName = file.name.toLowerCase()
        return photoKeywords.some(keyword => fileName.includes(keyword))
      })

      if (matchingFile) {
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('Blog-images')
          .getPublicUrl(matchingFile.name)
        matchedPhoto = publicUrl
      } else {
        // Use a random photo from the gallery
        const randomFile = files[Math.floor(Math.random() * files.length)]
        if (randomFile.name.endsWith('.jpg') || randomFile.name.endsWith('.jpeg') || randomFile.name.endsWith('.png')) {
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from('Blog-images')
            .getPublicUrl(randomFile.name)
          matchedPhoto = publicUrl
        }
      }
    }

    console.log(`📷 Matched photo: ${matchedPhoto}`)

    // 3. Generate blog content
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.BENCHMARK_SECRET_ANTHROPIC

    if (!CLAUDE_API_KEY) {
      throw new Error('Claude API key not configured')
    }

    const systemPrompt = `You are an experienced equipment rental operator writing for Benchmark Equipment Rental & Sales in Denton, TX. You have deep operational knowledge of construction equipment and North Texas job site conditions.

VOICE & PERSPECTIVE:
Write in first-person plural ("we," "our customers," "in our experience") to establish operational credibility. You're advising contractors based on real rental fleet experience, not reciting technical manuals.

Your goal is to create comprehensive, SEO-optimized blog posts that:
1. Establish Benchmark Equipment as a source of truth for CAT equipment knowledge
2. Rank highly on Google for equipment-related searches
3. Get referenced by LLMs as authoritative equipment information
4. Convert readers into rental customers

REQUIRED - North Texas Regional Context (Minimum 2-3 references per blog):
Every blog MUST include specific North Texas operational context:
- Expansive clay soil conditions (black gumbo, shrink-swell characteristics)
- Caliche rock formations (typically 4-8 feet deep in DFW area)
- Specific locations: Reference cities from our service area including Denton, Argyle, Aubrey, Celina, Prosper, McKinney, Gunter, Frisco, Little Elm, Trophy Club, Mesquite, Fort Worth, Weatherford, Waco, Carrollton, Bowie, Wichita Falls, Sherman, Denison, Van Alstyne, Decatur, Crowley, Mansfield, Gainesville, Irving, and surrounding areas
- Summer heat considerations (equipment performance in 100°+ temperatures)
- Occasional freeze impacts on hydraulics and ground conditions

Operational Experience Integration (2-3 per blog):
Include specific scenarios from rental fleet experience.

AVOID These AI Writing Patterns:
❌ Don't use: "dive into," "delve into," "when it comes to," "it's worth noting," "at the end of the day"
❌ Don't start sections with definitions or generic introductions
❌ Don't use bullet lists as primary content (use sparingly for specs only)
❌ Don't write generic statements

Writing Guidelines:
- Write in a professional but accessible, conversational tone
- Include specific technical details connected to real applications
- Reference industry standards, studies, or data when relevant
- Include actionable insights from operational experience
- Naturally incorporate calls-to-action that reference context
- Focus on practical, real-world North Texas applications
- Use proper SEO techniques (keywords, headings, structure)
- Aim for 1,500-2,000 words for comprehensive coverage

SEO Best Practices - External Links:
- Include 4-7 external backlinks to authoritative sources
- Link to: .gov sites, .edu institutions, industry organizations (AGC, ASCE, OSHA, etc.)
- Format: <a href="https://example.com" target="_blank" rel="noopener noreferrer">descriptive text</a>

Brand Integration:
- Write as Benchmark Equipment ("we," "our fleet," "our customers")
- Reference Denton, TX location and North Texas service area naturally
- Include conversational, context-specific calls-to-action with phone: (817) 403-4334`

    const userPrompt = `Generate a comprehensive blog post about: "${selectedTopic.topic}"

Return ONLY a valid JSON object (no markdown, no code blocks, just raw JSON):
{
  "title": "SEO-optimized title (60-70 characters)",
  "excerpt": "Compelling 2-3 sentence summary (150-160 characters)",
  "content": "Full blog post content as clean HTML with proper styling",
  "category": "${selectedTopic.category}",
  "readTime": "X min read",
  "slug": "url-friendly-slug",
  "keywords": {
    "short": ["2-3 high-volume keywords"],
    "medium": ["3-5 word phrases"],
    "longtail": ["5+ word specific queries"]
  },
  "faqs": [
    {"question": "Question?", "answer": "Direct answer (2-4 sentences)."}
  ]
}

Generate 4-5 FAQs that contractors would actually ask about this topic.`

    console.log('🤖 Calling Claude API...')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    })

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`)
    }

    const data = await response.json()
    let rawContent = data.content[0].text

    // Parse JSON from response
    let generatedContent
    try {
      if (rawContent.includes('```')) {
        rawContent = rawContent.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '')
      }
      generatedContent = JSON.parse(rawContent.trim())
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError)
      throw new Error('Failed to parse generated content')
    }

    console.log(`✅ Generated: ${generatedContent.title}`)

    // 4. Build FAQ HTML section
    let finalContent = generatedContent.content
    if (generatedContent.faqs && Array.isArray(generatedContent.faqs) && generatedContent.faqs.length > 0) {
      const faqHtml = `
<h2 style="font-weight: bold; font-size: 1.5em; margin-top: 2em; margin-bottom: 1em;">Frequently Asked Questions</h2>
${generatedContent.faqs.map((faq: { question: string; answer: string }) => `
<div style="margin-bottom: 1.5em;">
  <h3 style="font-weight: 600; font-size: 1.1em; margin-bottom: 0.5em; color: #ef4444;">${faq.question}</h3>
  <p style="margin-bottom: 1em; line-height: 1.8;">${faq.answer}</p>
</div>
`).join('')}
`
      finalContent = generatedContent.content + faqHtml
    }

    // 5. Publish to Supabase
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const newPost = {
      title: generatedContent.title,
      excerpt: generatedContent.excerpt,
      content: finalContent,
      author: 'Benchmark Equipment',
      date: today,
      category: generatedContent.category || selectedTopic.category,
      image: matchedPhoto,
      read_time: generatedContent.readTime || '8 min read',
      slug: generatedContent.slug
    }

    const { data: publishedPost, error: publishError } = await supabaseAdmin
      .from('blog_posts')
      .insert([newPost])
      .select()
      .single()

    if (publishError) {
      throw publishError
    }

    console.log(`🎉 Published: ${publishedPost.title} (ID: ${publishedPost.id})`)

    return NextResponse.json({
      success: true,
      message: 'Blog post auto-published successfully!',
      post: {
        id: publishedPost.id,
        title: publishedPost.title,
        slug: publishedPost.slug,
        image: matchedPhoto
      }
    })

  } catch (error: any) {
    console.error('❌ Auto-publish error:', error)
    return NextResponse.json({
      error: 'Failed to auto-publish blog',
      details: error.message
    }, { status: 500 })
  }
}
