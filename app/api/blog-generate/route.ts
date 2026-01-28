import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { topic, equipmentModel, contentAngle } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.BENCHMARK_SECRET_ANTHROPIC

    if (!CLAUDE_API_KEY) {
      return NextResponse.json({ error: 'Claude API key not configured' }, { status: 500 })
    }

    // Build the prompt for Claude
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

Examples:
✅ "Most Denton County projects hit caliche around the 4-6 foot mark. We've seen contractors burn through standard bucket cutting edges in two days when they hit these layers."
✅ "That black clay in Argyle sticks to everything when wet. Buckets need self-cleaning features or you'll spend half your day scraping."
✅ "Contractors working on McKinney developments..."
✅ "Sherman-Denison area sites typically..."
❌ Avoid generic: "In Texas..." or "In our area..." - Be specific about locations and conditions.

Operational Experience Integration (2-3 per blog):
Include specific scenarios from rental fleet experience:
- "Contractors working the Furst Ranch development in Argyle..."
- "Last month a customer hit solid rock on an I-35 project..."
- "Most customers rent [equipment] for 3-5 days when doing [task]..."
- "That time savings paid for the rental premium five times over"
- "We've had customers try to muscle through with [wrong tool] and end up with..."

AVOID These AI Writing Patterns:
❌ Don't use: "dive into," "delve into," "when it comes to," "it's worth noting," "at the end of the day"
❌ Don't start sections with definitions or generic introductions
❌ Don't use bullet lists as primary content (use sparingly for specs only)
❌ Don't write generic statements like "proper maintenance extends equipment life"

Instead:
✅ Start sections with real problems or scenarios
✅ Connect every technical detail to practical application
✅ Use specific numbers and timeframes from real experience
✅ Show, don't just tell - write like you're advising a contractor

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
- Use descriptive anchor text (not "click here")
- Format: <a href="https://example.com" target="_blank" rel="noopener noreferrer">descriptive text</a>
- Cite specific studies, statistics, or regulations with links to original sources
- Link naturally within sentences, not as standalone references

Content Structure:
- Engaging introduction with the problem/need
- Clear section headings (H2, H3)
- Specific equipment details and specifications
- Practical use cases and applications
- Expert tips and best practices
- Comparison with alternatives when relevant
- Strong conclusion with call-to-action

Brand Integration:
- Write as Benchmark Equipment ("we," "our fleet," "our customers")
- Reference Denton, TX location and North Texas service area naturally
- Emphasize low-hour, well-maintained rental equipment from operational perspective
- Reference "the [models] in our Denton fleet" or "most of our rental periods run..."
- Include conversational, context-specific calls-to-action

Enhanced Call-to-Action Guidelines:
Make CTAs conversational and specific to the content context. Show expertise, don't just ask for business.

❌ Generic: "Contact Benchmark Equipment at (817) 403-4334 for your equipment needs."

✅ Specific & Helpful:
- "Not sure if a 320 or 323 makes sense for your site conditions? Call us at (817) 403-4334. We've probably rented for a similar project and can walk you through what actually works in North Texas clay."
- "Hitting rock on your next Denton County project? We keep breakers sized for every excavator class in our fleet. (817) 403-4334"
- "Need this equipment delivered to a north Fort Worth site? We're local in Denton - usually same-day delivery for the areas we serve. Check our inventory at https://rent.benchmarkequip.com/items or call (817) 403-4334."

Customer Perspective Language:
- "Contractors tell us..."
- "The question we hear most often is..."
- "Most operators find that..."
- "We've rented equipment for dozens of projects that..."`

    const userPrompt = `Generate a comprehensive blog post about: "${topic}"
${equipmentModel ? `\nFocus on equipment model: ${equipmentModel}` : ''}
${contentAngle ? `\nContent angle: ${contentAngle}` : ''}

Return ONLY a valid JSON object (no markdown, no code blocks, just raw JSON):
{
  "title": "SEO-optimized title (60-70 characters)",
  "excerpt": "Compelling 2-3 sentence summary (150-160 characters)",
  "content": "Full blog post content as clean HTML. Use DOUBLE QUOTES for all HTML attributes. Format:
    - <h2 style=\"font-weight: bold; font-size: 1.5em; margin-top: 2em; margin-bottom: 1em;\">Section Heading</h2>
    - <p style=\"margin-bottom: 1.5em; line-height: 1.8;\">Paragraph text here.</p>
    - Each paragraph in its own <p> tag
    - Use <ul><li>items</li></ul> for lists
    - Include 4-7 external links: <a href=\"https://example.com\" target=\"_blank\" rel=\"noopener noreferrer\">anchor text</a>
    - Link to authoritative sources (.gov, .edu, OSHA, AGC, ASCE, etc.)
    - NO markdown syntax",
  "category": "Equipment Guides",
  "readTime": "X min read",
  "slug": "url-friendly-slug",
  "keywords": {
    "short": ["2-3 word high-volume keywords", "equipment rental", "cat excavator"],
    "medium": ["3-5 word more specific phrases", "cat 320 excavator rental", "heavy equipment denton tx"],
    "longtail": ["5+ word specific queries people search", "best excavator for clay soil north texas", "how much does cat 336 rental cost"]
  },
  "faqs": [
    {
      "question": "Specific question a contractor would ask about this topic?",
      "answer": "Direct, helpful answer (2-4 sentences) that provides real value."
    }
  ]
}

