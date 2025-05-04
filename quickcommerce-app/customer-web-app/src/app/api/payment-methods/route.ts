import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const backendUrl = 'http://localhost:8080/api/payment-methods';
  const cookie = request.headers.get('cookie');
  let authHeader = request.headers.get('authorization');

  if (!authHeader && cookie) {
    const match = cookie.match(/authToken=([^;]+)/);
    if (match) {
      authHeader = `Bearer ${match[1]}`;
    }
  }

  try {
    const res = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { cookie } : {}),
        ...(authHeader ? { authorization: authHeader } : {}),
      },
      credentials: 'include',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 });
  }
}
