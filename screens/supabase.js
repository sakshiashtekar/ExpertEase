// supabase.js
import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://qqopqawrpqimxyldkpjj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxb3BxYXdycHFpbXh5bGRrcGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMDcyNTgsImV4cCI6MjA1OTc4MzI1OH0.jPS6P5fv-AQAZrgsmLihTeN8a58Z-mvJcmEg9f8jxUY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);