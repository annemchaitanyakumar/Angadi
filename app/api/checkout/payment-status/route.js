import { NextResponse } from 'next/server';

// In-memory registry of active UPI checkout payment intents
// Key: session payment ID -> { createdAt, amount, status, transactionId }
const activePaymentSessions = new Map();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || searchParams.get('ref') || 'default';
    const amount = parseFloat(searchParams.get('amount') || '0');
    const autoVerify = searchParams.get('verify') === 'true';

    const now = Date.now();
    let session = activePaymentSessions.get(id);

    if (!session) {
      session = {
        id,
        amount,
        createdAt: now,
        status: 'waiting',
        transactionId: null
      };
      activePaymentSessions.set(id, session);
    }

    // Clean up expired sessions (older than 30 minutes)
    if (activePaymentSessions.size > 200) {
      for (const [key, val] of activePaymentSessions.entries()) {
        if (now - val.createdAt > 30 * 60 * 1000) {
          activePaymentSessions.delete(key);
        }
      }
    }

    // Demo verification support: when ?verify=true is passed (e.g. clicking Place Order or Simulate)
    if (autoVerify && session.status !== 'paid') {
      session.status = 'paid';
      session.transactionId = `DEMO_UPI_${now}_${Math.floor(1000 + Math.random() * 9000)}`;
    }

    return NextResponse.json({
      success: true,
      id: session.id,
      status: session.status,
      transactionId: session.transactionId,
      amount: session.amount
    });

  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, status = 'paid', transactionId } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Session ID is required' }, { status: 400 });
    }

    const session = activePaymentSessions.get(id) || {
      id,
      createdAt: Date.now()
    };

    session.status = status;
    session.transactionId = transactionId || `UPI_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    activePaymentSessions.set(id, session);

    return NextResponse.json({
      success: true,
      id,
      status: session.status,
      transactionId: session.transactionId
    });

  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
