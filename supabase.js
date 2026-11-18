
import { createClient } from
'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL =
'https://uhwprpfastshfvlhpfdl.supabase.co';

const SUPABASE_KEY =
'sb_publishable_wUqNwSawrQ4xanui3yzHsg_NerrGoRA';

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

window.supabaseClient = supabase;

console.log('AngoSound ligado ao Supabase!');
