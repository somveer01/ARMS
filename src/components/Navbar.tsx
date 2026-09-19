import React from 'react';
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

          {/* Right: Install App + Low Stock Alert Badge + Language Switcher + User Email Only + Logout */}
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

            {/* User Login Email & Logout */}
            {user && (
              <div className="flex items-center space-x-2 pl-2 border-l border-emerald-700">
                <span
                  className="text-xs text-emerald-100 font-medium truncate max-w-[140px] sm:max-w-[220px]"
                  title={user.email}
                >
                  {user.email}
                </span>

                <button
                  onClick={() => {
                    if (window.confirm(language === 'hi' ? 'क्या आप लॉगआउट करना चाहते हैं?' : 'Are you sure you want to log out?')) {
                      logout();
                    }
                  }}
                  title={language === 'hi' ? 'लॉगआउट करें' : 'Logout'}
                  className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4 text-rose-300" />
                  <span className="text-xs hidden sm:inline">{language === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
