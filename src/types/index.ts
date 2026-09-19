export type Language = 'en' | 'hi';

export interface User {
  id: string;
  name: string;
  email: string;
  shopName: string;
  phone?: string;
  photoUrl?: string;
  address?: string;
  district?: string;
  state?: string;
  licenseNo?: string;
  gstin?: string;
  receiptFooter?: string;
  authProvider: 'email' | 'google';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameHi: string;
  description?: string;
  color?: string;
}

export interface Unit {
  id: string;
  name: string;
  nameHi: string;
  shortCode: string;
}

export interface Product {
  id: string;
  name: string;
  nameHi: string;
  categoryId: string;
  unitId: string;
  hsnCode?: string;
  batchNo?: string;
  expiryDate?: string;
  purchasePrice: number;
  sellingPrice: number;
  currentStock: number;
  minStockAlert: number;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  company: string;
  phone: string;
  gstin?: string;
  address?: string;
  openingBalance: number;
  currentPayable: number;
  createdAt: string;
}

export interface District {
  id: string;
  name: string;
  nameHi: string;
}

export interface Village {
  id: string;
  name: string;
  nameHi: string;
  districtId: string;
}

export interface Farmer {
  id: string;
  name: string;
  fatherName?: string;
  mobile: string;
  districtId: string;
  villageId: string;
  landAcreage?: number;
  creditLimit?: number;
  openingDue: number;
  currentDue: number;
  createdAt: string;
}

export interface PurchaseItem {
  productId: string;
  productName?: string;
  quantity: number;
  unitRate: number;
  totalCost: number;
  batchNo?: string;
  expiryDate?: string;
}

export interface Purchase {
  id: string;
  invoiceNo: string;
  supplierId: string;
  supplierName?: string;
  purchaseDate: string;
  items: PurchaseItem[];
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  notes?: string;
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  productName?: string;
  unitName?: string;
  quantity: number;
  unitRate: number;
  totalCost: number;
}

export interface Sale {
  id: string;
  invoiceNo: string;
  farmerId: string;
  farmerName?: string;
  farmerMobile?: string;
  farmerVillage?: string;
  saleDate: string;
  items: SaleItem[];
  subTotal: number;
  discount: number;
  grandTotal: number;
  paidAmount: number;
  remainingDue: number;
  paymentMode: 'cash' | 'upi' | 'bank' | 'cheque';
  notes?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  receiptNo: string;
  farmerId: string;
  farmerName?: string;
  paymentDate: string;
  amount: number;
  paymentMode: 'cash' | 'upi' | 'bank' | 'cheque';
  referenceNo?: string;
  notes?: string;
  createdAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName?: string;
  date: string;
  type: 'purchase' | 'sale' | 'adjustment';
  quantity: number; // positive for purchase, negative for sale
  balanceAfter: number;
  referenceId: string; // purchaseId or saleId
  notes?: string;
}
