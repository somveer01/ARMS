import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import {
  Receipt,
  Plus,
  Trash2,
  CheckCircle,
  Search,
  User,
  AlertCircle,
  Printer,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { SaleItem, Sale, Farmer } from '../types';
import { ReceiptModal } from '../components/ReceiptModal';
import { SearchableProductSelect } from '../components/SearchableProductSelect';

interface SalesEntryProps {
  initialFarmer?: Farmer | null;
  onClearInitialFarmer?: () => void;
}

export const SalesEntry: React.FC<SalesEntryProps> = ({
  initialFarmer,
  onClearInitialFarmer,
}) => {
  const { language, t } = useLanguage();
  const { products, categories, units, farmers, villages, createSale, sales } = useData();

  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(initialFarmer?.id || farmers[0]?.id || '');
  const [farmerSearchQuery, setFarmerSearchQuery] = useState('');
  const [showFarmerPicker, setShowFarmerPicker] = useState(false);

  const [invoiceNo, setInvoiceNo] = useState(`INV-${new Date().getFullYear()}-${String(sales.length + 1).padStart(3, '0')}`);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);

  // Cart items
  const [items, setItems] = useState<SaleItem[]>([
    {
      productId: products[0]?.id || '',
      productName: products[0]?.name || '',
      unitName: 'Bag',
      quantity: 1,
      unitRate: products[0]?.sellingPrice || 0,
      totalCost: products[0]?.sellingPrice || 0,
    },
  ]);

  const [discount, setDiscount] = useState<number | string>('');
  const [paidAmount, setPaidAmount] = useState<number | string>('');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'bank' | 'cheque'>('cash');
  const [notes, setNotes] = useState('');

  // Receipt modal state
  const [savedSale, setSavedSale] = useState<Sale | null>(null);
  const [prevDueSnapshot, setPrevDueSnapshot] = useState(0);
  const [newDueSnapshot, setNewDueSnapshot] = useState(0);

  // Selected farmer object
  const selectedFarmer = farmers.find(f => f.id === selectedFarmerId);
  const farmerVillage = villages.find(v => v.id === selectedFarmer?.villageId);

  // Calculations
  const subTotal = items.reduce((sum, item) => sum + (Number(item.totalCost) || 0), 0);
  const grandTotal = Math.max(0, subTotal - (Number(discount) || 0));
  const remainingDue = Math.max(0, grandTotal - (Number(paidAmount) || 0));
  const farmerPrevDue = selectedFarmer?.currentDue || 0;
  const farmerNewDue = farmerPrevDue + remainingDue;

  const handleProductChange = (index: number, prodId: string) => {
    const prod = products.find(p => p.id === prodId);
    const u = units.find(unit => unit.id === prod?.unitId);
    const updated = [...items];
    const unitRate = prod?.sellingPrice || 0;
    const qty = Number(updated[index].quantity) || 1;

    updated[index] = {
      productId: prodId,
      productName: prod?.name || '',
      unitName: u?.shortCode || '',
      quantity: qty,
      unitRate: unitRate,
      totalCost: qty * unitRate,
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
    const u = units.find(unit => unit.id === defaultProd?.unitId);
    setItems([
      ...items,
      {
        productId: defaultProd?.id || '',
        productName: defaultProd?.name || '',
        unitName: u?.shortCode || '',
        quantity: 1,
        unitRate: defaultProd?.sellingPrice || 0,
        totalCost: defaultProd?.sellingPrice || 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmerId || items.length === 0) return;

    const newSale = createSale({
      invoiceNo,
      farmerId: selectedFarmerId,
      farmerName: selectedFarmer?.name || 'Farmer',
      farmerMobile: selectedFarmer?.mobile || '',
      farmerVillage: farmerVillage ? (language === 'hi' ? farmerVillage.nameHi || farmerVillage.name : farmerVillage.name) : '',
      saleDate,
      items: items.map(item => ({
        ...item,
        quantity: Number(item.quantity) || 1,
        unitRate: Number(item.unitRate) || 0,
        totalCost: (Number(item.quantity) || 1) * (Number(item.unitRate) || 0),
      })),
      subTotal,
      discount: Number(discount) || 0,
      grandTotal,
      paidAmount: Number(paidAmount) || 0,
      remainingDue,
      paymentMode,
      notes,
    });

    setPrevDueSnapshot(farmerPrevDue);
    setNewDueSnapshot(farmerNewDue);
    setSavedSale(newSale);

    // Reset bill form for next transaction
    setInvoiceNo(`INV-${new Date().getFullYear()}-${String(sales.length + 2).padStart(3, '0')}`);
    setItems([
      {
        productId: products[0]?.id || '',
        productName: products[0]?.name || '',
        unitName: 'Bag',
        quantity: 1,
        unitRate: products[0]?.sellingPrice || 0,
        totalCost: products[0]?.sellingPrice || 0,
      },
    ]);
    setDiscount('');
    setPaidAmount('');
    setNotes('');
  };

  // Farmer search filter
  const searchResults = farmers.filter(f => {
    const vil = villages.find(v => v.id === f.villageId);
    const q = farmerSearchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.mobile.includes(q) ||
      (vil && vil.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Step Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-rose-600 uppercase tracking-wider">
          <Receipt className="w-4 h-4" />
          <span>{t.step5Title}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
          {language === 'hi' ? 'दैनिक बिक्री एवं बिलिंग (POS काउंटर)' : 'Daily Sales Entry & POS Billing'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {t.step5Subtitle}
        </p>

        {/* Workflow Diagram Banner */}
        <div className="mt-4 p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl text-xs text-rose-900 flex flex-wrap items-center gap-2 font-medium">
          <span className="font-bold">{language === 'hi' ? 'प्रक्रिया प्रवाह:' : 'Workflow:'}</span>
          <span className="bg-white px-2 py-0.5 rounded border border-rose-300">
            {language === 'hi' ? '१. किसान चुनें' : '1. Select Farmer'}
          </span>
          <span>➔</span>
          <span className="bg-white px-2 py-0.5 rounded border border-rose-300">
            {language === 'hi' ? '२. उत्पाद चुनें' : '2. Select Product'}
          </span>
          <span>➔</span>
          <span className="bg-white px-2 py-0.5 rounded border border-rose-300">
            {language === 'hi' ? '३. मात्रा व दर' : '3. Qty & Rate'}
          </span>
          <span>➔</span>
          <span className="bg-white px-2 py-0.5 rounded border border-rose-300 font-bold">
            {language === 'hi' ? '४. कुल बिल स्वतः' : '4. Auto Bill Total'}
          </span>
          <span>➔</span>
          <span className="bg-white px-2 py-0.5 rounded border border-rose-300 font-bold text-emerald-700">
            {language === 'hi' ? '५. प्राप्त जमा राशि' : '5. Payment Received'}
          </span>
          <span>➔</span>
          <span className="bg-rose-600 text-white px-2 py-0.5 rounded font-bold">
            {language === 'hi' ? '६. शेष उधारी स्वतः' : '6. Auto Remaining Due'}
          </span>
        </div>
      </div>

      {/* POS Billing Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step 1: Farmer Selection Box */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <User className="w-4 h-4 text-rose-600" />
              <span>{t.selectedFarmer} (Step 1)</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowFarmerPicker(!showFarmerPicker)}
              className="text-xs text-rose-600 font-bold hover:underline"
            >
              {showFarmerPicker
                ? (language === 'hi' ? 'खोज बंद करें' : 'Close search')
                : (language === 'hi' ? '🔍 किसान बदलें / खोजें' : '🔍 Search / Change Farmer')}
            </button>
          </div>

          {/* Farmer Quick Search Drawer */}
          {showFarmerPicker && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder={t.searchFarmerPlaceholder}
                  value={farmerSearchQuery}
                  onChange={e => setFarmerSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  autoFocus
                />
              </div>
              <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 bg-white rounded-lg border border-slate-200">
                {searchResults.map(f => {
                  const vil = villages.find(v => v.id === f.villageId);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setSelectedFarmerId(f.id);
                        setShowFarmerPicker(false);
                      }}
                      className="w-full text-left p-2 hover:bg-rose-50 flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{f.name}</span>
                        <span className="text-slate-500 ml-2">📞 {f.mobile}</span>
                        <span className="text-slate-400 ml-2">📍 {vil?.name}</span>
                      </div>
                      <span className={`font-bold ${f.currentDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {f.currentDue > 0 ? `Due: ₹${f.currentDue}` : 'No Dues'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Farmer Detail Card */}
          {selectedFarmer ? (
            <div className="p-4 bg-gradient-to-r from-slate-50 to-rose-50/40 rounded-xl border border-rose-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-extrabold text-slate-900">{selectedFarmer.name}</span>
                  {selectedFarmer.fatherName && (
                    <span className="text-xs text-slate-500">S/o {selectedFarmer.fatherName}</span>
                  )}
                </div>
                <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-3">
                  <span>📞 {selectedFarmer.mobile}</span>
                  <span>📍 {language === 'hi' ? farmerVillage?.nameHi || farmerVillage?.name : farmerVillage?.name}</span>
                  {selectedFarmer.landAcreage ? <span>🌾 {selectedFarmer.landAcreage} Acre</span> : null}
                </div>
              </div>

              {/* Previous Due Alert */}
              <div className="bg-white p-3 rounded-xl border border-rose-200 text-right">
                <span className="text-[11px] text-slate-500 block">{t.farmerPreviousDue}</span>
                <span className={`text-lg font-black ${farmerPrevDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  ₹{farmerPrevDue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 text-amber-800 rounded-xl text-xs font-semibold">
              {t.selectFarmerFirst}
            </div>
          )}
        </div>

        {/* Step 2 & 3: Product Selection & Cart Items */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              {language === 'hi' ? 'उत्पाद व मात्रा चुनें (Products & Qty)' : 'Selected Products (Cart)'}
            </h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center space-x-1 px-3 py-1.5 bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addItem}</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => {
              const prod = products.find(p => p.id === item.productId);
              const u = units.find(unit => unit.id === prod?.unitId);
              const isStockShort = prod && item.quantity > prod.currentStock;

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
                      priceType="selling"
                      themeColor="rose"
                    />

                    {/* Stock Alert */}
                    <div className="mt-1 flex items-center space-x-2 text-[11px]">
                      <span className="text-slate-500">
                        {language === 'hi' ? 'उपलब्ध स्टॉक:' : 'Available:'}{' '}
                        <strong className={prod && prod.currentStock <= prod.minStockAlert ? 'text-amber-700' : 'text-slate-800'}>
                          {prod?.currentStock} {u?.shortCode}
                        </strong>
                      </span>
                      {isStockShort && (
                        <span className="text-rose-600 font-bold flex items-center space-x-0.5">
                          <AlertCircle className="w-3 h-3" />
                          <span>{language === 'hi' ? 'स्टॉक से अधिक!' : 'Exceeds stock!'}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 text-[11px] mb-1">
                      {t.quantity} ({item.unitName || u?.shortCode})
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
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none text-center font-bold"
                    />
                  </div>

                  {/* Selling Rate */}
                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 text-[11px] mb-1">{t.sellingPrice} (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0"
                      required
                      value={item.unitRate === 0 || (item.unitRate as any) === '' ? '' : item.unitRate}
                      onFocus={e => e.target.select()}
                      onChange={e => handleRateChange(idx, e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none text-right font-medium"
                    />
                  </div>

                  {/* Line Total */}
                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 text-[11px] mb-1 font-bold text-slate-700">
                      {t.total} (₹)
                    </label>
                    <div className="p-2 bg-slate-200/70 border border-slate-300 rounded-lg font-black text-slate-900 text-right">
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
        </div>

        {/* Step 4 & 5 & 6: Bill Total, Payment Received, Auto Remaining Due */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">
            {language === 'hi' ? 'भुगतान एवं उधारी गणना (Payment & Udhar Calculation)' : 'Payment & Due Settlement'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
            {/* Bill Subtotal */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-xs">{t.subTotal}</span>
              <p className="text-xl font-black text-slate-900 mt-1">₹{subTotal.toLocaleString('en-IN')}</p>
            </div>

            {/* Discount */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block text-slate-500 text-xs mb-1">{t.discount} (₹)</label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={discount === 0 || (discount as any) === '' ? '' : discount}
                onFocus={e => e.target.select()}
                onChange={e => setDiscount(e.target.value === '' ? ('' as any) : Number(e.target.value))}
                className="w-full p-1.5 border border-slate-300 rounded-lg font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            {/* Grand Total (Auto) */}
            <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-inner">
              <span className="text-slate-300 block text-xs font-bold">{t.grandTotal} (Auto)</span>
              <p className="text-2xl font-black text-lime-400 mt-1">₹{grandTotal.toLocaleString('en-IN')}</p>
            </div>

            {/* Payment Mode */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="block text-slate-500 text-xs mb-1">{t.paymentMode}</label>
              <select
                value={paymentMode}
                onChange={e => setPaymentMode(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="cash">{t.cash}</option>
                <option value="upi">{t.upi}</option>
                <option value="bank">{t.bank}</option>
                <option value="cheque">{t.cheque}</option>
              </select>
            </div>
          </div>

          {/* Split Payment: Payment Received vs Remaining Due */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Payment Received Input */}
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl">
              <label className="block text-emerald-900 font-bold text-sm mb-1">
                {t.paymentReceived} (₹)
              </label>
              <p className="text-xs text-emerald-700 mb-2">
                {language === 'hi' ? 'किसान द्वारा आज नकद/UPI में दी गई राशि' : 'Cash/UPI paid by farmer right now'}
              </p>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max={grandTotal}
                  step="any"
                  placeholder="0"
                  value={paidAmount === 0 || (paidAmount as any) === '' ? '' : paidAmount}
                  onFocus={e => e.target.select()}
                  onChange={e => setPaidAmount(e.target.value === '' ? ('' as any) : Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-emerald-400 rounded-xl text-lg font-black text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setPaidAmount(grandTotal)}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold whitespace-nowrap"
                >
                  {language === 'hi' ? 'पूर्ण भुगतान' : 'Full Paid'}
                </button>
              </div>
            </div>

            {/* Auto Remaining Due Display */}
            <div className="bg-rose-50 border-2 border-rose-400 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-rose-900 font-bold text-sm block">
                  {t.remainingDue}
                </span>
                <p className="text-xs text-rose-700 mt-0.5">
                  {language === 'hi' ? 'यह राशि स्वतः किसान के खाते में उधारी जुड़ेगी' : 'Automatically posted to Farmer Khata'}
                </p>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-rose-600">
                  ₹{remainingDue.toLocaleString('en-IN')}
                </span>
                {remainingDue > 0 && (
                  <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded font-bold">
                    {language === 'hi' ? 'उधारी दर्ज होगी' : 'Due Balance'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Combined Farmer Net Due Preview */}
          <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-3 text-slate-700 font-medium">
              <span>{t.farmerPreviousDue}: <strong>₹{farmerPrevDue}</strong></span>
              <span>+</span>
              <span>{language === 'hi' ? 'आज की उधारी:' : 'Today Due:'} <strong className="text-rose-600">₹{remainingDue}</strong></span>
              <span>=</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800">{t.newTotalDue}:</span>
              <span className="text-base font-black text-rose-700">₹{farmerNewDue.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Submit & Bill Print Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-base sm:text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-3 group"
          >
            <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span>
              {language === 'hi'
                ? 'बिक्री बिल बनाएं एवं रसीद प्रिंट करें'
                : 'Complete Sale & Print Receipt'}
            </span>
          </button>
        </div>
      </form>

      {/* Bill Receipt Modal */}
      {savedSale && (
        <ReceiptModal
          sale={savedSale}
          farmerPrevDue={prevDueSnapshot}
          farmerNewDue={newDueSnapshot}
          onClose={() => setSavedSale(null)}
        />
      )}
    </div>
  );
};
