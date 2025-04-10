package com.quickcommerce.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String orderNumber;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;
    
    @Column(nullable = false)
    private BigDecimal subtotal;
    
    @Column(nullable = false)
    private BigDecimal tax;
    
    @Column(nullable = false)
    private BigDecimal shippingCost;
    
    @Column(nullable = false)
    private BigDecimal discount;
    
    @Column(nullable = false)
    private BigDecimal total;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
    
    @Embedded
    private Address shippingAddress;
    
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "street", column = @Column(name = "billing_street")),
        @AttributeOverride(name = "city", column = @Column(name = "billing_city")),
        @AttributeOverride(name = "state", column = @Column(name = "billing_state")),
        @AttributeOverride(name = "zipCode", column = @Column(name = "billing_zip_code")),
        @AttributeOverride(name = "country", column = @Column(name = "billing_country")),
        @AttributeOverride(name = "fullName", column = @Column(name = "billing_full_name")),
        @AttributeOverride(name = "phone", column = @Column(name = "billing_phone")),
        @AttributeOverride(name = "apartment", column = @Column(name = "billing_apartment")),
        @AttributeOverride(name = "additionalInfo", column = @Column(name = "billing_additional_info")),
        @AttributeOverride(name = "isDefault", column = @Column(name = "billing_is_default"))
    })
    private Address billingAddress;
    
    @Embedded
    private PaymentMethod paymentMethod;
    
    private String notes;
    
    private String deliveryInstructions;
    
    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime orderDate;
    
    @UpdateTimestamp
    private LocalDateTime lastUpdated;
    
    private LocalDateTime processedDate;
    
    private LocalDateTime shippedDate;
    
    private LocalDateTime deliveredDate;
    
    private LocalDateTime cancelledDate;
    
    @ManyToOne
    @JoinColumn(name = "delivery_partner_id")
    private User deliveryPartner;
    
    @Column(nullable = false)
    private Boolean isPaid = false;
    
    private String stripePaymentIntentId;
    
    // Helper methods
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
    
    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }
    
    // Recalculate total
    public void calculateTotal() {
        this.subtotal = items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calculate tax (assuming tax is applied to subtotal)
        // In a real app, you might have more complex tax rules
        this.total = this.subtotal
                .add(this.tax)
                .add(this.shippingCost)
                .subtract(this.discount);
    }
    
    // Set the appropriate timestamp based on status change
    public void updateStatusTimestamp(OrderStatus newStatus) {
        this.status = newStatus;
        
        switch (newStatus) {
            case PROCESSING:
                this.processedDate = LocalDateTime.now();
                break;
            case IN_TRANSIT:
                this.shippedDate = LocalDateTime.now();
                break;
            case DELIVERED:
                this.deliveredDate = LocalDateTime.now();
                break;
            case CANCELLED:
                this.cancelledDate = LocalDateTime.now();
                break;
        }
    }

    // Define OrderStatus enum
    public enum OrderStatus {
        PENDING,         // Order created but not yet processed
        PROCESSING,      // Order confirmed and being prepared
        IN_TRANSIT,      // Order has been shipped and is on the way
        DELIVERED,       // Order has been delivered to the customer
        CANCELLED        // Order has been cancelled
    }
} 