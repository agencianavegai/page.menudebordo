import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ctxhcznhmjgbkprieeno.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0eGhjem5obWpnYmtwcmllZW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMjI5MTIsImV4cCI6MjA4NjY5ODkxMn0.6dD_ULwerUgvhY6-hwi83QOXJ9uzmw1fcXXiQZ0AGq4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
