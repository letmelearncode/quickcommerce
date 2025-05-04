-- Add upi_id column to payment_methods table
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS upi_id VARCHAR(255); 