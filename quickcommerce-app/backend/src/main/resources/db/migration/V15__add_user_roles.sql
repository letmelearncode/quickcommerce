-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add ROLE_CUSTOMER to all existing users
INSERT INTO user_roles (user_id, role)
SELECT id, 'ROLE_CUSTOMER'
FROM users;

-- (Optional) Create a test delivery partner account or add the role to an existing user
-- Example: Add ROLE_PARTNER to user ID 1 (if exists)
INSERT INTO user_roles (user_id, role)
SELECT 1, 'ROLE_PARTNER'
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1);
