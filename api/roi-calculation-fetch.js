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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const MONDAY_API_TOKEN = process.env.VITE_MONDAY_API_TOKEN;
  const MONDAY_BOARD_ID = '9864593426'; // Equipment calculator board

  if (!MONDAY_API_TOKEN) {
    console.error('Monday.com API token not configured');
    return res.status(500).json({ error: 'ROI calculator not configured properly' });
  }

  try {
    // Fetch all items from the board with their column values
    const itemsQuery = {
      query: `
        query {
          boards(ids: ${MONDAY_BOARD_ID}) {
            columns {
              id
              title
              type
            }
            items_page(limit: 500) {
              items {
                id
                name
                created_at
                column_values {
                  id
                  column {
                    id
                    title
                  }
                  text
                  value
                }
              }
            }
          }
        }
      `
    };

    console.log('Fetching ROI calculations from Monday.com...');
    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_TOKEN
      },
      body: JSON.stringify(itemsQuery)
    });

    const result = await response.json();

    if (result.errors) {
      console.error('Monday.com fetch error:', result.errors);
      throw new Error('Failed to fetch items: ' + JSON.stringify(result.errors));
    }

    const board = result.data.boards[0];
    const items = board.items_page.items;
    const columns = board.columns;

    // Transform Monday.com items to SavedCalculation format
    const calculations = items.map(item => {
      const columnData = {};

      // Build a map of column values
      item.column_values.forEach(cv => {
        if (cv.column) {
          const title = cv.column.title.toLowerCase().trim();
          columnData[title] = cv;
        }
      });

      // Helper function to parse number values
      const parseNumber = (columnValue) => {
        if (!columnValue || !columnValue.text) return 0;
        const text = columnValue.text.replace(/[,$]/g, '').trim();
        return parseFloat(text) || 0;
      };

      // Helper function to check if meets target from status
      const getMeetsTarget = (columnValue) => {
        if (!columnValue || !columnValue.value) return false;
        try {
          const parsed = JSON.parse(columnValue.value);
          const label = parsed.label || '';
          return label.toLowerCase().includes('terry approves');
        } catch (e) {
          return false;
        }
      };

      // Extract values from columns
      const price = parseNumber(columnData['price']);
      const rental = parseNumber(columnData['monthly rental']);
      const utilization = parseNumber(columnData['utilization rate']);
      const monthlyROI = parseNumber(columnData['monthly roi']);
      const effectiveMonthlyRevenue = parseNumber(columnData['effective monthly revenue']) ||
                                       parseNumber(columnData['effective monthl']);

      // Find status column
      const statusColumn = item.column_values.find(cv =>
        cv.column && (cv.column.title.toLowerCase() === 'status' || cv.column.title.toLowerCase().includes('status'))
      );
      const meetsTarget = statusColumn ? getMeetsTarget(statusColumn) : false;

      return {
        id: item.id,
        equipmentName: item.name,
        price,
        rental,
        utilization,
        monthlyROI,
        effectiveMonthlyRevenue,
        meetsTarget,
        timestamp: item.created_at
      };
    });

    // Sort by timestamp, newest first
    calculations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    console.log(`Successfully fetched ${calculations.length} ROI calculations`);

    return res.status(200).json({
      success: true,
      calculations
    });

  } catch (error) {
    console.error('Error fetching ROI calculations from Monday.com:', error);
    return res.status(500).json({
      error: 'Failed to fetch ROI calculations',
      details: error.message
    });
  }
}
