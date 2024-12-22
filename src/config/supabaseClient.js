import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pajydhfrpqrnamvkutde.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhanlkaGZycHFybmFtdmt1dGRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4MzAxMTEsImV4cCI6MjA1MDQwNjExMX0.dnP5P6XMQ2eX0Lp24gk2wbjk5ChNd8eB5XBj-I_M_jw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)