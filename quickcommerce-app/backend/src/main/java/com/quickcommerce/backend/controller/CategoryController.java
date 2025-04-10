package com.quickcommerce.backend.controller;

import com.quickcommerce.backend.dto.CategoryDTO;
import com.quickcommerce.backend.model.Category;
import com.quickcommerce.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend dev server
public class CategoryController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<CategoryDTO> categories = productService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        CategoryDTO category = productService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    // Add POST/PUT/DELETE later for admin actions
} 