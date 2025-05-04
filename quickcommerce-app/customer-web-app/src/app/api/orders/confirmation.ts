import { NextRequest, NextResponse } from 'next/server';

// Simulate fetching order confirmation (in a real app, this would query a database)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const orderId = searchParams.get('orderId');
    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }
    // Simulate order details (could be expanded as needed)
    const confirmation = {
      orderId,
      status: 'success',
      message: 'Order confirmed',
      createdAt: new Date().toISOString(),
      // order: { ... } // Optionally add mock order details here
    };
    return NextResponse.json(confirmation, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order confirmation' }, { status: 500 });
  }
} 