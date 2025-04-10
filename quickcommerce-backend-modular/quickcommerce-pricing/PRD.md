# Pricing Module PRD

## 1. Module Scope & Context

### 1.1 Core Responsibilities
- Base price management
- Store-specific pricing
- Dynamic pricing rules
- Tax calculation
- Currency handling
- Price history tracking
- Margin management

### 1.2 Key Use Cases

#### A. Price Management
- **Base Pricing**
  - Price setup
  - Cost tracking
  - Margin calculation
  - Bulk price updates
  - Price versioning
  - Currency conversion

- **Store Pricing**
  - Store-specific prices
  - Regional pricing
  - Location-based adjustments
  - Competitive pricing
  - Market segmentation
  - Price zones

- **Dynamic Pricing**
  - Time-based pricing
  - Demand-based adjustments
  - Competitor-based pricing
  - Stock-level pricing
  - Peak pricing
  - Special event pricing

#### B. Tax & Currency
- **Tax Management**
  - Tax rules
  - Tax categories
  - Tax exemptions
  - Multiple tax handling
  - Tax reporting
  - Tax calculation

- **Currency Operations**
  - Multi-currency support
  - Exchange rates
  - Currency conversion
  - Rounding rules
  - Price normalization
  - Currency updates

### 1.3 Price Lifecycle Events

#### A. Price Setup
1. **Initial Configuration**
   - Base price setting
   - Cost allocation
   - Margin definition
   - Tax configuration
   - Currency setup
   - Store mapping

2. **Rule Definition**
   - Dynamic pricing rules
   - Tax rules
   - Currency rules
   - Override rules
   - Regional rules
   - Time-based rules

#### B. Price Maintenance
1. **Regular Updates**
   - Price adjustments
   - Tax updates
   - Currency sync
   - Rule refinement
   - Cost updates
   - Margin adjustments

2. **Special Handling**
   - Peak pricing setup
   - Regional adjustments
   - Competitive updates
   - Emergency changes
   - Price corrections
   - Market adjustments

#### C. Price Retirement
1. **Retirement Process**
   - Price archival
   - History maintenance
   - Rule deactivation
   - Customer notification
   - Transition management
   - Market analysis

## 2. Technical Architecture

### 2.1 Data Model
```sql
CREATE TABLE base_prices (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2),
    margin_percentage DECIMAL(5,2),
    currency VARCHAR(3) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE store_prices (
    id UUID PRIMARY KEY,
    base_price_id UUID NOT NULL,
    store_id UUID NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    margin_percentage DECIMAL(5,2),
    currency VARCHAR(3) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_base_price FOREIGN KEY (base_price_id) REFERENCES base_prices(id),
    CONSTRAINT fk_store FOREIGN KEY (store_id) REFERENCES stores(id),
    UNIQUE(base_price_id, store_id)
);

CREATE TABLE dynamic_price_rules (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    rule_type VARCHAR(50) NOT NULL,
    adjustment_type VARCHAR(50) NOT NULL,
    adjustment_value DECIMAL(10,2) NOT NULL,
    condition_json JSONB NOT NULL,
    priority INTEGER NOT NULL,
    applies_to VARCHAR(50) NOT NULL,
    target_id UUID,
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE price_history (
    id UUID PRIMARY KEY,
    base_price_id UUID NOT NULL,
    store_id UUID,
    old_price DECIMAL(10,2) NOT NULL,
    new_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    change_reason VARCHAR(100),
    changed_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_base_price FOREIGN KEY (base_price_id) REFERENCES base_prices(id),
    CONSTRAINT fk_store FOREIGN KEY (store_id) REFERENCES stores(id)
);

CREATE TABLE tax_rules (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    tax_type VARCHAR(50) NOT NULL,
    tax_percentage DECIMAL(5,2) NOT NULL,
    region_code VARCHAR(50),
    product_category_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE currency_rates (
    id UUID PRIMARY KEY,
    base_currency VARCHAR(3) NOT NULL,
    target_currency VARCHAR(3) NOT NULL,
    exchange_rate DECIMAL(10,6) NOT NULL,
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    UNIQUE(base_currency, target_currency, valid_from)
);

CREATE INDEX idx_base_prices_product ON base_prices(product_id);
CREATE INDEX idx_store_prices_base ON store_prices(base_price_id);
CREATE INDEX idx_store_prices_store ON store_prices(store_id);
CREATE INDEX idx_dynamic_rules_type ON dynamic_price_rules(rule_type);
CREATE INDEX idx_price_history_base ON price_history(base_price_id);
CREATE INDEX idx_tax_rules_region ON tax_rules(region_code);
CREATE INDEX idx_currency_rates_pair ON currency_rates(base_currency, target_currency);
```

