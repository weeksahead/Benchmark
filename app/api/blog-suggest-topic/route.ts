import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY

    if (!CLAUDE_API_KEY) {
      return NextResponse.json({ error: 'Claude API key not configured' }, { status: 500 })
    }

    // Get existing blog posts from Supabase
    const { data: blogPosts, error } = await supabase
      .from('blog_posts')
      .select('title, category')

    if (error || !blogPosts) {
      throw new Error('Failed to fetch blog posts')
    }

    // Get existing blog titles for context
    const existingTitles = blogPosts.map(post => post.title)
    const existingCategories = [...new Set(blogPosts.map(post => post.category))]

    const systemPrompt = `You are a content strategist for Benchmark Equipment Rental & Sales, specializing in CAT construction equipment.

Your goal is to suggest blog topics that:
1. Don't conflict with existing blog posts
2. Target valuable SEO keywords for construction equipment
3. Help establish Benchmark as a source of truth for CAT equipment
4. Are likely to rank well on Google and be cited by LLMs
5. Provide real value to contractors and equipment operators

Available Equipment Models:
- Cat 301.7 (Mini Excavator)
- Cat 315 (Small Excavator)
- Cat 320 (Medium Excavator)
- Cat 323 (Medium Excavator)
- Cat 336 (Medium Excavator)
- Cat 395 (Large Excavator)
- Cat 938M (Wheel Loader)
- Cat 950M (Wheel Loader)
- Cat 272D3 (Skid Steer)
- Cat CS54B (Compactor/Roller)
- Cat D8 (Dozer)

Content Angles:
- Specifications & Features
- Best Use Cases & Applications
- vs. Competitor Comparison
- Operator Tips & Techniques
- Maintenance Guide
- ROI & Rental Analysis
- Industry-Specific Uses
- Technology Features
- Safety Features & Protocols
- Fuel Efficiency Strategies
- Attachment Guide
- Project Case Study
- Seasonal Considerations
- Model Evolution & History
- Troubleshooting Guide`

    const userPrompt = `Here are our existing blog post titles:
${existingTitles.map((title, i) => `${i + 1}. ${title}`).join('\n')}

Existing categories: ${existingCategories.join(', ')}

Suggest ONE new unique blog topic that:
- Doesn't overlap with existing posts
- Is highly valuable for SEO and contractors
- Focuses on CAT equipment
- Would perform well in search rankings
- Is comprehensive enough for 1,500-2,000 words

Return a JSON object with this structure:
{
  "topic": "Full blog topic/title suggestion",
  "equipmentModel": "Specific Cat model if applicable, or 'General Equipment Topic'",
  "contentAngle": "One of the content angles from the list",
  "reasoning": "Why this topic is valuable and unique"
}

Be creative but strategic. Think about what contractors are actually searching for.`

    console.log('Requesting topic suggestion from Claude...')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
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
    let suggestion
    try {
      const jsonMatch = rawContent.match(/```json\n?([\s\S]*?)\n?```/) ||
                        rawContent.match(/```\n?([\s\S]*?)\n?```/) ||
                        [null, rawContent]

      const jsonString = jsonMatch[1] || rawContent
      suggestion = JSON.parse(jsonString.trim())
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', parseError)
      // Fallback suggestion
      suggestion = {
        topic: 'CAT Equipment Best Practices for Construction Projects',
        equipmentModel: 'General Equipment Topic',
        contentAngle: 'Best Use Cases & Applications',
        reasoning: 'Fallback topic'
      }
    }

    console.log('Topic suggestion generated:', suggestion.topic)

    return NextResponse.json({
      success: true,
      suggestion
    })

  } catch (error: any) {
    console.error('Topic suggestion error:', error)
    return NextResponse.json({
      error: 'Failed to generate topic suggestion',
      details: error.message
    }, { status: 500 })
  }
}
