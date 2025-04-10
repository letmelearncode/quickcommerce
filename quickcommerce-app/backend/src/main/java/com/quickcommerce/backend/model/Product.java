package com.quickcommerce.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = {"category"})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Digits(integer=8, fraction=2) // Example: Max 99,999,999.99
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Min(0)
    @Column(nullable = false, name = "stock_quantity")
    private int stockQuantity = 0;

    @Size(max = 255)
    @Column(name = "image_url")
    private String imageUrl; // URL to the product image

    @ManyToOne(fetch = FetchType.LAZY) // Many products belong to one category
    @JoinColumn(name = "category_id") // Foreign key column
    private Category category;

    @Column(nullable = false)
    private boolean active = true; // To control visibility

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Add nutritional info, brand, etc. as needed based on PRD

    // REMOVED custom constructor to ensure default behavior
    // public Product(String name, String description, BigDecimal price, int stockQuantity, Category category) {
    //     this.name = name;
    //     this.description = description;
    //     this.price = price;
    //     this.stockQuantity = stockQuantity;
    //     this.category = category;
    // }
} 