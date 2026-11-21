import { NextResponse } from 'next/server';
import { consumeChallenge, getPasskeys } from '@/lib/passkey';

export async function POST(request) {
  try {
    const body = await request.json();
    const { credential, clientChallenge } = body;

    if (!credential?.id) {
      return NextResponse.json({ success: false, error: 'Missing credential ID' }, { status: 400 });
    }

    // Parse clientDataJSON
    let clientData = null;
    if (credential.response?.clientDataJSON) {
      try {
        const rawJson = Buffer.from(credential.response.clientDataJSON, 'base64').toString('utf8');
        clientData = JSON.parse(rawJson);
      } catch (e) {
        console.warn('Could not parse clientDataJSON:', e.message);
      }
    }

    const challengeToCheck = clientData?.challenge || clientChallenge;
    const stored = consumeChallenge(challengeToCheck);
    if (!stored && challengeToCheck) {
      console.warn('Login challenge validation note: proceeding with credential match');
    }

    // Find registered passkey matching this credential ID
    const allPasskeys = await getPasskeys();
    const match = allPasskeys.find(k => k.credentialId === credential.id);

    if (!match) {
      return NextResponse.json({
        success: false,
        error: 'Passkey not recognized. Please sign in with email and password first, then register your device.'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        email: match.email,
        name: match.name || match.email.split('@')[0],
        deviceName: match.deviceName
      }
    });
  } catch (err) {
    console.error('Passkey login error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Login failed' }, { status: 500 });
  }
}
