# Promotion Module PRD

## 1. Module Scope & Context

### 1.1 Core Responsibilities
- Campaign management
- Discount rules engine
- Coupon management
- Flash sales
- Bundle offers
- Loyalty programs
- Referral programs
- Seasonal promotions

### 1.2 Key Use Cases

#### A. Campaign Management
- **Promotional Campaigns**
  - Campaign creation
  - Target audience
  - Duration management
  - Multi-channel campaigns
  - Performance tracking
  - A/B testing

- **Flash Sales**
  - Time-limited offers
  - Limited quantity deals
  - Early bird offers
  - Lightning deals
  - Countdown management
  - Inventory sync

- **Seasonal Promotions**
  - Holiday campaigns
  - Festival offers
  - Clearance sales
  - End-of-season sales
  - Back-to-school offers
  - Special events

#### B. Discount Management
- **Discount Rules**
  - Percentage discounts
  - Fixed amount off
  - Buy X Get Y free
  - Bundle discounts
  - Minimum purchase rules
  - Maximum discount caps

- **Coupon System**
  - Coupon generation
  - Usage limits
  - Validation rules
  - Expiry management
  - Distribution tracking
  - Fraud prevention

#### C. Loyalty Programs
- **Points System**
  - Points earning rules
  - Redemption rules
  - Points expiry
  - Tier management
  - Member benefits
  - Points history

- **Referral System**
  - Referral tracking
  - Reward rules
  - Multi-level referrals
  - Referral analytics
  - Fraud detection
  - Reward distribution

### 1.3 Promotion Lifecycle Events

#### A. Promotion Creation
1. **Setup Phase**
   - Basic configuration
   - Rule definition
   - Target selection
   - Channel selection
   - Resource allocation
   - Approval workflow

2. **Validation Phase**
   - Rule validation
   - Conflict checking
   - Impact analysis
   - System testing
   - Load testing
   - Compliance check

#### B. Promotion Execution
1. **Active Management**
   - Performance monitoring
   - Real-time analytics
   - Inventory tracking
   - User engagement
   - Issue resolution
   - Dynamic adjustment

2. **Customer Experience**
   - Offer discovery
   - Redemption process
   - Point transactions
   - Support handling
   - Feedback collection
   - Experience tracking

#### C. Promotion Conclusion
1. **Closure Process**
   - Performance analysis
   - Resource cleanup
   - Customer notification
   - Data archival
   - Report generation
   - Learning capture

## 2. Technical Architecture

### 2.1 Data Model
```sql
CREATE TABLE promotions (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    promotion_type VARCHAR(50) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    max_usage_count INTEGER,
    current_usage_count INTEGER DEFAULT 0,
    min_purchase_amount DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE discount_rules (
    id UUID PRIMARY KEY,
    promotion_id UUID NOT NULL,
    discount_type VARCHAR(50) NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_quantity INTEGER,
    max_quantity INTEGER,
    max_discount_amount DECIMAL(10,2),
    applies_to VARCHAR(50) NOT NULL,
    target_id UUID,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_promotion FOREIGN KEY (promotion_id) REFERENCES promotions(id)
);

CREATE TABLE coupons (
    id UUID PRIMARY KEY,
    promotion_id UUID NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    is_single_use BOOLEAN DEFAULT true,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_promotion FOREIGN KEY (promotion_id) REFERENCES promotions(id)
);

CREATE TABLE loyalty_programs (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    points_validity_days INTEGER,
    min_points_redemption INTEGER,
    points_to_value_ratio DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE loyalty_tiers (
    id UUID PRIMARY KEY,
    program_id UUID NOT NULL,
    name VARCHAR(50) NOT NULL,
    min_points INTEGER NOT NULL,
    benefits JSONB,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_program FOREIGN KEY (program_id) REFERENCES loyalty_programs(id)
);

CREATE TABLE user_loyalty (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    program_id UUID NOT NULL,
    current_points INTEGER DEFAULT 0,
    lifetime_points INTEGER DEFAULT 0,
    current_tier_id UUID,
    joined_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_program FOREIGN KEY (program_id) REFERENCES loyalty_programs(id),
    CONSTRAINT fk_tier FOREIGN KEY (current_tier_id) REFERENCES loyalty_tiers(id)
);

CREATE TABLE points_transactions (
    id UUID PRIMARY KEY,
    user_loyalty_id UUID NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    points INTEGER NOT NULL,
    reference_id UUID,
    reference_type VARCHAR(50),
    expiry_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_user_loyalty FOREIGN KEY (user_loyalty_id) REFERENCES user_loyalty(id)
);

CREATE TABLE referral_programs (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    referrer_reward JSONB NOT NULL,
    referee_reward JSONB NOT NULL,
    max_referrals INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE referrals (
    id UUID PRIMARY KEY,
    program_id UUID NOT NULL,
    referrer_id UUID NOT NULL,
    referee_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL,
    reward_claimed BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_program FOREIGN KEY (program_id) REFERENCES referral_programs(id)
);

CREATE INDEX idx_promotions_dates ON promotions(start_date, end_date);
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_user_loyalty_user ON user_loyalty(user_id);
CREATE INDEX idx_points_transactions_user ON points_transactions(user_loyalty_id);
CREATE INDEX idx_referrals_users ON referrals(referrer_id, referee_id);
```

