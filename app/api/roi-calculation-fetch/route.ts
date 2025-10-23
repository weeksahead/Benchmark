import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN
    const MONDAY_BOARD_ID = '9864593426' // Equipment calculator board

    if (!MONDAY_API_TOKEN) {
      console.error('Monday.com API token not configured')
      return NextResponse.json({ error: 'ROI calculator not configured properly' }, { status: 500 })
    }

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
    }

    console.log('Fetching ROI calculations from Monday.com...')
    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_TOKEN
      },
      body: JSON.stringify(itemsQuery)
    })

    const result = await response.json()

    if (result.errors) {
      console.error('Monday.com fetch error:', result.errors)
      throw new Error('Failed to fetch items: ' + JSON.stringify(result.errors))
    }

    const board = result.data.boards[0]
    const items = board.items_page.items
    const columns = board.columns

    // Helper function to parse number values
    const parseNumber = (columnValue: any) => {
      if (!columnValue || !columnValue.text) return 0
      const text = columnValue.text.replace(/[,$]/g, '').trim()
      return parseFloat(text) || 0
    }

    // Helper function to check if meets target from status
    const getMeetsTarget = (columnValue: any) => {
      if (!columnValue || !columnValue.value) return false
      try {
        const parsed = JSON.parse(columnValue.value)
        const label = parsed.label || ''
        return label.toLowerCase().includes('terry approves')
      } catch (e) {
        return false
      }
    }

    // Transform Monday.com items to SavedCalculation format
    const calculations = items.map((item: any) => {
      const columnData: Record<string, any> = {}

      // Build a map of column values
      item.column_values.forEach((cv: any) => {
        if (cv.column) {
          const title = cv.column.title.toLowerCase().trim()
          columnData[title] = cv
        }
      })

      // Extract values from columns
      const price = parseNumber(columnData['price'])
      const rental = parseNumber(columnData['monthly rental'])
      const utilization = parseNumber(columnData['utilization rate'])
      const monthlyROI = parseNumber(columnData['monthly roi'])
      const effectiveMonthlyRevenue = parseNumber(columnData['effective monthly revenue']) ||
                                       parseNumber(columnData['effective monthl'])

      // Find status column
      const statusColumn = item.column_values.find((cv: any) =>
        cv.column && (cv.column.title.toLowerCase() === 'status' || cv.column.title.toLowerCase().includes('status'))
      )
      const meetsTarget = statusColumn ? getMeetsTarget(statusColumn) : false

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
      }
    })

    // Sort by timestamp, newest first
    calculations.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    console.log(`Successfully fetched ${calculations.length} ROI calculations`)

    return NextResponse.json({
      success: true,
      calculations
    })

  } catch (error: any) {
    console.error('Error fetching ROI calculations from Monday.com:', error)
    return NextResponse.json({
      error: 'Failed to fetch ROI calculations',
      details: error.message
    }, { status: 500 })
  }
}
