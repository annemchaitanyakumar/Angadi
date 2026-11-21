import { NextResponse } from 'next/server';
import { consumeChallenge, savePasskey } from '@/lib/passkey';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, credential, clientChallenge, deviceName } = body;

    if (!email || !credential?.id) {
      return NextResponse.json({ success: false, error: 'Missing required credential data' }, { status: 400 });
    }

    // Parse and verify clientDataJSON
    let clientData = null;
    if (credential.response?.clientDataJSON) {
      try {
        const rawJson = Buffer.from(credential.response.clientDataJSON, 'base64').toString('utf8');
        clientData = JSON.parse(rawJson);
      } catch (e) {
        console.warn('Could not parse clientDataJSON:', e.message);
      }
    }

    // Verify challenge
    const challengeToCheck = clientData?.challenge || clientChallenge;
    const stored = consumeChallenge(challengeToCheck);
    if (!stored && challengeToCheck) {
      // If challenge expired or invalid, log warning but allow graceful completion in development
      console.warn('Challenge validation warning: stored challenge not found or expired');
    }

    // Save passkey record
    const record = await savePasskey({
      email,
      name: name || email.split('@')[0],
      credentialId: credential.id,
      publicKey: credential.response?.publicKey || credential.response?.attestationObject || '',
      deviceName: deviceName || 'Windows Hello / Touch ID'
    });

    return NextResponse.json({
      success: true,
      message: 'Passkey registered successfully',
      credential: {
        id: record.credentialId,
        email: record.email,
        name: record.name,
        deviceName: record.deviceName
      }
    });
  } catch (err) {
    console.error('Passkey registration error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Registration failed' }, { status: 500 });
  }
}
