package com.quickcommerce.backend.controller;

import com.quickcommerce.backend.dto.PaymentMethodDTO;
import com.quickcommerce.backend.model.User;
import com.quickcommerce.backend.security.CurrentUser;
import com.quickcommerce.backend.service.PaymentMethodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    // List all payment methods for the current user
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PaymentMethodDTO>> getPaymentMethods(@CurrentUser User user) {
        return ResponseEntity.ok(paymentMethodService.getPaymentMethodsForUser(user));
    }

    // Add a new payment method for the current user
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentMethodDTO> addPaymentMethod(
            @CurrentUser User user,
            @Valid @RequestBody PaymentMethodDTO paymentMethodDTO) {
        return ResponseEntity.status(201).body(paymentMethodService.addPaymentMethod(user, paymentMethodDTO));
    }

    // Delete a payment method for the current user
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deletePaymentMethod(
            @CurrentUser User user,
            @PathVariable Long id) {
        paymentMethodService.deletePaymentMethod(user, id);
        return ResponseEntity.noContent().build();
    }
} 