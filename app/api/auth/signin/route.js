import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { findLocalAccount, verifyPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Try Supabase Auth
    const supabase = await createClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: password
        });

        if (!error && data?.user) {
          const user = data.user;
          let fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
          if (!fullName) {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', user.id)
                .single();
              if (profile?.full_name) fullName = profile.full_name;
            } catch {}
          }

          if (!fullName) {
            fullName = normalizedEmail.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          }

          return NextResponse.json({
            success: true,
            user: {
              id: user.id,
              email: user.email,
              name: fullName
            }
          });
        }
      } catch (sbErr) {
        console.warn('Supabase signin attempt notice:', sbErr.message);
      }
    }

    // 2. Check local account store (handles accounts registered during rate limits or without email confirmation)
    const local = findLocalAccount(normalizedEmail);
    if (local && verifyPassword(password, local.salt, local.hash)) {
      return NextResponse.json({
        success: true,
        user: {
          id: local.id,
          email: local.email,
          name: local.name
        }
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid email or password. Please check your credentials.'
    }, { status: 401 });

  } catch (err) {
    console.error('Signin handler error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
