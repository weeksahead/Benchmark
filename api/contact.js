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

  const { fullName, phone, email, business, request } = req.body;

  // Validate required fields
  if (!fullName || !phone || !email || !request) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const MONDAY_API_TOKEN = process.env.VITE_MONDAY_API_TOKEN;
  const MONDAY_BOARD_ID = process.env.VITE_MONDAY_BOARD_ID || '9864313431';

  if (!MONDAY_API_TOKEN) {
    console.error('Monday.com API token not configured');
    return res.status(500).json({ error: 'Contact form not configured properly' });
  }

  try {
    // First, create the item with just the name
    const createItemQuery = {
      query: `
        mutation {
          create_item (
            board_id: ${MONDAY_BOARD_ID},
            item_name: "${fullName} - ${new Date().toLocaleDateString()}"
          ) {
            id
          }
        }
      `
    };

    console.log('Creating Monday.com item...');
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
    console.log('Created item with ID:', itemId);

    // Use the actual column IDs from the Monday.com board
    const columnValues = {
      // Phone column
      phone_mkv0nh94: phone,
      
      // Email column - Monday.com email columns need this format
      email_mkv06d0n: { email: email, text: email },
      
      // Company/Business column
      text_mkv0kyy4: business || 'N/A',
      
      // Request column
      text_mkv07z2h: request
    };

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

    console.log('Updating Monday.com item columns...');
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
      message: 'Contact form submitted successfully!',
      itemId: itemId
    });

  } catch (error) {
    console.error('Error submitting to Monday.com:', error);
    return res.status(500).json({ 
      error: 'Failed to submit contact form. Please try again or call us directly.',
      details: error.message 
    });
  }
}