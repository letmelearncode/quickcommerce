package com.quickcommerce.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {
    
    @Valid
    @NotNull(message = "Shipping address is required")
    private AddressDTO shippingAddress;
    
    @Valid
    private AddressDTO billingAddress; // Optional if same as shipping
    
    private Boolean useShippingAddressForBilling = true;
    
    @NotBlank(message = "Payment method ID is required")
    private String paymentMethodId; // Stripe payment method ID
    
    private String notes;
    
    private String deliveryInstructions;
    
    private String promoCode; // Optional promo code
} 