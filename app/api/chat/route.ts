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
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: `You are Tyler, a friendly AI assistant for Benchmark Equipment Rental & Sales. You help customers with questions about equipment rental, availability, pricing, and general inquiries. Be helpful, professional, and concise. If you don't know something specific, suggest they call (817) 403-4334 or visit the contact page.`,
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
      throw new Error(`Claude API error: ${response.statusText}`)
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
