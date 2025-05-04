-- Drop existing foreign key constraints
ALTER TABLE orders DROP CONSTRAINT IF EXISTS fk_order_shipping_address;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS fk_order_billing_address;

-- Drop and recreate addresses table
DROP TABLE IF EXISTS addresses;

CREATE TABLE addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    apartment VARCHAR(255),
    additional_info TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Recreate foreign key constraints for orders table
ALTER TABLE orders
    ADD CONSTRAINT fk_order_shipping_address 
    FOREIGN KEY (shipping_address_id) REFERENCES addresses(id);

ALTER TABLE orders
    ADD CONSTRAINT fk_order_billing_address 
    FOREIGN KEY (billing_address_id) REFERENCES addresses(id); 