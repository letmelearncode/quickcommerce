import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getReviewsForProduct } from '../services/productService'; // Import review service
import { useCart } from '../context/CartContext'; // Import useCart hook

// Component to display a single review
function ReviewItem({ review }) {
    return (
        <div className="border-b border-gray-200 py-4">
            <div className="flex items-center mb-1">
                <span className="font-semibold mr-2">{review.userName || 'Anonymous'}</span>
                <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
            </div>
            <p className="text-gray-600 text-sm mb-1">{new Date(review.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-800">{review.comment}</p>
        </div>
    );
}

function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]); // State for reviews
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true); // Separate loading for reviews
  const [productError, setProductError] = useState('');
  const [reviewsError, setReviewsError] = useState(''); // Separate error for reviews
  const { addToCart } = useCart(); // Get addToCart function from context

  // Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setLoadingProduct(true);
      setProductError('');
      try {
        const data = await getProductById(productId);
        setProduct(data);
        if (!data) throw new Error('Product not found');
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setProductError(err.message || "Failed to load product details.");
        setProduct(null);
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Fetch Reviews Data
  useEffect(() => {
    const fetchReviews = async () => {
        if (!productId) return;
        setLoadingReviews(true);
        setReviewsError('');
        try {
            console.log(`Fetching reviews for product ID: ${productId}`);
            const data = await getReviewsForProduct(productId);
            setReviews(data || []);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
            setReviewsError(err.message || "Failed to load reviews.");
            setReviews([]);
        } finally {
            setLoadingReviews(false);
        }
    };
    fetchReviews();
  }, [productId]); // Also depends on productId

  const handleAddToCart = () => {
      if (product) {
          addToCart(product, 1); // Add 1 quantity of the current product
          // Optional: Add user feedback (e.g., toast notification)
          console.log(`${product.name} added to cart`);
      }
  };

  if (loadingProduct) {
    return <div className="container mx-auto p-4 text-center">Loading product details...</div>;
  }

  if (productError) {
    return <div className="container mx-auto p-4 text-center text-red-500">Error: {productError}</div>;
  }

  if (!product) {
    return <div className="container mx-auto p-4 text-center">Product not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="md:flex mb-8">
        {/* Product Image */}
        <div className="md:w-1/2 p-4">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-auto object-cover rounded shadow-md"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded shadow-md text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 p-4">
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.category?.name}</p>
          <p className="text-xl text-green-700 font-semibold mb-4">${product.price?.toFixed(2)}</p>
          <div className="mb-4">
            {product.stockQuantity > 0 ? (
              <span className="text-green-600">In Stock ({product.stockQuantity} available)</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
          <p className="text-gray-800 mb-6">{product.description}</p>
          <button 
            className={`w-full py-2 px-4 rounded font-bold text-white ${product.stockQuantity > 0 ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
            disabled={product.stockQuantity <= 0}
            onClick={handleAddToCart}
          >
            {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Product Reviews</h2>
        {loadingReviews && <p>Loading reviews...</p>}
        {reviewsError && <p className="text-red-500">Error loading reviews: {reviewsError}</p>}
        {!loadingReviews && !reviewsError && (
            reviews.length > 0 ? (
                reviews.map(review => <ReviewItem key={review.id} review={review} />)
            ) : (
                <p>No reviews yet for this product.</p>
            )
        )}
      </div>

    </div>
  );
}

export default ProductDetailPage; 