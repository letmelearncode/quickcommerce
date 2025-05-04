import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = 'http://localhost:8080/api/addresses';

// Helper to forward headers including auth token
const forwardHeaders = (request: NextRequest) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const authToken = request.cookies.get('authToken')?.value;
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(BACKEND_API_URL, {
      method: 'GET',
      headers: forwardHeaders(request),
      credentials: 'include',
    });
    const data = await response.json();
    // If backend returns an array, wrap it in { addresses: [...] }
    if (Array.isArray(data)) {
      return NextResponse.json({ addresses: data }, { status: response.status });
    }
    // If backend returns an object, pass as is
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: forwardHeaders(request),
      body,
      credentials: 'include',
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save address' }, { status: 500 });
  }
} 