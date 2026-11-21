import { NextResponse } from 'next/server';
import { getStoreSettings, updateStoreSettings } from '@/lib/settings';

export async function GET() {
  try {
    const settings = getStoreSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const updated = updateStoreSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
