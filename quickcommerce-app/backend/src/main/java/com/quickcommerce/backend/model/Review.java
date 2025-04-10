package com.quickcommerce.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_reviews") // Use a specific table name
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = {"product", "user"}) // Avoid circular references in toString
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private Integer rating; // Rating out of 5

    @Column(columnDefinition = "TEXT")
    private String comment;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY) // Many reviews belong to one product
    @JoinColumn(name = "product_id", nullable = false) // Foreign key to Product
    private Product product;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY) // Many reviews belong to one user
    @JoinColumn(name = "user_id", nullable = false) // Foreign key to User
    private User user;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Constructors can be added if needed, Lombok provides @NoArgsConstructor
} 