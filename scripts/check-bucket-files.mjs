import { readFileSync } from 'fs'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

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

console.log('Listing files in Blog-images bucket...\n')

const { data: files, error } = await supabaseAdmin.storage.from('Blog-images').list()

if (error) {
  console.error('Error:', error)
  process.exit(1)
}

console.log(`Found ${files.length} files:\n`)
files.forEach((file, index) => {
  console.log(`${index + 1}. ${file.name}`)
  console.log(`   Created: ${file.created_at}`)
  console.log(`   Size: ${file.metadata?.size || 'unknown'} bytes`)
  console.log()
})
