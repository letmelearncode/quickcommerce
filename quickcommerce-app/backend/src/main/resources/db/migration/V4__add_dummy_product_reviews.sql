 -- Dummy Product Reviews
-- NOTE: Adjust product_id and user_id values based on your existing data from V1/V2 migrations.

-- Reviews for Product 1 (e.g., Whole Wheat Bread)
INSERT INTO product_reviews (rating, comment, product_id, user_id, created_at, updated_at) VALUES
(5, 'Absolutely fantastic bread! Fresh and wholesome.', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Assuming product 1 and user 1 exist
(4, 'Good quality bread, great for sandwiches.', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);       -- Assuming product 1 and user 2 exist

-- Reviews for Product 2 (e.g., Milk)
INSERT INTO product_reviews (rating, comment, product_id, user_id, created_at, updated_at) VALUES
(5, 'Always fresh and delivered quickly.', 2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Assuming product 2 and user 2 exist
(3, 'Usually good, but was close to expiry this time.', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); -- Assuming product 2 and user 1 exist

-- Reviews for Product 3 (e.g., Eggs)
INSERT INTO product_reviews (rating, comment, product_id, user_id, created_at, updated_at) VALUES
(4, 'Good value pack, eggs were intact.', 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); -- Assuming product 3 and user 1 exist