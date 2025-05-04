import { NextRequest, NextResponse } from 'next/server';

// Sample product data (in a real app, this would come from a database)
const products = [
  {
    id: 1,
    name: 'Organic Bananas',
    price: 1.99,
    image: 'https://via.placeholder.com/300x300.png?text=Organic+Bananas',
    description: 'Sweet and fresh organic bananas.',
    category: 'fruits',
    stock: 25
  },
  {
    id: 2,
    name: 'Fresh Milk',
    price: 2.49,
    image: 'https://via.placeholder.com/300x300.png?text=Fresh+Milk',
    description: 'Farm fresh whole milk.',
    category: 'dairy',
    stock: 30
  },
  {
    id: 3,
    name: 'Avocado',
    price: 3.99,
    image: 'https://via.placeholder.com/300x300.png?text=Avocado',
    description: 'Ripe and ready to eat avocados.',
    category: 'fruits',
    stock: 15
  },
  {
    id: 4,
    name: 'Whole Grain Bread',
    price: 2.99,
    image: 'https://via.placeholder.com/300x300.png?text=Whole+Grain+Bread',
    description: 'Freshly baked whole grain bread.',
    category: 'bakery',
    stock: 20
  },
  {
    id: 5,
    name: 'Free Range Eggs',
    price: 4.49,
    image: 'https://via.placeholder.com/300x300.png?text=Free+Range+Eggs',
    description: 'Farm fresh free-range eggs.',
    category: 'dairy',
    stock: 24
  },
  {
    id: 6,
    name: 'Bottled Water',
    price: 0.99,
    image: 'https://via.placeholder.com/300x300.png?text=Bottled+Water',
    description: 'Pure natural spring water.',
    category: 'beverages',
    stock: 50
  },
  {
    id: 7,
    name: 'Organic Apples',
    price: 3.49,
    image: 'https://via.placeholder.com/300x300.png?text=Organic+Apples',
    description: 'Sweet and crisp organic apples.',
    category: 'fruits',
    stock: 35
  },
  {
    id: 8,
    name: 'Sliced Cheese',
    price: 3.99,
    image: 'https://via.placeholder.com/300x300.png?text=Sliced+Cheese',
    description: 'Delicious sliced cheese for sandwiches.',
    category: 'dairy',
    stock: 18
  },
  {
    id: 9,
    name: 'Tomatoes',
    price: 2.29,
    image: 'https://via.placeholder.com/300x300.png?text=Tomatoes',
    description: 'Vine-ripened fresh tomatoes.',
    category: 'vegetables',
    stock: 40
  },
  {
    id: 10,
    name: 'Chocolate Cookies',
    price: 3.79,
    image: 'https://via.placeholder.com/300x300.png?text=Chocolate+Cookies',
    description: 'Freshly baked chocolate chip cookies.',
    category: 'bakery',
    stock: 15
  },
  {
    id: 11,
    name: 'Orange Juice',
    price: 3.29,
    image: 'https://via.placeholder.com/300x300.png?text=Orange+Juice',
    description: 'Freshly squeezed orange juice.',
    category: 'beverages',
    stock: 22
  },
  {
    id: 12,
    name: 'Carrots',
    price: 1.49,
    image: 'https://via.placeholder.com/300x300.png?text=Carrots',
    description: 'Fresh organic carrots.',
    category: 'vegetables',
    stock: 30
  }
];

export async function GET(request: NextRequest) {
  // Extract query parameters
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
  const sortBy = searchParams.get('sortBy');
  const searchQuery = searchParams.get('query');
  
  // Apply filters to products
  let filteredProducts = [...products];
  
  // Filter by category
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }
  
  // Filter by price range
  if (minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product => product.price >= minPrice);
  }
  
  if (maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
  }
  
  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }
  
  // Sort the products
  if (sortBy) {
    switch (sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      // Default sorting is by id
    }
  }
  
  // Get all available categories
  const categories = ['all', ...new Set(products.map(product => product.category))];
  
  // Return the filtered products and metadata
  return NextResponse.json({
    products: filteredProducts,
    total: products.length,
    filtered: filteredProducts.length,
    categories: categories
  });
} 