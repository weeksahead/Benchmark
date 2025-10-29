import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      title,
      excerpt,
      content,
      category,
      image,
      readTime,
      slug
    } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 })
    }

    // Read the current blogPosts.ts file
    const blogPostsPath = path.join(process.cwd(), 'data', 'blogPosts.ts')
    const fileContent = await fs.readFile(blogPostsPath, 'utf-8')

    // Find the blog post by ID using regex
    const blogRegex = new RegExp(`\\{[^}]*id:\\s*${id}[^}]*\\}(?:\\s*,)?`, 's')
    const match = fileContent.match(blogRegex)

    if (!match) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    // Build updated blog post object
    const updatedPost = `  {
    id: ${id},
    title: '${title.replace(/'/g, "\\'")}',
    excerpt: '${excerpt.replace(/'/g, "\\'")}',
    content: \`${content.replace(/`/g, '\\`')}\`,
    author: 'Benchmark Equipment',
    date: '${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}',
    category: '${category}',
    image: '${image}',
    readTime: '${readTime}',
    slug: '${slug}'
  }`

    // Replace the old blog post with the updated one
    const updatedContent = fileContent.replace(match[0], updatedPost + (match[0].endsWith(',') ? ',' : ''))

    // Write back to file
    await fs.writeFile(blogPostsPath, updatedContent, 'utf-8')

    console.log('Blog post updated successfully:', title)

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully!',
      post: {
        id,
        title,
        slug
      }
    })

  } catch (error: any) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({
      error: 'Failed to update blog post',
      details: error.message
    }, { status: 500 })
  }
}
