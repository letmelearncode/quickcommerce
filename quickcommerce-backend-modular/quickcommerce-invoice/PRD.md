# Invoice Module PRD

## 1. Module Scope & Context

### 1.1 Core Responsibilities
- Invoice generation
- Tax calculation
- Payment tracking
- Credit note management
- Invoice templates
- Digital signatures
- Invoice numbering
- GST compliance
- Financial reporting
- Document storage

### 1.2 Key Use Cases

#### A. Invoice Management
- **Invoice Generation**
  - Order-based invoicing
  - Subscription billing
  - Advance invoicing
  - Split invoicing
  - Bulk generation
  - Draft management

- **Invoice Customization**
  - Template selection
  - Branding elements
  - Dynamic fields
  - Terms & conditions
  - Multi-language support
  - Currency handling

- **Tax Management**
  - GST calculation
  - Tax rules
  - HSN codes
  - Tax exemptions
  - Multiple tax rates
  - Tax reports

#### B. Financial Operations
- **Payment Tracking**
  - Payment status
  - Partial payments
  - Payment methods
  - Due date tracking
  - Overdue handling
  - Collection reminders

- **Credit Management**
  - Credit notes
  - Refund tracking
  - Adjustments
  - Credit limits
  - Write-offs
  - Dispute handling

#### C. Compliance & Reporting
- **Compliance**
  - GST compliance
  - E-invoicing
  - Digital signatures
  - Audit trails
  - Legal requirements
  - Retention policies

### 1.3 Invoice Lifecycle

#### A. Creation Phase
1. **Invoice Initiation**
   - Order processing
   - Data collection
   - Template selection
   - Tax calculation
   - Amount computation
   - Draft creation

2. **Validation & Approval**
   - Data validation
   - Tax verification
   - Amount confirmation
   - Compliance check
   - Digital signing
   - Number assignment

#### B. Active Phase
1. **Distribution**
   - Digital delivery
   - Email notification
   - Download options
   - Print handling
   - Archive copy
   - Access control

2. **Payment Tracking**
   - Status monitoring
   - Payment matching
   - Partial payments
   - Due date alerts
   - Collection process
   - Payment reconciliation

#### C. Closure Phase
1. **Settlement**
   - Payment completion
   - Credit application
   - Dispute resolution
   - Final reconciliation
   - Status update
   - Archive process

## 2. Technical Architecture

### 2.1 Data Model
```sql
CREATE TABLE invoices (
    id UUID PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    order_id UUID,
    user_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    sub_total DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    due_date DATE,
    notes TEXT,
    terms_conditions TEXT,
    is_credit_note BOOLEAN DEFAULT false,
    original_invoice_id UUID,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_original_invoice FOREIGN KEY (original_invoice_id) REFERENCES invoices(id)
);

CREATE TABLE invoice_items (
    id UUID PRIMARY KEY,
    invoice_id UUID NOT NULL,
    product_id UUID NOT NULL,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    hsn_code VARCHAR(50),
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE invoice_taxes (
    id UUID PRIMARY KEY,
    invoice_id UUID NOT NULL,
    tax_type VARCHAR(50) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

CREATE TABLE invoice_payments (
    id UUID PRIMARY KEY,
    invoice_id UUID NOT NULL,
    payment_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_reference VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    CONSTRAINT fk_payment FOREIGN KEY (payment_id) REFERENCES payments(id)
);

CREATE TABLE invoice_templates (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    template_data JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE invoice_sequences (
    id UUID PRIMARY KEY,
    prefix VARCHAR(10) NOT NULL,
    current_number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    UNIQUE(prefix, year)
);

CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_user ON invoices(user_id);
CREATE INDEX idx_invoices_order ON invoices(order_id);
CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX idx_invoice_payments_invoice ON invoice_payments(invoice_id);
```

### 2.2 API Endpoints

#### Invoice Management
```
POST /api/v1/invoices
    Request:
    {
        "orderId": "uuid",
        "userId": "uuid",
        "currency": "string",
        "dueDate": "date",
        "notes": "string",
        "items": [{
            "productId": "uuid",
            "quantity": integer,
            "unitPrice": number,
            "taxRate": number
        }]
    }

GET /api/v1/invoices/{id}
    Response:
    {
        "id": "uuid",
        "invoiceNumber": "string",
        "status": "string",
        "currency": "string",
        "subTotal": number,
        "taxAmount": number,
        "totalAmount": number,
        "paidAmount": number,
        "dueDate": "date",
        "items": [{
            "description": "string",
            "quantity": integer,
            "unitPrice": number,
            "taxAmount": number,
            "totalAmount": number
        }]
    }
```

#### Payment Management
```
POST /api/v1/invoices/{id}/payments
    Request:
    {
        "amount": number,
        "paymentMethod": "string",
        "transactionReference": "string",
        "notes": "string"
    }

GET /api/v1/invoices/{id}/payments
    Response:
    {
        "payments": [{
            "amount": number,
            "paymentDate": "timestamp",
            "paymentMethod": "string",
            "transactionReference": "string"
        }]
    }
```

#### Credit Note Management
```
POST /api/v1/invoices/{id}/credit-notes
    Request:
    {
        "items": [{
            "invoiceItemId": "uuid",
            "quantity": integer,
            "amount": number,
            "reason": "string"
        }],
        "notes": "string"
    }

GET /api/v1/invoices/{id}/credit-notes
    Response:
    {
        "creditNotes": [{
            "number": "string",
            "date": "timestamp",
            "amount": number,
            "reason": "string"
        }]
    }
```

### 2.3 Event Streams

#### Published Events
- InvoiceCreatedEvent
- InvoicePaidEvent
- InvoiceCanceledEvent
- CreditNoteIssuedEvent
- PaymentReceivedEvent
- InvoiceOverdueEvent

#### Subscribed Events
- OrderCompletedEvent
- PaymentSuccessfulEvent
- RefundProcessedEvent
- OrderCanceledEvent
- UserUpdatedEvent
- TaxRateChangedEvent

## 3. Scalability Considerations

### 3.1 Performance Requirements
- Invoice generation: < 2s
- PDF rendering: < 3s
- Payment processing: < 1s
- Template loading: < 100ms
- Tax calculation: < 200ms
- Document storage: < 1s

### 3.2 Scaling Strategies
- Async PDF generation
- Template caching
- Distributed storage
- Queue-based processing
- Read replicas
- Data archival

## 4. Monitoring & Alerts

### 4.1 Key Metrics
- Invoice generation time
- Payment success rate
- PDF generation time
- Storage usage
- Error rates
- Processing time

### 4.2 Alert Conditions
- Generation failures
- Payment failures
- Storage issues
- Processing delays
- Compliance violations
- System errors

## 5. Future Work

### 5.1 Advanced Features
- Automated reminders
- Payment predictions
- Smart numbering
- Advanced analytics
- AI-based validation
- Blockchain receipts

### 5.2 Integration Expansions
- Accounting software
- Tax portals
- Payment gateways
- ERP systems
- Audit tools
- CRM integration

## 6. Version History
- v1.0: Initial PRD creation
- v1.1: Added GST compliance
- v1.2: Enhanced payment tracking
- v1.3: Added credit note features 