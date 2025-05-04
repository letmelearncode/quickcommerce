-- Add user_id column to addresses table
ALTER TABLE addresses
ADD COLUMN user_id BIGINT NOT NULL;

-- Add foreign key constraint
ALTER TABLE addresses
ADD CONSTRAINT fk_addresses_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;