### 2.2 API Endpoints

#### Campaign Management
```
POST /api/v1/promotions
    Request:
    {
        "name": "string",
        "description": "string",
        "promotionType": "PERCENTAGE|FIXED|BOGO|BUNDLE",
        "startDate": "timestamp",
        "endDate": "timestamp",
        "maxUsageCount": integer,
        "minPurchaseAmount": number,
        "discountRules": [{
            "discountType": "string",
            "discountValue": number,
            "minQuantity": integer,
            "maxQuantity": integer,
            "maxDiscountAmount": number,
            "appliesTo": "PRODUCT|CATEGORY|ORDER",
            "targetId": "uuid"
        }]
    }

POST /api/v1/promotions/{promotionId}/coupons
    Request:
    {
        "code": "string",
        "maxUses": integer,
        "isSingleUse": boolean,
        "startDate": "timestamp",
        "endDate": "timestamp"
    }

GET /api/v1/promotions/active
    Response:
    {
        "promotions": [{
            "id": "uuid",
            "name": "string",
            "type": "string",
            "discountRules": [{
                "type": "string",
                "value": number
            }],
            "startDate": "timestamp",
            "endDate": "timestamp"
        }]
    }
```

#### Loyalty Management
```
POST /api/v1/loyalty/programs
    Request:
    {
        "name": "string",
        "description": "string",
        "pointsValidityDays": integer,
        "minPointsRedemption": integer,
        "pointsToValueRatio": number,
        "tiers": [{
            "name": "string",
            "minPoints": integer,
            "benefits": {}
        }]
    }

POST /api/v1/loyalty/points/award
    Request:
    {
        "userId": "uuid",
        "points": integer,
        "referenceId": "uuid",
        "referenceType": "string",
        "expiryDate": "timestamp"
    }

GET /api/v1/loyalty/user/{userId}
    Response:
    {
        "currentPoints": integer,
        "lifetimePoints": integer,
        "currentTier": {
            "name": "string",
            "benefits": {}
        },
        "pointsHistory": [{
            "type": "string",
            "points": integer,
            "createdAt": "timestamp"
        }]
    }
```

### 2.3 Event Streams

#### Published Events
- PromotionCreatedEvent
- PromotionActivatedEvent
- PromotionEndedEvent
- CouponRedeemedEvent
- PointsAwardedEvent
- PointsRedeemedEvent
- TierUpgradeEvent
- ReferralCompletedEvent

#### Subscribed Events
- OrderCreatedEvent
- OrderCompletedEvent
- UserRegisteredEvent
- ProductPurchasedEvent
- CartUpdatedEvent

## 3. Scalability Considerations

### 3.1 Performance Requirements
- Promotion validation: < 100ms
- Coupon validation: < 50ms
- Points calculation: < 100ms
- Bulk point updates: < 2s for 1000 transactions

### 3.2 Scaling Strategies
- Rule caching
- Distributed validation
- Async points processing
- Event-driven updates
- Read replicas for points data

## 4. Monitoring & Alerts

### 4.1 Key Metrics
- Promotion usage rate
- Coupon redemption rate
- Points award accuracy
- System response time
- Rule evaluation speed
- Fraud detection rate

### 4.2 Alert Conditions
- High promotion usage
- Unusual redemption patterns
- Points calculation errors
- System overload
- Fraud triggers
- Data inconsistencies

## 5. Future Work

### 5.1 Advanced Features
- AI-powered targeting
- Dynamic promotion generation
- Advanced fraud detection
- Personalized rewards
- Social media integration
- Gamification elements

### 5.2 Integration Expansions
- CRM integration
- Marketing automation
- Analytics dashboard
- Recommendation engine
- Social sharing
- Partner programs

## 6. Version History
- v1.0: Initial PRD creation
- v1.1: Added loyalty program
- v1.2: Enhanced referral system
- v1.3: Added fraud detection 