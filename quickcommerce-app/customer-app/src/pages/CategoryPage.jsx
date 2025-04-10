import React, { useState, useEffect } from 'react';
import { getCategories } from '../services/productService'; // Import the service

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getCategories();
        setCategories(data || []); // Handle potential null/undefined response
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError(err.message || "Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Browse Categories</h1>

      {loading && <div>Loading categories...</div>}

      {error && <div className="text-red-500">Error: {error}</div>}

      {!loading && !error && (
        <ul>
          {categories.length > 0 ? (
            categories.map(category => (
              <li key={category.id} className="mb-2">
                {/* TODO: Link to category-specific page later */}
                <span className="text-blue-600 hover:underline cursor-pointer">{category.name}</span>
              </li>
            ))
          ) : (
            <p>No categories found.</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default CategoryPage; 