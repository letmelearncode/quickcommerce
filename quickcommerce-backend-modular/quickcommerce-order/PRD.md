# Order Module PRD

## 1. Module Scope & Context

### 1.1 Core Responsibilities
- Cart management
- Order processing
- Order lifecycle management
- Order tracking
- Order history
- Order validation
- Cart to order conversion
- Multi-vendor order splitting
- Order fulfillment
- Order cancellation

### 1.2 Key Use Cases

#### A. Cart Management
- **Cart Operations**
  - Cart creation
  - Add to cart
  - Update quantities
  - Remove items
  - Cart merging
  - Cart expiry
  - Cart restoration
  - Guest cart handling
  - Cart validation
  - Price recalculation

- **Cart Features**
  - Multi-vendor support
  - Stock validation
  - Price validation
  - Promotion application
  - Tax calculation
  - Shipping estimation
  - Save for later
  - Wishlist integration
  - Cart notes
  - Bulk operations

#### B. Order Management
- **Order Creation**
  - Cart validation
  - Inventory check
  - Price finalization
  - Address validation
  - Payment initiation
  - Order splitting
  - Vendor assignment

- **Order Processing**
  - Status updates
  - Fulfillment tracking
  - Delivery scheduling
  - Payment tracking
  - Invoice generation
  - Notification triggers
  - SLA monitoring

#### C. Order Operations
- **Order Modifications**
  - Quantity updates
  - Address changes
  - Delivery changes
  - Cancellations
  - Returns initiation
  - Refund processing

- **Order Analytics**
  - Order metrics
  - Performance tracking
  - Vendor analytics
  - Customer insights
  - Delivery analytics
  - Financial reporting

### 1.3 Cart & Order Lifecycle

#### A. Cart Phase
1. **Cart Creation**
   - Guest/User identification
   - Session management
   - Cart initialization
   - Item addition
   - Price calculation
   - Promotion check

2. **Cart Management**
   - Item updates
   - Stock validation
   - Price updates
   - Cart merging
   - Session handling
   - Expiry management

3. **Pre-Order**
   - Cart validation
   - Stock confirmation
   - Price finalization
   - Address collection
   - Payment selection
   - Order preview

#### B. Order Phase
1. **Order Creation**
   - Cart conversion
   - Order number generation
   - Payment processing
   - Inventory allocation
   - Vendor notification
   - Customer notification

2. **Order Processing**
   - Status tracking
   - Fulfillment monitoring
   - Delivery coordination
   - Payment reconciliation
   - Document generation
   - SLA tracking

#### C. Post-Order Phase
1. **Order Completion**
   - Delivery confirmation
   - Payment completion
   - Feedback collection
   - Analytics update
   - Loyalty points
   - Review requests

2. **Order Support**
   - Returns handling
   - Refund processing
   - Issue resolution
   - Customer support
   - Vendor settlement
   - Documentation

## 2. Technical Architecture

### 2.1 Data Model
```sql
CREATE TABLE carts (
    id UUID PRIMARY KEY,
    user_id UUID,
    session_id VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    sub_total DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    item_count INTEGER NOT NULL,
    notes TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY,
    cart_id UUID NOT NULL,
    product_id UUID NOT NULL,
    vendor_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_cart FOREIGN KEY (cart_id) REFERENCES carts(id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

CREATE TABLE orders (
    id UUID PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL,
    cart_id UUID,
    status VARCHAR(50) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    sub_total DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    shipping_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    shipping_address_id UUID NOT NULL,
    billing_address_id UUID NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_cart FOREIGN KEY (cart_id) REFERENCES carts(id),
    CONSTRAINT fk_shipping_address FOREIGN KEY (shipping_address_id) REFERENCES addresses(id),
    CONSTRAINT fk_billing_address FOREIGN KEY (billing_address_id) REFERENCES addresses(id)
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    vendor_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

CREATE TABLE order_status_history (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_user FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE cart_promotions (
    id UUID PRIMARY KEY,
    cart_id UUID NOT NULL,
    promotion_id UUID NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_cart FOREIGN KEY (cart_id) REFERENCES carts(id),
    CONSTRAINT fk_promotion FOREIGN KEY (promotion_id) REFERENCES promotions(id)
);

CREATE INDEX idx_carts_user ON carts(user_id);
CREATE INDEX idx_carts_session ON carts(session_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_cart ON orders(cart_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_order_status_history_order ON order_status_history(order_id);
```

