import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      readTime,
      slug,
      featuredImage
    } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Read the current blogPosts.ts file
    const blogPostsPath = path.join(process.cwd(), 'data', 'blogPosts.ts')
    const fileContent = await fs.readFile(blogPostsPath, 'utf-8')

    // Parse to find the highest ID
    const idMatches = fileContent.match(/id:\s*(\d+)/g)
    const ids = idMatches ? idMatches.map(match => parseInt(match.match(/\d+/)![0])) : [0]
    const nextId = Math.max(...ids) + 1

    // Get current date
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Create new blog post object
    const newPost = {
      id: nextId,
      title: title,
      excerpt: excerpt || title,
      content: content,
      author: 'Benchmark Equipment',
      date: today,
      category: category || 'Equipment Guides',
      image: featuredImage || '/images/equipment/cat-excavator-default.jpg',
      readTime: readTime || '5 min read',
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }

    // Format the new post as TypeScript code
    const newPostCode = `  {
    id: ${newPost.id},
    title: '${newPost.title.replace(/'/g, "\\'")}',
    excerpt: '${newPost.excerpt.replace(/'/g, "\\'")}',
    content: \`${newPost.content.replace(/`/g, '\\`')}\`,
    author: '${newPost.author}',
    date: '${newPost.date}',
    category: '${newPost.category}',
    image: '${newPost.image}',
    readTime: '${newPost.readTime}',
    slug: '${newPost.slug}'
  }`

    // Find the closing bracket of the blogPosts array
    const arrayEndIndex = fileContent.lastIndexOf('];')
    if (arrayEndIndex === -1) {
      throw new Error('Could not find end of blogPosts array')
    }

    // Insert the new post before the closing bracket
    const beforeArray = fileContent.substring(0, arrayEndIndex)
    const afterArray = fileContent.substring(arrayEndIndex)

    // Add comma after last post if there are existing posts
    const needsComma = beforeArray.trim().endsWith('}')
    const newContent = beforeArray + (needsComma ? ',\n' : '') + newPostCode + '\n' + afterArray

    // Write the updated content back to the file
    await fs.writeFile(blogPostsPath, newContent, 'utf-8')

    console.log('Blog post published successfully:', newPost.title, 'with ID:', nextId)

    return NextResponse.json({
      success: true,
      message: 'Blog post published successfully!',
      post: {
        id: nextId,
        title: newPost.title,
        slug: newPost.slug
      }
    })

  } catch (error: any) {
    console.error('Error publishing blog post:', error)
    return NextResponse.json({
      error: 'Failed to publish blog post',
      details: error.message
    }, { status: 500 })
  }
}
