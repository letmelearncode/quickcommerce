package com.quickcommerce.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Constraint(validatedBy = PaymentMethodValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPaymentMethod {
    String message() default "Invalid payment method details";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

