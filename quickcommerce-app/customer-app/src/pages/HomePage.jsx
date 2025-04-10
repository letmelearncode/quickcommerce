import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // For linking to product details
import { getCategories, getProducts } from '../services/productService';
import styles from './HomePage.module.css'; // Import CSS Module

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch categories and products concurrently
        const [categoriesData, productsPage] = await Promise.all([
          getCategories(),
          getProducts({ page: 0, size: 10 }) // Fetch first 10 products for homepage
        ]);
        
        setCategories(categoriesData || []);
        setProducts(productsPage?.content || []); // Access content from Page object

      } catch (err) {
        console.error("Failed to load homepage data:", err);
        setError(err.message || "Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading QuickCommerce essentials...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className={styles.homePageContainer}>
      <h2>Welcome to QuickCommerce!</h2>
      <p>Browse our amazing selection of items for quick delivery.</p>

      {/* Display Categories */}
      <section className={styles.section}>
        <h3>Categories</h3>
        {categories.length > 0 ? (
          <ul className={styles.categoryList}>
            {categories.map(category => (
              <li key={category.id}>
                {/* Link to a category page later */} 
                {/* <Link to={`/category/${category.id}`}>{category.name}</Link> */} 
                 <span>{category.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No categories available right now.</p>
        )}
      </section>

      {/* Display Products */}
      <section className={styles.section}>
        <h3>Featured Products</h3>
        {products.length > 0 ? (
          <div className={styles.productList}>
            {products.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className={styles.productCard}>
                 {/* Content of the product card */} 
                {product.imageUrl && (
                   <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className={styles.productImage} 
                      onError={(e) => { e.target.style.display = 'none'; }} // Hide if image fails to load
                  />
                )}
                <h4>{product.name}</h4>
                <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p>No products available right now.</p>
        )}
      </section>
    </div>
  );
}

export default HomePage; 