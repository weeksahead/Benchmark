import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Allow up to 60 seconds for Claude API generation
export const maxDuration = 60

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

    // Get list of already published slugs and titles to avoid duplicates
    const { data: existingPosts } = await supabaseAdmin
      .from('blog_posts')
      .select('slug, title')

    const publishedSlugs = new Set(existingPosts?.map(p => p.slug) || [])
    const publishedTitles = new Set(existingPosts?.map(p => p.title.toLowerCase()) || [])

    // Topic pool - 100 topics interleaved by category for variety
    const topicPool = [
      // Week 1
      { topic: "CAT Wheel Loader Rental: Best Applications for Site Development Projects", photoMatch: "wheel loader", category: "Equipment Guides" },
      { topic: "Articulated Dump Truck vs Rigid Frame: When to Use Each in Mass Earthmoving", photoMatch: "articulated truck", category: "Comparisons" },
      // Week 2
      { topic: "How to Choose the Right Excavator Size for Utility Trenching in North Texas", photoMatch: "excavator", category: "Use Cases" },
      { topic: "Working in North Texas Clay: Equipment Tips for Black Gumbo Soil Conditions", photoMatch: "excavator", category: "Regional" },
      // Week 3
      { topic: "Equipment Rental Rates Explained: What's Included and What's Extra", photoMatch: "excavator", category: "Cost/ROI" },
      { topic: "Why Local Equipment Rental Beats National Chains for North Texas Contractors", photoMatch: "excavator", category: "Business" },
      // Week 4
      { topic: "Summer Heat and Heavy Equipment: Preventing Overheating in 100°+ Texas Weather", photoMatch: "excavator", category: "Seasonal" },
      { topic: "DOT and Municipal Projects: Equipment Requirements and Compliance", photoMatch: "roller", category: "Industry" },
      // Week 5
      { topic: "Roller and Compactor Selection Guide for Road Base and Pad Prep", photoMatch: "roller", category: "Equipment Guides" },
      { topic: "CAT 320 vs 323 vs 326: Choosing the Right Mid-Size Excavator", photoMatch: "excavator", category: "Comparisons" },
      // Week 6
      { topic: "Site Prep Equipment Package: What You Need for Residential Development", photoMatch: "excavator", category: "Use Cases" },
      { topic: "Breaking Through Caliche: Equipment and Techniques for North Texas Rock Layers", photoMatch: "excavator", category: "Regional" },
      // Week 7
      { topic: "Monthly vs Weekly Equipment Rental: Calculating the Best Value", photoMatch: "wheel loader", category: "Cost/ROI" },
      { topic: "Preventing Equipment Downtime: Maintenance Tips for Rental Customers", photoMatch: "excavator", category: "Maintenance" },
      // Week 8
      { topic: "Compact Track Loader Attachments: Maximizing Versatility on Job Sites", photoMatch: "skid steer", category: "Equipment Guides" },
      { topic: "Padfoot vs Smooth Drum Rollers: Choosing the Right Compactor", photoMatch: "roller", category: "Comparisons" },
      // Week 9
      { topic: "Soil Compaction Testing: Why Proper Compaction Matters in North Texas", photoMatch: "roller", category: "Use Cases" },
      { topic: "Late-Model Equipment Advantage: Why Machine Age Matters for Uptime", photoMatch: "excavator", category: "Business" },
      // Week 10
      { topic: "Pipeline and Utility Contractor Equipment Guide for North Texas Projects", photoMatch: "excavator", category: "Industry" },
      { topic: "Denton County Development Boom: Equipment Trends for Local Contractors", photoMatch: "excavator", category: "Regional" },
      // Week 11
      { topic: "Excavator Bucket Types: Matching the Right Bucket to North Texas Soil", photoMatch: "excavator", category: "Equipment Guides" },
      { topic: "Mini Excavator vs Standard Excavator: Right-Sizing for Your Project", photoMatch: "excavator", category: "Comparisons" },
      // Week 12
      { topic: "Equipment for Commercial Building Pads: Excavation to Final Grade", photoMatch: "excavator", category: "Use Cases" },
      { topic: "Excavator Operating Costs: Fuel, Maintenance, and Productivity Factors", photoMatch: "excavator", category: "Cost/ROI" },
      // Week 13
      { topic: "Hauling and Logistics: Getting Equipment to Your North Texas Job Site", photoMatch: "articulated truck", category: "Business" },
      { topic: "Winter Equipment Operation: Cold Weather Tips for North Texas", photoMatch: "excavator", category: "Seasonal" },
      // Week 14
      { topic: "CAT D6 Dozer: Applications and Best Practices for Site Grading", photoMatch: "dozer", category: "Equipment Guides" },
      { topic: "Renting vs Buying Heavy Equipment: The Complete Financial Breakdown", photoMatch: "excavator", category: "Comparisons" },
      // Week 15
      { topic: "Grading and Finish Work: Equipment Selection for Precision Results", photoMatch: "skid steer", category: "Use Cases" },
      { topic: "McKinney and Prosper Growth: Equipment Needs for North Texas Subdivisions", photoMatch: "excavator", category: "Regional" },
      // Week 16
      { topic: "Equipment Insurance Requirements: What Renters Need to Know", photoMatch: "excavator", category: "Business" },
      { topic: "Road Construction Equipment Lineup: From Subgrade to Final Surface", photoMatch: "roller", category: "Industry" },
      // Week 17
      { topic: "CAT 730 Articulated Truck: Ideal Applications for Mass Earthmoving", photoMatch: "articulated truck", category: "Equipment Guides" },
      { topic: "CAT 308 vs 310 Mini Excavator: Which Compact Machine Wins?", photoMatch: "excavator", category: "Comparisons" },
      // Week 18
      { topic: "Stormwater Management: Equipment for Retention Ponds and Drainage", photoMatch: "excavator", category: "Use Cases" },
      { topic: "Equipment Productivity Rates: How to Estimate Production for Bidding", photoMatch: "excavator", category: "Cost/ROI" },
      // Week 19
      { topic: "Operator Tips: Getting Maximum Production from Rental Equipment", photoMatch: "excavator", category: "Maintenance" },
      { topic: "Celina and Gunter Expansion: Construction Equipment Demand in Fast-Growing Cities", photoMatch: "excavator", category: "Regional" },
      // Week 20
      { topic: "Hydraulic Breaker Attachments: When and How to Use Rock Breakers", photoMatch: "excavator", category: "Equipment Guides" },
      { topic: "Dozer vs Scraper for Mass Grading: Cost and Productivity Comparison", photoMatch: "dozer", category: "Comparisons" },
      // Week 21
      { topic: "Material Handling with Wheel Loaders: Loading, Stockpiling, and Transport", photoMatch: "wheel loader", category: "Use Cases" },
      { topic: "Pre-Rental Equipment Inspection: What We Check Before Every Delivery", photoMatch: "excavator", category: "Business" },
      // Week 22
      { topic: "Long-Term Rental Advantages: When Monthly Rentals Make Sense", photoMatch: "excavator", category: "Cost/ROI" },
      { topic: "Trenching Safety: OSHA Requirements and Best Practices", photoMatch: "excavator", category: "Industry" },
      // Week 23
      { topic: "GPS and Machine Control: Modern Technology in CAT Equipment", photoMatch: "excavator", category: "Equipment Guides" },
      { topic: "Rubber Tracks vs Steel Tracks: Choosing the Right Undercarriage", photoMatch: "excavator", category: "Comparisons" },
      // Week 24
      { topic: "Foundation Excavation: Equipment and Techniques for Residential Builds", photoMatch: "excavator", category: "Use Cases" },
      { topic: "North Texas Flood Plain Construction: Equipment for Challenging Drainage Projects", photoMatch: "excavator", category: "Regional" },
      // Week 25
      { topic: "Rental Equipment Care: Customer Responsibilities During Rental Period", photoMatch: "skid steer", category: "Business" },
      { topic: "Spring Rain and Mud Season: Equipment Tips for Wet North Texas Job Sites", photoMatch: "excavator", category: "Seasonal" },
      // Week 26
      { topic: "CAT Equipment Telematics: How Product Link Improves Fleet Management", photoMatch: "excavator", category: "Equipment Guides" },
      { topic: "Diesel vs Electric Equipment: Is Battery-Powered Construction Ready?", photoMatch: "excavator", category: "Comparisons" },
      // Week 27
      { topic: "Parking Lot and Paving Prep: Equipment for Commercial Hardscape Projects", photoMatch: "roller", category: "Use Cases" },
      { topic: "Hidden Costs of Owning Heavy Equipment: Insurance, Storage, and Depreciation", photoMatch: "excavator", category: "Cost/ROI" },
      // Week 28
      { topic: "Demolition Equipment: Safe and Efficient Structure Removal", photoMatch: "excavator", category: "Use Cases" },
      { topic: "Building in the DFW Metroplex: Why Equipment Availability Matters Most", photoMatch: "wheel loader", category: "Regional" },
      // Week 29
      { topic: "Credit Application Process: Getting Set Up for Equipment Rental", photoMatch: "excavator", category: "Business" },
      { topic: "SWPPP Compliance: Erosion Control Equipment for North Texas Construction Sites", photoMatch: "water truck", category: "Industry" },
      // Week 30
      { topic: "CAT 299 Compact Track Loader: The Ultimate Multi-Purpose Machine", photoMatch: "skid steer", category: "Equipment Guides" },
      { topic: "End Dump vs Belly Dump Trailers: Hauling Efficiency Comparison", photoMatch: "articulated truck", category: "Comparisons" },
      // Week 31
      { topic: "Land Clearing Equipment: Trees, Brush, and Vegetation Removal Methods", photoMatch: "skid steer", category: "Use Cases" },
      { topic: "How Equipment Rental Improves Cash Flow for Small Contractors", photoMatch: "skid steer", category: "Cost/ROI" },
      // Week 32
      { topic: "Starting a Dirt Work Business in North Texas: Equipment You Need First", photoMatch: "excavator", category: "Business" },
      { topic: "Frisco and Little Elm Growth: Commercial Equipment Needs in Booming Markets", photoMatch: "excavator", category: "Regional" },
      // Week 33
      { topic: "Understanding Excavator Swing Radius: Tight Access Job Site Solutions", photoMatch: "excavator", category: "Equipment Guides" },
      { topic: "CAT Tier 4 vs Tier 4 Final Engines: Emissions and Performance Differences", photoMatch: "excavator", category: "Comparisons" },
      // Week 34
      { topic: "Swimming Pool Excavation: Equipment and Techniques for Residential Pools", photoMatch: "excavator", category: "Use Cases" },
      { topic: "Construction Scheduling Around Texas Weather: Planning for Rain Delays", photoMatch: "skid steer", category: "Seasonal" },
      // Week 35
      { topic: "Daily Pre-Operation Equipment Inspection: A Contractor's Checklist", photoMatch: "excavator", category: "Maintenance" },
      { topic: "Highway 380 Corridor Development: Equipment for North Texas Infrastructure", photoMatch: "roller", category: "Regional" },
      // Week 36
      { topic: "CAT Motor Graders: Precision Road Building and Maintenance Applications", photoMatch: "excavator", category: "Equipment Guides" },
      { topic: "6-Ton vs 14-Ton Excavators: Matching Machine to Project Scale", photoMatch: "excavator", category: "Comparisons" },
      // Week 37
      { topic: "Sewer Line Installation: Equipment Selection for Municipal Utility Projects", photoMatch: "excavator", category: "Use Cases" },
      { topic: "Cost Per Yard: Calculating Earthmoving Costs for Accurate Project Bids", photoMatch: "excavator", category: "Cost/ROI" },
      // Week 38
      { topic: "How General Contractors Choose Equipment Rental Partners", photoMatch: "wheel loader", category: "Business" },
      { topic: "Weatherford to Sherman: Equipment Rental Coverage Across North Texas", photoMatch: "excavator", category: "Regional" },
      // Week 39
      { topic: "Telehandler vs Wheel Loader: Which Lift Machine Fits Your Project?", photoMatch: "wheel loader", category: "Equipment Guides" },
      { topic: "Tracked Carriers vs Dump Trucks: Moving Material on Soft Ground", photoMatch: "articulated truck", category: "Comparisons" },
      // Week 40
      { topic: "Horse Arena and Equestrian Facility Grading: Equipment for North Texas Ranches", photoMatch: "skid steer", category: "Use Cases" },
      { topic: "Fall Building Season: Why Autumn is Prime Time for North Texas Construction", photoMatch: "excavator", category: "Seasonal" },
      // Week 41
      { topic: "CAT 325 Excavator: The Mid-Size Sweet Spot for North Texas Contractors", photoMatch: "excavator", category: "Equipment Guides" },
      { topic: "Tax Benefits of Renting vs Buying Construction Equipment", photoMatch: "wheel loader", category: "Cost/ROI" },
      // Week 42
      { topic: "Equipment for Building Retaining Walls: Excavation and Backfill Guide", photoMatch: "excavator", category: "Use Cases" },
      { topic: "North Texas Wind and Dust: How Weather Conditions Affect Equipment Operation", photoMatch: "water truck", category: "Regional" },
      // Week 43
      { topic: "Emergency Equipment Rental: When Your Machine Goes Down Mid-Project", photoMatch: "excavator", category: "Business" },
      { topic: "Vibratory Plate Compactors vs Rollers: Small Area Compaction Guide", photoMatch: "roller", category: "Equipment Guides" },
      // Week 44
      { topic: "Backhoe vs Mini Excavator: Which Makes Sense for Small Projects?", photoMatch: "excavator", category: "Comparisons" },
      { topic: "Farm Pond Construction: Excavation Equipment for North Texas Properties", photoMatch: "excavator", category: "Use Cases" },
      // Week 45
      { topic: "Fuel Cost Calculator: Estimating Daily Equipment Operating Expenses", photoMatch: "excavator", category: "Cost/ROI" },
      { topic: "Lake Lewisville and Lake Ray Roberts: Shoreline Construction Equipment Challenges", photoMatch: "excavator", category: "Regional" },
      // Week 46
      { topic: "Track vs Wheel Excavators: Mobility and Application Differences", photoMatch: "excavator", category: "Equipment Guides" },
      { topic: "Wheel Loader vs Skid Steer for Material Loading: Productivity Analysis", photoMatch: "wheel loader", category: "Comparisons" },
      // Week 47
      { topic: "Driveway and Private Road Construction: Equipment for Rural Properties", photoMatch: "roller", category: "Use Cases" },
      { topic: "Water Truck Rental Guide: Dust Control and Compaction in DFW's Dry Season", photoMatch: "water truck", category: "Equipment Guides" },
      // Week 48
      { topic: "Church and School Construction: Equipment Needs for Community Buildings", photoMatch: "excavator", category: "Use Cases" },
      { topic: "Dozer Blade Types Explained: S-Blade, U-Blade, and SU-Blade Applications", photoMatch: "dozer", category: "Equipment Guides" },
      // Week 49
      { topic: "Cell Tower Site Prep: Access Road and Pad Equipment Requirements", photoMatch: "excavator", category: "Use Cases" },
      { topic: "CAT 259 vs 289 Compact Track Loader: Feature Comparison", photoMatch: "skid steer", category: "Comparisons" },
      // Week 50
      { topic: "Solar Farm Site Prep: Grading Equipment for Renewable Energy Projects", photoMatch: "dozer", category: "Use Cases" },
      { topic: "Excavator Quick Couplers: Faster Attachment Changes on the Job Site", photoMatch: "excavator", category: "Equipment Guides" },
      // Bonus (if needed)
      { topic: "Water Truck Operations Guide: Spray Systems, Fill Rates, and Coverage", photoMatch: "water truck", category: "Equipment Guides" },
    ]

    // Generate a deterministic slug from topic title
    const generateSlug = (topic: string) =>
      topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    // Find a topic that hasn't been published yet (check both slugs and title keywords)
    const pendingTopics = topicPool.filter(t => {
      const slug = generateSlug(t.topic)
      // Check exact slug match
      if (publishedSlugs.has(slug)) return false
      // Check if a similar title already exists (first 5 significant words overlap)
      const topicWords = t.topic.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w: string) => w.length > 3)
      for (const title of publishedTitles) {
        const titleWords = title.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w: string) => w.length > 3)
        const overlap = topicWords.filter((w: string) => titleWords.includes(w)).length
        if (overlap >= 5) return false
      }
      return true
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
3. Get referenced by AI answer engines (ChatGPT, Perplexity, Google AI Overview) as authoritative information
4. Convert readers into rental customers

