import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ authenticated: false });
    }

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ authenticated: false });
    }

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

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: fullName || user.email.split('@')[0]
      }
    });
  } catch (err) {
    return NextResponse.json({ authenticated: false });
  }
}
