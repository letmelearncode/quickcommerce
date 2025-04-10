package com.quickcommerce.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipping_address_id")
    private Address shippingAddress;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "billing_address_id")
    private Address billingAddress;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_method_id")
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal tax;

    @Column(name = "shipping_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal shippingCost;

    @Column(precision = 10, scale = 2)
    private BigDecimal discount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    private String notes;

    @Column(name = "delivery_instructions")
    private String deliveryInstructions;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @Column(name = "processed_date")
    private LocalDateTime processedDate;

    @Column(name = "shipped_date")
    private LocalDateTime shippedDate;

    @Column(name = "delivered_date")
    private LocalDateTime deliveredDate;

    @Column(name = "cancelled_date")
    private LocalDateTime cancelledDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_partner_id")
    private User deliveryPartner;

    @Column(name = "is_paid")
    private Boolean isPaid = false;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        lastUpdated = LocalDateTime.now();
    }

    public enum OrderStatus {
        PENDING,
        PROCESSING,
        IN_TRANSIT,
        DELIVERED,
        CANCELLED
    }

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }

    public void calculateTotal() {
        this.total = this.subtotal
                .add(this.tax)
                .add(this.shippingCost)
                .subtract(this.discount != null ? this.discount : BigDecimal.ZERO);
    }

    public void updateStatusTimestamp(OrderStatus newStatus) {
        this.status = newStatus;
        this.lastUpdated = LocalDateTime.now();

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
            default:
                break;
        }
    }
} 