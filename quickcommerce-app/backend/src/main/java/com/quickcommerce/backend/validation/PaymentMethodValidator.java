package com.quickcommerce.backend.validation;

import com.quickcommerce.backend.validation.ValidPaymentMethod;
import com.quickcommerce.backend.model.PaymentMethod;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.util.StringUtils;

public class PaymentMethodValidator implements ConstraintValidator<ValidPaymentMethod, PaymentMethod> {

    @Override
    public void initialize(ValidPaymentMethod constraintAnnotation) {
    }

    @Override
    public boolean isValid(PaymentMethod paymentMethod, ConstraintValidatorContext context) {
        if (paymentMethod == null) {
            return true; // Let @NotNull handle null PaymentMethod
        }

        PaymentMethod.PaymentType type = paymentMethod.getType();

        if (type == PaymentMethod.PaymentType.CREDIT_CARD || type == PaymentMethod.PaymentType.DEBIT_CARD) {
            // For card payments, require card details
            boolean isValid = !StringUtils.isEmpty(paymentMethod.getCardBrand()) &&
                              !StringUtils.isEmpty(paymentMethod.getLast4()) &&
                              !StringUtils.isEmpty(paymentMethod.getExpiryMonth()) &&
                              !StringUtils.isEmpty(paymentMethod.getExpiryYear()) &&
                              !StringUtils.isEmpty(paymentMethod.getPaymentMethodId()); // Assuming paymentMethodId is required for cards

            if (!isValid) {
                context.disableDefaultConstraintViolation();
                if (StringUtils.isEmpty(paymentMethod.getCardBrand())) addValidationError("Card brand is required for card payments", context);
                if (StringUtils.isEmpty(paymentMethod.getLast4())) addValidationError("Last 4 digits are required for card payments", context);
                if (StringUtils.isEmpty(paymentMethod.getExpiryMonth())) addValidationError("Expiry month is required for card payments", context);
                if (StringUtils.isEmpty(paymentMethod.getExpiryYear())) addValidationError("Expiry year is required for card payments", context);
                 if (StringUtils.isEmpty(paymentMethod.getPaymentMethodId())) addValidationError("Payment method ID is required for card payments", context);
            }
             return isValid;

        } else if (type == PaymentMethod.PaymentType.UPI) {
            // For UPI payments, require upiId
            boolean isValid = !StringUtils.isEmpty(paymentMethod.getUpiId());
            if (!isValid) {
                context.disableDefaultConstraintViolation();
                addValidationError("UPI ID is required for UPI payments", context);
            }
            return isValid;
        }
         // Add validation for other payment types as needed (e.g., NET_BANKING, WALLET, COD)

        return true; // Valid for other payment types or if type is null (handled by @NotNull)
    }

     private void addValidationError(String message, ConstraintValidatorContext context) {
        context.buildConstraintViolationWithTemplate(message)
               .addConstraintViolation();
    }
}
