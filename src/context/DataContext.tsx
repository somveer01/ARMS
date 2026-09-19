import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Category,
  Unit,
  Product,
  Supplier,
  District,
  Village,
  Farmer,
  Purchase,
  Sale,
  Payment,
  StockMovement,
} from '../types';

interface DataContextType {
  categories: Category[];
  units: Unit[];
  products: Product[];
  suppliers: Supplier[];
  districts: District[];
  villages: Village[];
  farmers: Farmer[];
  purchases: Purchase[];
  sales: Sale[];
  payments: Payment[];
  stockMovements: StockMovement[];

  // Mutations
  addCategory: (item: Omit<Category, 'id'>) => void;
  addUnit: (item: Omit<Unit, 'id'>) => void;
  addProduct: (item: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, item: Partial<Product>) => void;
  addSupplier: (item: Omit<Supplier, 'id' | 'currentPayable' | 'createdAt'>) => void;
  addDistrict: (item: Omit<District, 'id'>) => District;
  addVillage: (item: Omit<Village, 'id'>) => Village;
  addFarmer: (item: Omit<Farmer, 'id' | 'currentDue' | 'createdAt'>) => Farmer;
  updateFarmer: (id: string, item: Partial<Farmer>) => void;

  // Workflows
  createPurchase: (purchase: Omit<Purchase, 'id' | 'createdAt'>) => Purchase;
  createSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => Sale;
  createPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => Payment;
  resetToDefaults: () => void;
  importPostgresSeed: (seedData: any) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial Seed Data
const initialCategories: Category[] = [
  { id: 'cat-1', name: 'Fertilizers', nameHi: 'खाद / उर्वरक', color: 'emerald' },
  { id: 'cat-2', name: 'Seeds', nameHi: 'बीज', color: 'amber' },
  { id: 'cat-3', name: 'Pesticides', nameHi: 'कीटनाशक दवाइयां', color: 'rose' },
  { id: 'cat-4', name: 'Micro-nutrients & Tonics', nameHi: 'टॉनिक / सूक्ष्म पोषक तत्व', color: 'blue' },
  { id: 'cat-5', name: 'Sprayers & Equipment', nameHi: 'छिड़काव यंत्र व उपकरण', color: 'purple' },
];

const initialUnits: Unit[] = [
  { id: 'unit-1', name: 'Bag (बोरी/बैग)', nameHi: 'बैग (Bag)', shortCode: 'Bag' },
  { id: 'unit-2', name: 'Packet (पैकेट)', nameHi: 'पैकेट (Pkt)', shortCode: 'Pkt' },
  { id: 'unit-3', name: 'Bottle (बोतल)', nameHi: 'बोतल (Btl)', shortCode: 'Btl' },
  { id: 'unit-4', name: 'Kilogram (किलो)', nameHi: 'किलोग्राम (Kg)', shortCode: 'Kg' },
  { id: 'unit-5', name: 'Liter (लीटर)', nameHi: 'लीटर (Ltr)', shortCode: 'Ltr' },
  { id: 'unit-6', name: 'Piece (नग)', nameHi: 'नग (Pcs)', shortCode: 'Pcs' },
];

const initialDistricts: District[] = [
  { id: 'dist-1', name: 'Karnal', nameHi: 'करनाल' },
  { id: 'dist-2', name: 'Meerut', nameHi: 'मेरठ' },
  { id: 'dist-3', name: 'Kurukshetra', nameHi: 'कुरुक्षेत्र' },
];

const initialVillages: Village[] = [
  { id: 'vil-1', name: 'Rampur', nameHi: 'रामपुर', districtId: 'dist-1' },
  { id: 'vil-2', name: 'Kunjpura', nameHi: 'कुंजपुरा', districtId: 'dist-1' },
  { id: 'vil-3', name: 'Nilokheri', nameHi: 'नीलोखेड़ी', districtId: 'dist-1' },
  { id: 'vil-4', name: 'Taraori', nameHi: 'तरावड़ी', districtId: 'dist-1' },
  { id: 'vil-5', name: 'Daurala', nameHi: 'दौराला', districtId: 'dist-2' },
  { id: 'vil-6', name: 'Sardhana', nameHi: 'सरधना', districtId: 'dist-2' },
  { id: 'vil-7', name: 'Mawana', nameHi: 'मवाना', districtId: 'dist-2' },
  { id: 'vil-8', name: 'Pehowa', nameHi: 'पिहोवा', districtId: 'dist-3' },
];

const initialSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'IFFCO Fertilizer Depo',
    company: 'Indian Farmers Fertiliser Coop',
    phone: '9812001122',
    gstin: '06AAACI1234F1Z8',
    address: 'Grain Market, Karnal',
    openingBalance: 0,
    currentPayable: 25000,
    createdAt: '2026-09-01T10:00:00Z',
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
    createdAt: '2026-09-01T10:00:00Z',
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
    createdAt: '2026-09-01T10:00:00Z',
  },
];

