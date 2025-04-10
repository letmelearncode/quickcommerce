-- V2: Seed Initial Data

-- 1. Add Dummy Users
-- Password hash generated using BCrypt for the password "password"
-- Make sure the password encoder bean in SecurityConfig matches (e.g., BCryptPasswordEncoder)
INSERT INTO users (name, email, password, created_at, updated_at) VALUES
('Alice Test', 'alice@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bob Test', 'bob@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Dummy Categories
INSERT INTO categories (name, description) VALUES
('Groceries', 'Fresh produce, dairy, pantry staples'),
('Beverages', 'Water, soda, juice, coffee, tea'),
('Snacks', 'Chips, cookies, candy, nuts'),
('Household Essentials', 'Cleaning supplies, paper products, laundry'),
('Personal Care', 'Soap, shampoo, toothpaste, skincare');

-- Dummy Products (Assuming category IDs 1-5 generated above)

-- Groceries (Category ID: 1)
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, active, created_at, updated_at)
VALUES 
('Organic Apples (Bag)', 'Crisp and sweet organic apples, perfect for snacking.', 4.99, 50, 'https://via.placeholder.com/150/FF9999/FFFFFF?Text=Apples', 1, true, NOW(), NOW()),
('Milk (1 Gallon)', 'Fresh whole milk, pasteurized.', 3.89, 30, 'https://via.placeholder.com/150/EFEFEF/000000?Text=Milk', 1, true, NOW(), NOW()),
('Whole Wheat Bread', 'Sliced whole wheat bread for sandwiches and toast.', 2.99, 40, 'https://via.placeholder.com/150/D2B48C/FFFFFF?Text=Bread', 1, true, NOW(), NOW()),
('Eggs (Dozen)', 'Large grade A eggs.', 3.49, 60, 'https://via.placeholder.com/150/FFFFE0/000000?Text=Eggs', 1, true, NOW(), NOW());

-- Beverages (Category ID: 2)
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, active, created_at, updated_at)
VALUES 
('Spring Water (24 Pack)', 'Natural spring water, 16.9 fl oz bottles.', 5.99, 25, 'https://via.placeholder.com/150/ADD8E6/FFFFFF?Text=Water', 2, true, NOW(), NOW()),
('Cola (12 Pack)', 'Classic cola flavor, 12 fl oz cans.', 6.49, 40, 'https://via.placeholder.com/150/A52A2A/FFFFFF?Text=Cola', 2, true, NOW(), NOW()),
('Orange Juice (Half Gallon)', '100% pure orange juice, not from concentrate.', 4.29, 20, 'https://via.placeholder.com/150/FFA500/FFFFFF?Text=OJ', 2, true, NOW(), NOW()),
('Medium Roast Coffee Beans', 'Whole bean medium roast coffee, 12 oz bag.', 8.99, 15, 'https://via.placeholder.com/150/8B4513/FFFFFF?Text=Coffee', 2, true, NOW(), NOW());

-- Snacks (Category ID: 3)
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, active, created_at, updated_at)
VALUES 
('Potato Chips (Family Size)', 'Classic salted potato chips.', 3.99, 50, 'https://via.placeholder.com/150/FFDA63/000000?Text=Chips', 3, true, NOW(), NOW()),
('Chocolate Chip Cookies', 'Pack of classic chocolate chip cookies.', 3.49, 35, 'https://via.placeholder.com/150/D2691E/FFFFFF?Text=Cookies', 3, true, NOW(), NOW()),
('Trail Mix', 'Mix of nuts, seeds, and dried fruit.', 5.49, 25, 'https://via.placeholder.com/150/CD853F/FFFFFF?Text=TrailMix', 3, true, NOW(), NOW()),
('Salted Peanuts', 'Roasted and salted peanuts, 16 oz jar.', 4.19, 40, 'https://via.placeholder.com/150/DEB887/000000?Text=Peanuts', 3, true, NOW(), NOW());

-- Household Essentials (Category ID: 4)
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, active, created_at, updated_at)
VALUES 
('Paper Towels (6 Rolls)', 'Absorbent paper towels, select-a-size.', 7.99, 30, 'https://via.placeholder.com/150/F5F5F5/000000?Text=PaperTowels', 4, true, NOW(), NOW()),
('Dish Soap', 'Liquid dish soap, 28 fl oz.', 3.29, 45, 'https://via.placeholder.com/150/90EE90/FFFFFF?Text=DishSoap', 4, true, NOW(), NOW()),
('Laundry Detergent', 'Liquid laundry detergent, 50 fl oz.', 9.99, 20, 'https://via.placeholder.com/150/87CEFA/000000?Text=Detergent', 4, true, NOW(), NOW());

-- Personal Care (Category ID: 5)
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, active, created_at, updated_at)
VALUES 
('Bar Soap (3 Pack)', 'Gentle cleansing bar soap.', 4.49, 40, 'https://via.placeholder.com/150/E0FFFF/000000?Text=Soap', 5, true, NOW(), NOW()),
('Shampoo', 'Daily clarifying shampoo, 12 fl oz.', 5.99, 30, 'https://via.placeholder.com/150/B0E0E6/000000?Text=Shampoo', 5, true, NOW(), NOW()),
('Fluoride Toothpaste', 'Cavity protection toothpaste, 6 oz.', 2.79, 55, 'https://via.placeholder.com/150/FFFFFF/0000FF?Text=Toothpaste', 5, true, NOW(), NOW()); 