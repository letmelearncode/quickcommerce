package com.quickcommerce.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, unique = true)
    private String name;

    @Size(max = 255)
    private String description;

    // If supporting subcategories later:
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "parent_id")
    // private Category parent;
    // 
    // @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<Category> children;

    // Bi-directional relationship (optional, but can be useful)
    // If added, make sure to handle potential infinite recursion in toString/JSON serialization
    // @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // private List<Product> products;

    public Category(String name, String description) {
        this.name = name;
        this.description = description;
    }
} 