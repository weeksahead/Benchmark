import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { topic, equipmentModel, contentAngle } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY

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

Return a JSON object with the following structure:
{
  "title": "SEO-optimized title (60-70 characters)",
  "excerpt": "Compelling 2-3 sentence summary (150-160 characters)",
  "content": "Full blog post content as clean HTML paragraphs. Use <h2> for section headings, <p> for paragraphs, <ul>/<li> for lists. NO markdown syntax (no **, ##, etc). Ensure proper paragraph breaks between sections.",
  "category": "Equipment Guides | Industry Insights | Operator Tips | Equipment Comparisons",
  "readTime": "X min read",
  "slug": "url-friendly-slug",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

IMPORTANT: The content field must be clean HTML only - no markdown formatting. Use proper HTML tags and ensure paragraphs are separated with </p><p> tags.

Make the content authoritative, detailed, and valuable for contractors researching equipment.`

    console.log('Generating blog content with Claude...')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
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

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Claude API error:', response.status, errorData)
      throw new Error(`Claude API error: ${response.status}`)
    }

    const data = await response.json()
    const rawContent = data.content[0].text

    // Try to parse JSON from Claude's response
    let generatedContent
    try {
      // Claude sometimes wraps JSON in markdown code blocks
      const jsonMatch = rawContent.match(/```json\n?([\s\S]*?)\n?```/) ||
                        rawContent.match(/```\n?([\s\S]*?)\n?```/) ||
                        [null, rawContent]

      const jsonString = jsonMatch[1] || rawContent
      generatedContent = JSON.parse(jsonString.trim())
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', parseError)
      // Return a fallback structure
      generatedContent = {
        title: topic,
        excerpt: rawContent.substring(0, 160),
        content: rawContent,
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
