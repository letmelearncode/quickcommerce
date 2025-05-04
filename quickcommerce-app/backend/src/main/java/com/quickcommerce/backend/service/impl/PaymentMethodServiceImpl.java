package com.quickcommerce.backend.service.impl;

import com.quickcommerce.backend.dto.PaymentMethodDTO;
import com.quickcommerce.backend.model.PaymentMethod;
import com.quickcommerce.backend.model.User;
import com.quickcommerce.backend.repository.PaymentMethodRepository;
import com.quickcommerce.backend.service.PaymentMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentMethodServiceImpl implements PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PaymentMethodDTO> getPaymentMethodsForUser(User user) {
        return paymentMethodRepository.findAll().stream()
                .filter(pm -> pm.getUser() != null && pm.getUser().getId().equals(user.getId()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PaymentMethodDTO addPaymentMethod(User user, PaymentMethodDTO dto) {
        PaymentMethod pm = new PaymentMethod();
        pm.setUser(user);
        pm.setType(dto.getType());
        pm.setCardBrand(dto.getCardBrand());
        pm.setLast4(dto.getLast4());
        pm.setExpiryMonth(dto.getExpiryMonth());
        pm.setExpiryYear(dto.getExpiryYear());
        pm.setPaymentMethodId(dto.getPaymentMethodId());
        pm.setUpiId(dto.getUpiId());
        pm.setBankName(dto.getBankName());
        PaymentMethod saved = paymentMethodRepository.save(pm);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public void deletePaymentMethod(User user, Long paymentMethodId) {
        PaymentMethod pm = paymentMethodRepository.findById(paymentMethodId)
                .orElseThrow(() -> new IllegalArgumentException("Payment method not found"));
        if (pm.getUser() == null || !pm.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Not authorized to delete this payment method");
        }
        paymentMethodRepository.delete(pm);
    }

    private PaymentMethodDTO mapToDTO(PaymentMethod pm) {
        return PaymentMethodDTO.builder()
                .type(pm.getType())
                .cardBrand(pm.getCardBrand())
                .last4(pm.getLast4())
                .expiryMonth(pm.getExpiryMonth())
                .expiryYear(pm.getExpiryYear())
                .paymentMethodId(pm.getPaymentMethodId())
                .upiId(pm.getUpiId())
                .bankName(pm.getBankName())
                .build();
    }
} 