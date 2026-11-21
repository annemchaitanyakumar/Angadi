import { NextResponse } from 'next/server';
import { getPasskeys } from '@/lib/passkey';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const passkeys = await getPasskeys(email);

    // Return credential descriptors safe for browser allowCredentials
    const credentials = passkeys.map(k => ({
      id: k.credentialId,
      type: 'public-key',
      transports: ['internal', 'hybrid', 'usb', 'nfc', 'ble'],
      deviceName: k.deviceName,
      createdAt: k.createdAt
    }));

    return NextResponse.json({
      success: true,
      credentials
    });
  } catch (err) {
    console.error('Fetch credentials error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