### 2.2 API Endpoints

#### Price Management
```
POST /api/v1/prices/base
    Request:
    {
        "productId": "uuid",
        "basePrice": number,
        "costPrice": number,
        "marginPercentage": number,
        "currency": "string",
        "validFrom": "timestamp",
        "validTo": "timestamp"
    }

POST /api/v1/prices/store
    Request:
    {
        "basePriceId": "uuid",
        "storeId": "uuid",
        "price": number,
        "marginPercentage": number,
        "currency": "string",
        "validFrom": "timestamp",
        "validTo": "timestamp"
    }

GET /api/v1/prices/product/{productId}
    Response:
    {
        "basePrice": {
            "price": number,
            "currency": "string",
            "marginPercentage": number
        },
        "storePrices": [{
            "storeId": "uuid",
            "price": number,
            "currency": "string",
            "marginPercentage": number
        }]
    }

POST /api/v1/prices/rules
    Request:
    {
        "name": "string",
        "description": "string",
        "ruleType": "TIME|DEMAND|STOCK|REGION",
        "adjustmentType": "PERCENTAGE|FIXED",
        "adjustmentValue": number,
        "conditions": {
            "timeRange": {},
            "demandThreshold": {},
            "stockLevel": {},
            "region": {}
        },
        "priority": integer,
        "appliesTo": "PRODUCT|CATEGORY|STORE",
        "targetId": "uuid",
        "validFrom": "timestamp",
        "validTo": "timestamp"
    }
```

#### Tax & Currency
```
POST /api/v1/tax/rules
    Request:
    {
        "name": "string",
        "description": "string",
        "taxType": "string",
        "taxPercentage": number,
        "regionCode": "string",
        "productCategoryId": "uuid"
    }

GET /api/v1/currency/rates
    Request:
    {
        "baseCurrency": "string",
        "targetCurrency": "string"
    }
```

### 2.3 Event Streams

#### Published Events
- BasePriceUpdatedEvent
- StorePriceUpdatedEvent
- DynamicRuleCreatedEvent
- DynamicRuleTriggeredEvent
- TaxRuleUpdatedEvent
- CurrencyRateUpdatedEvent
- MarginUpdatedEvent

#### Subscribed Events
- ProductCreatedEvent
- StoreCreatedEvent
- CategoryUpdatedEvent
- InventoryUpdatedEvent
- MarketDataUpdatedEvent

## 3. Scalability Considerations

### 3.1 Performance Requirements
- Price lookups: < 50ms
- Dynamic rule evaluation: < 100ms
- Price updates: < 200ms
- Bulk price updates: < 2s for 1000 items

### 3.2 Scaling Strategies
- Price caching
- Rule evaluation optimization
- Async price updates
- Event-driven architecture
- Read replicas for pricing data

## 4. Monitoring & Alerts

### 4.1 Key Metrics
- Price update success rate
- Rule evaluation performance
- Tax calculation accuracy
- System response time
- Cache hit ratio
- Margin compliance

### 4.2 Alert Conditions
- Price inconsistencies
- Failed updates
- Rule evaluation errors
- System latency
- Cache misses
- Currency sync issues
- Margin violations

## 5. Future Work

### 5.1 Advanced Features
- AI-powered dynamic pricing
- Competitor price tracking
- Advanced margin management
- Real-time market adjustment
- Predictive pricing
- Cost forecasting

### 5.2 Integration Expansions
- External price feeds
- Market data integration
- Advanced analytics
- ML price optimization
- Cost analysis tools
- Market intelligence feeds

## 6. Version History
- v1.0: Initial PRD creation
- v1.1: Added dynamic pricing rules
- v1.2: Enhanced tax handling
- v1.3: Added margin management 