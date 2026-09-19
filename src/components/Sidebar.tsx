import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ProfileModal } from './ProfileModal';
import {
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Package,
  UserCheck,
  Receipt,
  CreditCard,
  BarChart3,
  ChevronRight,
  UserCog,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      num: '0',
      labelEn: 'Dashboard',
      labelHi: 'डैशबोर्ड',
      icon: LayoutDashboard,
      color: 'text-slate-600',
    },
    {
      id: 'master-setup',
      num: '1',
      labelEn: 'Master Setup',
      labelHi: '१. मास्टर सेटअप',
      icon: Settings,
      color: 'text-blue-600',
    },
    {
      id: 'purchase-entry',
      num: '2',
      labelEn: 'Purchase Entry',
      labelHi: '२. खरीद प्रविष्टि',
      icon: ShoppingCart,
      color: 'text-amber-600',
    },
    {
      id: 'inventory-stock',
      num: '3',
      labelEn: 'Inventory / Stock',
      labelHi: '३. स्टॉक प्रबंधन',
      icon: Package,
      color: 'text-emerald-600',
    },
    {
      id: 'farmer-registration',
      num: '4',
      labelEn: 'Farmer Registration',
      labelHi: '४. किसान पंजीकरण',
      icon: UserCheck,
      color: 'text-cyan-600',
    },
    {
      id: 'sales-entry',
      num: '5',
      labelEn: 'Sales Entry (POS)',
      labelHi: '५. बिक्री बिलिंग (POS)',
      icon: Receipt,
      color: 'text-rose-600',
      highlight: true,
    },
    {
      id: 'payment-entry',
      num: '6',
      labelEn: 'Payment Entry (Due)',
      labelHi: '६. उधारी जमा (वसूली)',
      icon: CreditCard,
      color: 'text-indigo-600',
      highlight: true,
    },
    {
      id: 'reports',
      num: '7',
      labelEn: 'Reports & Analysis',
      labelHi: '७. रिपोर्ट्स एवं विश्लेषण',
      icon: BarChart3,
      color: 'text-teal-600',
    },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            {language === 'hi' ? 'दुकान कार्यप्रणाली' : 'Shop Workflows'}
          </div>

          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const title = language === 'hi' ? item.labelHi : item.labelEn;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-semibold border-l-4 border-emerald-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                } ${item.highlight && !isActive ? 'bg-amber-50/50 text-slate-700' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 ' + item.color
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{title}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </button>
            );
          })}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/80 space-y-2">
          {user && (
            <button
              onClick={() => {
                setProfileOpen(true);
                if (window.innerWidth < 768) setIsOpen(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left shadow-sm group"
              title={language === 'hi' ? 'दुकानदार प्रोफ़ाइल एवं सेटिंग्स' : 'Store Owner Profile'}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-lime-300 font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-900 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.shopName || user.email}</p>
                </div>
              </div>
              <UserCog className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 shrink-0" />
            </button>
          )}

          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-xs text-slate-500">
            <p className="font-semibold text-slate-700">ARMS v1.0 Universal</p>
            <p className="text-[11px] text-slate-400">Web • Android • iOS Ready</p>
          </div>
        </div>
      </aside>

      {/* Profile Settings Modal */}
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
};
