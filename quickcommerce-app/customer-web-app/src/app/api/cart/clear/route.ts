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

// DELETE to clear cart
export async function DELETE(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_API_URL}`, {
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