### 2.2 API Endpoints

#### Cart Management
```
POST /api/v1/carts
    Request:
    {
        "userId": "uuid",
        "sessionId": "string",
        "currency": "string"
    }

POST /api/v1/carts/{id}/items
    Request:
    {
        "productId": "uuid",
        "quantity": integer,
        "notes": "string"
    }

PUT /api/v1/carts/{id}/items/{itemId}
    Request:
    {
        "quantity": integer,
        "notes": "string"
    }

DELETE /api/v1/carts/{id}/items/{itemId}

GET /api/v1/carts/{id}
    Response:
    {
        "id": "uuid",
        "status": "string",
        "currency": "string",
        "subTotal": number,
        "taxAmount": number,
        "totalAmount": number,
        "itemCount": integer,
        "items": [{
            "productId": "uuid",
            "quantity": integer,
            "unitPrice": number,
            "totalAmount": number
        }],
        "promotions": [{
            "id": "uuid",
            "discountAmount": number
        }]
    }
```

#### Order Management
```
POST /api/v1/orders
    Request:
    {
        "cartId": "uuid",
        "shippingAddressId": "uuid",
        "billingAddressId": "uuid",
        "notes": "string"
    }

GET /api/v1/orders/{id}
    Response:
    {
        "id": "uuid",
        "orderNumber": "string",
        "status": "string",
        "currency": "string",
        "subTotal": number,
        "taxAmount": number,
        "shippingAmount": number,
        "totalAmount": number,
        "paymentStatus": "string",
        "items": [{
            "productId": "uuid",
            "quantity": integer,
            "unitPrice": number,
            "totalAmount": number,
            "status": "string"
        }]
    }

PUT /api/v1/orders/{id}/cancel
    Request:
    {
        "reason": "string",
        "notes": "string"
    }
```

### 2.3 Event Streams

#### Published Events
- CartCreatedEvent
- CartUpdatedEvent
- CartAbandonedEvent
- OrderCreatedEvent
- OrderUpdatedEvent
- OrderCanceledEvent
- OrderCompletedEvent
- ItemAddedToCartEvent
- ItemRemovedFromCartEvent
- CartMergedEvent

#### Subscribed Events
- ProductUpdatedEvent
- PriceChangedEvent
- PromotionAppliedEvent
- PaymentProcessedEvent
- InventoryUpdatedEvent
- UserLoggedInEvent
- ShipmentStatusEvent

## 3. Scalability Considerations

### 3.1 Performance Requirements
- Cart operations: < 200ms
- Order creation: < 2s
- Status updates: < 500ms
- Cart merging: < 1s
- Inventory checks: < 100ms
- Price calculations: < 200ms

### 3.2 Scaling Strategies
- Cart data caching
- Session management
- Distributed locking
- Queue-based processing
- Event-driven updates
- Read replicas

## 4. Monitoring & Alerts

### 4.1 Key Metrics
- Cart conversion rate
- Cart abandonment rate
- Order processing time
- Error rates
- API latencies
- Cart size metrics

### 4.2 Alert Conditions
- High cart abandonment
- Order processing delays
- Payment failures
- Inventory conflicts
- API errors
- System overload

## 5. Future Work

### 5.1 Advanced Features
- Smart cart recommendations
- Automated cart recovery
- Predictive ordering
- Real-time inventory
- Dynamic pricing
- Social sharing

### 5.2 Integration Expansions
- Advanced analytics
- ML-based insights
- Subscription orders
- Voice commerce
- AR product preview
- Social commerce

## 6. Version History
- v1.0: Initial PRD creation
- v1.1: Added cart management
- v1.2: Enhanced order processing
- v1.3: Added multi-vendor support 