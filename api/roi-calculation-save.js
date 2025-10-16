export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    equipmentName,
    price,
    rental,
    utilization,
    monthlyROI,
    effectiveMonthlyRevenue,
    meetsTarget
  } = req.body;

  // Validate required fields
  if (!equipmentName || price === undefined || rental === undefined || utilization === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const MONDAY_API_TOKEN = process.env.VITE_MONDAY_API_TOKEN;
  const MONDAY_BOARD_ID = '9864593426'; // Equipment calculator board

  if (!MONDAY_API_TOKEN) {
    console.error('Monday.com API token not configured');
    return res.status(500).json({ error: 'ROI calculator not configured properly' });
  }

  try {
    // First, get the board columns to find the correct column IDs
    const columnsQuery = {
      query: `
        query {
          boards(ids: ${MONDAY_BOARD_ID}) {
            columns {
              id
              title
              type
            }
          }
        }
      `
    };

    const columnsResponse = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_TOKEN
      },
      body: JSON.stringify(columnsQuery)
    });

    const columnsResult = await columnsResponse.json();

    if (columnsResult.errors) {
      console.error('Monday.com columns fetch error:', columnsResult.errors);
      throw new Error('Failed to fetch board columns');
    }

    const columns = columnsResult.data.boards[0].columns;

    // Map column titles to IDs (case-insensitive matching)
    const columnMap = {};
    columns.forEach(col => {
      const title = col.title.toLowerCase().trim();
      columnMap[title] = col.id;
    });

    // Create the item with equipment name
    const createItemQuery = {
      query: `
        mutation {
          create_item (
            board_id: ${MONDAY_BOARD_ID},
            item_name: "${equipmentName}"
          ) {
            id
          }
        }
      `
    };

    console.log('Creating Monday.com ROI calculation item...');
    const createResponse = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_TOKEN
      },
      body: JSON.stringify(createItemQuery)
    });

    const createResult = await createResponse.json();

    if (createResult.errors) {
      console.error('Monday.com create error:', createResult.errors);
      throw new Error('Failed to create item: ' + JSON.stringify(createResult.errors));
    }

    const itemId = createResult.data.create_item.id;
    console.log('Created ROI calculation item with ID:', itemId);

    // Build column values object dynamically based on found columns
    const columnValues = {};

    // Map our data to the board columns
    if (columnMap['price']) {
      columnValues[columnMap['price']] = price;
    }

    if (columnMap['monthly rental']) {
      columnValues[columnMap['monthly rental']] = rental;
    }

    if (columnMap['utilization rate']) {
      columnValues[columnMap['utilization rate']] = utilization;
    }

    if (columnMap['monthly roi']) {
      columnValues[columnMap['monthly roi']] = monthlyROI;
    }

    if (columnMap['effective monthly revenue'] || columnMap['effective monthl']) {
      const colId = columnMap['effective monthly revenue'] || columnMap['effective monthl'];
      columnValues[colId] = effectiveMonthlyRevenue;
    }

    // Handle Status column - find the status column
    const statusColumn = columns.find(col => col.type === 'color' || col.title.toLowerCase() === 'status');
    if (statusColumn) {
      // Set status based on meetsTarget
      // "Terry Approves" for meets target, "Terry is heating up" for doesn't meet target
      const statusLabel = meetsTarget ? "Terry Approves" : "Terry is heating up";
      columnValues[statusColumn.id] = { label: statusLabel };
    }

    // Update the item with all column values
    const updateQuery = {
      query: `
        mutation {
          change_multiple_column_values (
            board_id: ${MONDAY_BOARD_ID},
            item_id: ${itemId},
            column_values: ${JSON.stringify(JSON.stringify(columnValues))}
          ) {
            id
          }
        }
      `
    };

    console.log('Updating Monday.com ROI calculation columns...');
    const updateResponse = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_TOKEN
      },
      body: JSON.stringify(updateQuery)
    });

    const updateResult = await updateResponse.json();

    if (updateResult.errors) {
      console.error('Monday.com update error:', updateResult.errors);
      // Don't fail completely if update fails - at least we created the item
      console.log('Item created but some fields may not have been updated');
    }

    return res.status(200).json({
      success: true,
      message: 'ROI calculation saved successfully!',
      itemId: itemId
    });

  } catch (error) {
    console.error('Error submitting ROI calculation to Monday.com:', error);
    return res.status(500).json({
      error: 'Failed to save ROI calculation. Please try again.',
      details: error.message
    });
  }
}
