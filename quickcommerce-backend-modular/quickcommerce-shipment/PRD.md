# Shipment Module PRD

## 1. Module Scope & Context

### 1.1 Core Responsibilities
- Last-mile delivery management
- Rider assignment and tracking
- Delivery route optimization
- Real-time shipment tracking
- Delivery SLA management

### 1.2 Key Use Cases

#### A. Quick Commerce Delivery Flows
- **Express Delivery**
  - 15-30 minute delivery promise
  - Dynamic rider allocation
  - Real-time route optimization
  - Live tracking
  - SLA monitoring

- **Batch Deliveries**
  - Multi-order optimization
  - Route clustering
  - Capacity planning
  - Priority management
  - Batch size optimization

- **Store Pickup**
  - Pickup slot management
  - Store capacity check
  - Order readiness sync
  - Customer notification
  - QR code generation

#### B. Rider Management
- **Rider Assignment**
  - Real-time availability tracking
  - Skill-based routing
  - Load balancing
  - Performance-based assignment
  - Zone management

- **Route Optimization**
  - Real-time traffic integration
  - Dynamic rerouting
  - Multi-stop optimization
  - ETA calculation
  - Zone-based routing

- **Rider Performance**
  - SLA adherence tracking
  - Delivery success rate
  - Customer rating
  - Speed monitoring
  - Efficiency metrics

#### C. Delivery Operations
- **Delivery Zones**
  - Dynamic zone mapping
  - Coverage area management
  - Surge handling
  - Store mapping
  - Restricted areas

- **Delivery Analytics**
  - Performance tracking
  - Cost analysis
  - SLA monitoring
  - Efficiency metrics
  - Heat map analysis

### 1.3 Shipment Lifecycle Events

#### A. Pre-Shipment Phase
1. **Order Assignment**
   - Store confirmation
   - Package readiness check
   - Delivery slot allocation
   - Priority assessment

2. **Rider Assignment**
   - Availability check
   - Location proximity
   - Load capacity check
   - Performance matching

3. **Route Planning**
   - Distance calculation
   - Traffic analysis
   - Multi-drop optimization
   - ETA computation

#### B. Pickup Phase
1. **Store Coordination**
   - Pickup notification
   - Order verification
   - Package handover
   - Digital signature

2. **Rider Verification**
   - Identity check
   - Order details confirmation
   - Package condition check
   - Temperature verification

#### C. Delivery Phase
1. **En-route Management**
   - Real-time tracking
   - Route adherence
   - ETA updates
   - Customer notifications

2. **Delivery Execution**
   - Customer verification
   - Delivery confirmation
   - Photo proof
   - Rating collection

#### D. Exception Handling
1. **Delivery Issues**
   - Customer unavailable
   - Wrong address
   - Package damage
   - Return handling

2. **Rider Issues**
   - Vehicle breakdown
   - Network issues
   - Emergency situations
   - Route deviations

## 2. Technical Architecture

### 2.1 Data Model
```sql
CREATE TABLE shipments (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL,
    rider_id UUID,
    store_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL,
    pickup_time TIMESTAMP,
    delivery_time TIMESTAMP,
    estimated_delivery_time TIMESTAMP,
    actual_delivery_time TIMESTAMP,
    delivery_attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    version BIGINT NOT NULL,
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_rider FOREIGN KEY (rider_id) REFERENCES riders(id),
    CONSTRAINT fk_store FOREIGN KEY (store_id) REFERENCES stores(id)
);

CREATE TABLE riders (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    current_location POINT,
    status VARCHAR(50) NOT NULL,
    current_zone UUID,
    rating DECIMAL(3,2),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_zone FOREIGN KEY (current_zone) REFERENCES delivery_zones(id)
);

CREATE TABLE delivery_zones (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    polygon POLYGON NOT NULL,
    is_active BOOLEAN DEFAULT true,
    surge_factor DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE rider_locations (
    id UUID PRIMARY KEY,
    rider_id UUID NOT NULL,
    location POINT NOT NULL,
    heading INTEGER,
    speed DECIMAL(5,2),
    timestamp TIMESTAMP NOT NULL,
    CONSTRAINT fk_rider FOREIGN KEY (rider_id) REFERENCES riders(id)
);

CREATE INDEX idx_shipments_order ON shipments(order_id);
CREATE INDEX idx_shipments_rider ON shipments(rider_id);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_rider_locations_rider ON rider_locations(rider_id);
CREATE INDEX idx_rider_locations_timestamp ON rider_locations(timestamp);
```

