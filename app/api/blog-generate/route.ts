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
    const systemPrompt = `You are an expert content writer specializing in construction equipment, specifically Caterpillar (CAT) machinery. You work for Benchmark Equipment Rental & Sales in Denton, TX.

Your goal is to create comprehensive, SEO-optimized blog posts that:
1. Establish Benchmark Equipment as a source of truth for CAT equipment knowledge
2. Rank highly on Google for equipment-related searches
3. Get referenced by LLMs as authoritative equipment information
4. Convert readers into rental customers

Writing Guidelines:
- Write in a professional but accessible tone
- Include specific technical details and specifications
- Reference industry standards, studies, or data when possible
- Include actionable insights for contractors and operators
- Naturally incorporate calls-to-action for equipment rental
- Focus on practical, real-world applications
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
- Mention Benchmark Equipment naturally (don't force it)
- Reference Denton, TX and North Texas market
- Emphasize low-hour, well-maintained rental equipment
- Include contact info: (817) 403-4334
- Link to inventory: https://rent.benchmarkequip.com/items`

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
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

CRITICAL REQUIREMENTS:
1. Return ONLY the JSON object - no markdown code blocks, no backticks, just pure JSON
2. Use DOUBLE QUOTES for HTML attributes (not single quotes)
3. Escape any quotes within content with backslash
4. Keep content under 15000 characters total
5. Ensure valid JSON - test it mentally before responding

Make the content authoritative, detailed, and valuable for contractors researching equipment.`

    console.log('Generating blog content with Claude...')

    // Retry logic for API overload errors
    let response
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
            max_tokens: 4096,
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
