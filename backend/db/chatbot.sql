CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    contact_info TEXT,
    product_categories TEXT[]
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    brand VARCHAR(100),
    price DECIMAL(10, 2),
    category VARCHAR(100),
    description TEXT,
    supplier_id INTEGER REFERENCES suppliers(id)
);

-- Sample Data
INSERT INTO suppliers (name, contact_info, product_categories)
VALUES ('Supplier A', 'contact@suppliera.com', ARRAY['laptops', 'smartphones']);

INSERT INTO products (name, brand, price, category, description, supplier_id)
VALUES ('Laptop X', 'Brand X', 1200.00, 'laptops', 'A high-performance laptop', 1);
