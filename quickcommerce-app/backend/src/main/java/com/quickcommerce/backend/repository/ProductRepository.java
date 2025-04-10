package com.quickcommerce.backend.repository;

import com.quickcommerce.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    // Find active products only, with pagination
    Page<Product> findByActiveTrue(Pageable pageable);

    // Find active products by category, with pagination
    Page<Product> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);

    // JpaSpecificationExecutor allows for dynamic query building (for search/filters)
} 