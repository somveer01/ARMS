import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Receipt,
  CreditCard,
  Package,
  BarChart3,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { language } = useLanguage();

  const navItems = [
    {
      id: 'dashboard',
      labelEn: 'Home',
      labelHi: 'होम',
      icon: LayoutDashboard,
    },
    {
      id: 'inventory-stock',
      labelEn: 'Stock',
      labelHi: 'स्टॉक',
      icon: Package,
    },
    {
      id: 'sales-entry',
      labelEn: 'Sale POS',
      labelHi: 'बिक्री बिल',
      icon: Receipt,
      featured: true,
    },
    {
      id: 'payment-entry',
      labelEn: 'Collect Due',
      labelHi: 'उधारी जमा',
      icon: CreditCard,
    },
    {
      id: 'reports',
      labelEn: 'Reports',
      labelHi: 'रिपोर्ट',
      icon: BarChart3,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 shadow-lg px-2 py-1">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const label = language === 'hi' ? item.labelHi : item.labelEn;

          if (item.featured) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center -mt-5"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                    isActive
                      ? 'bg-emerald-700 text-white ring-4 ring-emerald-100'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-emerald-800 mt-1">{label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
                isActive ? 'text-emerald-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
