import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    return NextResponse.json({ success: true, message: 'Signed out successfully' });
  } catch (err) {
    console.error('Signout handler error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
