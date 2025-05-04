package com.quickcommerce.backend.service;

import com.quickcommerce.backend.dto.AddressDTO;
import com.quickcommerce.backend.model.User;

import java.util.List;

public interface AddressService {
    
    /**
     * Save a new address for a user
     */
    AddressDTO saveAddress(User user, AddressDTO addressDTO);
    
    /**
     * Get all addresses for a user
     */
    List<AddressDTO> getAllAddresses(User user);
    
    /**
     * Update an existing address
     */
    AddressDTO updateAddress(User user, Long addressId, AddressDTO addressDTO);
    
    /**
     * Delete an address
     */
    void deleteAddress(User user, Long addressId);
    
    /**
     * Set an address as default for a user
     */
    AddressDTO setDefaultAddress(User user, Long addressId);
} 