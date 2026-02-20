import { createClient } from '@supabase/supabase-js'

// Pointing to the main Menu de Bordo Supabase project
// so leads land in the same DB as restaurants and users
const supabaseUrl = 'https://wgomxbyklaunmamjaeko.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indnb214YnlrbGF1bm1hbWphZWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTM0NDgsImV4cCI6MjA4NjA2OTQ0OH0.0Vc9qDJxVlPkk5AfB9BYpH5RZ05PXGwynt60bdvu23g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
