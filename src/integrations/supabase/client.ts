// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ilvtvatchclqirwnovyh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsdnR2YXRjaGNscWlyd25vdnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MDUyMDUsImV4cCI6MjA2NTI4MTIwNX0.ddnJ_kbma-HwNV_gh4XUz8OMDRsKYPrnauM1r_HKgWs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);