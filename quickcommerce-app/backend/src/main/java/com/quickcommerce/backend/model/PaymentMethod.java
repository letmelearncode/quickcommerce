package com.quickcommerce.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "payment_methods")
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentType type;
    
    @Column(name = "card_brand")
    private String cardBrand;
    
    @Column(name = "last_4")
    private String last4;
    
    @Column(name = "expiry_month")
    private String expiryMonth;
    
    @Column(name = "expiry_year")
    private String expiryYear;
    
    @Column(name = "payment_method_id")
    private String paymentMethodId;
    
    // Define the payment types
    public enum PaymentType {
        CREDIT_CARD,
        PAYPAL,
        APPLE_PAY,
        GOOGLE_PAY,
        OTHER
    }
} 