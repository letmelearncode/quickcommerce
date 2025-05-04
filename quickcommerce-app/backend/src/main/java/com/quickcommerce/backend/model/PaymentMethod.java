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
    
    @Column(name = "upi_id")
    private String upiId;
    
    @Column(name = "bank_name")
    private String bankName;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Define the payment types
    public enum PaymentType {
        CREDIT_CARD,
        DEBIT_CARD,
        UPI,
        NET_BANKING,
        WALLET,
        COD
    }
} 