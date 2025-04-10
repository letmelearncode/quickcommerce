# Review & Ratings Module PRD

## 1. Module Scope & Context

### 1.1 Core Responsibilities
- Review management
- Rating system
- Content moderation
- Review analytics
- Response management
- Sentiment analysis
- Review verification
- Spam prevention

### 1.2 Key Use Cases

#### A. Review Management
- **Review Creation**
  - Text reviews
  - Star ratings
  - Media attachments
  - Purchase verification
  - Review templates
  - Draft management

- **Review Moderation**
  - Content filtering
  - Automated screening
  - Manual moderation
  - Violation reporting
  - Review editing
  - Review removal

- **Response Handling**
  - Merchant responses
  - User interactions
  - Response templates
  - Response time tracking
  - Escalation management
  - Follow-up system

#### B. Rating System
- **Rating Components**
  - Overall rating
  - Category ratings
  - Attribute scoring
  - Rating distribution
  - Weighted averages
  - Rating trends

- **Rating Analytics**
  - Score calculation
  - Trend analysis
  - Comparative metrics
  - Rating aggregation
  - Historical tracking
  - Performance insights

#### C. Quality Control
- **Content Quality**
  - Authenticity checks
  - Spam detection
  - Duplicate prevention
  - Language filtering
  - Quality scoring
  - Content guidelines

- **User Verification**
  - Purchase verification
  - User credibility
  - Review history
  - User reputation
  - Fraud detection
  - Identity verification

### 1.3 Review Lifecycle Events

#### A. Review Creation
1. **Submission Phase**
   - Content entry
   - Rating selection
   - Media upload
   - Purchase verification
   - Guidelines check
   - Draft saving

2. **Verification Phase**
   - Content screening
   - Spam checking
   - Purchase validation
   - User verification
   - Quality scoring
   - Duplicate checking

#### B. Review Processing
1. **Moderation**
   - Content review
   - Policy compliance
   - Media screening
   - Flag resolution
   - Status updates
   - Notification handling

2. **Publication**
   - Review approval
   - Rating calculation
   - Index updating
   - User notification
   - Merchant alert
   - Analytics update

#### C. Review Maintenance
1. **Management**
   - Content updates
   - Response tracking
   - Flag handling
   - Archive process
   - History tracking
   - Performance monitoring

## 2. Technical Architecture

### 2.1 Data Model
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL,
    user_id UUID NOT NULL,
    order_id UUID,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(200),
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    is_verified_purchase BOOLEAN DEFAULT false,
    helpful_votes INTEGER DEFAULT 0,
    not_helpful_votes INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    moderation_status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE review_attributes (
    id UUID PRIMARY KEY,
    review_id UUID NOT NULL,
    attribute_name VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_review FOREIGN KEY (review_id) REFERENCES reviews(id)
);

CREATE TABLE review_media (
    id UUID PRIMARY KEY,
    review_id UUID NOT NULL,
    media_type VARCHAR(50) NOT NULL,
    url VARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL,
    moderation_status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_review FOREIGN KEY (review_id) REFERENCES reviews(id)
);

CREATE TABLE review_responses (
    id UUID PRIMARY KEY,
    review_id UUID NOT NULL,
    responder_id UUID NOT NULL,
    responder_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_review FOREIGN KEY (review_id) REFERENCES reviews(id)
);

