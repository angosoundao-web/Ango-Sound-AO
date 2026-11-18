
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://uhwprpfastshfvlhpfdl.supabase.co';

const SUPABASE_KEY = 'sb_publishable_wUqNwSawrQ4xanui3yzHsg_NerrGoRA';

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
