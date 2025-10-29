import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN;
    const BOARD_ID = '18303173124';

    if (!MONDAY_API_TOKEN) {
      return NextResponse.json(
        { error: 'Monday.com API token not configured' },
        { status: 500 }
      );
    }

    // Query to get board columns
    const query = `
      query {
        boards(ids: ${BOARD_ID}) {
          columns {
            id
            title
            type
          }
        }
      }
    `;

    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('Monday.com API Error:', result.errors);
      return NextResponse.json(
        { error: 'Failed to fetch board info', details: result.errors },
        { status: 500 }
      );
    }

    return NextResponse.json({
      columns: result.data.boards[0].columns
    });
  } catch (error) {
    console.error('Error fetching board info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
