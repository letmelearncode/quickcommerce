import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  const backendUrl = 'http://localhost:8080/api/orders';
  const cookie = request.headers.get('cookie');
  let authHeader = request.headers.get('authorization');

  // Extract authToken from cookie if present and not already in Authorization header
  if (!authHeader && cookie) {
    const match = cookie.match(/authToken=([^;]+)/);
    if (match) {
      authHeader = `Bearer ${match[1]}`;
    }
  }

  // Optional: log headers for debugging
  console.log('Forwarding headers:', {
    ...(cookie ? { cookie } : {}),
    ...(authHeader ? { authorization: authHeader } : {}),
  });

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
    return NextResponse.json({ error: 'Failed to fetch orders from backend' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const backendUrl = 'http://localhost:8080/api/orders';
  const cookie = request.headers.get('cookie');
  let authHeader = request.headers.get('authorization');

  // Extract authToken from cookie if present and not already in Authorization header
  if (!authHeader && cookie) {
    const match = cookie.match(/authToken=([^;]+)/);
    if (match) {
      authHeader = `Bearer ${match[1]}`;
    }
  }

  try {
    const body = await request.text();
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { cookie } : {}),
        ...(authHeader ? { authorization: authHeader } : {}),
      },
      body,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order in backend' }, { status: 500 });
  }
} 