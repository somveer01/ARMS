-- ==========================================================
-- ARMS (Agricultural Retailer Management System)
-- PostgreSQL Seed Data Script
-- ==========================================================

-- 1. Districts
INSERT INTO districts (id, name, name_hi) VALUES
('dist-1', 'Karnal', 'करनाल'),
('dist-2', 'Meerut', 'मेरठ'),
('dist-3', 'Kurukshetra', 'कुरुक्षेत्र');

-- 2. Villages
INSERT INTO villages (id, name, name_hi, district_id) VALUES
('vil-1', 'Rampur', 'रामपुर', 'dist-1'),
('vil-2', 'Kunjpura', 'कुंजपुरा', 'dist-1'),
('vil-3', 'Nilokheri', 'नीलोखेड़ी', 'dist-1'),
('vil-4', 'Taraori', 'तरावड़ी', 'dist-1'),
('vil-5', 'Daurala', 'दौराला', 'dist-2'),
('vil-6', 'Sardhana', 'सरधना', 'dist-2'),
('vil-7', 'Mawana', 'मवाना', 'dist-2'),
('vil-8', 'Pehowa', 'पिहोवा', 'dist-3');

-- 3. Categories
INSERT INTO categories (id, name, name_hi, color) VALUES
('cat-1', 'Fertilizers', 'खाद / उर्वरक', 'emerald'),
('cat-2', 'Seeds', 'बीज', 'amber'),
('cat-3', 'Pesticides', 'कीटनाशक दवाइयां', 'rose'),
('cat-4', 'Micro-nutrients & Tonics', 'टॉनिक / सूक्ष्म पोषक तत्व', 'blue'),
('cat-5', 'Sprayers & Equipment', 'छिड़काव यंत्र व उपकरण', 'purple');

-- 4. Units
INSERT INTO units (id, name, name_hi, short_code) VALUES
('unit-1', 'Bag (बोरी/बैग)', 'बैग (Bag)', 'Bag'),
('unit-2', 'Packet (पैकेट)', 'पैकेट (Pkt)', 'Pkt'),
('unit-3', 'Bottle (बोतल)', 'बोतल (Btl)', 'Btl'),
('unit-4', 'Kilogram (किलो)', 'किलोग्राम (Kg)', 'Kg'),
('unit-5', 'Liter (लीटर)', 'लीटर (Ltr)', 'Ltr'),
('unit-6', 'Piece (नग)', 'नग (Pcs)', 'Pcs');

-- 5. Products
INSERT INTO products (id, name, name_hi, category_id, unit_id, hsn_code, batch_no, expiry_date, purchase_price, selling_price, current_stock, min_stock_alert) VALUES
('prod-1', 'Neem Coated Urea (45 Kg)', 'नीम लेपित यूरिया (45 किग्रा)', 'cat-1', 'unit-1', '31021000', 'UR-2026-B1', NULL, 242.00, 266.00, 120, 25),
('prod-2', 'DAP Fertilizer (50 Kg)', 'डीएपी खाद (50 किग्रा)', 'cat-1', 'unit-1', '31053000', 'DAP-908', NULL, 1280.00, 1350.00, 65, 15),
('prod-3', 'NPK 12:32:16 (50 Kg)', 'एनपीके 12:32:16 (50 किग्रा)', 'cat-1', 'unit-1', '31052000', 'NPK-441', NULL, 1400.00, 1470.00, 18, 20),
('prod-4', 'Chlorpyrifos 20% EC (1 Liter)', 'क्लोरोपायरीफॉस 20% ईसी (1 लीटर)', 'cat-3', 'unit-3', '38089190', 'CHP-778', '2027-08-30', 380.00, 450.00, 45, 10),
('prod-5', 'Coragen Insecticide (60 ml)', 'कोराजन कीटनाशक (60 मिली)', 'cat-3', 'unit-3', '38089199', 'CRG-102', '2027-11-15', 1550.00, 1750.00, 8, 10),
('prod-6', 'Hybrid Mustard Seed Pioneer 45S46 (1 Kg)', 'हाइब्रिड सरसों बीज पायनियर 45S46 (1 किग्रा)', 'cat-2', 'unit-2', '12075010', 'PIO-MS-09', '2027-03-31', 720.00, 850.00, 80, 20),
('prod-7', 'Certified Wheat Seed HD-2967 (40 Kg)', 'प्रमाणित गेहूं बीज HD-2967 (40 किग्रा)', 'cat-2', 'unit-1', '10019910', 'WHT-2967-A', '2026-12-31', 1100.00, 1250.00, 5, 25),
('prod-8', 'Zinc Sulphate Monohydrate 33% (5 Kg)', 'जिंक सल्फेट 33% (5 किग्रा)', 'cat-4', 'unit-2', '28332990', 'ZN-33-88', NULL, 310.00, 380.00, 35, 10);

