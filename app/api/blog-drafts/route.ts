import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN
    const MONDAY_BLOG_BOARD_ID = '18258982175' // Blog content workflow board

    if (!MONDAY_API_TOKEN) {
      return NextResponse.json({ error: 'Blog workflow not configured' }, { status: 500 })
    }

    // Query to get all items from the board with their updates
    const query = {
      query: `
        query {
          boards(ids: ${MONDAY_BLOG_BOARD_ID}) {
            items_page(limit: 50) {
              items {
                id
                name
                column_values {
                  id
                  title
                  text
                }
                updates {
                  id
                  body
                  created_at
                }
              }
            }
          }
        }
      `
    }

    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_TOKEN
      },
      body: JSON.stringify(query)
    })

    const result = await response.json()

    if (result.errors) {
      console.error('Monday.com fetch error:', result.errors)
      throw new Error('Failed to fetch drafts')
    }

    const items = result.data.boards[0].items_page.items

    // Parse items into a cleaner format
    const drafts = items.map((item: any) => {
      const columnMap: Record<string, string> = {}
      item.column_values.forEach((col: any) => {
        const title = col.title.toLowerCase().trim()
        columnMap[title] = col.text || ''
      })

      // Extract full content from updates
      let excerpt = ''
      let content = ''
      let hasImage = false

      if (item.updates && item.updates.length > 0) {
        // Find the update with full blog content
        const contentUpdate = item.updates.find((update: any) =>
          update.body.includes('FULL BLOG POST')
        )

        if (contentUpdate) {
          const body = contentUpdate.body

          // Extract excerpt
          const excerptMatch = body.match(/EXCERPT:\s*(.*?)(?=\n\n━|$)/s)
          if (excerptMatch) {
            excerpt = excerptMatch[1].trim()
          }

          // Check for image
          hasImage = body.includes('✅ Featured image included')

          // Extract full content
          const contentMatch = body.match(/FULL CONTENT:\s*(.*?)(?=\n\n━|$)/s)
          if (contentMatch) {
            content = contentMatch[1].trim()
          }
        }
      }

      return {
        id: item.id,
        title: item.name,
        slug: columnMap['slug'] || '',
        category: columnMap['category'] || 'Equipment Guides',
        readTime: columnMap['word count'] ? `${Math.ceil(parseInt(columnMap['word count']) / 200)} min read` : '5 min read',
        keywords: columnMap['target keywords'] || '',
        createdDate: columnMap['created date'] || '',
        status: columnMap['status'] || 'Draft',
        excerpt,
        content,
        hasImage
      }
    })

    // Filter to only show drafts
    const draftItems = drafts.filter((draft: any) =>
      draft.status === 'Draft' || draft.status === ''
    )

    return NextResponse.json({
      success: true,
      drafts: draftItems
    })

  } catch (error: any) {
    console.error('Error fetching drafts:', error)
    return NextResponse.json({
      error: 'Failed to fetch drafts',
      details: error.message
    }, { status: 500 })
  }
}
