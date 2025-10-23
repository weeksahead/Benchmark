import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { fullName, phone, email, business, request: userRequest } = await request.json()

    const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN
    const MONDAY_BOARD_ID = process.env.MONDAY_BOARD_ID

    if (!MONDAY_API_TOKEN || !MONDAY_BOARD_ID) {
      return NextResponse.json(
        { error: 'Monday.com configuration missing' },
        { status: 500 }
      )
    }

    // Create item on Monday.com board
    const mutation = `
      mutation {
        create_item (
          board_id: ${MONDAY_BOARD_ID},
          item_name: "${fullName}",
          column_values: "{\\"phone_mkv0nh94\\":\\"${phone}\\",\\"email_mkv06d0n\\":{\\"email\\":\\"${email}\\",\\"text\\":\\"${email}\\"},\\"text_mkv0kyy4\\":\\"${business}\\",\\"text_mkv07z2h\\":\\"${userRequest}\\"}"
        ) {
          id
        }
      }
    `

    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_TOKEN
      },
      body: JSON.stringify({ query: mutation })
    })

    if (!response.ok) {
      throw new Error(`Monday.com API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.errors) {
      console.error('Monday.com GraphQL errors:', data.errors)
      throw new Error('Failed to create item on Monday.com')
    }

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully'
    })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}
