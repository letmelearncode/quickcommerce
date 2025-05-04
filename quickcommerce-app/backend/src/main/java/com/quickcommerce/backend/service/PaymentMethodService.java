package com.quickcommerce.backend.service;

import com.quickcommerce.backend.dto.PaymentMethodDTO;
import com.quickcommerce.backend.model.User;
import java.util.List;

public interface PaymentMethodService {
    List<PaymentMethodDTO> getPaymentMethodsForUser(User user);
    PaymentMethodDTO addPaymentMethod(User user, PaymentMethodDTO paymentMethodDTO);
    void deletePaymentMethod(User user, Long paymentMethodId);
} 