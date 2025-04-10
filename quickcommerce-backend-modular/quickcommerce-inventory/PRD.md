# Inventory Module PRD

## 1. Module Scope & Context

### 1.1 Core Responsibilities
- Real-time inventory tracking
- Multi-store inventory management
- Stock reservation system
- Inventory alerts and notifications
- Stock transfer management
- Wastage and returns handling
- Batch/lot tracking
- Expiry date management

### 1.2 Key Use Cases

#### A. Inventory Operations
- **Stock Management**
  - Real-time stock updates
  - Stock reservations
  - Buffer stock management
  - Batch/lot tracking
  - Expiry tracking
  - Stock adjustments
  - Wastage recording

- **Store Operations**
  - Store-wise inventory
  - Stock transfers
  - Store receiving
  - Stock counting
  - Threshold alerts
  - Store-level buffer

- **Inventory Planning**
  - Low stock alerts
  - Reorder point management
  - Stock optimization
  - Demand forecasting
  - Seasonal planning
  - Buffer calculations

#### B. Stock Movement
- **Transfer Management**
  - Inter-store transfers
  - Transfer tracking
  - Transfer reconciliation
  - Bulk transfers
  - Transfer rules
  - Route optimization

- **Stock Adjustments**
  - Damage recording
  - Expiry adjustments
  - Quality issues
  - Stock count adjustments
  - Return processing
  - Adjustment approval

#### C. Quality Control
- **Batch Management**
  - Batch tracking
  - Expiry monitoring
  - Quality checks
  - Batch recalls
  - FIFO/FEFO enforcement
  - Batch history

### 1.3 Inventory Lifecycle Events

#### A. Stock Receipt
1. **Receiving Process**
   - Stock verification
   - Batch recording
   - Expiry checking
   - Quality inspection
   - Location assignment
   - Receipt documentation

2. **Stock Placement**
   - Storage location
   - FIFO/FEFO placement
   - Batch segregation
   - Temperature monitoring
   - Space optimization
   - Accessibility planning

#### B. Stock Maintenance
1. **Regular Operations**
   - Stock counting
   - Expiry checking
   - Quality monitoring
   - Location updates
   - Buffer management
   - Threshold monitoring

2. **Issue Resolution**
   - Damage handling
   - Expiry management
   - Quality issues
   - Stock reconciliation
   - Discrepancy resolution
   - Return processing

#### C. Stock Retirement
1. **Retirement Process**
   - Expiry removal
   - Damage disposal
   - Quality failures
   - Return processing
   - Documentation
   - Audit trail

## 2. Technical Architecture

### 2.1 Data Model
```sql
CREATE TABLE inventory_stock (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL,
    store_id UUID NOT NULL,
    available_quantity INTEGER NOT NULL,
    reserved_quantity INTEGER DEFAULT 0,
    buffer_quantity INTEGER DEFAULT 0,
    reorder_point INTEGER,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_store FOREIGN KEY (store_id) REFERENCES stores(id),
    UNIQUE(product_id, store_id)
);

CREATE TABLE inventory_batches (
    id UUID PRIMARY KEY,
    inventory_id UUID NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    manufacturing_date DATE,
    expiry_date DATE,
    received_date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_inventory FOREIGN KEY (inventory_id) REFERENCES inventory_stock(id)
);

CREATE TABLE stock_movements (
    id UUID PRIMARY KEY,
    inventory_id UUID NOT NULL,
    movement_type VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    batch_id UUID,
    reference_id UUID,
    notes TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_inventory FOREIGN KEY (inventory_id) REFERENCES inventory_stock(id),
    CONSTRAINT fk_batch FOREIGN KEY (batch_id) REFERENCES inventory_batches(id)
);

CREATE TABLE stock_transfers (
    id UUID PRIMARY KEY,
    source_inventory_id UUID NOT NULL,
    target_inventory_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    initiated_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    created_by UUID NOT NULL,
    notes TEXT,
    CONSTRAINT fk_source_inventory FOREIGN KEY (source_inventory_id) REFERENCES inventory_stock(id),
    CONSTRAINT fk_target_inventory FOREIGN KEY (target_inventory_id) REFERENCES inventory_stock(id)
);

CREATE TABLE stock_reservations (
    id UUID PRIMARY KEY,
    inventory_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    reservation_type VARCHAR(50) NOT NULL,
    reference_id UUID NOT NULL,
    expiry_time TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_inventory FOREIGN KEY (inventory_id) REFERENCES inventory_stock(id)
);

CREATE TABLE inventory_alerts (
    id UUID PRIMARY KEY,
    inventory_id UUID NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    threshold_value INTEGER,
    current_value INTEGER,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP,
    CONSTRAINT fk_inventory FOREIGN KEY (inventory_id) REFERENCES inventory_stock(id)
);

CREATE INDEX idx_inventory_product ON inventory_stock(product_id);
CREATE INDEX idx_inventory_store ON inventory_stock(store_id);
CREATE INDEX idx_batch_inventory ON inventory_batches(inventory_id);
CREATE INDEX idx_movements_inventory ON stock_movements(inventory_id);
CREATE INDEX idx_transfers_source ON stock_transfers(source_inventory_id);
CREATE INDEX idx_transfers_target ON stock_transfers(target_inventory_id);
CREATE INDEX idx_reservations_inventory ON stock_reservations(inventory_id);
CREATE INDEX idx_alerts_inventory ON inventory_alerts(inventory_id);
```

