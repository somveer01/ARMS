-- ==========================================================
-- ARMS (Agricultural Retailer Management System)
-- PostgreSQL Complete Schema DDL
-- ==========================================================

DROP TABLE IF EXISTS stock_movements CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS sale_items CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS purchase_items CASCADE;
DROP TABLE IF EXISTS purchases CASCADE;
DROP TABLE IF EXISTS farmers CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS villages CASCADE;
DROP TABLE IF EXISTS districts CASCADE;

-- 1. Districts Master
CREATE TABLE districts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_hi VARCHAR(100)
);

-- 2. Villages Master
CREATE TABLE villages (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_hi VARCHAR(100),
    district_id VARCHAR(50) REFERENCES districts(id) ON DELETE CASCADE
);

-- 3. Product Categories Master
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_hi VARCHAR(100),
    color VARCHAR(20) DEFAULT 'emerald'
);

-- 4. Measurement Units Master
CREATE TABLE units (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    name_hi VARCHAR(50),
    short_code VARCHAR(20) NOT NULL
);

-- 5. Products Catalog Master
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    name_hi VARCHAR(200),
    category_id VARCHAR(50) REFERENCES categories(id),
    unit_id VARCHAR(50) REFERENCES units(id),
    hsn_code VARCHAR(20),
    batch_no VARCHAR(50),
    expiry_date DATE,
    purchase_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    selling_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    current_stock NUMERIC(10, 2) NOT NULL DEFAULT 0,
    min_stock_alert NUMERIC(10, 2) NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Suppliers / Distributors Master
CREATE TABLE suppliers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    company VARCHAR(150),
    phone VARCHAR(20) NOT NULL,
    gstin VARCHAR(30),
    address TEXT,
    opening_balance NUMERIC(12, 2) DEFAULT 0,
    current_payable NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Farmers Directory
CREATE TABLE farmers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    father_name VARCHAR(150),
    mobile VARCHAR(20) NOT NULL,
    district_id VARCHAR(50) REFERENCES districts(id),
    village_id VARCHAR(50) REFERENCES villages(id),
    land_acreage NUMERIC(6, 2) DEFAULT 0,
    credit_limit NUMERIC(12, 2) DEFAULT 50000,
    opening_due NUMERIC(12, 2) DEFAULT 0,
    current_due NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Purchases & Purchase Items
CREATE TABLE purchases (
    id VARCHAR(50) PRIMARY KEY,
    invoice_no VARCHAR(50) NOT NULL,
    supplier_id VARCHAR(50) REFERENCES suppliers(id),
    supplier_name VARCHAR(150),
    purchase_date DATE NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    paid_amount NUMERIC(12, 2) DEFAULT 0,
    balance_due NUMERIC(12, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_items (
    id SERIAL PRIMARY KEY,
    purchase_id VARCHAR(50) REFERENCES purchases(id) ON DELETE CASCADE,
    product_id VARCHAR(50) REFERENCES products(id),
    quantity NUMERIC(10, 2) NOT NULL,
    unit_rate NUMERIC(10, 2) NOT NULL,
    total_cost NUMERIC(12, 2) NOT NULL,
    batch_no VARCHAR(50),
    expiry_date DATE
);

-- 9. Sales & Sale Items
CREATE TABLE sales (
    id VARCHAR(50) PRIMARY KEY,
    invoice_no VARCHAR(50) UNIQUE NOT NULL,
    farmer_id VARCHAR(50) REFERENCES farmers(id),
    farmer_name VARCHAR(150),
    farmer_mobile VARCHAR(20),
    farmer_village VARCHAR(100),
    sale_date DATE NOT NULL,
    sub_total NUMERIC(12, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    grand_total NUMERIC(12, 2) NOT NULL,
    paid_amount NUMERIC(12, 2) DEFAULT 0,
    remaining_due NUMERIC(12, 2) DEFAULT 0,
    payment_mode VARCHAR(20) DEFAULT 'cash',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sale_items (
    id SERIAL PRIMARY KEY,
    sale_id VARCHAR(50) REFERENCES sales(id) ON DELETE CASCADE,
    product_id VARCHAR(50) REFERENCES products(id),
    product_name VARCHAR(200),
    unit_name VARCHAR(20),
    quantity NUMERIC(10, 2) NOT NULL,
    unit_rate NUMERIC(10, 2) NOT NULL,
    total_cost NUMERIC(12, 2) NOT NULL
);

-- 10. Payments (Udhar Recovery)
CREATE TABLE payments (
    id VARCHAR(50) PRIMARY KEY,
    receipt_no VARCHAR(50) UNIQUE NOT NULL,
    farmer_id VARCHAR(50) REFERENCES farmers(id),
    farmer_name VARCHAR(150),
    payment_date DATE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    payment_mode VARCHAR(20) DEFAULT 'cash',
    reference_no VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Stock Movement Audit Trail
CREATE TABLE stock_movements (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) REFERENCES products(id),
    product_name VARCHAR(200),
    date DATE NOT NULL,
    type VARCHAR(20) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    balance_after NUMERIC(10, 2) NOT NULL,
    reference_id VARCHAR(50),
    notes TEXT
);

-- Indexes for Ultra-Fast Queries (<10ms)
CREATE INDEX idx_farmers_village ON farmers(village_id);
CREATE INDEX idx_farmers_district ON farmers(district_id);
CREATE INDEX idx_farmers_mobile ON farmers(mobile);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_farmer ON sales(farmer_id);
CREATE INDEX idx_payments_farmer ON payments(farmer_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
