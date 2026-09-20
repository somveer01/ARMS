import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PWAProvider } from './context/PWAContext';
import { Auth } from './pages/Auth';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { InstallModal } from './components/InstallModal';
import { InstallBanner } from './components/InstallBanner';
import { Dashboard } from './pages/Dashboard';
import { MasterSetup } from './pages/MasterSetup';
import { PurchaseEntry } from './pages/PurchaseEntry';
import { InventoryStock } from './pages/InventoryStock';
import { FarmerRegistration } from './pages/FarmerRegistration';
import { SalesEntry } from './pages/SalesEntry';
import { PaymentEntry } from './pages/PaymentEntry';
import { Reports } from './pages/Reports';
import { Profile } from './pages/Profile';
import { Farmer } from './types';

const VALID_TABS = [
  'dashboard',
  'master-setup',
  'purchase-entry',
  'inventory-stock',
  'farmer-registration',
  'sales-entry',
  'payment-entry',
  'reports',
  'profile',
];

const getInitialTab = (): string => {
  // 1. Check URL hash first (e.g. #master-setup)
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash && VALID_TABS.includes(hash)) {
    return hash;
  }
  // 2. Check saved localStorage
  const savedTab = localStorage.getItem('arms_active_tab');
  if (savedTab && VALID_TABS.includes(savedTab)) {
    return savedTab;
  }
  return 'dashboard';
};

export const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTabState] = useState<string>(getInitialTab);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [selectedFarmerForAction, setSelectedFarmerForAction] = useState<Farmer | null>(null);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    localStorage.setItem('arms_active_tab', tab);
    if (window.location.hash !== `#${tab}`) {
      window.location.hash = tab;
    }
  };

  // Sync hash changes (e.g. Browser Back/Forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash && VALID_TABS.includes(hash)) {
        setActiveTabState(hash);
        localStorage.setItem('arms_active_tab', hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update initial hash if not set
  useEffect(() => {
    if (!window.location.hash && activeTab) {
      window.location.hash = activeTab;
    }
  }, [activeTab]);

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <InstallBanner />
        <Auth />
        <InstallModal />
      </div>
    );
  }

  const handleSelectFarmerForSale = (farmer: Farmer) => {
    setSelectedFarmerForAction(farmer);
    setActiveTab('sales-entry');
  };

  const handleSelectFarmerForPayment = (farmer: Farmer) => {
    setSelectedFarmerForAction(farmer);
    setActiveTab('payment-entry');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      {/* PWA Install Banner */}
      <InstallBanner />

      {/* Top Navbar with Language Toggle and Install App button */}
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
            {activeTab === 'master-setup' && <MasterSetup />}
            {activeTab === 'purchase-entry' && <PurchaseEntry />}
            {activeTab === 'inventory-stock' && <InventoryStock />}
            {activeTab === 'farmer-registration' && (
              <FarmerRegistration
                onSelectFarmerForSale={handleSelectFarmerForSale}
                onSelectFarmerForPayment={handleSelectFarmerForPayment}
              />
            )}
            {activeTab === 'sales-entry' && (
              <SalesEntry
                initialFarmer={selectedFarmerForAction}
                onClearInitialFarmer={() => setSelectedFarmerForAction(null)}
              />
            )}
            {activeTab === 'payment-entry' && (
              <PaymentEntry
                initialFarmer={selectedFarmerForAction}
                onClearInitialFarmer={() => setSelectedFarmerForAction(null)}
              />
            )}
            {activeTab === 'reports' && <Reports />}
            {activeTab === 'profile' && <Profile />}
          </div>
        </main>
      </div>

      {/* Mobile Touch Bottom Nav for Android & iOS */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* PWA Install Instructions Modal */}
      <InstallModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <PWAProvider>
            <AppContent />
          </PWAProvider>
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
