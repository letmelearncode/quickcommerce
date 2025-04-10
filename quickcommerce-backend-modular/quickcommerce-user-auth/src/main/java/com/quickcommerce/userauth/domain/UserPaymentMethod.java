package com.quickcommerce.userauth.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user_payment_methods")
public class UserPaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String paymentType; // CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING

    @Column(nullable = false)
    private String paymentMethodToken; // Encrypted token from payment gateway

    private String lastFourDigits; // For cards

    private String cardType; // VISA, MASTERCARD, etc.

    private String bankName;

    private String upiId;

    private boolean isDefault;

    @Column(nullable = false)
    private boolean isActive = true;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 