GEO (Generative Engine Optimization) REQUIREMENTS:
These are critical for AI answer engine visibility:
- Start with a "Quick Answer" section (2-3 sentences) that directly answers the main question - this is what AI will extract
- Include a "Key Takeaways" section with 3-5 bullet points near the top after the intro
- Add 2-3 quotable statistics or facts with specific numbers that AI can cite (e.g., "CAT 336 excavators achieve 15-20% better fuel efficiency than previous models")
- Use H2 headings that match how people ask AI questions (e.g., "What size excavator do I need for utility trenching?" instead of "Excavator Sizing")
- Structure content so the most important answer appears in the FIRST sentence of each section
- Mention specific entities: CAT model numbers, industry standards (OSHA 1926, ASTM specs), certifications

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
  "quickAnswer": "2-3 sentence direct answer to the main topic question - this is what AI will extract and cite",
  "keyTakeaways": ["Takeaway 1 with specific detail", "Takeaway 2", "Takeaway 3", "Takeaway 4"],
  "content": "Full blog post content as clean HTML with proper styling. MUST include: Quick Answer box at top, Key Takeaways section after intro, H2s phrased as questions",
  "category": "${selectedTopic.category}",
  "readTime": "X min read",
  "slug": "url-friendly-slug",
  "keywords": {
    "short": ["2-3 high-volume keywords"],
    "medium": ["3-5 word phrases"],
    "longtail": ["5+ word specific queries that match how people ask AI"]
  },
  "faqs": [
    {"question": "Question phrased naturally as people would ask AI?", "answer": "Direct answer (2-4 sentences) with specific facts/numbers."}
  ]
}

CONTENT STRUCTURE REQUIREMENTS:
1. Start with a Quick Answer box: <div style="background: #1f2937; border-left: 4px solid #ef4444; padding: 1em; margin-bottom: 1.5em;"><strong>Quick Answer:</strong> [2-3 sentences]</div>
2. After intro paragraph, add Key Takeaways: <div style="background: #111827; padding: 1em; margin: 1.5em 0; border-radius: 8px;"><h3>Key Takeaways</h3><ul>...</ul></div>
3. Use H2s phrased as questions people would ask AI (e.g., "What size excavator do I need for...?")
4. Include 2-3 quotable statistics with specific numbers

Generate 4-5 FAQs that contractors would actually ask AI assistants about this topic. Make questions conversational and answers citation-worthy.`

    console.log('🤖 Calling Claude API...')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
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
      slug: generateSlug(selectedTopic.topic),
      // Store FAQs and keywords for schema markup (GEO optimization)
      faqs: generatedContent.faqs ? JSON.stringify(generatedContent.faqs) : null,
      keywords: generatedContent.keywords ? JSON.stringify(generatedContent.keywords) : null
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
