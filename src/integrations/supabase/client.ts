// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sxiwxjthgjszcaxnynxi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4aXd4anRoZ2pzemNheG55bnhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MjYzMTcsImV4cCI6MjA1NTEwMjMxN30.lw3aYodI-B-Fxvy-3pXXI4Mktxsl3DK2XfUpLHjjIGs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);