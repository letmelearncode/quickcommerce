package com.quickcommerce.backend.service;

import com.quickcommerce.backend.dto.CategoryDTO;
import com.quickcommerce.backend.dto.ProductDTO;
import com.quickcommerce.backend.exception.ResourceNotFoundException;
import com.quickcommerce.backend.model.Category;
import com.quickcommerce.backend.model.Product;
import com.quickcommerce.backend.repository.CategoryRepository;
import com.quickcommerce.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Needed for lazy loading within method
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Predicate; // Ensure correct import
import jakarta.persistence.criteria.Join;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // --- Helper Mapper Methods ---
    private CategoryDTO mapToCategoryDTO(Category category) {
        if (category == null) return null;
        return new CategoryDTO(category.getId(), category.getName());
    }

    private ProductDTO mapToProductDTO(Product product) {
        if (product == null) return null;
        // Accessing product.getCategory() triggers lazy loading if not already loaded
        CategoryDTO categoryDTO = mapToCategoryDTO(product.getCategory()); 
        return new ProductDTO(
            product.getId(),
            product.getName(),
            product.getDescription(), // If description is lazy, it loads here
            product.getPrice(),
            product.getStockQuantity(),
            product.getImageUrl(),
            categoryDTO,
            product.isActive()
        );
    }

    // --- Category Methods ---
    @Transactional(readOnly = true) // Ensure session stays open for potential lazy loading
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapToCategoryDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDTO getCategoryById(Long id) {
         Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return mapToCategoryDTO(category);
    }
    
    // Add create/update/delete category methods later (likely for admin)

    // --- Product Methods ---
    @Transactional(readOnly = true) // Ensure session stays open for lazy loading category
    public Page<ProductDTO> getAllActiveProducts(Pageable pageable) {
        Page<Product> productPage = productRepository.findByActiveTrue(pageable);
        return productPage.map(this::mapToProductDTO);
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getActiveProductsByCategory(Long categoryId, Pageable pageable) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category", "id", categoryId);
        }
        Page<Product> productPage = productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable);
        return productPage.map(this::mapToProductDTO);
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        // Optional: Check if product is active before returning?
        // if (!product.isActive()) { ... }
        return mapToProductDTO(product);
    }

    // --- Search Method ---
    @Transactional(readOnly = true)
    public Page<ProductDTO> searchProducts(String query, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        if (!StringUtils.hasText(query)) {
            return Page.empty(pageable);
        }

        Specification<Product> spec = (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Active products
            predicates.add(cb.isTrue(root.get("active")));

            // 2. Search query
            if (StringUtils.hasText(query)) {
                String queryString = "%" + query.toLowerCase() + "%";
                Predicate namePredicate = cb.like(cb.lower(root.get("name")), queryString);
                Predicate descriptionPredicate = cb.like(cb.lower(root.get("description")), queryString);
                predicates.add(cb.or(namePredicate, descriptionPredicate));
            }
            
            // 3. Category filter
            if (categoryId != null) {
                Join<Product, Category> categoryJoin = root.join("category"); 
                predicates.add(cb.equal(categoryJoin.get("id"), categoryId));
            }

            // 4. Price range filter
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            // Combine predicates with AND
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Product> productPage = productRepository.findAll(spec, pageable);
        return productPage.map(this::mapToProductDTO);
    }

    // --- Suggestion Method ---
    @Transactional(readOnly = true)
    public List<String> getProductSuggestions(String queryFragment) {
        // Don't return suggestions for very short fragments or empty strings
        if (!StringUtils.hasText(queryFragment) || queryFragment.length() < 2) { 
            return List.of(); // Return empty list
        }

        // Limit the number of suggestions
        Pageable limit = Pageable.ofSize(10); 

        Specification<Product> spec = (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("active"))); // Only suggest active products
            // Match product names containing the query fragment (case-insensitive)
            String pattern = "%" + queryFragment.toLowerCase() + "%";
            predicates.add(cb.like(cb.lower(root.get("name")), pattern));
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // Fetch products matching the spec with the limit
        Page<Product> suggestionPage = productRepository.findAll(spec, limit);

        // Map to a list of product names
        return suggestionPage.getContent().stream()
                             .map(Product::getName)
                             .collect(Collectors.toList());
    }

    // Add create/update/delete product methods later (likely for admin)
} 