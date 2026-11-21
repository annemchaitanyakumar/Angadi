import { NextResponse } from 'next/server';
import { generateChallenge, storeChallenge } from '@/lib/passkey';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const challenge = generateChallenge();
    const host = request.headers.get('host') || 'localhost:3000';
    const hostname = host.split(':')[0]; // e.g. 'localhost' or 'angadi.store'

    storeChallenge(challenge, {
      email: body.email ? body.email.toLowerCase().trim() : null,
      mode: body.mode || 'login',
      hostname
    });

    return NextResponse.json({
      success: true,
      challenge,
      rp: {
        name: 'ANGADI Outdoor',
        id: hostname
      }
    });
  } catch (err) {
    console.error('Challenge generation error:', err);
    return NextResponse.json({ success: false, error: 'Failed to create challenge' }, { status: 500 });
  }
}
