package com.quickcommerce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDTO {
    
    private String fullName;
    
    private String street;
    
    private String city;
    
    private String state;
    
    private String zipCode;
    
    private String country;
    
    private String phone;
    
    private String apartment;
    
    private String additionalInfo;
    
    private Boolean isDefault;
} 