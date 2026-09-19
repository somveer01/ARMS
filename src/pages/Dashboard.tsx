import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  Package,
  Receipt,
  ShoppingCart,
  UserPlus,
  MapPin,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { language, t } = useLanguage();
  const { products, farmers, sales, payments, villages, districts } = useData();
  const { user } = useAuth();

  // Metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(s => s.saleDate === todayStr);
  const todaySalesTotal = todaySales.reduce((acc, s) => acc + s.grandTotal, 0);

  const todayPayments = payments.filter(p => p.paymentDate === todayStr);
  const todayCollectionsTotal =
    todaySales.reduce((acc, s) => acc + s.paidAmount, 0) +
    todayPayments.reduce((acc, p) => acc + p.amount, 0);

  const totalOutstandingDues = farmers.reduce((acc, f) => acc + f.currentDue, 0);
  const lowStockProducts = products.filter(p => p.currentStock <= p.minStockAlert);

  // Group dues by village
  const villageDueMap: { [vilId: string]: { name: string; count: number; due: number } } = {};
  farmers.forEach(f => {
    if (f.currentDue > 0) {
      if (!villageDueMap[f.villageId]) {
        const v = villages.find(vil => vil.id === f.villageId);
        villageDueMap[f.villageId] = {
          name: language === 'hi' ? (v?.nameHi || v?.name || 'गाँव') : (v?.name || 'Village'),
          count: 0,
          due: 0,
        };
      }
      villageDueMap[f.villageId].count += 1;
      villageDueMap[f.villageId].due += f.currentDue;
    }
  });

  const topVillageDues = Object.values(villageDueMap).sort((a, b) => b.due - a.due).slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-5 sm:p-7 rounded-2xl shadow-sm border border-emerald-700/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-700/60 text-lime-300 px-2.5 py-1 rounded-full">
            {user?.shopName || (language === 'hi' ? 'कृषि व्यापार नियंत्रण केंद्र' : 'Agri Retail Command Center')}
          </span>
          <h1 className="text-xl sm:text-2xl font-black mt-2 tracking-tight">
            {language === 'hi' ? `नमस्ते, ${user?.name || 'दुकानदार'}` : `Welcome, ${user?.name || 'Retailer'}`}
          </h1>
          <p className="text-emerald-200 text-xs sm:text-sm mt-1">
            {language === 'hi'
              ? 'बीज, खाद, कीटनाशक बिक्री व गाँव अनुसार किसान उधारी का पूर्ण प्रबंधन'
              : 'Seeds, fertilizers, pesticides sales & village-wise farmer credit ledgers'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('sales-entry')}
            className="flex items-center space-x-2 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold px-4 py-2.5 rounded-xl shadow transition-all active:scale-95 text-xs sm:text-sm"
          >
            <Receipt className="w-4 h-4" />
            <span>{language === 'hi' ? 'नया बिल बनाएं (POS)' : 'New Bill (POS)'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Today's Sales */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.todaySales}
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              ₹{todaySalesTotal.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {todaySales.length} {language === 'hi' ? 'बिल कटे' : 'bills today'}
            </p>
          </div>
        </div>

        {/* Today's Collections */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.todayCollections}
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              ₹{todayCollectionsTotal.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              Cash & UPI {language === 'hi' ? 'प्राप्त' : 'collected'}
            </p>
          </div>
        </div>

        {/* Total Outstanding Dues */}
        <div
          onClick={() => setActiveTab('reports')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-rose-400 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              {t.totalOutstandingDues}
            </span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-rose-600">
              ₹{totalOutstandingDues.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-rose-500 font-medium mt-0.5 flex items-center space-x-1">
              <span>{farmers.filter(f => f.currentDue > 0).length} {language === 'hi' ? 'किसानों पर बकाया' : 'farmers with dues'}</span>
            </p>
          </div>
        </div>

        {/* Low Stock Items */}
        <div
          onClick={() => setActiveTab('inventory-stock')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-amber-400 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              {t.lowStockAlerts}
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-amber-700">
              {lowStockProducts.length}
            </span>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">
              {language === 'hi' ? 'री-ऑर्डर की जरूरत' : 'Items need reorder'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Workflows Grid (Directly maps to the diagram steps!) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>{t.quickActions}</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('sales-entry')}
            className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 text-left transition-all group flex flex-col justify-between"
          >
            <div className="p-2.5 bg-rose-600 text-white rounded-xl w-fit group-hover:scale-105 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <div className="mt-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Step 5</span>
              <p className="font-bold text-slate-900 text-sm">{t.newSale}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === 'hi' ? 'नकद व उधारी बिलिंग' : 'POS with auto due split'}
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('payment-entry')}
            className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 text-left transition-all group flex flex-col justify-between"
          >
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl w-fit group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="mt-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Step 6</span>
              <p className="font-bold text-slate-900 text-sm">{t.receivePayment}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === 'hi' ? 'उधारी वसूली दर्ज करें' : 'Record farmer payment'}
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('purchase-entry')}
            className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 text-left transition-all group flex flex-col justify-between"
          >
            <div className="p-2.5 bg-amber-600 text-white rounded-xl w-fit group-hover:scale-105 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div className="mt-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Step 2</span>
              <p className="font-bold text-slate-900 text-sm">{t.newPurchase}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === 'hi' ? 'सप्लायर से माल आवक' : 'Distributor stock inward'}
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('farmer-registration')}
            className="p-4 rounded-xl border border-cyan-200 bg-cyan-50/40 hover:bg-cyan-50 text-left transition-all group flex flex-col justify-between"
          >
            <div className="p-2.5 bg-cyan-600 text-white rounded-xl w-fit group-hover:scale-105 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <div className="mt-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Step 4</span>
              <p className="font-bold text-slate-900 text-sm">{t.addFarmer}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === 'hi' ? 'गाँव अनुसार किसान जोड़ें' : 'Register farmer by village'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Village-wise Dues Snapshot & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Village Dues Snapshot */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {t.villageDueSnapshot}
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('reports')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
              >
                {language === 'hi' ? 'पूरी रिपोर्ट देखें →' : 'View Full Report →'}
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {topVillageDues.map((v, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800">{v.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {v.count} {language === 'hi' ? 'बकायादार किसान' : 'farmers with dues'}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-rose-600">
                    ₹{v.due.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>{language === 'hi' ? 'गाँव वसूली टूर के लिए रिपोर्ट उपयोगी है' : 'Target for recovery tours'}</span>
            <span className="text-emerald-700 font-bold">
              {language === 'hi' ? 'रिपोर्ट सेक्शन में उपलब्ध' : 'Available in Reports'}
            </span>
          </div>
        </div>

        {/* Recent Sales Ledger */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {t.recentSales}
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('sales-entry')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
              >
                {language === 'hi' ? 'बिक्री काउंटर खोलें →' : 'Open POS Counter →'}
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {sales.slice(0, 5).map(s => (
                <div key={s.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-900">{s.farmerName}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {s.invoiceNo}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {s.saleDate} • {s.items.length} {language === 'hi' ? 'आइटम' : 'items'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">₹{s.grandTotal}</p>
                    {s.remainingDue > 0 ? (
                      <p className="text-[11px] font-semibold text-rose-500">
                        ₹{s.remainingDue} {language === 'hi' ? 'उधारी' : 'Due'}
                      </p>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>{language === 'hi' ? 'पूर्ण भुगतान' : 'Paid'}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>{language === 'hi' ? 'दैनिक बिक्री स्वतः दर्ज' : 'Auto sales register'}</span>
            <span className="font-semibold text-slate-700">
              {sales.length} {language === 'hi' ? 'कुल बिल' : 'total sales recorded'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