CREATE TABLE review_votes (
    id UUID PRIMARY KEY,
    review_id UUID NOT NULL,
    user_id UUID NOT NULL,
    vote_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_review FOREIGN KEY (review_id) REFERENCES reviews(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(review_id, user_id)
);

CREATE TABLE review_reports (
    id UUID PRIMARY KEY,
    review_id UUID NOT NULL,
    reporter_id UUID NOT NULL,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    resolution TEXT,
    created_at TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP,
    CONSTRAINT fk_review FOREIGN KEY (review_id) REFERENCES reviews(id),
    CONSTRAINT fk_reporter FOREIGN KEY (reporter_id) REFERENCES users(id)
);

CREATE TABLE moderation_queue (
    id UUID PRIMARY KEY,
    review_id UUID NOT NULL,
    moderator_id UUID,
    status VARCHAR(50) NOT NULL,
    priority INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_review FOREIGN KEY (review_id) REFERENCES reviews(id),
    CONSTRAINT fk_moderator FOREIGN KEY (moderator_id) REFERENCES users(id)
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_review_attributes_review ON review_attributes(review_id);
CREATE INDEX idx_review_media_review ON review_media(review_id);
CREATE INDEX idx_review_responses_review ON review_responses(review_id);
CREATE INDEX idx_review_votes_review ON review_votes(review_id);
CREATE INDEX idx_moderation_queue_status ON moderation_queue(status);
```

### 2.2 API Endpoints

#### Review Management
```
POST /api/v1/reviews
    Request:
    {
        "productId": "uuid",
        "rating": integer,
        "title": "string",
        "content": "string",
        "attributes": [{
            "name": "string",
            "rating": integer
        }],
        "media": [{
            "type": "string",
            "url": "string"
        }]
    }

GET /api/v1/reviews/product/{productId}
    Response:
    {
        "reviews": [{
            "id": "uuid",
            "rating": integer,
            "title": "string",
            "content": "string",
            "isVerifiedPurchase": boolean,
            "helpfulVotes": integer,
            "attributes": [{
                "name": "string",
                "rating": integer
            }],
            "media": [{
                "type": "string",
                "url": "string"
            }],
            "responses": [{
                "content": "string",
                "responderType": "string",
                "createdAt": "timestamp"
            }]
        }],
        "summary": {
            "averageRating": number,
            "totalReviews": integer,
            "ratingDistribution": {
                "5": integer,
                "4": integer,
                "3": integer,
                "2": integer,
                "1": integer
            },
            "attributeAverages": [{
                "name": "string",
                "average": number
            }]
        }
    }

POST /api/v1/reviews/{reviewId}/vote
    Request:
    {
        "voteType": "HELPFUL|NOT_HELPFUL",
        "userId": "uuid"
    }

POST /api/v1/reviews/{reviewId}/report
    Request:
    {
        "reason": "string",
        "description": "string",
        "reporterId": "uuid"
    }
```

#### Moderation
```
POST /api/v1/moderation/reviews/{reviewId}/status
    Request:
    {
        "status": "APPROVED|REJECTED|PENDING",
        "notes": "string",
        "moderatorId": "uuid"
    }

GET /api/v1/moderation/queue
    Response:
    {
        "queue": [{
            "reviewId": "uuid",
            "content": "string",
            "status": "string",
            "priority": integer,
            "createdAt": "timestamp"
        }]
    }
```

### 2.3 Event Streams

#### Published Events
- ReviewCreatedEvent
- ReviewUpdatedEvent
- ReviewModeratedEvent
- ReviewVotedEvent
- ReviewReportedEvent
- ReviewResponseAddedEvent
- ModerationQueueUpdatedEvent

#### Subscribed Events
- OrderCompletedEvent
- ProductUpdatedEvent
- UserBannedEvent
- ContentGuidelinesUpdatedEvent

## 3. Scalability Considerations

### 3.1 Performance Requirements
- Review submission: < 500ms
- Review listing: < 200ms
- Moderation check: < 100ms
- Media processing: < 2s
- Analytics calculation: < 1s

### 3.2 Scaling Strategies
- Content caching
- Async media processing
- Distributed moderation
- Rating pre-calculation
- Read replicas
- Event-driven updates

## 4. Monitoring & Alerts

### 4.1 Key Metrics
- Review submission rate
- Moderation queue length
- Response time tracking
- Spam detection rate
- User engagement
- Content quality score

### 4.2 Alert Conditions
- High spam activity
- Moderation backlog
- Response time breach
- Content policy violations
- System overload
- Data inconsistencies

## 5. Future Work

### 5.1 Advanced Features
- AI-powered moderation
- Sentiment analysis
- Review summarization
- Review translation
- Video reviews
- Voice reviews

### 5.2 Integration Expansions
- Social media sharing
- Review aggregation
- Advanced analytics
- SEO optimization
- Review syndication
- Influencer integration

## 6. Version History
- v1.0: Initial PRD creation
- v1.1: Added media support
- v1.2: Enhanced moderation
- v1.3: Added analytics 