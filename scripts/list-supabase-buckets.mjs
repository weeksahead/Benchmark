import { readFileSync } from 'fs'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env file
const envPath = resolve(process.cwd(), '.env')
const envFile = readFileSync(envPath, 'utf-8')
envFile.split('\n').forEach(line => {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) return

  const [key, ...valueParts] = trimmed.split('=')
  if (key && valueParts.length > 0) {
    const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
    process.env[key.trim()] = value
  }
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

console.log('Listing all Supabase storage buckets...\n')

const { data: buckets, error } = await supabaseAdmin.storage.listBuckets()

if (error) {
  console.error('Error:', error)
  process.exit(1)
}

console.log('Found', buckets.length, 'buckets:\n')
buckets.forEach((bucket, index) => {
  console.log(`${index + 1}. Name: "${bucket.name}"`)
  console.log(`   ID: ${bucket.id}`)
  console.log(`   Public: ${bucket.public}`)
  console.log(`   Created: ${bucket.created_at}`)
  console.log()
})
