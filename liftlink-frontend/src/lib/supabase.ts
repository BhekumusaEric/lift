import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zwlnjacnepcwpphfnxww.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bG5qYWNuZXBjd3BwaGZueHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMzMzOTEsImV4cCI6MjA2NDcwOTM5MX0.g6EjnFea5hx4NvWr3Da6aJrtH0qq4_XeNULAB8QZm3I'

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set. Please check your .env.local file.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export type { Database }