package com.quickcommerce.backend.controller;

import com.quickcommerce.backend.dto.AddressDTO;
import com.quickcommerce.backend.service.AddressService;
import com.quickcommerce.backend.security.CurrentUser;
import com.quickcommerce.backend.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class AddressController {

    private final AddressService addressService;

    @Operation(summary = "Save a new address", description = "Creates a new address for the authenticated user")
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressDTO> saveAddress(
            @CurrentUser User user,
            @Valid @RequestBody AddressDTO addressDTO) {
        return ResponseEntity.status(201).body(addressService.saveAddress(user, addressDTO));
    }

    @Operation(summary = "Get all addresses", description = "Retrieves all addresses for the authenticated user")
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AddressDTO>> getAllAddresses(@CurrentUser User user) {
        return ResponseEntity.ok(addressService.getAllAddresses(user));
    }

    @Operation(summary = "Update an address", description = "Updates an existing address for the authenticated user")
    @PutMapping("/{addressId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressDTO> updateAddress(
            @CurrentUser User user,
            @PathVariable Long addressId,
            @Valid @RequestBody AddressDTO addressDTO) {
        return ResponseEntity.ok(addressService.updateAddress(user, addressId, addressDTO));
    }

    @Operation(summary = "Delete an address", description = "Deletes an address for the authenticated user")
    @DeleteMapping("/{addressId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteAddress(
            @CurrentUser User user,
            @PathVariable Long addressId) {
        addressService.deleteAddress(user, addressId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Set default address", description = "Sets an address as default for the authenticated user")
    @PutMapping("/{addressId}/default")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressDTO> setDefaultAddress(
            @CurrentUser User user,
            @PathVariable Long addressId) {
        return ResponseEntity.ok(addressService.setDefaultAddress(user, addressId));
    }
} 