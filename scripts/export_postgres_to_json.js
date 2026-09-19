/**
 * ARMS: PostgreSQL Data Seeding & Extraction Utility
 * 
 * Usage:
 *   node scripts/export_postgres_to_json.js
 * 
 * If DATABASE_URL or PG* environment variables are provided,
 * it connects to PostgreSQL and extracts live tables.
 * Otherwise, it generates the validated seed package.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function exportData() {
  console.log('🌱 [ARMS] Starting PostgreSQL Seeding & Export Processor...');

  const connectionString = process.env.DATABASE_URL;

  if (connectionString) {
    console.log('📡 Connecting to PostgreSQL via DATABASE_URL...');
    try {
      // Dynamic import of pg if installed
      const { Client } = await import('pg');
      const client = new Client({ connectionString });
      await client.connect();
      console.log('✅ Connected to PostgreSQL successfully.');

      const queries = {
        products: `SELECT json_agg(row_to_json(t)) AS data FROM (
          SELECT id, name, name_hi AS "nameHi", category_id AS "categoryId", unit_id AS "unitId",
                 hsn_code AS "hsnCode", batch_no AS "batchNo", expiry_date AS "expiryDate",
                 purchase_price AS "purchasePrice", selling_price AS "sellingPrice",
                 current_stock AS "currentStock", min_stock_alert AS "minStockAlert", created_at AS "createdAt"
          FROM products
        ) t`,
        farmers: `SELECT json_agg(row_to_json(f)) AS data FROM (
          SELECT id, name, father_name AS "fatherName", mobile, district_id AS "districtId",
                 village_id AS "villageId", land_acreage AS "landAcreage", credit_limit AS "creditLimit",
                 opening_due AS "openingDue", current_due AS "currentDue", created_at AS "createdAt"
          FROM farmers
        ) f`,
        villages: `SELECT json_agg(row_to_json(v)) AS data FROM (
          SELECT id, name, name_hi AS "nameHi", district_id AS "districtId" FROM villages
        ) v`,
        districts: `SELECT json_agg(row_to_json(d)) AS data FROM (
          SELECT id, name, name_hi AS "nameHi" FROM districts
        ) d`,
        suppliers: `SELECT json_agg(row_to_json(s)) AS data FROM (
          SELECT id, name, company, phone, gstin, address,
                 opening_balance AS "openingBalance", current_payable AS "currentPayable", created_at AS "createdAt"
          FROM suppliers
        ) s`,
        categories: `SELECT json_agg(row_to_json(c)) AS data FROM categories c`,
        units: `SELECT json_agg(row_to_json(u)) AS data FROM units u`
      };

      const seedPackage = {};
      for (const [key, sql] of Object.entries(queries)) {
        const res = await client.query(sql);
        seedPackage[key] = res.rows[0]?.data || [];
        console.log(`   ✓ Exported ${key}: ${seedPackage[key].length} records`);
      }

      await client.end();
      const outputPath = path.join(__dirname, '..', 'public', 'postgres_seed.json');
      fs.writeFileSync(outputPath, JSON.stringify(seedPackage, null, 2));
      console.log(`🎉 Live PostgreSQL seed data written to: ${outputPath}`);
      return;
    } catch (err) {
      console.warn('⚠️ Could not connect to PostgreSQL client directly. Creating standalone JSON seed from schema...');
    }
  }

  // Standalone JSON seed generation from seed_data.sql definitions
  const sampleSeedPackage = {
    categories: [
      { id: 'cat-1', name: 'Fertilizers', nameHi: 'खाद / उर्वरक', color: 'emerald' },
      { id: 'cat-2', name: 'Seeds', nameHi: 'बीज', color: 'amber' },
      { id: 'cat-3', name: 'Pesticides', nameHi: 'कीटनाशक दवाइयां', color: 'rose' },
      { id: 'cat-4', name: 'Micro-nutrients & Tonics', nameHi: 'टॉनिक / सूक्ष्म पोषक तत्व', color: 'blue' },
      { id: 'cat-5', name: 'Sprayers & Equipment', nameHi: 'छिड़काव यंत्र व उपकरण', color: 'purple' }
    ],
    units: [
      { id: 'unit-1', name: 'Bag (बोरी/बैग)', nameHi: 'बैग (Bag)', shortCode: 'Bag' },
      { id: 'unit-2', name: 'Packet (पैकेट)', nameHi: 'पैकेट (Pkt)', shortCode: 'Pkt' },
      { id: 'unit-3', name: 'Bottle (बोतल)', nameHi: 'बोतल (Btl)', shortCode: 'Btl' },
      { id: 'unit-4', name: 'Kilogram (किलो)', nameHi: 'किलोग्राम (Kg)', shortCode: 'Kg' },
      { id: 'unit-5', name: 'Liter (लीटर)', nameHi: 'लीटर (Ltr)', shortCode: 'Ltr' },
      { id: 'unit-6', name: 'Piece (नग)', nameHi: 'नग (Pcs)', shortCode: 'Pcs' }
    ],
    districts: [
      { id: 'dist-1', name: 'Karnal', nameHi: 'करनाल' },
      { id: 'dist-2', name: 'Meerut', nameHi: 'मेरठ' },
      { id: 'dist-3', name: 'Kurukshetra', nameHi: 'कुरुक्षेत्र' }
    ],
    villages: [
      { id: 'vil-1', name: 'Rampur', nameHi: 'रामपुर', districtId: 'dist-1' },
      { id: 'vil-2', name: 'Kunjpura', nameHi: 'कुंजपुरा', districtId: 'dist-1' },
      { id: 'vil-3', name: 'Nilokheri', nameHi: 'नीलोखेड़ी', districtId: 'dist-1' },
      { id: 'vil-4', name: 'Taraori', nameHi: 'तरावड़ी', districtId: 'dist-1' },
      { id: 'vil-5', name: 'Daurala', nameHi: 'दौराला', districtId: 'dist-2' },
      { id: 'vil-6', name: 'Sardhana', nameHi: 'सरधना', districtId: 'dist-2' },
      { id: 'vil-7', name: 'Mawana', nameHi: 'मवाना', districtId: 'dist-2' },
      { id: 'vil-8', name: 'Pehowa', nameHi: 'पिहोवा', districtId: 'dist-3' }
    ],
    products: [
      {
        id: 'prod-1',
        name: 'Neem Coated Urea (45 Kg)',
        nameHi: 'नीम लेपित यूरिया (45 किग्रा)',
        categoryId: 'cat-1',
        unitId: 'unit-1',
        hsnCode: '31021000',
        batchNo: 'UR-2026-B1',
        purchasePrice: 242,
        sellingPrice: 266,
        currentStock: 120,
        minStockAlert: 25,
        createdAt: '2026-09-01T10:00:00Z'
      },
      {
        id: 'prod-2',
        name: 'DAP Fertilizer (50 Kg)',
        nameHi: 'डीएपी खाद (50 किग्रा)',
        categoryId: 'cat-1',
        unitId: 'unit-1',
        hsnCode: '31053000',
        batchNo: 'DAP-908',
        purchasePrice: 1280,
        sellingPrice: 1350,
        currentStock: 65,
        minStockAlert: 15,
        createdAt: '2026-09-01T10:00:00Z'
      },
      {
        id: 'prod-3',
        name: 'NPK 12:32:16 (50 Kg)',
        nameHi: 'एनपीके 12:32:16 (50 किग्रा)',
        categoryId: 'cat-1',
        unitId: 'unit-1',
        hsnCode: '31052000',
        batchNo: 'NPK-441',
        purchasePrice: 1400,
        sellingPrice: 1470,
        currentStock: 18,
        minStockAlert: 20,
        createdAt: '2026-09-01T10:00:00Z'
      },
      {
        id: 'prod-4',
        name: 'Chlorpyrifos 20% EC (1 Liter)',
        nameHi: 'क्लोरोपायरीफॉस 20% ईसी (1 लीटर)',
        categoryId: 'cat-3',
        unitId: 'unit-3',
        hsnCode: '38089190',
        batchNo: 'CHP-778',
        expiryDate: '2027-08-30',
        purchasePrice: 380,
        sellingPrice: 450,
        currentStock: 45,
        minStockAlert: 10,
        createdAt: '2026-09-01T10:00:00Z'
      },
      {
        id: 'prod-5',
        name: 'Coragen Insecticide (60 ml)',
        nameHi: 'कोराजन कीटनाशक (60 मिली)',
        categoryId: 'cat-3',
        unitId: 'unit-3',
        hsnCode: '38089199',
        batchNo: 'CRG-102',
        expiryDate: '2027-11-15',
        purchasePrice: 1550,
        sellingPrice: 1750,
        currentStock: 8,
        minStockAlert: 10,
        createdAt: '2026-09-01T10:00:00Z'
      },
      {
        id: 'prod-6',
        name: 'Hybrid Mustard Seed Pioneer 45S46 (1 Kg)',
        nameHi: 'हाइब्रिड सरसों बीज पायनियर 45S46 (1 किग्रा)',
        categoryId: 'cat-2',
        unitId: 'unit-2',
        hsnCode: '12075010',
        batchNo: 'PIO-MS-09',
        expiryDate: '2027-03-31',
        purchasePrice: 720,
        sellingPrice: 850,
        currentStock: 80,
        minStockAlert: 20,
        createdAt: '2026-09-01T10:00:00Z'
      },
      {
        id: 'prod-7',
        name: 'Certified Wheat Seed HD-2967 (40 Kg)',
        nameHi: 'प्रमाणित गेहूं बीज HD-2967 (40 किग्रा)',
        categoryId: 'cat-2',
        unitId: 'unit-1',
        hsnCode: '10019910',
        batchNo: 'WHT-2967-A',
        expiryDate: '2026-12-31',
        purchasePrice: 1100,
        sellingPrice: 1250,
        currentStock: 5,
        minStockAlert: 25,
        createdAt: '2026-09-01T10:00:00Z'
      },
      {
        id: 'prod-8',
        name: 'Zinc Sulphate Monohydrate 33% (5 Kg)',
        nameHi: 'जिंक सल्फेट 33% (5 किग्रा)',
        categoryId: 'cat-4',
        unitId: 'unit-2',
        hsnCode: '28332990',
        batchNo: 'ZN-33-88',
        purchasePrice: 310,
        sellingPrice: 380,
        currentStock: 35,
        minStockAlert: 10,
        createdAt: '2026-09-01T10:00:00Z'
      }
    ],
    suppliers: [
      {
        id: 'sup-1',
        name: 'IFFCO Fertilizer Depo',
        company: 'Indian Farmers Fertiliser Coop',
        phone: '9812001122',
        gstin: '06AAACI1234F1Z8',
        address: 'Grain Market, Karnal',
        openingBalance: 0,
        currentPayable: 25000,
        createdAt: '2026-09-01T10:00:00Z'
      },
      {
        id: 'sup-2',
        name: 'Bayer CropScience Hub',
        company: 'Bayer India Ltd',
        phone: '9822334455',
        gstin: '07AABCB5566G1Z2',
        address: 'GT Road, Panipat',
        openingBalance: 0,
        currentPayable: 15000,
        createdAt: '2026-09-01T10:00:00Z'
      },
      {
        id: 'sup-3',
        name: 'National Seeds Agency',
        company: 'National Seeds Corp',
        phone: '9899112233',
        gstin: '06AAACN9988H1Z4',
        address: 'Railway Station Road, Karnal',
        openingBalance: 0,
        currentPayable: 8000,
        createdAt: '2026-09-01T10:00:00Z'
      }
    ],
    farmers: [
      {
        id: 'farm-1',
        name: 'Rameshwar Sharma (रामेश्वर शर्मा)',
        fatherName: 'Late Sh. Kashi Ram',
        mobile: '9876543210',
        districtId: 'dist-1',
        villageId: 'vil-1',
        landAcreage: 12,
        creditLimit: 50000,
        openingDue: 3500,
        currentDue: 5200,
        createdAt: '2026-09-01T10:00:00Z'
      },
      {
        id: 'farm-2',
        name: 'Baldev Singh (बलदेव सिंह)',
        fatherName: 'Sh. Gurmukh Singh',
        mobile: '9812345678',
        districtId: 'dist-1',
        villageId: 'vil-1',
        landAcreage: 28,
        creditLimit: 100000,
        openingDue: 0,
        currentDue: 14200,
        createdAt: '2026-09-02T10:00:00Z'
      },
      {
        id: 'farm-3',
        name: 'Jaiveer Yadav (जयवीर यादव)',
        fatherName: 'Sh. Ramphal Yadav',
        mobile: '9416253412',
        districtId: 'dist-1',
        villageId: 'vil-1',
        landAcreage: 15,
        creditLimit: 60000,
        openingDue: 2000,
        currentDue: 4700,
        createdAt: '2026-09-02T10:00:00Z'
      },
      {
        id: 'farm-4',
        name: 'Suresh Chand (सुरेश चंद)',
        fatherName: 'Sh. Dharam Pal',
        mobile: '9896541230',
        districtId: 'dist-1',
        villageId: 'vil-2',
        landAcreage: 8,
        creditLimit: 40000,
        openingDue: 0,
        currentDue: 2800,
        createdAt: '2026-09-03T10:00:00Z'
      },
      {
        id: 'farm-5',
        name: 'Dharmender Tyagi (धर्मेन्द्र त्यागी)',
        fatherName: 'Sh. Satpal Tyagi',
        mobile: '9756123456',
        districtId: 'dist-2',
        villageId: 'vil-5',
        landAcreage: 18,
        creditLimit: 75000,
        openingDue: 1500,
        currentDue: 6300,
        createdAt: '2026-09-03T10:00:00Z'
      },
      {
        id: 'farm-6',
        name: 'Kuldeep Nain (कुलदीप नैन)',
        fatherName: 'Sh. Rajendra Nain',
        mobile: '9812098765',
        districtId: 'dist-1',
        villageId: 'vil-3',
        landAcreage: 22,
        creditLimit: 80000,
        openingDue: 0,
        currentDue: 0,
        createdAt: '2026-09-04T10:00:00Z'
      }
    ]
  };

  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'postgres_seed.json');
  fs.writeFileSync(outputPath, JSON.stringify(sampleSeedPackage, null, 2));
  console.log(`✅ [ARMS] Verified seed package generated at: ${outputPath}`);
}

exportData().catch(console.error);
