import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import {
  ShoppingCart,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Truck,
  Building,
} from 'lucide-react';
import { PurchaseItem } from '../types';
import { SearchableProductSelect } from '../components/SearchableProductSelect';

export const PurchaseEntry: React.FC = () => {
  const { language, t } = useLanguage();
  const { suppliers, products, categories, units, createPurchase, purchases } = useData();

  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [invoiceNo, setInvoiceNo] = useState(`PUR-${new Date().getFullYear()}-${String(purchases.length + 1).padStart(3, '0')}`);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<PurchaseItem[]>([
    {
      productId: products[0]?.id || '',
      productName: products[0]?.name || '',
      quantity: 10,
      unitRate: products[0]?.purchasePrice || 0,
      totalCost: 10 * (products[0]?.purchasePrice || 0),
      batchNo: '',
      expiryDate: '',
    },
  ]);
  const [paidAmount, setPaidAmount] = useState<number | string>('');
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Selected supplier details
  const selectedSupplier = suppliers.find(s => s.id === supplierId);

  // Calculate total purchase cost
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.totalCost) || 0), 0);
  const balancePayable = Math.max(0, totalAmount - (Number(paidAmount) || 0));

  const handleProductChange = (index: number, prodId: string) => {
    const prod = products.find(p => p.id === prodId);
    const updated = [...items];
    const unitRate = prod?.purchasePrice || 0;
    const qty = Number(updated[index].quantity) || 1;
    updated[index] = {
      ...updated[index],
      productId: prodId,
      productName: prod?.name || '',
      unitRate: unitRate,
      totalCost: qty * unitRate,
      batchNo: prod?.batchNo || '',
      expiryDate: prod?.expiryDate || '',
    };
    setItems(updated);
  };

  const handleQtyChange = (index: number, qty: any) => {
    const updated = [...items];
    const numQty = qty === '' ? '' : Number(qty);
    updated[index].quantity = numQty as any;
    updated[index].totalCost = (Number(numQty) || 0) * (Number(updated[index].unitRate) || 0);
    setItems(updated);
  };

  const handleRateChange = (index: number, rate: any) => {
    const updated = [...items];
    const numRate = rate === '' ? '' : Number(rate);
    updated[index].unitRate = numRate as any;
    updated[index].totalCost = (Number(updated[index].quantity) || 0) * (Number(numRate) || 0);
    setItems(updated);
  };

  const handleAddItem = () => {
    const defaultProd = products[0];
    setItems([
      ...items,
      {
        productId: defaultProd?.id || '',
        productName: defaultProd?.name || '',
        quantity: 1,
        unitRate: defaultProd?.purchasePrice || 0,
        totalCost: defaultProd?.purchasePrice || 0,
        batchNo: '',
        expiryDate: '',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || items.length === 0) return;

    createPurchase({
      invoiceNo,
      supplierId,
      supplierName: selectedSupplier?.name || 'Supplier',
      purchaseDate,
      items: items.map(it => ({
        ...it,
        quantity: Number(it.quantity) || 1,
        unitRate: Number(it.unitRate) || 0,
        totalCost: (Number(it.quantity) || 1) * (Number(it.unitRate) || 0),
      })),
      totalAmount,
      paidAmount: Number(paidAmount) || 0,
      balanceDue: balancePayable,
      notes,
    });

    setSuccessMessage(t.savePurchaseSuccess);
    setTimeout(() => setSuccessMessage(''), 5000);

    // Reset Form
    setInvoiceNo(`PUR-${new Date().getFullYear()}-${String(purchases.length + 2).padStart(3, '0')}`);
    setItems([
      {
        productId: products[0]?.id || '',
        productName: products[0]?.name || '',
        quantity: 10,
        unitRate: products[0]?.purchasePrice || 0,
        totalCost: 10 * (products[0]?.purchasePrice || 0),
        batchNo: '',
        expiryDate: '',
      },
    ]);
    setPaidAmount('');
    setNotes('');
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Step Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
          <ShoppingCart className="w-4 h-4" />
          <span>{t.step2Title}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
          {language === 'hi' ? 'खरीद प्रविष्टि (सप्लायर से माल आवक)' : 'Purchase Entry (Stock Inward)'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {t.step2Subtitle}
        </p>

        {/* Diagram Flow Indicator */}
        <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex flex-wrap items-center gap-2 font-medium">
          <span className="font-bold">{language === 'hi' ? 'प्रक्रिया प्रवाह:' : 'Workflow:'}</span>
          <span className="bg-white px-2 py-0.5 rounded border border-amber-300">
            {language === 'hi' ? '१. सप्लायर चुनें' : '1. Select Supplier'}
          </span>
          <span>➔</span>
          <span className="bg-white px-2 py-0.5 rounded border border-amber-300">
            {language === 'hi' ? '२. उत्पाद चुनें' : '2. Select Product'}
          </span>
          <span>➔</span>
          <span className="bg-white px-2 py-0.5 rounded border border-amber-300">
            {language === 'hi' ? '३. मात्रा व दर' : '3. Qty & Rate'}
          </span>
          <span>➔</span>
          <span className="bg-white px-2 py-0.5 rounded border border-amber-300 font-bold text-emerald-800">
            {language === 'hi' ? '४. कुल लागत स्वतः' : '4. Auto Total Cost'}
          </span>
          <span>➔</span>
          <span className="bg-amber-600 text-white px-2 py-0.5 rounded font-bold">
            {language === 'hi' ? '५. सुरक्षित करें (स्टॉक बढ़ेगा)' : '5. Save (Stock In)'}
          </span>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center space-x-3 text-emerald-800 font-semibold animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Supplier & Invoice Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
            <Truck className="w-4 h-4 text-amber-600" />
            <span>{language === 'hi' ? 'सप्लायर एवं बिल विवरण' : 'Supplier & Bill Details'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            {/* Supplier Select */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">{t.selectSupplier} *</label>
              <select
                required
                value={supplierId}
                onChange={e => setSupplierId(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium text-slate-900"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.company})
                  </option>
                ))}
              </select>
            </div>

            {/* Invoice Number */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">{t.invoiceNumber} *</label>
              <input
                type="text"
                required
                value={invoiceNo}
                onChange={e => setInvoiceNo(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">{t.date} *</label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={e => setPurchaseDate(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {selectedSupplier && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between text-slate-600 gap-2">
              <span><strong>Firm:</strong> {selectedSupplier.company}</span>
              <span><strong>Phone:</strong> {selectedSupplier.phone}</span>
              <span className="text-amber-800 font-bold">
                {language === 'hi' ? 'सप्लायर को पूर्व देय शेष:' : 'Current Payable Due:'} ₹{selectedSupplier.currentPayable.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>

        {/* Product Items Table Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              {language === 'hi' ? 'खरीदी जाने वाली वस्तुओं की सूची' : 'Purchased Products'}
            </h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center space-x-1 px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'और उत्पाद जोड़ें' : 'Add Item'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => {
              const prod = products.find(p => p.id === item.productId);
              const u = units.find(unit => unit.id === prod?.unitId);

              return (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs sm:text-sm"
                >
                  {/* Product Dropdown */}
                  <div className="sm:col-span-5">
                    <label className="block text-slate-500 text-[11px] mb-1">{t.selectProduct}</label>
                    <SearchableProductSelect
                      value={item.productId}
                      onChange={prodId => handleProductChange(idx, prodId)}
                      products={products}
                      categories={categories}
                      units={units}
                      priceType="purchase"
                      themeColor="amber"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 text-[11px] mb-1">
                      {t.quantity} ({u?.shortCode})
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      placeholder="1"
                      required
                      value={item.quantity === 0 || (item.quantity as any) === '' ? '' : item.quantity}
                      onFocus={e => e.target.select()}
                      onChange={e => handleQtyChange(idx, e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-center font-bold"
                    />
                  </div>

                  {/* Purchase Rate */}
                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 text-[11px] mb-1">{t.ratePerUnit} (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0"
                      required
                      value={item.unitRate === 0 || (item.unitRate as any) === '' ? '' : item.unitRate}
                      onFocus={e => e.target.select()}
                      onChange={e => handleRateChange(idx, e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-right font-medium"
                    />
                  </div>

                  {/* Total Cost (Auto) */}
                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 text-[11px] mb-1 font-bold text-amber-800">
                      {t.totalPurchaseCost}
                    </label>
                    <div className="p-2 bg-amber-100/70 border border-amber-200 rounded-lg font-black text-slate-900 text-right">
                      ₹{item.totalCost.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Delete Item */}
                  <div className="sm:col-span-1 text-center pt-2 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={items.length <= 1}
                      className="p-2 text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors"
                      title={t.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment to Supplier & Balance */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">{t.totalPurchaseCost}</span>
              <p className="text-xl font-black text-slate-900 mt-1">₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block text-xs text-slate-500 mb-1">{t.amountPaidToSupplier} (₹)</label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={paidAmount === 0 || (paidAmount as any) === '' ? '' : paidAmount}
                onFocus={e => e.target.select()}
                onChange={e => setPaidAmount(e.target.value === '' ? ('' as any) : Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg font-bold text-emerald-700 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200">
              <span className="text-xs text-amber-800 font-bold">{t.balancePayable}</span>
              <p className="text-xl font-black text-amber-900 mt-1">₹{balancePayable.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 text-xs font-medium mb-1">{t.notes}</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Received via Transport Truck No. HR-05-XXXX"
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-extrabold text-sm sm:text-base shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{language === 'hi' ? 'खरीद बिल सुरक्षित करें (Save & Update Stock)' : 'Save Purchase & Update Stock'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