-- 6. Suppliers
INSERT INTO suppliers (id, name, company, phone, gstin, address, opening_balance, current_payable) VALUES
('sup-1', 'IFFCO Fertilizer Depo', 'Indian Farmers Fertiliser Coop', '9812001122', '06AAACI1234F1Z8', 'Grain Market, Karnal', 0, 25000),
('sup-2', 'Bayer CropScience Hub', 'Bayer India Ltd', '9822334455', '07AABCB5566G1Z2', 'GT Road, Panipat', 0, 15000),
('sup-3', 'National Seeds Agency', 'National Seeds Corp', '9899112233', '06AAACN9988H1Z4', 'Railway Station Road, Karnal', 0, 8000);

-- 7. Farmers
INSERT INTO farmers (id, name, father_name, mobile, district_id, village_id, land_acreage, credit_limit, opening_due, current_due) VALUES
('farm-1', 'Rameshwar Sharma (रामेश्वर शर्मा)', 'Late Sh. Kashi Ram', '9876543210', 'dist-1', 'vil-1', 12.00, 50000, 3500, 5200),
('farm-2', 'Baldev Singh (बलदेव सिंह)', 'Sh. Gurmukh Singh', '9812345678', 'dist-1', 'vil-1', 28.00, 100000, 0, 14200),
('farm-3', 'Jaiveer Yadav (जयवीर यादव)', 'Sh. Ramphal Yadav', '9416253412', 'dist-1', 'vil-1', 15.00, 60000, 2000, 4700),
('farm-4', 'Suresh Chand (सुरेश चंद)', 'Sh. Dharam Pal', '9896541230', 'dist-1', 'vil-2', 8.00, 40000, 0, 2800),
('farm-5', 'Dharmender Tyagi (धर्मेन्द्र त्यागी)', 'Sh. Satpal Tyagi', '9756123456', 'dist-2', 'vil-5', 18.00, 75000, 1500, 6300),
('farm-6', 'Kuldeep Nain (कुलदीप नैन)', 'Sh. Rajendra Nain', '9812098765', 'dist-1', 'vil-3', 22.00, 80000, 0, 0);

-- 8. Purchases
INSERT INTO purchases (id, invoice_no, supplier_id, supplier_name, purchase_date, total_amount, paid_amount, balance_due, notes) VALUES
('pur-1', 'IFFCO-9921', 'sup-1', 'IFFCO Fertilizer Depo', '2026-09-05', 75400, 50400, 25000, 'Seasonal supply of Urea & DAP');

INSERT INTO purchase_items (purchase_id, product_id, quantity, unit_rate, total_cost) VALUES
('pur-1', 'prod-1', 100, 242, 24200),
('pur-1', 'prod-2', 40, 1280, 51200);

-- 9. Sales
INSERT INTO sales (id, invoice_no, farmer_id, farmer_name, farmer_mobile, farmer_village, sale_date, sub_total, discount, grand_total, paid_amount, remaining_due, payment_mode, notes) VALUES
('sale-1', 'INV-2026-001', 'farm-1', 'Rameshwar Sharma (रामेश्वर शर्मा)', '9876543210', 'Rampur', '2026-09-18', 3560, 60, 3500, 1800, 1700, 'cash', 'Wheat sowing preparation'),
('sale-2', 'INV-2026-002', 'farm-2', 'Baldev Singh (बलदेव सिंह)', '9812345678', 'Rampur', '2026-09-19', 20250, 250, 20000, 5800, 14200, 'upi', 'Mustard crop fertilizer');

INSERT INTO sale_items (sale_id, product_id, product_name, unit_name, quantity, unit_rate, total_cost) VALUES
('sale-1', 'prod-1', 'Neem Coated Urea (45 Kg)', 'Bag', 10, 266, 2660),
('sale-1', 'prod-4', 'Chlorpyrifos 20% EC (1 Liter)', 'Btl', 2, 450, 900),
('sale-2', 'prod-2', 'DAP Fertilizer (50 Kg)', 'Bag', 15, 1350, 20250);

-- 10. Payments
INSERT INTO payments (id, receipt_no, farmer_id, farmer_name, payment_date, amount, payment_mode, reference_no, notes) VALUES
('pay-1', 'REC-2026-001', 'farm-1', 'Rameshwar Sharma (रामेश्वर शर्मा)', '2026-09-17', 2000, 'upi', 'UPI-9821039812', 'Partial payment against previous paddy dues');

-- 11. Stock Movements
INSERT INTO stock_movements (id, product_id, product_name, date, type, quantity, balance_after, reference_id, notes) VALUES
('sm-1', 'prod-1', 'Neem Coated Urea (45 Kg)', '2026-09-05', 'purchase', 100, 130, 'pur-1', 'Purchased from IFFCO'),
('sm-2', 'prod-1', 'Neem Coated Urea (45 Kg)', '2026-09-18', 'sale', -10, 120, 'sale-1', 'Sold to Rameshwar Sharma'),
('sm-3', 'prod-2', 'DAP Fertilizer (50 Kg)', '2026-09-05', 'purchase', 40, 80, 'pur-1', 'Purchased from IFFCO'),
('sm-4', 'prod-2', 'DAP Fertilizer (50 Kg)', '2026-09-19', 'sale', -15, 65, 'sale-2', 'Sold to Baldev Singh');
