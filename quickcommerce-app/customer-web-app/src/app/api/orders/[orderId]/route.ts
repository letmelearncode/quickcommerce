import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await context.params;
  const backendUrl = `http://localhost:8080/api/orders/${orderId}`;
  const cookie = request.headers.get('cookie');
  let authHeader = request.headers.get('authorization');

  // Extract authToken from cookie if present and not already in Authorization header
  if (!authHeader && cookie) {
    const match = cookie.match(/authToken=([^;]+)/);
    if (match) {
      authHeader = `Bearer ${match[1]}`;
    }
  }

  console.log('Forwarding headers:', {
    ...(cookie ? { cookie } : {}),
    ...(authHeader ? { authorization: authHeader } : {}),
  });

  try {
    const res = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { cookie } : {}),
        ...(authHeader ? { authorization: authHeader } : {}),
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order from backend' }, { status: 500 });
  }
} 