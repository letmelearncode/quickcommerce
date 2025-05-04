import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative h-48 w-full overflow-hidden bg-gray-200">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">
            {product.name}
          </h3>
          <p className="mt-1 text-gray-500 text-xs line-clamp-2">
            {product.description}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-900">
              ${product.price.toFixed(2)}
            </p>
            <span className="text-xs text-gray-500">{product.category}</span>
          </div>
        </div>
      </Link>
      <div className="absolute bottom-4 right-4">
        <button 
          className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={(e) => {
            e.preventDefault();
            // Add to cart functionality would go here
            console.log(`Added ${product.name} to cart`);
          }}
        >
          <ShoppingCartIcon className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Add to cart</span>
        </button>
      </div>
    </div>
  );
} 