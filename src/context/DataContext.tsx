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

import {
  CURRENT_SEED_VERSION,
  initialCategories,
  initialUnits,
  initialDistricts,
  initialVillages,
  initialSuppliers,
  initialProducts,
  initialFarmers,
  initialPurchases,
  initialSales,
  initialPayments,
  initialStockMovements,
} from '../data/seedData';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const savedVersion = localStorage.getItem('arms_seed_version_cat');
    if (savedVersion !== CURRENT_SEED_VERSION) {
      localStorage.setItem('arms_seed_version_cat', CURRENT_SEED_VERSION);
      localStorage.setItem('arms_categories', JSON.stringify(initialCategories));
      return initialCategories;
    }
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
    const savedVersion = localStorage.getItem('arms_seed_version_sup');
    if (savedVersion !== CURRENT_SEED_VERSION) {
      localStorage.setItem('arms_seed_version_sup', CURRENT_SEED_VERSION);
      localStorage.setItem('arms_suppliers', JSON.stringify(initialSuppliers));
      return initialSuppliers;
    }
    const saved = localStorage.getItem('arms_suppliers');
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const savedVersion = localStorage.getItem('arms_seed_version');
    const saved = localStorage.getItem('arms_products');

    if (savedVersion !== CURRENT_SEED_VERSION) {
      localStorage.setItem('arms_seed_version', CURRENT_SEED_VERSION);
      if (saved) {
        try {
          const existing: Product[] = JSON.parse(saved);
          const existingIds = new Set(existing.map(p => p.id));
          const newProducts = initialProducts.filter(p => !existingIds.has(p.id));
          const merged = [...existing, ...newProducts];
          localStorage.setItem('arms_products', JSON.stringify(merged));
          return merged;
        } catch {
          return initialProducts;
        }
      }
      return initialProducts;
    }
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
