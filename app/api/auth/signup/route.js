import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { saveLocalAccount, findLocalAccount } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const fullName = (name || '').trim() || normalizedEmail.split('@')[0];

    // Check if account already exists locally
    const existingLocal = findLocalAccount(normalizedEmail);

    const supabase = await createClient();
    let supabaseUser = null;
    let rateLimited = false;

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: password,
          options: {
            data: {
              full_name: fullName,
              name: fullName
            }
          }
        });

        if (error) {
          const errMsg = error.message.toLowerCase();
          if (errMsg.includes('rate limit') || errMsg.includes('over_email_send_rate_limit')) {
            console.warn('Supabase email rate limit reached; using resilient fallback account store.');
            rateLimited = true;
          } else if (errMsg.includes('already registered')) {
            return NextResponse.json({
              success: false,
              error: 'An account with this email already exists. Please sign in.'
            }, { status: 409 });
          } else {
            console.warn('Supabase signup notice:', error.message);
          }
        } else if (data?.user) {
          supabaseUser = data.user;
          // Best-effort profile sync
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              email: normalizedEmail,
              full_name: fullName,
              role: 'customer',
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' });
          } catch {}
        }
      } catch (sbErr) {
        console.warn('Supabase network notice:', sbErr.message);
      }
    }

    // Always persist to local encrypted account store as safety net
    const localRecord = saveLocalAccount({
      email: normalizedEmail,
      name: fullName,
      password
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: supabaseUser?.id || localRecord.id,
        email: normalizedEmail,
        name: fullName
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
