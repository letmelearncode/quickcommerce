-- Create the addresses table if it doesn't exist
CREATE TABLE IF NOT EXISTS addresses (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    apartment VARCHAR(255),
    additional_info TEXT,
    is_default BOOLEAN DEFAULT FALSE
);

-- Create the payment_methods table if it doesn't exist
CREATE TABLE IF NOT EXISTS payment_methods (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    card_brand VARCHAR(50),
    last_4 VARCHAR(4),
    expiry_month VARCHAR(2),
    expiry_year VARCHAR(4),
    payment_method_id VARCHAR(255)
);

-- Create the order_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    product_name VARCHAR(255),
    product_image VARCHAR(255),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Drop existing columns from orders table if they exist
DO $$
BEGIN
    BEGIN
        ALTER TABLE orders 
            DROP COLUMN IF EXISTS billing_street,
            DROP COLUMN IF EXISTS billing_city,
            DROP COLUMN IF EXISTS billing_state,
            DROP COLUMN IF EXISTS billing_zip_code,
            DROP COLUMN IF EXISTS billing_country,
            DROP COLUMN IF EXISTS billing_full_name,
            DROP COLUMN IF EXISTS billing_phone,
            DROP COLUMN IF EXISTS billing_apartment,
            DROP COLUMN IF EXISTS billing_additional_info,
            DROP COLUMN IF EXISTS billing_is_default;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
END $$;

-- Add new columns to orders table if they don't exist
DO $$
BEGIN
    BEGIN
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address_id BIGINT;
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_address_id BIGINT;
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method_id BIGINT;
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP;
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS processed_date TIMESTAMP;
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipped_date TIMESTAMP;
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_date TIMESTAMP;
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_date TIMESTAMP;
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_instructions TEXT;
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
END $$;

-- Update column types for money-related columns
DO $$
BEGIN
    BEGIN
        ALTER TABLE orders ALTER COLUMN subtotal TYPE DECIMAL(10,2);
        ALTER TABLE orders ALTER COLUMN tax TYPE DECIMAL(10,2);
        ALTER TABLE orders ALTER COLUMN shipping_cost TYPE DECIMAL(10,2);
        ALTER TABLE orders ALTER COLUMN discount TYPE DECIMAL(10,2);
        ALTER TABLE orders ALTER COLUMN total TYPE DECIMAL(10,2);
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
END $$;

-- Add NOT NULL constraints if not already present
DO $$
BEGIN
    BEGIN
        ALTER TABLE orders ALTER COLUMN subtotal SET NOT NULL;
        ALTER TABLE orders ALTER COLUMN tax SET NOT NULL;
        ALTER TABLE orders ALTER COLUMN shipping_cost SET NOT NULL;
        ALTER TABLE orders ALTER COLUMN total SET NOT NULL;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
END $$;

-- Add foreign key constraints if they don't exist
DO $$
BEGIN
    -- Check and add shipping address foreign key
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_order_shipping_address'
    ) THEN
        ALTER TABLE orders
            ADD CONSTRAINT fk_order_shipping_address 
            FOREIGN KEY (shipping_address_id) REFERENCES addresses(id);
    END IF;
    
    -- Check and add billing address foreign key
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_order_billing_address'
    ) THEN
        ALTER TABLE orders
            ADD CONSTRAINT fk_order_billing_address 
            FOREIGN KEY (billing_address_id) REFERENCES addresses(id);
    END IF;
    
    -- Check and add payment method foreign key
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_order_payment_method'
    ) THEN
        ALTER TABLE orders
            ADD CONSTRAINT fk_order_payment_method 
            FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id);
    END IF;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Update any existing NULL last_updated values
UPDATE orders SET last_updated = CURRENT_TIMESTAMP WHERE last_updated IS NULL;

-- Create a function to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update last_updated
DROP TRIGGER IF EXISTS update_orders_last_updated ON orders;
CREATE TRIGGER update_orders_last_updated
    BEFORE INSERT OR UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_last_updated_column();

-- Set NOT NULL constraint after ensuring all rows have a value
ALTER TABLE orders ALTER COLUMN last_updated SET NOT NULL; 