// This endpoint helps identify the correct column IDs for your Monday.com board
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

  const MONDAY_API_TOKEN = process.env.VITE_MONDAY_API_TOKEN;
  const MONDAY_BOARD_ID = process.env.VITE_MONDAY_BOARD_ID || '9864313431';

  if (!MONDAY_API_TOKEN) {
    return res.status(500).json({ error: 'Monday.com API token not configured' });
  }

  try {
    // Query to get board columns
    const query = {
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

    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_TOKEN
      },
      body: JSON.stringify(query)
    });

    const result = await response.json();

    if (result.errors) {
      return res.status(500).json({ error: 'Failed to fetch board columns', details: result.errors });
    }

    const columns = result.data.boards[0].columns;
    
    return res.status(200).json({ 
      message: 'Board columns retrieved successfully',
      boardId: MONDAY_BOARD_ID,
      columns: columns,
      instructions: 'Use these column IDs in your contact form integration'
    });

  } catch (error) {
    console.error('Error fetching Monday.com columns:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch columns',
      details: error.message 
    });
  }
}