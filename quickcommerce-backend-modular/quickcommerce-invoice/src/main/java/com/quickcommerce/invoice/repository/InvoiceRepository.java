package com.quickcommerce.invoice.repository;

import com.quickcommerce.invoice.domain.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    
    List<Invoice> findByUserId(Long userId);
    
    List<Invoice> findByOrderId(Long orderId);
    
    List<Invoice> findByPaymentStatus(Invoice.PaymentStatus paymentStatus);
    
    List<Invoice> findByInvoiceStatus(Invoice.InvoiceStatus invoiceStatus);
    
    List<Invoice> findByDueDateBeforeAndPaymentStatus(
        LocalDateTime dueDate, 
        Invoice.PaymentStatus paymentStatus
    );
    
    List<Invoice> findByInvoiceDateBetween(
        LocalDateTime startDate, 
        LocalDateTime endDate
    );
} 