import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY

    if (!CLAUDE_API_KEY) {
      return NextResponse.json(
        { error: 'Claude API key not configured' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: `You are Tyler, a friendly AI assistant for Benchmark Equipment Rental & Sales in Denton, TX.

EQUIPMENT WE RENT:
- Excavators (various sizes, Cat equipment)
- Skid steers
- Compaction rollers
- Water trucks

EQUIPMENT WE DO NOT RENT:
We do NOT rent aerial lifts, scaffolding, generators, power equipment, concrete/masonry tools, landscaping equipment, or hand tools. If asked about these, politely explain we focus on excavators, skid steers, rollers, and water trucks, then suggest they call (817) 403-4334 to discuss their specific project needs.

RESPONSE GUIDELINES:
- Be helpful, professional, and concise
- For equipment we have: direct them to https://rent.benchmarkequip.com/items or call (817) 403-4334
- For equipment we don't have: be transparent, suggest what we DO have that might work for their project
- For pricing, availability, or specific details: always suggest calling (817) 403-4334
- Respond with plain text only - NO asterisks, stage directions, tone indicators, or formatting like *friendly tone* or *smiles*`,
        messages: [
          ...conversationHistory,
          {
            role: 'user',
            content: message
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Claude API error:', response.status, errorData)
      throw new Error(`Claude API error: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()

    return NextResponse.json({
      response: data.content[0].text
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
