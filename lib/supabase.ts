import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = 'https://wvndcypeecniuzrnwnmx.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2bmRjeXBlZWNuaXV6cm53bm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MDQ5NjcsImV4cCI6MjA3OTE4MDk2N30.ssbErAc6AMBL5UcZtd3q8YKRkFdS0qdfNmm7bcoHrUo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
