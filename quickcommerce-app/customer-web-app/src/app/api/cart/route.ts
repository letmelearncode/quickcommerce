import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = 'http://localhost:8080/api/cart';

// Helper function to forward headers
const forwardHeaders = (request: NextRequest) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  
  // Forward auth token if present
  const authToken = request.cookies.get('authToken')?.value;
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};

// GET cart
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(BACKEND_API_URL, {
      method: 'GET',
      headers: forwardHeaders(request),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch cart', details: data },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Internal server error fetching cart' },
      { status: 500 }
    );
  }
}

// POST to add item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_API_URL}/items`, {
      method: 'POST',
      headers: forwardHeaders(request),
      body: JSON.stringify(body),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to add item to cart', details: data },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { error: 'Internal server error adding item to cart' },
      { status: 500 }
    );
  }
}

// DELETE to clear cart
export async function DELETE(request: NextRequest) {
  try {
    const response = await fetch(BACKEND_API_URL, {
      method: 'DELETE',
      headers: forwardHeaders(request),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to clear cart', details: data },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Internal server error clearing cart' },
      { status: 500 }
    );
  }
} 