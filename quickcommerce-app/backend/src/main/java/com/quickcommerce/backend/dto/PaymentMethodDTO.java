package com.quickcommerce.backend.dto;

import com.quickcommerce.backend.model.PaymentMethod.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentMethodDTO {
    
    private PaymentType type;
    
    private String cardBrand;
    
    private String last4;
    
    private String expiryMonth;
    
    private String expiryYear;
    
    private String paymentMethodId;
} 