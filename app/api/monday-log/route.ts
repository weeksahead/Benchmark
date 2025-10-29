import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN;
    const BOARD_ID = '18303173124';

    if (!MONDAY_API_TOKEN) {
      return NextResponse.json(
        { error: 'Monday.com API token not configured' },
        { status: 500 }
      );
    }

    // Create item name with timestamp and recommendation
    const itemName = `${data.equipmentType} - ${data.recommendation} - ${new Date().toLocaleString()}`;

    // Build column values object with actual column IDs
    // Send raw numbers - Monday.com will handle formatting based on column settings
    const columnValues = {
      numeric_mkx6kaef: Math.round(data.purchasePrice),
      numeric_mkx6n69c: data.hoursPerYear,
      numeric_mkx6nh2v: data.yearsOfOwnership,
      numeric_mkx69rmf: data.operatorWage,
      numeric_mkx6b78v: data.maintenancePerHour,
      numeric_mkx6tcnr: Math.round(data.monthlyRentalRate),
      numeric_mkx6853a: Math.round(data.interestRate * 100), // Convert to whole number percentage
      numeric_mkx68kqj: Math.round(data.taxRate * 100), // Convert to whole number percentage
      numeric_mkx6gcdv: Math.round(data.savings),
      numeric_mkx6qzad: Math.round(data.totalBuyCost),
      numeric_mkx6amcz: Math.round(data.totalRentCost),
      date_mkx634a5: new Date().toISOString().split('T')[0]
    };

    // Monday.com GraphQL mutation
    const query = `
      mutation {
        create_item (
          board_id: ${BOARD_ID},
          item_name: "${itemName}",
          column_values: ${JSON.stringify(JSON.stringify(columnValues))}
        ) {
          id
        }
      }
    `;

    console.log('Sending to Monday.com:', {
      itemName,
      columnValues
    });

    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    console.log('Monday.com API Response:', JSON.stringify(result, null, 2));

    if (result.errors) {
      console.error('Monday.com API Error:', result.errors);
      return NextResponse.json(
        { error: 'Failed to log to Monday.com', details: result.errors },
        { status: 500 }
      );
    }

    if (!result.data || !result.data.create_item) {
      console.error('Monday.com unexpected response format:', result);
      return NextResponse.json(
        { error: 'Unexpected response format from Monday.com' },
        { status: 500 }
      );
    }

    console.log('Successfully created Monday.com item:', result.data.create_item.id);
    return NextResponse.json({ success: true, itemId: result.data.create_item.id });
  } catch (error) {
    console.error('Error logging to Monday.com:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
