import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import {
  BarChart3,
  Calendar,
  MapPin,
  FileText,
  Printer,
  Share2,
  Download,
  Search,
  Filter,
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  CreditCard,
  Building,
  CheckCircle,
} from 'lucide-react';
import { Farmer, Sale, Purchase, Payment, StockMovement } from '../types';

export const Reports: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    products,
    categories,
    units,
    suppliers,
    districts,
    villages,
    farmers,
    sales,
    purchases,
    payments,
    stockMovements,
  } = useData();

  const [activeReportTab, setActiveReportTab] = useState<
    'daily' | 'purchase' | 'stock' | 'farmer' | 'village-due' | 'monthly' | 'custom-date'
  >('village-due');

  // Report 1: Daily Sales State
  const [selectedDailyDate, setSelectedDailyDate] = useState(new Date().toISOString().split('T')[0]);

  // Report 2: Purchase Report State
  const [purchaseFilterSupplier, setPurchaseFilterSupplier] = useState('all');

  // Report 4: Farmer Ledger State
  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || '');

  // Report 5: Village Wise Due Report State
  const [selectedDistrictId, setSelectedDistrictId] = useState(districts[0]?.id || '');
  const [selectedVillageId, setSelectedVillageId] = useState(villages[0]?.id || '');

  // Report 6: Monthly Report State
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  // Report 7: Custom Date Report State
  const [customFromDate, setCustomFromDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [customToDate, setCustomToDate] = useState(new Date().toISOString().split('T')[0]);

  // Handle Village filter change
  const currentVillages = villages.filter(v => v.districtId === selectedDistrictId);

  // 1. Daily Sales Filtered
  const filteredDailySales = sales.filter(s => s.saleDate === selectedDailyDate);
  const dailyTotalSales = filteredDailySales.reduce((sum, s) => sum + s.grandTotal, 0);
  const dailyCashReceived = filteredDailySales.reduce((sum, s) => sum + s.paidAmount, 0);
  const dailyRemainingDue = filteredDailySales.reduce((sum, s) => sum + s.remainingDue, 0);

  // 2. Purchases Filtered
  const filteredPurchases = purchases.filter(p => {
    return purchaseFilterSupplier === 'all' || p.supplierId === purchaseFilterSupplier;
  });
  const totalPurchaseCost = filteredPurchases.reduce((sum, p) => sum + p.totalAmount, 0);

  // 4. Farmer Ledger Calculations
  const activeFarmer = farmers.find(f => f.id === selectedFarmerId);
  const activeFarmerSales = sales.filter(s => s.farmerId === selectedFarmerId);
  const activeFarmerPayments = payments.filter(p => p.farmerId === selectedFarmerId);

  // Combine sales and payments into a ledger
  const farmerLedgerItems = [
    ...activeFarmerSales.map(s => ({
      date: s.saleDate,
      desc: `${language === 'hi' ? 'बिक्री बिल' : 'Sale Bill'} #${s.invoiceNo} (${s.items.map(i => i.productName).join(', ')})`,
      debit: s.grandTotal,
      credit: s.paidAmount,
      type: 'sale',
    })),
    ...activeFarmerPayments.map(p => ({
      date: p.paymentDate,
      desc: `${language === 'hi' ? 'उधारी जमा' : 'Due Payment'} #${p.receiptNo} (${p.paymentMode.toUpperCase()})`,
      debit: 0,
      credit: p.amount,
      type: 'payment',
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // 5. Village Wise Due Calculations
  const villageFarmersWithDue = farmers.filter(f => {
    const matchesVillage = selectedVillageId === 'all' || f.villageId === selectedVillageId;
    const matchesDistrict = selectedDistrictId === 'all' || f.districtId === selectedDistrictId;
    return matchesVillage && matchesDistrict && f.currentDue > 0;
  });
  const villageTotalDue = villageFarmersWithDue.reduce((sum, f) => sum + f.currentDue, 0);
  const selectedVillageObj = villages.find(v => v.id === selectedVillageId);

  // 6. Monthly Report Calculations
  const monthlySales = sales.filter(s => s.saleDate.startsWith(selectedMonth));
  const monthlyPurchases = purchases.filter(p => p.purchaseDate.startsWith(selectedMonth));
  const monthlyPayments = payments.filter(p => p.paymentDate.startsWith(selectedMonth));
  const monthlySalesTotal = monthlySales.reduce((sum, s) => sum + s.grandTotal, 0);
  const monthlyPurchaseTotal = monthlyPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const monthlyCollectedTotal =
    monthlySales.reduce((sum, s) => sum + s.paidAmount, 0) +
    monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

  // 7. Custom Date Calculations
  const customSales = sales.filter(s => s.saleDate >= customFromDate && s.saleDate <= customToDate);
  const customPurchases = purchases.filter(p => p.purchaseDate >= customFromDate && p.purchaseDate <= customToDate);
  const customPayments = payments.filter(p => p.paymentDate >= customFromDate && p.paymentDate <= customToDate);
  const customSalesTotal = customSales.reduce((sum, s) => sum + s.grandTotal, 0);
  const customPurchasesTotal = customPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const customCollectionsTotal =
    customSales.reduce((sum, s) => sum + s.paidAmount, 0) +
    customPayments.reduce((sum, p) => sum + p.amount, 0);
  const customDuesTotal = customSales.reduce((sum, s) => sum + s.remainingDue, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Step Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>{t.step7Title}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {language === 'hi' ? 'रिपोर्ट्स एवं संपूर्ण विश्लेषण' : 'Reports & Comprehensive Analytics'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.step7Subtitle}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'hi' ? 'रिपोर्ट प्रिंट करें' : 'Print Report'}</span>
          </button>
        </div>
      </div>

      {/* 7 Report Tabs (Matching diagram exactly!) */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 border-b border-slate-200 text-xs sm:text-sm no-print">
        <button
          onClick={() => setActiveReportTab('village-due')}
          className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all ${
            activeReportTab === 'village-due'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>{t.villageDueTab}</span>
        </button>

        <button
          onClick={() => setActiveReportTab('daily')}
          className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all ${
            activeReportTab === 'daily'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{t.dailySalesTab}</span>
        </button>

        <button
          onClick={() => setActiveReportTab('purchase')}
          className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all ${
            activeReportTab === 'purchase'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{t.purchaseReportTab}</span>
        </button>

        <button
          onClick={() => setActiveReportTab('stock')}
          className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all ${
            activeReportTab === 'stock'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t.stockReportTab}</span>
        </button>

        <button
          onClick={() => setActiveReportTab('farmer')}
          className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all ${
            activeReportTab === 'farmer'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t.farmerReportTab}</span>
        </button>

        <button
          onClick={() => setActiveReportTab('monthly')}
          className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all ${
            activeReportTab === 'monthly'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t.monthlyReportTab}</span>
        </button>

        <button
          onClick={() => setActiveReportTab('custom-date')}
          className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all ${
            activeReportTab === 'custom-date'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.customDateTab}</span>
        </button>
      </div>

      {/* REPORT 5: VILLAGE WISE DUE REPORT (Requested specifically by user) */}
      {activeReportTab === 'village-due' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          {/* Controls */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  {t.districtName}
                </label>
                <select
                  value={selectedDistrictId}
                  onChange={e => {
                    const newDistId = e.target.value;
                    setSelectedDistrictId(newDistId);
                    const matchingVils = villages.filter(v => v.districtId === newDistId);
                    if (matchingVils.length > 0) {
                      setSelectedVillageId(matchingVils[0].id);
                    }
                  }}
                  className="p-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                >
                  {districts.map(d => (
                    <option key={d.id} value={d.id}>
                      {language === 'hi' ? d.nameHi || d.name : d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  {t.villageName}
                </label>
                <select
                  value={selectedVillageId}
                  onChange={e => setSelectedVillageId(e.target.value)}
                  className="p-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-900"
                >
                  <option value="all">
                    {language === 'hi' ? 'सभी गाँव (All Villages)' : 'All Villages'}
                  </option>
                  {currentVillages.map(v => (
                    <option key={v.id} value={v.id}>
                      {language === 'hi' ? v.nameHi || v.name : v.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Village Total Box */}
            <div className="bg-rose-50 border border-rose-300 p-3 rounded-xl text-right">
              <span className="text-xs font-bold text-rose-800 block">
                {t.villageTotalDue}
              </span>
              <span className="text-xl font-black text-rose-600">
                ₹{villageTotalDue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Printable Report Header */}
          <div className="px-5 pt-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {language === 'hi'
                ? `गाँव अनुसार बकाया सूची — ${selectedVillageObj ? selectedVillageObj.nameHi || selectedVillageObj.name : 'समस्त गाँव'}`
                : `Village Outstanding Dues Report — ${selectedVillageObj?.name || 'All Villages'}`}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? `कुल बकायादार किसान: ${villageFarmersWithDue.length} • कुल गाँव बकाया: ₹${villageTotalDue.toLocaleString('en-IN')}`
                : `Total farmers with pending dues: ${villageFarmersWithDue.length} • Grand Total: ₹${villageTotalDue.toLocaleString('en-IN')}`}
            </p>
          </div>

          {/* Dues Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-bold border-y border-slate-200">
                <tr>
                  <th className="p-3.5">#</th>
                  <th className="p-3.5">{t.farmerName}</th>
                  <th className="p-3.5">{t.fatherName}</th>
                  <th className="p-3.5">{t.villageName}</th>
                  <th className="p-3.5">{t.phone}</th>
                  <th className="p-3.5 text-center">{t.landAcreage}</th>
                  <th className="p-3.5 text-right">{t.currentDue} (₹)</th>
                  <th className="p-3.5 text-center no-print">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {villageFarmersWithDue.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      {t.noDataFound}
                    </td>
                  </tr>
                ) : (
                  villageFarmersWithDue.map((f, idx) => {
                    const vil = villages.find(v => v.id === f.villageId);
                    return (
                      <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 text-slate-400 font-bold">{idx + 1}</td>
                        <td className="p-3.5 font-bold text-slate-900">{f.name}</td>
                        <td className="p-3.5 text-slate-600">{f.fatherName || '-'}</td>
                        <td className="p-3.5 text-slate-700">
                          {language === 'hi' ? vil?.nameHi || vil?.name : vil?.name}
                        </td>
                        <td className="p-3.5 font-mono text-slate-800">{f.mobile}</td>
                        <td className="p-3.5 text-center text-slate-600">{f.landAcreage ? `${f.landAcreage} Acre` : '-'}</td>
                        <td className="p-3.5 text-right font-black text-rose-600 text-base">
                          ₹{f.currentDue.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5 text-center no-print">
                          <button
                            onClick={() => {
                              const text = language === 'hi'
                                ? `नमस्ते श्री ${f.name} जी, किसान कृषि केंद्र से आपका खाद-बीज का बकाया ₹${f.currentDue} शेष है। कृपया समय पर भुगतान करें। धन्यवाद!`
                                : `Dear ${f.name}, reminder from Kisan Agri Retail that your pending due is ₹${f.currentDue}. Kindly settle at your convenience.`;
                              window.open(`https://wa.me/91${f.mobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold inline-flex items-center space-x-1"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {villageFarmersWithDue.length > 0 && (
                <tfoot className="bg-slate-100 font-extrabold border-t-2 border-slate-300">
                  <tr>
                    <td colSpan={6} className="p-3.5 text-right text-slate-800">
                      {language === 'hi' ? 'गाँव कुल बकाया (Village Grand Total):' : 'Village Total Outstanding:'}
                    </td>
                    <td className="p-3.5 text-right text-rose-600 text-lg">
                      ₹{villageTotalDue.toLocaleString('en-IN')}
                    </td>
                    <td className="no-print"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* REPORT 1: DAILY SALES REPORT */}
      {activeReportTab === 'daily' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
            <div className="flex items-center space-x-2">
              <label className="text-xs font-bold text-slate-700">{t.reportDate}:</label>
              <input
                type="date"
                value={selectedDailyDate}
                onChange={e => setSelectedDailyDate(e.target.value)}
                className="p-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="bg-slate-200 text-slate-800 px-3 py-1 rounded-lg font-bold">
                {t.totalSalesAmount}: ₹{dailyTotalSales.toLocaleString('en-IN')}
              </span>
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg font-bold">
                {t.totalCashReceived}: ₹{dailyCashReceived.toLocaleString('en-IN')}
              </span>
              <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-lg font-bold">
                {t.totalDueGiven}: ₹{dailyRemainingDue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Bill #</th>
                  <th className="p-3.5">{t.farmerName}</th>
                  <th className="p-3.5">{t.villageName}</th>
                  <th className="p-3.5">{language === 'hi' ? 'आइटम विवरण' : 'Items'}</th>
                  <th className="p-3.5 text-right">{t.grandTotal}</th>
                  <th className="p-3.5 text-right">{t.paymentReceived}</th>
                  <th className="p-3.5 text-right">{t.remainingDue}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDailySales.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      {t.noDataFound}
                    </td>
                  </tr>
                ) : (
                  filteredDailySales.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-mono font-bold text-slate-800">{s.invoiceNo}</td>
                      <td className="p-3.5 font-bold text-slate-900">{s.farmerName}</td>
                      <td className="p-3.5 text-slate-600">{s.farmerVillage}</td>
                      <td className="p-3.5 text-slate-600">{s.items.map(i => `${i.productName} (${i.quantity})`).join(', ')}</td>
                      <td className="p-3.5 text-right font-black text-slate-900">₹{s.grandTotal}</td>
                      <td className="p-3.5 text-right font-bold text-emerald-600">₹{s.paidAmount}</td>
                      <td className="p-3.5 text-right font-bold text-rose-600">₹{s.remainingDue}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 2: PURCHASE REPORT */}
      {activeReportTab === 'purchase' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
            <div className="flex items-center space-x-2">
              <label className="text-xs font-bold text-slate-700">{t.selectSupplier}:</label>
              <select
                value={purchaseFilterSupplier}
                onChange={e => setPurchaseFilterSupplier(e.target.value)}
                className="p-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold"
              >
                <option value="all">{language === 'hi' ? 'सभी सप्लायर (All Suppliers)' : 'All Suppliers'}</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1.5 rounded-lg">
              {language === 'hi' ? 'कुल खरीद लागत:' : 'Total Purchase Value:'} ₹{totalPurchaseCost.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Invoice #</th>
                  <th className="p-3.5">{t.date}</th>
                  <th className="p-3.5">{t.supplierName}</th>
                  <th className="p-3.5">{language === 'hi' ? 'खरीदी गई वस्तुएं' : 'Products'}</th>
                  <th className="p-3.5 text-right">{t.totalPurchaseCost}</th>
                  <th className="p-3.5 text-right">{t.amountPaidToSupplier}</th>
                  <th className="p-3.5 text-right">{t.balancePayable}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPurchases.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-mono font-bold text-slate-800">{p.invoiceNo}</td>
                    <td className="p-3.5 text-slate-600 font-mono">{p.purchaseDate}</td>
                    <td className="p-3.5 font-bold text-slate-900">{p.supplierName}</td>
                    <td className="p-3.5 text-slate-600">
                      {p.items.map(i => `${i.productName} (${i.quantity} @ ₹${i.unitRate})`).join(', ')}
                    </td>
                    <td className="p-3.5 text-right font-black text-slate-900">₹{p.totalAmount}</td>
                    <td className="p-3.5 text-right font-bold text-emerald-600">₹{p.paidAmount}</td>
                    <td className="p-3.5 text-right font-bold text-amber-600">₹{p.balanceDue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 3: STOCK REPORT */}
      {activeReportTab === 'stock' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              <span className="text-xs text-slate-500 font-bold">{language === 'hi' ? 'कुल उपलब्ध उत्पाद' : 'Total Active SKUs'}</span>
              <p className="text-2xl font-black text-emerald-900 mt-1">{products.length}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <span className="text-xs text-amber-800 font-bold">{language === 'hi' ? 'कम स्टॉक चेतावनी' : 'Low Stock Warning'}</span>
              <p className="text-2xl font-black text-amber-900 mt-1">
                {products.filter(p => p.currentStock <= p.minStockAlert).length}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold">{language === 'hi' ? 'स्टॉक आवक-जावक एंट्री' : 'Stock Movements'}</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{stockMovements.length}</p>
            </div>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">{t.productName}</th>
                  <th className="p-3.5 text-center">{t.currentStock}</th>
                  <th className="p-3.5 text-right">{t.purchasePrice}</th>
                  <th className="p-3.5 text-right">{language === 'hi' ? 'स्टॉक वैल्यू' : 'Inventory Value'}</th>
                  <th className="p-3.5 text-center">{t.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(p => {
                  const isLow = p.currentStock <= p.minStockAlert;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{p.name}</td>
                      <td className="p-3.5 text-center font-extrabold text-base">
                        <span className={isLow ? 'text-rose-600' : 'text-slate-900'}>{p.currentStock}</span>
                      </td>
                      <td className="p-3.5 text-right text-slate-600">₹{p.purchasePrice}</td>
                      <td className="p-3.5 text-right font-bold text-slate-900">
                        ₹{(p.currentStock * p.purchasePrice).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isLow ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {isLow ? t.lowStock : t.inStock}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 4: FARMER LEDGER / KHATA */}
      {activeReportTab === 'farmer' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
            <div className="flex items-center space-x-2">
              <label className="text-xs font-bold text-slate-700">{language === 'hi' ? 'किसान चुनें:' : 'Select Farmer:'}</label>
              <select
                value={selectedFarmerId}
                onChange={e => setSelectedFarmerId(e.target.value)}
                className="p-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold"
              >
                {farmers.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} — Due: ₹{f.currentDue}
                  </option>
                ))}
              </select>
            </div>
            {activeFarmer && (
              <div className="text-right">
                <span className="text-xs text-slate-500">{t.currentDue}:</span>
                <span className="text-lg font-black text-rose-600 ml-2">
                  ₹{activeFarmer.currentDue.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          <div className="px-5 pt-2">
            <h3 className="font-extrabold text-slate-900 text-base">
              {language === 'hi' ? `किसान खाता बही (Khata Statement): ${activeFarmer?.name}` : `Farmer Account Ledger: ${activeFarmer?.name}`}
            </h3>
            <p className="text-xs text-slate-500">
              📞 {activeFarmer?.mobile} • 🌾 {activeFarmer?.landAcreage ? `${activeFarmer.landAcreage} Acres` : 'N/A'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-bold border-y border-slate-200">
                <tr>
                  <th className="p-3.5">{t.date}</th>
                  <th className="p-3.5">{language === 'hi' ? 'विवरण (Description)' : 'Description'}</th>
                  <th className="p-3.5 text-right">{language === 'hi' ? 'नामे / डेबिट (Debit ₹)' : 'Debit (₹)'}</th>
                  <th className="p-3.5 text-right">{language === 'hi' ? 'जमा / क्रेडिट (Credit ₹)' : 'Credit (₹)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {farmerLedgerItems.map((it, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3.5 font-mono text-slate-600">{it.date}</td>
                    <td className="p-3.5 text-slate-800 font-medium">{it.desc}</td>
                    <td className="p-3.5 text-right font-bold text-rose-600">
                      {it.debit > 0 ? `₹${it.debit}` : '-'}
                    </td>
                    <td className="p-3.5 text-right font-bold text-emerald-600">
                      {it.credit > 0 ? `₹${it.credit}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 6: MONTHLY REPORT */}
      {activeReportTab === 'monthly' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-5">
          <div className="flex items-center space-x-3 no-print">
            <label className="text-xs font-bold text-slate-700">{language === 'hi' ? 'माह चुनें:' : 'Select Month:'}</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="p-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              <span className="text-xs text-slate-600 font-bold">{language === 'hi' ? 'मासिक कुल बिक्री' : 'Monthly Total Sales'}</span>
              <p className="text-2xl font-black text-emerald-950 mt-1">₹{monthlySalesTotal.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <span className="text-xs text-amber-800 font-bold">{language === 'hi' ? 'मासिक खरीद लागत' : 'Monthly Purchases'}</span>
              <p className="text-2xl font-black text-amber-950 mt-1">₹{monthlyPurchaseTotal.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <span className="text-xs text-blue-800 font-bold">{language === 'hi' ? 'कुल प्राप्त वसूली' : 'Total Collections'}</span>
              <p className="text-2xl font-black text-blue-950 mt-1">₹{monthlyCollectedTotal.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 7: CUSTOM DATE REPORT */}
      {activeReportTab === 'custom-date' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 no-print">
            <div className="flex items-center space-x-2">
              <label className="text-xs font-bold text-slate-700">{t.fromDate}:</label>
              <input
                type="date"
                value={customFromDate}
                onChange={e => setCustomFromDate(e.target.value)}
                className="p-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-xs font-bold text-slate-700">{t.toDate}:</label>
              <input
                type="date"
                value={customToDate}
                onChange={e => setCustomToDate(e.target.value)}
                className="p-2 border border-slate-300 rounded-xl text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">{language === 'hi' ? 'बिक्री' : 'Sales'}</span>
              <p className="text-xl font-black text-slate-900 mt-1">₹{customSalesTotal.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">{language === 'hi' ? 'खरीद' : 'Purchases'}</span>
              <p className="text-xl font-black text-slate-900 mt-1">₹{customPurchasesTotal.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">{language === 'hi' ? 'वसूली' : 'Collections'}</span>
              <p className="text-xl font-black text-emerald-600 mt-1">₹{customCollectionsTotal.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">{language === 'hi' ? 'उधारी दी' : 'Dues Extended'}</span>
              <p className="text-xl font-black text-rose-600 mt-1">₹{customDuesTotal.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
