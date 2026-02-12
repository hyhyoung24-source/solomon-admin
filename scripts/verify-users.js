const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manual .env parser
function loadEnv(filePath) {
    if (!fs.existsSync(filePath)) return {};
    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};
    content.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
        }
    });
    return env;
}

async function main() {
    const envPath = path.resolve(__dirname, '../.env.local');
    const env = loadEnv(envPath);

    // Fallback to process.env if available
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !anonKey) {
        console.error('Missing env variables (URL or Anon Key)');
        console.log('Loaded from:', envPath);
        console.log('Keys found:', Object.keys(env));
        return;
    }

    const anonClient = createClient(supabaseUrl, anonKey);
    let adminClient = null;
    if (serviceKey) {
        adminClient = createClient(supabaseUrl, serviceKey);
    } else {
        console.warn('Warning: SUPABASE_SERVICE_ROLE_KEY not found. Cannot verify admin access completely.');
    }

    console.log('--- Verify Users ---');

    // Check with Admin Client (Expected to work)
    let adminUsersCount = 0;
    if (adminClient) {
        const { data: adminUsers, error: adminError } = await adminClient
            .from('users')
            .select('email, password');

        if (adminError) {
            console.error('Admin Client Error:', adminError.message);
        } else {
            console.log(`Admin Client found ${adminUsers.length} users:`);
            adminUsers.forEach(u => console.log(` - ${u.email} (Hash exists: ${!!u.password})`));
            adminUsersCount = adminUsers.length;
        }
    }

    // Check with Anon Client (Expected to fail if RLS blocks read)
    const { data: anonUsers, error: anonError } = await anonClient
        .from('users')
        .select('email');

    if (anonError) {
        console.error('Anon Client Error:', anonError.message);
    } else {
        console.log(`Anon Client found ${anonUsers ? anonUsers.length : 0} users.`);
        if (adminClient && (anonUsers || []).length === 0 && adminUsersCount > 0) {
            console.error('CRITICAL: Anon client found 0 users but Admin found some.');
            console.error('RLS Policy "Allow public read" on users table is likely missing or incorrect.');
            console.log('To fix: Run the following SQL in your Supabase SQL Editor:');
            console.log('create policy "Allow public read" on public.users for select using (true);');
        } else if ((anonUsers || []).length > 0) {
            console.log('RLS seems fine (users are readable by anon).');
        } else {
            console.log('No users found in DB at all.');
        }
    }
}

main().catch(console.error);