const initialProducts: Product[] = [
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
    createdAt: '2026-09-01T10:00:00Z',
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
    createdAt: '2026-09-01T10:00:00Z',
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
    minStockAlert: 20, // triggers low stock alert!
    createdAt: '2026-09-01T10:00:00Z',
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
    createdAt: '2026-09-01T10:00:00Z',
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
    minStockAlert: 10, // triggers low stock alert!
    createdAt: '2026-09-01T10:00:00Z',
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
    createdAt: '2026-09-01T10:00:00Z',
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
    minStockAlert: 25, // triggers low stock alert!
    createdAt: '2026-09-01T10:00:00Z',
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
    createdAt: '2026-09-01T10:00:00Z',
  },
];

const initialFarmers: Farmer[] = [
  {
    id: 'farm-1',
    name: 'Rameshwar Sharma (रामेश्वर शर्मा)',
    fatherName: 'Late Sh. Kashi Ram',
    mobile: '9876543210',
    districtId: 'dist-1',
    villageId: 'vil-1', // Rampur
    landAcreage: 12,
    creditLimit: 50000,
    openingDue: 3500,
    currentDue: 5200,
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'farm-2',
    name: 'Baldev Singh (बलदेव सिंह)',
    fatherName: 'Sh. Gurmukh Singh',
    mobile: '9812345678',
    districtId: 'dist-1',
    villageId: 'vil-1', // Rampur
    landAcreage: 28,
    creditLimit: 100000,
    openingDue: 0,
    currentDue: 14200,
    createdAt: '2026-09-02T10:00:00Z',
  },
  {
    id: 'farm-3',
    name: 'Jaiveer Yadav (जयवीर यादव)',
    fatherName: 'Sh. Ramphal Yadav',
    mobile: '9416253412',
    districtId: 'dist-1',
    villageId: 'vil-1', // Rampur
    landAcreage: 15,
    creditLimit: 60000,
    openingDue: 2000,
    currentDue: 4700,
    createdAt: '2026-09-02T10:00:00Z',
  },
  {
    id: 'farm-4',
    name: 'Suresh Chand (सुरेश चंद)',
    fatherName: 'Sh. Dharam Pal',
    mobile: '9896541230',
    districtId: 'dist-1',
    villageId: 'vil-2', // Kunjpura
    landAcreage: 8,
    creditLimit: 40000,
    openingDue: 0,
    currentDue: 2800,
    createdAt: '2026-09-03T10:00:00Z',
  },
  {
    id: 'farm-5',
    name: 'Dharmender Tyagi (धर्मेन्द्र त्यागी)',
    fatherName: 'Sh. Satpal Tyagi',
    mobile: '9756123456',
    districtId: 'dist-2',
    villageId: 'vil-5', // Daurala
    landAcreage: 18,
    creditLimit: 75000,
    openingDue: 1500,
    currentDue: 6300,
    createdAt: '2026-09-03T10:00:00Z',
  },
  {
    id: 'farm-6',
    name: 'Kuldeep Nain (कुलदीप नैन)',
    fatherName: 'Sh. Rajendra Nain',
    mobile: '9812098765',
    districtId: 'dist-1',
    villageId: 'vil-3', // Nilokheri
    landAcreage: 22,
    creditLimit: 80000,
    openingDue: 0,
    currentDue: 0, // Fully paid
    createdAt: '2026-09-04T10:00:00Z',
  },
];

const initialPurchases: Purchase[] = [
  {
    id: 'pur-1',
    invoiceNo: 'IFFCO-9921',
    supplierId: 'sup-1',
    supplierName: 'IFFCO Fertilizer Depo',
    purchaseDate: '2026-09-05',
    items: [
      {
        productId: 'prod-1',
        productName: 'Neem Coated Urea (45 Kg)',
        quantity: 100,
        unitRate: 242,
        totalCost: 24200,
      },
      {
        productId: 'prod-2',
        productName: 'DAP Fertilizer (50 Kg)',
        quantity: 40,
        unitRate: 1280,
        totalCost: 51200,
      },
    ],
    totalAmount: 75400,
    paidAmount: 50400,
    balanceDue: 25000,
    notes: 'Seasonal supply of Urea & DAP',
    createdAt: '2026-09-05T11:00:00Z',
  },
];

