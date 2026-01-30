import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET - Fetch all active hero slides
export async function GET() {
  try {
    const { data: slides, error } = await supabaseAdmin
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching slides:', error)
      throw error
    }

    return NextResponse.json({ slides })

  } catch (error: any) {
    console.error('Error fetching hero slides:', error)
    return NextResponse.json({
      error: 'Failed to fetch slides',
      details: error.message
    }, { status: 500 })
  }
}

// POST - Create a new hero slide
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image, title, subtitle, button_text, button_url, sort_order } = body

    if (!image || !title) {
      return NextResponse.json({ error: 'Image and title are required' }, { status: 400 })
    }

    // Get the max sort_order if not provided
    let newSortOrder = sort_order
    if (newSortOrder === undefined) {
      const { data: maxOrder } = await supabaseAdmin
        .from('hero_slides')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .single()

      newSortOrder = (maxOrder?.sort_order || 0) + 1
    }

    const { data, error } = await supabaseAdmin
      .from('hero_slides')
      .insert({
        image,
        title,
        subtitle: subtitle || '',
        button_text: button_text || 'View Equipment',
        button_url: button_url || 'https://rent.benchmarkequip.com/items',
        sort_order: newSortOrder
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating slide:', error)
      throw error
    }

    return NextResponse.json({ success: true, slide: data })

  } catch (error: any) {
    console.error('Error creating hero slide:', error)
    return NextResponse.json({
      error: 'Failed to create slide',
      details: error.message
    }, { status: 500 })
  }
}

// PATCH - Update a hero slide
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Slide ID required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('hero_slides')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating slide:', error)
      throw error
    }

    return NextResponse.json({ success: true, slide: data })

  } catch (error: any) {
    console.error('Error updating hero slide:', error)
    return NextResponse.json({
      error: 'Failed to update slide',
      details: error.message
    }, { status: 500 })
  }
}

// DELETE - Remove a hero slide
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Slide ID required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('hero_slides')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting slide:', error)
      throw error
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Error deleting hero slide:', error)
    return NextResponse.json({
      error: 'Failed to delete slide',
      details: error.message
    }, { status: 500 })
  }
}
