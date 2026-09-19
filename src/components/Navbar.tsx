import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { usePWA } from '../context/PWAContext';
import {
  Sprout,
  Languages,
  AlertTriangle,
  Menu,
  X,
  LogOut,
  Smartphone,
  Mail,
} from 'lucide-react';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { products } = useData();
  const { user, logout } = useAuth();
  const { isInstalled, installApp } = usePWA();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Count low stock products
  const lowStockCount = products.filter(p => p.currentStock <= p.minStockAlert).length;

  return (
    <header className="sticky top-0 z-30 bg-emerald-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Menu + Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg text-emerald-100 hover:bg-emerald-800 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center space-x-2">
              <div className="bg-emerald-700 p-2 rounded-xl text-white shadow-inner flex items-center justify-center">
                <Sprout className="w-6 h-6 text-lime-300" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                    ARMS
                  </span>
                  <span className="text-xs bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full font-medium hidden sm:inline-block">
                    Agri Retail
                  </span>
                </div>
                <p className="text-xs text-emerald-200 hidden sm:block truncate max-w-xs">
                  {user?.shopName || (language === 'hi' ? 'कृषि खुदरा प्रबंधन एवं किसान उधारी बही' : 'Seeds, Pesticides, Fertilizers & Ledger')}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Install App + Low Stock Alert Badge + Language Switcher + Circle Avatar Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Install App Button (Visible if not running as installed PWA) */}
            {!isInstalled && (
              <button
                onClick={installApp}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-lime-400 hover:bg-lime-300 active:scale-95 text-emerald-950 rounded-lg text-xs font-black shadow transition-all animate-pulse"
                title={language === 'hi' ? 'अपने फोन में ऐप इंस्टॉल करें' : 'Install App on Phone'}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-900" />
                <span className="hidden sm:inline">{language === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>
                <span className="sm:hidden font-extrabold">{language === 'hi' ? 'ऐप लें' : 'Install'}</span>
              </button>
            )}

            {/* Low stock badge */}
            {lowStockCount > 0 && (
              <div
                title={`${lowStockCount} products low on stock`}
                className="flex items-center space-x-1 px-2 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-200 rounded-full text-xs font-semibold animate-pulse"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">{lowStockCount} {t.lowStock}</span>
                <span className="sm:hidden">{lowStockCount}</span>
              </div>
            )}

            {/* Language Switcher Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 active:scale-95 border border-emerald-600 rounded-lg transition-all shadow-sm group"
              title="Switch Language / भाषा बदलें"
            >
              <Languages className="w-4 h-4 text-lime-300 group-hover:rotate-12 transition-transform" />
              <div className="text-xs font-bold tracking-wide flex items-center space-x-0.5">
                <span className={language === 'en' ? 'text-lime-300 font-extrabold' : 'text-emerald-300'}>EN</span>
                <span className="text-emerald-400">/</span>
                <span className={language === 'hi' ? 'text-lime-300 font-extrabold' : 'text-emerald-300'}>हिन्दी</span>
              </div>
            </button>

            {/* Circle Avatar Button: click to reveal email & account details */}
            {user && (
              <div className="relative pl-1 sm:pl-2 border-l border-emerald-700" ref={dropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="w-8 h-8 rounded-full bg-lime-400 hover:bg-lime-300 active:scale-95 text-emerald-950 font-black text-xs flex items-center justify-center shadow-md transition-all ring-2 ring-emerald-600 focus:outline-none"
                  title="Click to view login email / खाता विवरण देखने के लिए क्लिक करें"
                  aria-label="User Account"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>

                {/* Dropdown Card Showing Email when clicked */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 px-4 z-50 text-slate-800 animate-fade-in">
                    <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-emerald-800 text-lime-300 font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-slate-900 truncate">{user.name}</p>
                        <div className="flex items-center space-x-1 text-slate-500 mt-0.5">
                          <Mail className="w-3 h-3 text-emerald-600 shrink-0" />
                          <p className="text-[11px] text-slate-600 truncate" title={user.email}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2.5 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {language === 'hi' ? 'सक्रिय लॉगिन' : 'Logged In'}
                      </span>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          if (window.confirm(language === 'hi' ? 'क्या आप लॉगआउट करना चाहते हैं?' : 'Are you sure you want to log out?')) {
                            logout();
                          }
                        }}
                        className="flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
