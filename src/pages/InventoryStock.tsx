import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import {
  Package,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Search,
  Filter,
  History,
  CheckCircle2,
} from 'lucide-react';

export const InventoryStock: React.FC = () => {
  const { language, t } = useLanguage();
  const { products, categories, units, stockMovements } = useData();

  const [activeTab, setActiveTab] = useState<'current' | 'movement'>('current');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCat === 'all' || p.categoryId === selectedCat;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.nameHi && p.nameHi.includes(searchTerm)) ||
      (p.batchNo && p.batchNo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLowStock = filterLowStockOnly ? p.currentStock <= p.minStockAlert : true;
    return matchesCat && matchesSearch && matchesLowStock;
  });

  const lowStockCount = products.filter(p => p.currentStock <= p.minStockAlert).length;
  const totalStockValue = products.reduce((sum, p) => sum + p.currentStock * p.purchasePrice, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
            <Package className="w-4 h-4" />
            <span>{t.step3Title}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {language === 'hi' ? 'स्टॉक एवं इन्वेंट्री प्रबंधन' : 'Inventory & Stock Management'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.step3Subtitle}
          </p>
        </div>

        {/* Stock Value Badge */}
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center space-x-4">
          <div>
            <span className="text-slate-500 text-xs block">
              {language === 'hi' ? 'कुल स्टॉक लागत मूल्य' : 'Total Stock Valuation'}
            </span>
            <span className="text-lg font-black text-emerald-900">
              ₹{totalStockValue.toLocaleString('en-IN')}
            </span>
          </div>
          {lowStockCount > 0 && (
            <button
              onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                filterLowStockOnly
                  ? 'bg-rose-600 text-white'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{lowStockCount} {t.lowStock}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('current')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'current'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t.currentStockTab} ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('movement')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'movement'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>{t.stockMovementTab} ({stockMovements.length})</span>
        </button>
      </div>

      {/* Tab 1: Current Stock */}
      {activeTab === 'current' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          {/* Filters Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCat}
                onChange={e => setSelectedCat(e.target.value)}
                className="p-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              >
                <option value="all">
                  {language === 'hi' ? 'सभी श्रेणियां (All Categories)' : 'All Categories'}
                </option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {language === 'hi' ? c.nameHi || c.name : c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Low stock toggle button */}
            <button
              onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition-colors ${
                filterLowStockOnly
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'केवल कम स्टॉक दिखाएं' : 'Low Stock Only'}</span>
            </button>
          </div>

          {/* Stock Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">#</th>
                  <th className="p-3.5">{t.productName}</th>
                  <th className="p-3.5">{t.productCategory}</th>
                  <th className="p-3.5 text-center">{t.currentStock}</th>
                  <th className="p-3.5 text-center">{t.minStockAlert}</th>
                  <th className="p-3.5 text-right">{t.purchasePrice}</th>
                  <th className="p-3.5 text-right">{t.sellingPrice}</th>
                  <th className="p-3.5 text-center">{t.stockStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p, idx) => {
                  const cat = categories.find(c => c.id === p.categoryId);
                  const u = units.find(unit => unit.id === p.unitId);
                  const isLow = p.currentStock <= p.minStockAlert;
                  const isOut = p.currentStock === 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 text-slate-400">{idx + 1}</td>
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">{p.name}</p>
                        {p.nameHi && <p className="text-xs text-slate-500">{p.nameHi}</p>}
                        {p.expiryDate && (
                          <p className="text-[10px] text-amber-700 font-medium mt-0.5">
                            Exp: {p.expiryDate}
                          </p>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs">
                          {language === 'hi' ? cat?.nameHi || cat?.name : cat?.name}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-extrabold text-base">
                        <span className={isLow ? 'text-rose-600' : 'text-slate-900'}>
                          {p.currentStock}
                        </span>
                        <span className="text-xs font-normal text-slate-500 ml-1">
                          {u?.shortCode}
                        </span>
                      </td>
                      <td className="p-3.5 text-center text-slate-500">
                        {p.minStockAlert} {u?.shortCode}
                      </td>
                      <td className="p-3.5 text-right text-slate-600 font-medium">₹{p.purchasePrice}</td>
                      <td className="p-3.5 text-right font-bold text-slate-900">₹{p.sellingPrice}</td>
                      <td className="p-3.5 text-center">
                        {isOut ? (
                          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold">
                            {t.outOfStock}
                          </span>
                        ) : isLow ? (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold inline-flex items-center space-x-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{t.lowStock}</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold inline-flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{t.inStock}</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Stock Movement Ledger */}
      {activeTab === 'movement' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">
              {language === 'hi' ? 'माल आवक-जावक रजिस्टर (Stock Movement History)' : 'Stock Movement Ledger (In / Out)'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'hi'
                ? 'खरीद से माल स्टॉक में जुड़ता है और बिक्री से स्वतः घटता है'
                : 'Purchases increase stock, sales automatically decrease stock'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">{t.date}</th>
                  <th className="p-3.5">{t.productName}</th>
                  <th className="p-3.5 text-center">{language === 'hi' ? 'प्रकार (Type)' : 'Type'}</th>
                  <th className="p-3.5 text-right">{language === 'hi' ? 'आवक/जावक मात्रा' : 'Quantity'}</th>
                  <th className="p-3.5 text-right">{t.balanceAfter}</th>
                  <th className="p-3.5">{t.notes}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockMovements.map(sm => {
                  const isPurchase = sm.type === 'purchase';
                  return (
                    <tr key={sm.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 text-slate-600 font-mono">{sm.date}</td>
                      <td className="p-3.5 font-bold text-slate-900">{sm.productName}</td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center space-x-1 ${
                            isPurchase
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isPurchase ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          <span>{isPurchase ? t.stockIn : t.stockOut}</span>
                        </span>
                      </td>
                      <td className={`p-3.5 text-right font-black ${isPurchase ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isPurchase ? `+${sm.quantity}` : `${sm.quantity}`}
                      </td>
                      <td className="p-3.5 text-right font-bold text-slate-800 font-mono">
                        {sm.balanceAfter}
                      </td>
                      <td className="p-3.5 text-slate-500">{sm.notes || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
