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

    const supabase = await createClient();
    let supabaseUser = null;

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
          if (errMsg.includes('already registered')) {
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

    // Always persist to resilient local account store as fallback safety net
    let localRecord = null;
    try {
      localRecord = saveLocalAccount({
        email: normalizedEmail,
        name: fullName,
        password
      });
    } catch (saveErr) {
      console.warn('Local account save warning:', saveErr);
    }

    if (!supabaseUser && !localRecord) {
      return NextResponse.json({
        success: false,
        error: 'Unable to register account. Please try again.'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: supabaseUser?.id || localRecord?.id || 'usr_' + Date.now(),
        email: normalizedEmail,
        name: fullName
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({
      success: false,
      error: 'Account creation encountered an issue. Please try again.'
    }, { status: 500 });
  }
}
