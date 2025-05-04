package com.quickcommerce.backend.controller;

import com.quickcommerce.backend.dto.ProductDTO;
import com.quickcommerce.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend dev server
public class ProductController {

    @Autowired
    private ProductService productService;

    // Get all active products (paginated) or filter by category
    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getActiveProducts(
            @RequestParam(required = false) Long categoryId,
            @PageableDefault(size = 20, sort = "name") Pageable pageable) { // Default size 20, sort by name
        
        Page<ProductDTO> products;
        if (categoryId != null) {
            products = productService.getActiveProductsByCategory(categoryId, pageable);
        } else {
            products = productService.getAllActiveProducts(pageable);
        }
        return ResponseEntity.ok(products);
    }

    // Get a single product by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    // Search for active products by name or description (paginated), optionally filter by category
    @GetMapping("/search")
    public ResponseEntity<Page<ProductDTO>> searchProducts(
            @RequestParam("q") String query,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @PageableDefault(size = 20, sort = "name") Pageable pageable) {
        
        Page<ProductDTO> products = productService.searchProducts(query, categoryId, minPrice, maxPrice, pageable);
        return ResponseEntity.ok(products);
    }

    // Get product name suggestions based on query fragment
    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSuggestions(
            @RequestParam("q") String queryFragment) {
        List<String> suggestions = productService.getProductSuggestions(queryFragment);
        return ResponseEntity.ok(suggestions);
    }

    // Add POST/PUT/DELETE later for admin actions
} 