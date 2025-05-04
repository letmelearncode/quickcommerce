-- Add user_id column to payment_methods and set up foreign key
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS user_id BIGINT;
ALTER TABLE payment_methods ADD CONSTRAINT fk_payment_methods_user FOREIGN KEY (user_id) REFERENCES users(id); 