KEYWORD REQUIREMENTS:
- short: 3-4 high-volume, competitive keywords (2-3 words)
- medium: 4-5 moderately specific phrases (3-5 words)
- longtail: 3-4 very specific queries (5+ words) that match how people actually search

FAQ REQUIREMENTS:
- Generate 4-5 FAQs that contractors would actually ask about this topic
- Questions should be natural language (how, what, why, when, which)
- Answers should be direct, helpful, and 2-4 sentences
- Include at least one question about cost/pricing and one about rental process
- These will be used for FAQPage schema markup (AEO optimization)

CRITICAL REQUIREMENTS:
1. Return ONLY the JSON object - no markdown code blocks, no backticks, just pure JSON
2. Use DOUBLE QUOTES for HTML attributes (not single quotes)
3. Escape any quotes within content with backslash
4. Ensure valid JSON - test it mentally before responding
5. Always complete the closing JSON braces properly

VOICE REMINDERS:
- Write in first-person plural ("we," "our customers," "our fleet")
- Include 2-3 specific regional references using cities from our service area (Denton, Fort Worth, McKinney, Sherman, Prosper, Celina, Wichita Falls, Gainesville, etc.) plus soil conditions (clay, caliche)
- Include 2-3 operational experience scenarios from rental fleet perspective
- Avoid generic AI phrases like "dive into," "delve into," "when it comes to"
- Make CTAs conversational and context-specific, not generic
- Start sections with real problems, not definitions
- Connect every technical detail to practical North Texas applications

Make the content authoritative, detailed, and valuable for contractors researching equipment - written from the perspective of an experienced Denton-based equipment rental operator.`

    console.log('Generating blog content with Claude...')

    // Retry logic for API overload errors
    let response: Response | undefined
    let lastError
    const maxRetries = 3

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        response = await fetch('https://api.anthropic.com/v1/messages', {
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
            messages: [
              {
                role: 'user',
                content: userPrompt
              }
            ]
          })
        })

        if (response.ok) {
          break // Success, exit retry loop
        }

        const errorData = await response.json()

        // If it's a 529 overloaded error and we have retries left, wait and retry
        if (response.status === 529 && attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000 // Exponential backoff: 2s, 4s, 8s
          console.log(`Claude API overloaded (529), retrying in ${waitTime/1000}s... (attempt ${attempt}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          lastError = errorData
          continue
        }

        // For other errors or final retry, throw
        console.error('Claude API error:', response.status, errorData)
        throw new Error(`Claude API error: ${response.status}`)
      } catch (fetchError: any) {
        if (attempt === maxRetries) {
          throw fetchError
        }
        lastError = fetchError
        const waitTime = Math.pow(2, attempt) * 1000
        console.log(`Request failed, retrying in ${waitTime/1000}s... (attempt ${attempt}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }

    if (!response) {
      throw new Error('Failed to get response from Claude API after retries')
    }

    const data = await response.json()
    const rawContent = data.content[0].text

    console.log('Raw Claude response (first 200 chars):', rawContent.substring(0, 200))

    // Try to parse JSON from Claude's response
    let generatedContent
    let jsonString = rawContent
    try {
      // Claude sometimes wraps JSON in markdown code blocks
      // Remove all markdown code block markers
      if (rawContent.includes('```')) {
        // Remove opening ```json or ```
        jsonString = rawContent.replace(/^```(?:json)?\s*\n?/i, '')
        // Remove closing ```
        jsonString = jsonString.replace(/\n?```\s*$/i, '')
      }

      // Trim whitespace
      jsonString = jsonString.trim()

      // Validate JSON structure before parsing
      if (!jsonString.startsWith('{') || !jsonString.endsWith('}')) {
        throw new Error('JSON does not start with { or end with }')
      }

      console.log('Attempting to parse JSON (first 300 chars):', jsonString.substring(0, 300))
      console.log('JSON ends with (last 100 chars):', jsonString.substring(jsonString.length - 100))

      generatedContent = JSON.parse(jsonString)
      console.log('✅ Successfully parsed JSON, title:', generatedContent.title)
    } catch (parseError) {
      console.error('❌ Failed to parse Claude response as JSON:', parseError)
      console.error('JSON length:', jsonString?.length)
      console.error('First 500 chars:', jsonString?.substring(0, 500))
      console.error('Last 500 chars:', jsonString?.substring(jsonString.length - 500))

      // Return a fallback structure
      generatedContent = {
        title: topic,
        excerpt: 'AI-generated content for ' + topic,
        content: '<p style="margin-bottom: 1.5em; line-height: 1.8;">Content generation failed. Please try again.</p>',
        category: 'Equipment Guides',
        readTime: '8 min read',
        slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        keywords: [topic]
      }
    }

    console.log('Blog content generated successfully')

    return NextResponse.json({
      success: true,
      content: generatedContent
    })

  } catch (error: any) {
    console.error('Blog generation error:', error)
    return NextResponse.json({
      error: 'Failed to generate blog content',
      details: error.message
    }, { status: 500 })
  }
}
