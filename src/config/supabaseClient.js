import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zfxlpcwimdgnftrinspg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmeGxwY3dpbWRnbmZ0cmluc3BnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4MTk3NjAsImV4cCI6MjA1MDM5NTc2MH0.G7-1DBa3kVG1Y6H6SNwQl4hcmFm7e3nPPl46Dkk1sg4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)