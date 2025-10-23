import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      topic,
      equipmentModel,
      contentAngle,
      category,
      keywords,
      wordCount,
      slug,
      excerpt,
      content
    } = await request.json()

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN
    const MONDAY_BLOG_BOARD_ID = '18258982175' // Blog content workflow board

    if (!MONDAY_API_TOKEN) {
      console.error('Monday.com API token not configured')
      return NextResponse.json({ error: 'Blog workflow not configured' }, { status: 500 })
    }

    // First, get the board columns to find the correct column IDs
    const columnsQuery = {
      query: `
        query {
          boards(ids: ${MONDAY_BLOG_BOARD_ID}) {
            columns {
              id
              title
              type
            }
          }
        }
      `
    }

    const columnsResponse = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_TOKEN
      },
      body: JSON.stringify(columnsQuery)
    })

    const columnsResult = await columnsResponse.json()

    if (columnsResult.errors) {
      console.error('Monday.com columns fetch error:', columnsResult.errors)
      throw new Error('Failed to fetch board columns')
    }

    const columns = columnsResult.data.boards[0].columns

    // Map column titles to IDs (case-insensitive matching)
    const columnMap: Record<string, string> = {}
    columns.forEach((col: any) => {
      const title = col.title.toLowerCase().trim()
      columnMap[title] = col.id
    })

    console.log('Available columns:', Object.keys(columnMap))

    // Create the item with blog title
    const createItemQuery = {
      query: `
        mutation {
          create_item (
            board_id: ${MONDAY_BLOG_BOARD_ID},
            item_name: "${title.replace(/"/g, '\\"')}"
          ) {
            id
          }
        }
      `
    }

    console.log('Creating Monday.com blog draft item...')
    const createResponse = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_TOKEN
      },
      body: JSON.stringify(createItemQuery)
    })

    const createResult = await createResponse.json()

    if (createResult.errors) {
      console.error('Monday.com create error:', createResult.errors)
      throw new Error('Failed to create item: ' + JSON.stringify(createResult.errors))
    }

    const itemId = createResult.data.create_item.id
    console.log('Created blog draft item with ID:', itemId)

    // Build column values object dynamically based on found columns
    const columnValues: Record<string, any> = {}

    // Map our data to the board columns
    if (columnMap['topic'] && topic) {
      columnValues[columnMap['topic']] = topic.substring(0, 2000) // Text limit
    }

    if (columnMap['equipment model'] && equipmentModel) {
      columnValues[columnMap['equipment model']] = equipmentModel
    }

    if (columnMap['content angle'] && contentAngle) {
      columnValues[columnMap['content angle']] = contentAngle
    }

    if (columnMap['category'] && category) {
      columnValues[columnMap['category']] = category
    }

    if (columnMap['target keywords'] && keywords) {
      columnValues[columnMap['target keywords']] = Array.isArray(keywords) ? keywords.join(', ') : keywords
    }

    if (columnMap['word count'] && wordCount) {
      columnValues[columnMap['word count']] = wordCount
    }

    if (columnMap['slug'] && slug) {
      columnValues[columnMap['slug']] = slug
    }

    // Set status to "Draft"
    const statusColumn = columns.find((col: any) => col.type === 'color' || col.title.toLowerCase() === 'status')
    if (statusColumn) {
      columnValues[statusColumn.id] = { label: "Draft" }
    }

    // Update the item with all column values
    const updateQuery = {
      query: `
        mutation {
          change_multiple_column_values (
            board_id: ${MONDAY_BLOG_BOARD_ID},
            item_id: ${itemId},
            column_values: ${JSON.stringify(JSON.stringify(columnValues))}
          ) {
            id
          }
        }
      `
    }

    console.log('Updating Monday.com blog draft columns...')
    const updateResponse = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_TOKEN
      },
      body: JSON.stringify(updateQuery)
    })

    const updateResult = await updateResponse.json()

    if (updateResult.errors) {
      console.error('Monday.com update error:', updateResult.errors)
      console.log('Item created but some fields may not have been updated')
    }

    // Store the full content in a note or update
    // Note: Full blog content (excerpt + content) will be stored in the item's updates/notes
    const addUpdateQuery = {
      query: `
        mutation {
          create_update (
            item_id: ${itemId},
            body: "BLOG CONTENT:\\n\\nEXCERPT:\\n${excerpt?.substring(0, 500) || ''}\\n\\nFULL CONTENT (stored separately):\\nView in Content Factory or click 'Publish' to add to site"
          ) {
            id
          }
        }
      `
    }

    await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_TOKEN
      },
      body: JSON.stringify(addUpdateQuery)
    })

    return NextResponse.json({
      success: true,
      message: 'Blog draft saved to Monday.com!',
      itemId: itemId,
      note: 'Full content stored separately. Use Publish to add to site.'
    })

  } catch (error: any) {
    console.error('Error saving blog draft to Monday.com:', error)
    return NextResponse.json({
      error: 'Failed to save blog draft',
      details: error.message
    }, { status: 500 })
  }
}