### 2.2 API Endpoints

#### Shipment Management
```
POST /api/v1/shipments
    Request:
    {
        "orderId": "uuid",
        "storeId": "uuid",
        "deliverySlot": {
            "startTime": "timestamp",
            "endTime": "timestamp"
        },
        "priority": "HIGH|MEDIUM|LOW",
        "specialInstructions": "string"
    }

GET /api/v1/shipments/{shipmentId}
    - Shipment details
    - Status tracking
    - Timeline events

PUT /api/v1/shipments/{shipmentId}/status
    - Status updates
    - Location updates
    - ETA updates

POST /api/v1/shipments/{shipmentId}/issues
    - Report delivery issues
    - Customer unavailable
    - Wrong address
```

#### Rider Management
```
POST /api/v1/riders/{riderId}/assign
    - Shipment assignment
    - Route update
    - Load update

GET /api/v1/riders/{riderId}/current-load
    - Active deliveries
    - Route information
    - Capacity status

PUT /api/v1/riders/{riderId}/location
    - Location update
    - Status update
    - Availability update

GET /api/v1/riders/available
    - Zone-based availability
    - Load capacity
    - Performance metrics
```

#### Route Optimization
```
POST /api/v1/routes/optimize
    Request:
    {
        "riderId": "uuid",
        "shipments": ["uuid"],
        "constraints": {
            "maxDistance": "number",
            "maxTime": "number",
            "priority": "string"
        }
    }

GET /api/v1/routes/{routeId}
    - Route details
    - Waypoints
    - ETAs

PUT /api/v1/routes/{routeId}/reoptimize
    - Dynamic rerouting
    - Traffic updates
    - Priority changes
```

#### Zone Management
```
POST /api/v1/zones
    - Create delivery zone
    - Set boundaries
    - Define constraints

GET /api/v1/zones/active
    - Active zones
    - Surge status
    - Coverage details

PUT /api/v1/zones/{zoneId}/surge
    - Update surge factor
    - Capacity management
    - Rider reallocation
```

### 2.3 Event Streams

#### Published Events
- ShipmentCreatedEvent
- ShipmentAssignedEvent
- RiderAssignedEvent
- PickupCompletedEvent
- DeliveryCompletedEvent
- DeliveryFailedEvent
- RiderLocationUpdatedEvent
- ZoneUpdatedEvent

#### Subscribed Events
- OrderConfirmedEvent
- StoreReadyEvent
- OrderCancelledEvent
- RiderAvailabilityEvent

## 3. Scalability Considerations

### 3.1 Performance Requirements
- Location update latency: < 100ms
- Route optimization: < 1s
- Rider assignment: < 500ms
- Real-time tracking: < 200ms

### 3.2 Scaling Strategies
- Geospatial data partitioning
- Real-time event processing
- In-memory location caching
- Zone-based sharding

## 4. Monitoring & Alerts

### 4.1 Key Metrics
- Delivery success rate
- Average delivery time
- Rider utilization
- Zone performance

### 4.2 Alert Conditions
- SLA breaches
- Rider unavailability
- Zone overcapacity
- System latency

## 5. Future Work

### 5.1 Advanced Features
- ML-based route optimization
- Predictive rider allocation
- Dynamic zone management
- Automated capacity planning

### 5.2 Integration Expansions
- Third-party delivery partners
- Advanced traffic integration
- Weather service integration
- Customer preference learning

## 6. Version History
- v1.0: Initial PRD creation
- v1.1: Added real-time tracking
- v1.2: Enhanced route optimization
- v1.3: Added zone management 