import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  image: string
  read_time: string
  slug: string
  created_at?: string
  updated_at?: string
  // GEO optimization fields - stored as JSON strings
  faqs?: string | null
  keywords?: string | null
}