### 2.2 API Endpoints

#### Inventory Management
```
POST /api/v1/inventory/stock
    Request:
    {
        "productId": "uuid",
        "storeId": "uuid",
        "quantity": integer,
        "bufferQuantity": integer,
        "reorderPoint": integer,
        "batch": {
            "batchNumber": "string",
            "quantity": integer,
            "manufacturingDate": "date",
            "expiryDate": "date"
        }
    }

GET /api/v1/inventory/stock/{productId}/store/{storeId}
    Response:
    {
        "availableQuantity": integer,
        "reservedQuantity": integer,
        "bufferQuantity": integer,
        "reorderPoint": integer,
        "batches": [{
            "batchNumber": "string",
            "quantity": integer,
            "expiryDate": "date",
            "status": "string"
        }]
    }

PUT /api/v1/inventory/stock/adjust
    Request:
    {
        "inventoryId": "uuid",
        "adjustmentType": "ADD|SUBTRACT|SET",
        "quantity": integer,
        "batchId": "uuid",
        "reason": "string",
        "notes": "string"
    }
```

#### Transfer Management
```
POST /api/v1/inventory/transfers
    Request:
    {
        "sourceInventoryId": "uuid",
        "targetInventoryId": "uuid",
        "quantity": integer,
        "notes": "string"
    }

GET /api/v1/inventory/transfers/{transferId}
    - Transfer details
    - Status tracking
    - Movement history

PUT /api/v1/inventory/transfers/{transferId}/status
    - Update status
    - Completion recording
    - Issue reporting
```

#### Reservation Management
```
POST /api/v1/inventory/reservations
    Request:
    {
        "inventoryId": "uuid",
        "quantity": integer,
        "reservationType": "ORDER|HOLD",
        "referenceId": "uuid",
        "expiryTime": "timestamp"
    }

DELETE /api/v1/inventory/reservations/{reservationId}
    - Release reservation
    - Update inventory
```

### 2.3 Event Streams

#### Published Events
- InventoryUpdatedEvent
- StockMovementCreatedEvent
- TransferInitiatedEvent
- TransferCompletedEvent
- ReservationCreatedEvent
- ReservationExpiredEvent
- LowStockAlertEvent
- BatchExpiryAlertEvent

#### Subscribed Events
- OrderCreatedEvent
- OrderCancelledEvent
- ProductCreatedEvent
- StoreCreatedEvent
- QualityCheckFailedEvent

## 3. Scalability Considerations

### 3.1 Performance Requirements
- Stock updates: < 100ms
- Reservation creation: < 200ms
- Transfer initiation: < 300ms
- Batch operations: < 2s for 100 items

### 3.2 Scaling Strategies
- Distributed locking
- Event-driven updates
- Read replicas
- Cache hierarchy
- Async batch processing

## 4. Monitoring & Alerts

### 4.1 Key Metrics
- Stock accuracy
- Reservation success rate
- Transfer completion time
- Alert response time
- System latency
- Batch expiry tracking

### 4.2 Alert Conditions
- Low stock threshold
- Failed transfers
- Expired reservations
- System latency spikes
- Data inconsistencies
- Batch expiry warnings

## 5. Future Work

### 5.1 Advanced Features
- ML-based demand forecasting
- Automated reordering
- Dynamic buffer calculation
- Smart transfer routing
- Predictive expiry management
- IoT integration for tracking

### 5.2 Integration Expansions
- Supplier integration
- Advanced analytics
- Mobile scanning
- Blockchain tracking
- Temperature monitoring
- Automated quality checks

## 6. Version History
- v1.0: Initial PRD creation
- v1.1: Added batch management
- v1.2: Enhanced transfer system
- v1.3: Added reservation system 