import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Auth } from './pages/Auth';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './pages/Dashboard';
import { MasterSetup } from './pages/MasterSetup';
import { PurchaseEntry } from './pages/PurchaseEntry';
import { InventoryStock } from './pages/InventoryStock';
import { FarmerRegistration } from './pages/FarmerRegistration';
import { SalesEntry } from './pages/SalesEntry';
import { PaymentEntry } from './pages/PaymentEntry';
import { Reports } from './pages/Reports';
import { Farmer } from './types';

export const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [selectedFarmerForAction, setSelectedFarmerForAction] = useState<Farmer | null>(null);

  if (!isAuthenticated) {
    return <Auth />;
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
      {/* Top Navbar with Language Toggle */}
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
          </div>
        </main>
      </div>

      {/* Mobile Touch Bottom Nav for Android & iOS */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
