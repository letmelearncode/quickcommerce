import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = 'http://localhost:8080/api/cart/items';

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

// PUT to update item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const itemId = params.itemId;
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_API_URL}/${itemId}`, {
      method: 'PUT',
      headers: forwardHeaders(request),
      body: JSON.stringify(body),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to update cart item', details: data },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Internal server error updating cart item' },
      { status: 500 }
    );
  }
}

// DELETE to remove item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const itemId = params.itemId;
    
    const response = await fetch(`${BACKEND_API_URL}/${itemId}`, {
      method: 'DELETE',
      headers: forwardHeaders(request),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to remove item from cart', details: data },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json(
      { error: 'Internal server error removing item from cart' },
      { status: 500 }
    );
  }
} 