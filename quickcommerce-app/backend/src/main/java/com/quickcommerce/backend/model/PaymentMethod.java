package com.quickcommerce.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class PaymentMethod {
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentType type;
    
    // For credit card payments
    private String cardBrand; // Visa, Mastercard, etc.
    
    private String last4; // Last 4 digits of card
    
    private String expiryMonth;
    
    private String expiryYear;
    
    // For stored payment methods in Stripe
    private String paymentMethodId; // Stripe payment method ID
    
    // Define the payment types
    public enum PaymentType {
        CREDIT_CARD,
        PAYPAL,
        APPLE_PAY,
        GOOGLE_PAY,
        OTHER
    }
} 