const initialSales: Sale[] = [
  {
    id: 'sale-1',
    invoiceNo: 'INV-2026-001',
    farmerId: 'farm-1',
    farmerName: 'Rameshwar Sharma (रामेश्वर शर्मा)',
    farmerMobile: '9876543210',
    farmerVillage: 'Rampur',
    saleDate: '2026-09-18',
    items: [
      {
        productId: 'prod-1',
        productName: 'Neem Coated Urea (45 Kg)',
        unitName: 'Bag',
        quantity: 10,
        unitRate: 266,
        totalCost: 2660,
      },
      {
        productId: 'prod-4',
        productName: 'Chlorpyrifos 20% EC (1 Liter)',
        unitName: 'Btl',
        quantity: 2,
        unitRate: 450,
        totalCost: 900,
      },
    ],
    subTotal: 3560,
    discount: 60,
    grandTotal: 3500,
    paidAmount: 1800,
    remainingDue: 1700,
    paymentMode: 'cash',
    notes: 'Wheat sowing preparation',
    createdAt: '2026-09-18T14:30:00Z',
  },
  {
    id: 'sale-2',
    invoiceNo: 'INV-2026-002',
    farmerId: 'farm-2',
    farmerName: 'Baldev Singh (बलदेव सिंह)',
    farmerMobile: '9812345678',
    farmerVillage: 'Rampur',
    saleDate: '2026-09-19',
    items: [
      {
        productId: 'prod-2',
        productName: 'DAP Fertilizer (50 Kg)',
        unitName: 'Bag',
        quantity: 15,
        unitRate: 1350,
        totalCost: 20250,
      },
    ],
    subTotal: 20250,
    discount: 250,
    grandTotal: 20000,
    paidAmount: 5800,
    remainingDue: 14200,
    paymentMode: 'upi',
    notes: 'Mustard crop fertilizer',
    createdAt: '2026-09-19T11:15:00Z',
  },
];

const initialPayments: Payment[] = [
  {
    id: 'pay-1',
    receiptNo: 'REC-2026-001',
    farmerId: 'farm-1',
    farmerName: 'Rameshwar Sharma (रामेश्वर शर्मा)',
    paymentDate: '2026-09-17',
    amount: 2000,
    paymentMode: 'upi',
    referenceNo: 'UPI-9821039812',
    notes: 'Partial payment against previous paddy dues',
    createdAt: '2026-09-17T16:00:00Z',
  },
];

