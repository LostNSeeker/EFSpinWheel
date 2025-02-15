import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yojsxklcdfuqifbesaat.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvanN4a2xjZGZ1cWlmYmVzYWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2MTIxMTAsImV4cCI6MjA1NTE4ODExMH0.NR3FthjOVh5JeT1pSBORKRHw_dxhXUIM2pWtln8dhrQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)