const initialStockMovements: StockMovement[] = [
  {
    id: 'sm-1',
    productId: 'prod-1',
    productName: 'Neem Coated Urea (45 Kg)',
    date: '2026-09-05',
    type: 'purchase',
    quantity: 100,
    balanceAfter: 130,
    referenceId: 'pur-1',
    notes: 'Purchased from IFFCO',
  },
  {
    id: 'sm-2',
    productId: 'prod-1',
    productName: 'Neem Coated Urea (45 Kg)',
    date: '2026-09-18',
    type: 'sale',
    quantity: -10,
    balanceAfter: 120,
    referenceId: 'sale-1',
    notes: 'Sold to Rameshwar Sharma',
  },
  {
    id: 'sm-3',
    productId: 'prod-2',
    productName: 'DAP Fertilizer (50 Kg)',
    date: '2026-09-05',
    type: 'purchase',
    quantity: 40,
    balanceAfter: 80,
    referenceId: 'pur-1',
    notes: 'Purchased from IFFCO',
  },
  {
    id: 'sm-4',
    productId: 'prod-2',
    productName: 'DAP Fertilizer (50 Kg)',
    date: '2026-09-19',
    type: 'sale',
    quantity: -15,
    balanceAfter: 65,
    referenceId: 'sale-2',
    notes: 'Sold to Baldev Singh',
  },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('arms_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [units, setUnits] = useState<Unit[]>(() => {
    const saved = localStorage.getItem('arms_units');
    return saved ? JSON.parse(saved) : initialUnits;
  });

  const [districts, setDistricts] = useState<District[]>(() => {
    const saved = localStorage.getItem('arms_districts');
    return saved ? JSON.parse(saved) : initialDistricts;
  });

  const [villages, setVillages] = useState<Village[]>(() => {
    const saved = localStorage.getItem('arms_villages');
    return saved ? JSON.parse(saved) : initialVillages;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('arms_suppliers');
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('arms_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [farmers, setFarmers] = useState<Farmer[]>(() => {
    const saved = localStorage.getItem('arms_farmers');
    return saved ? JSON.parse(saved) : initialFarmers;
  });

  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem('arms_purchases');
    return saved ? JSON.parse(saved) : initialPurchases;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('arms_sales');
    return saved ? JSON.parse(saved) : initialSales;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('arms_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('arms_stock_movements');
    return saved ? JSON.parse(saved) : initialStockMovements;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('arms_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('arms_units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('arms_districts', JSON.stringify(districts));
  }, [districts]);

  useEffect(() => {
    localStorage.setItem('arms_villages', JSON.stringify(villages));
  }, [villages]);

  useEffect(() => {
    localStorage.setItem('arms_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('arms_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('arms_farmers', JSON.stringify(farmers));
  }, [farmers]);

  useEffect(() => {
    localStorage.setItem('arms_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('arms_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('arms_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('arms_stock_movements', JSON.stringify(stockMovements));
  }, [stockMovements]);

  // Mutations
  const addCategory = (item: Omit<Category, 'id'>) => {
    const newCat: Category = { ...item, id: `cat-${Date.now()}` };
    setCategories(prev => [...prev, newCat]);
  };

  const addUnit = (item: Omit<Unit, 'id'>) => {
    const newUnit: Unit = { ...item, id: `unit-${Date.now()}` };
    setUnits(prev => [...prev, newUnit]);
  };

  const addProduct = (item: Omit<Product, 'id' | 'createdAt'>) => {
    const newProd: Product = {
      ...item,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProd]);
  };

  const updateProduct = (id: string, item: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...item } : p)));
  };

  const addSupplier = (item: Omit<Supplier, 'id' | 'currentPayable' | 'createdAt'>) => {
    const newSup: Supplier = {
      ...item,
      id: `sup-${Date.now()}`,
      currentPayable: item.openingBalance || 0,
      createdAt: new Date().toISOString(),
    };
    setSuppliers(prev => [...prev, newSup]);
  };

  const addDistrict = (item: Omit<District, 'id'>): District => {
    const newDist: District = { ...item, id: `dist-${Date.now()}` };
    setDistricts(prev => [...prev, newDist]);
    return newDist;
  };

  const addVillage = (item: Omit<Village, 'id'>): Village => {
    const newVil: Village = { ...item, id: `vil-${Date.now()}` };
    setVillages(prev => [...prev, newVil]);
    return newVil;
  };

  const addFarmer = (item: Omit<Farmer, 'id' | 'currentDue' | 'createdAt'>): Farmer => {
    const newFarmer: Farmer = {
      ...item,
      id: `farm-${Date.now()}`,
      currentDue: item.openingDue || 0,
      createdAt: new Date().toISOString(),
    };
    setFarmers(prev => [...prev, newFarmer]);
    return newFarmer;
  };

  const updateFarmer = (id: string, item: Partial<Farmer>) => {
    setFarmers(prev => prev.map(f => (f.id === id ? { ...f, ...item } : f)));
  };

  // Workflow 2: Purchase Entry
  // Step 2 & 3: updates stock (+), supplier ledger (+ liability), records movement
  const createPurchase = (purchaseData: Omit<Purchase, 'id' | 'createdAt'>): Purchase => {
    const purchaseId = `pur-${Date.now()}`;
    const newPurchase: Purchase = {
      ...purchaseData,
      id: purchaseId,
      createdAt: new Date().toISOString(),
    };

    // 1. Update product stock levels
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const itemPurchased = purchaseData.items.find(it => it.productId === p.id);
        if (itemPurchased) {
          return { ...p, currentStock: p.currentStock + itemPurchased.quantity };
        }
        return p;
      });
    });

    // 2. Update supplier ledger
    setSuppliers(prevSuppliers => {
      return prevSuppliers.map(s => {
        if (s.id === purchaseData.supplierId) {
          return {
            ...s,
            currentPayable: s.currentPayable + purchaseData.balanceDue,
          };
        }
        return s;
      });
    });

    // 3. Log stock movements
    const newMovements: StockMovement[] = purchaseData.items.map(it => {
      const prod = products.find(p => p.id === it.productId);
      const currStock = prod ? prod.currentStock : 0;
      return {
        id: `sm-${Date.now()}-${it.productId}`,
        productId: it.productId,
        productName: it.productName || prod?.name || '',
        date: purchaseData.purchaseDate,
        type: 'purchase',
        quantity: it.quantity,
        balanceAfter: currStock + it.quantity,
        referenceId: purchaseId,
        notes: `Purchase from ${purchaseData.supplierName || 'Supplier'}`,
      };
    });
    setStockMovements(prev => [...newMovements, ...prev]);

    setPurchases(prev => [newPurchase, ...prev]);
    return newPurchase;
  };

  // Workflow 5: Sales Entry (POS)
  // Auto decrease stock (-), update farmer currentDue (+ remainingDue), log movement
  const createSale = (saleData: Omit<Sale, 'id' | 'createdAt'>): Sale => {
    const saleId = `sale-${Date.now()}`;
    const newSale: Sale = {
      ...saleData,
      id: saleId,
      createdAt: new Date().toISOString(),
    };

    // 1. Decrement product stock levels
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const itemSold = saleData.items.find(it => it.productId === p.id);
        if (itemSold) {
          return { ...p, currentStock: Math.max(0, p.currentStock - itemSold.quantity) };
        }
        return p;
      });
    });

    // 2. Update farmer dues in Customer Ledger
    if (saleData.remainingDue > 0) {
      setFarmers(prevFarmers => {
        return prevFarmers.map(f => {
          if (f.id === saleData.farmerId) {
            return {
              ...f,
              currentDue: f.currentDue + saleData.remainingDue,
            };
          }
          return f;
        });
      });
    }

    // 3. Log stock movements
    const newMovements: StockMovement[] = saleData.items.map(it => {
      const prod = products.find(p => p.id === it.productId);
      const currStock = prod ? prod.currentStock : 0;
      return {
        id: `sm-${Date.now()}-${it.productId}`,
        productId: it.productId,
        productName: it.productName || prod?.name || '',
        date: saleData.saleDate,
        type: 'sale',
        quantity: -it.quantity,
        balanceAfter: Math.max(0, currStock - it.quantity),
        referenceId: saleId,
        notes: `Sold to ${saleData.farmerName || 'Farmer'}`,
      };
    });
    setStockMovements(prev => [...newMovements, ...prev]);

    setSales(prev => [newSale, ...prev]);
    return newSale;
  };

  // Workflow 6: Payment Entry (Udhar Recovery)
  // Reduces farmer's due balance (-amount)
  const createPayment = (paymentData: Omit<Payment, 'id' | 'createdAt'>): Payment => {
    const paymentId = `pay-${Date.now()}`;
    const newPayment: Payment = {
      ...paymentData,
      id: paymentId,
      createdAt: new Date().toISOString(),
    };

    setFarmers(prevFarmers => {
      return prevFarmers.map(f => {
        if (f.id === paymentData.farmerId) {
          return {
            ...f,
            currentDue: Math.max(0, f.currentDue - paymentData.amount),
          };
        }
        return f;
      });
    });

    setPayments(prev => [newPayment, ...prev]);
    return newPayment;
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setCategories(initialCategories);
    setUnits(initialUnits);
    setDistricts(initialDistricts);
    setVillages(initialVillages);
    setSuppliers(initialSuppliers);
    setProducts(initialProducts);
    setFarmers(initialFarmers);
    setPurchases(initialPurchases);
    setSales(initialSales);
    setPayments(initialPayments);
    setStockMovements(initialStockMovements);
  };

  const importPostgresSeed = (seedData: any) => {
    if (seedData.categories && Array.isArray(seedData.categories)) setCategories(seedData.categories);
    if (seedData.units && Array.isArray(seedData.units)) setUnits(seedData.units);
    if (seedData.districts && Array.isArray(seedData.districts)) setDistricts(seedData.districts);
    if (seedData.villages && Array.isArray(seedData.villages)) setVillages(seedData.villages);
    if (seedData.suppliers && Array.isArray(seedData.suppliers)) setSuppliers(seedData.suppliers);
    if (seedData.products && Array.isArray(seedData.products)) setProducts(seedData.products);
    if (seedData.farmers && Array.isArray(seedData.farmers)) setFarmers(seedData.farmers);
    if (seedData.purchases && Array.isArray(seedData.purchases)) setPurchases(seedData.purchases);
    if (seedData.sales && Array.isArray(seedData.sales)) setSales(seedData.sales);
    if (seedData.payments && Array.isArray(seedData.payments)) setPayments(seedData.payments);
    if (seedData.stockMovements && Array.isArray(seedData.stockMovements)) setStockMovements(seedData.stockMovements);
  };

  return (
    <DataContext.Provider
      value={{
        categories,
        units,
        products,
        suppliers,
        districts,
        villages,
        farmers,
        purchases,
        sales,
        payments,
        stockMovements,
        addCategory,
        addUnit,
        addProduct,
        updateProduct,
        addSupplier,
        addDistrict,
        addVillage,
        addFarmer,
        updateFarmer,
        createPurchase,
        createSale,
        createPayment,
        resetToDefaults,
        importPostgresSeed,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
