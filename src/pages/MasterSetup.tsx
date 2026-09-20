import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import {
  Settings,
  Package,
  Layers,
  Scale,
  Truck,
  MapPin,
  Plus,
  Search,
  Check,
  Filter,
  X,
  Tag,
  Building,
} from 'lucide-react';
import { Product, Supplier } from '../types';

export const MasterSetup: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    products,
    categories,
    units,
    suppliers,
    districts,
    villages,
    addProduct,
    addCategory,
    addUnit,
    addSupplier,
    addDistrict,
    addVillage,
  } = useData();

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'units' | 'suppliers' | 'villages'>('products');
  const [villageView, setVillageView] = useState<'villages' | 'districts'>('villages');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);

  // New District Form State
  const [newDist, setNewDist] = useState({
    name: '',
    nameHi: '',
  });

  // New Product Form State
  const [newProd, setNewProd] = useState({
    name: '',
    nameHi: '',
    categoryId: categories[0]?.id || '',
    unitId: units[0]?.id || '',
    hsnCode: '',
    batchNo: '',
    purchasePrice: 0,
    sellingPrice: 0,
    currentStock: 0,
    minStockAlert: 10,
  });

  // New Supplier Form State
  const [newSup, setNewSup] = useState({
    name: '',
    company: '',
    phone: '',
    gstin: '',
    address: '',
    openingBalance: 0,
  });

  // New Village Form State
  const [newVil, setNewVil] = useState({
    name: '',
    nameHi: '',
    districtId: districts[0]?.id || '',
  });

  // New Category Form State
  const [newCat, setNewCat] = useState({
    name: '',
    nameHi: '',
  });

  // New Unit Form State
  const [newUnitData, setNewUnitData] = useState({
    name: '',
    nameHi: '',
    shortCode: '',
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name) return;
    addProduct({
      ...newProd,
      purchasePrice: Number(newProd.purchasePrice),
      sellingPrice: Number(newProd.sellingPrice),
      currentStock: Number(newProd.currentStock),
      minStockAlert: Number(newProd.minStockAlert),
    });
    setNewProd({
      name: '',
      nameHi: '',
      categoryId: categories[0]?.id || '',
      unitId: units[0]?.id || '',
      hsnCode: '',
      batchNo: '',
      purchasePrice: 0,
      sellingPrice: 0,
      currentStock: 0,
      minStockAlert: 10,
    });
    setShowAddModal(false);
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSup.name) return;
    addSupplier({
      ...newSup,
      openingBalance: Number(newSup.openingBalance),
    });
    setNewSup({
      name: '',
      company: '',
      phone: '',
      gstin: '',
      address: '',
      openingBalance: 0,
    });
    setShowAddModal(false);
  };

  const handleCreateVillage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVil.name) return;
    addVillage(newVil);
    setNewVil({
      name: '',
      nameHi: '',
      districtId: districts[0]?.id || '',
    });
    setShowAddModal(false);
  };

  const handleCreateDistrict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDist.name) return;
    const created = addDistrict(newDist);
    setNewDist({ name: '', nameHi: '' });
    setNewVil(prev => ({ ...prev, districtId: created.id }));
    setShowDistrictModal(false);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name) return;
    addCategory(newCat);
    setNewCat({ name: '', nameHi: '' });
    setShowAddModal(false);
  };

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitData.name) return;
    addUnit(newUnitData);
    setNewUnitData({ name: '', nameHi: '', shortCode: '' });
    setShowAddModal(false);
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedProductCategory === 'all' || p.categoryId === selectedProductCategory;
    if (!matchesCategory) return false;
    const q = searchTerm.toLowerCase();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || (p.nameHi && p.nameHi.includes(q)) || (p.batchNo && p.batchNo.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            <span>{t.step1Title}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {language === 'hi' ? 'मास्टर प्रबंधन (Master Setup)' : 'Master Setup & Catalog'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.step1Subtitle}
          </p>
        </div>

        {activeTab === 'villages' ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDistrictModal(true)}
              className="flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow transition-all active:scale-95"
            >
              <Building className="w-4 h-4" />
              <span>{language === 'hi' ? 'नया ज़िला जोड़ें' : 'Add District'}</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'hi' ? 'नया गाँव जोड़ें' : 'Add Village'}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              if (activeTab === 'products' && selectedProductCategory !== 'all') {
                setNewProd(prev => ({ ...prev, categoryId: selectedProductCategory }));
              }
              setShowAddModal(true);
            }}
            className="flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>
              {activeTab === 'products' && (language === 'hi' ? 'नया उत्पाद जोड़ें' : 'Add New Product')}
              {activeTab === 'categories' && (language === 'hi' ? 'नई श्रेणी जोड़ें' : 'Add Category')}
              {activeTab === 'units' && (language === 'hi' ? 'नई इकाई जोड़ें' : 'Add Unit')}
              {activeTab === 'suppliers' && (language === 'hi' ? 'नया सप्लायर जोड़ें' : 'Add Supplier')}
            </span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 whitespace-nowrap transition-colors ${
            activeTab === 'products'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t.productsTab} ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 whitespace-nowrap transition-colors ${
            activeTab === 'categories'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t.categoriesTab} ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('units')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 whitespace-nowrap transition-colors ${
            activeTab === 'units'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>{t.unitsTab} ({units.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 whitespace-nowrap transition-colors ${
            activeTab === 'suppliers'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{t.suppliersTab} ({suppliers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('villages')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 whitespace-nowrap transition-colors ${
            activeTab === 'villages'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>{t.villagesTab} ({villages.length})</span>
        </button>
      </div>

      {/* Tab 1: Products Table */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Top Search & Category Dropdown Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Category Dropdown (for quick selection) */}
              <div className="flex items-center space-x-1.5">
                <select
                  value={selectedProductCategory}
                  onChange={e => setSelectedProductCategory(e.target.value)}
                  className="p-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-700 bg-white"
                >
                  <option value="all">
                    {language === 'hi' ? 'सभी श्रेणियां (All Categories)' : 'All Categories'} ({products.length})
                  </option>
                  {categories.map(c => {
                    const count = products.filter(p => p.categoryId === c.id).length;
                    return (
                      <option key={c.id} value={c.id}>
                        {language === 'hi' ? c.nameHi || c.name : c.name} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2">
              <span className="text-xs text-slate-500 font-medium">
                {filteredProducts.length} {language === 'hi' ? 'उत्पाद मौजूद' : 'products found'}
              </span>
              {selectedProductCategory !== 'all' && (
                <button
                  onClick={() => setSelectedProductCategory('all')}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                  <span>{language === 'hi' ? 'सभी दिखाएं' : 'Show All'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills (Horizontal Scroll) */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              <button
                type="button"
                onClick={() => setSelectedProductCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  selectedProductCategory === 'all'
                    ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/30'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{language === 'hi' ? 'सभी श्रेणियां' : 'All Categories'}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    selectedProductCategory === 'all' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {products.length}
                </span>
              </button>

              {categories.map(c => {
                const count = products.filter(p => p.categoryId === c.id).length;
                const isSelected = selectedProductCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedProductCategory(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/30'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{language === 'hi' ? c.nameHi || c.name : c.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">#</th>
                  <th className="p-3.5">{t.productName}</th>
                  <th className="p-3.5">{t.productCategory}</th>
                  <th className="p-3.5">{t.productUnit}</th>
                  <th className="p-3.5 text-right">{t.purchasePrice}</th>
                  <th className="p-3.5 text-right">{t.sellingPrice}</th>
                  <th className="p-3.5 text-center">{t.currentStock}</th>
                  <th className="p-3.5 text-center">{t.minStockAlert}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      <p className="font-semibold text-sm">
                        {language === 'hi' ? 'कोई उत्पाद नहीं मिला' : 'No products found'}
                      </p>
                      <p className="text-xs mt-1">
                        {language === 'hi' ? 'सर्च या श्रेणी फ़िल्टर बदलकर देखें' : 'Try adjusting your search or category filter'}
                      </p>
                      {selectedProductCategory !== 'all' && (
                        <button
                          onClick={() => setSelectedProductCategory('all')}
                          className="mt-3 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100"
                        >
                          {language === 'hi' ? 'सभी श्रेणियां दिखाएं' : 'Show All Categories'}
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p, idx) => {
                    const cat = categories.find(c => c.id === p.categoryId);
                    const u = units.find(unit => unit.id === p.unitId);
                    const isLow = p.currentStock <= p.minStockAlert;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 text-slate-400">{idx + 1}</td>
                        <td className="p-3.5">
                          <p className="font-bold text-slate-900">{p.name}</p>
                          {p.nameHi && <p className="text-xs text-slate-500">{p.nameHi}</p>}
                          {p.batchNo && (
                            <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                              Batch: {p.batchNo}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <button
                            type="button"
                            onClick={() => setSelectedProductCategory(p.categoryId)}
                            title={language === 'hi' ? 'इस श्रेणी के उत्पाद देखें' : 'Filter by this category'}
                            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-transform active:scale-95 ${
                              selectedProductCategory === p.categoryId
                                ? 'bg-emerald-700 text-white shadow-sm'
                                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            }`}
                          >
                            <Tag className="w-3 h-3 opacity-70" />
                            <span>{language === 'hi' ? cat?.nameHi || cat?.name : cat?.name}</span>
                          </button>
                        </td>
                        <td className="p-3.5 text-slate-600">
                          {language === 'hi' ? u?.nameHi || u?.name : u?.name}
                        </td>
                        <td className="p-3.5 text-right font-medium text-slate-600">₹{p.purchasePrice}</td>
                        <td className="p-3.5 text-right font-bold text-slate-900">₹{p.sellingPrice}</td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              isLow
                                ? 'bg-rose-100 text-rose-800 animate-pulse'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {p.currentStock} {u?.shortCode}
                          </span>
                        </td>
                        <td className="p-3.5 text-center text-slate-500">{p.minStockAlert} {u?.shortCode}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Categories */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(c => {
            const count = products.filter(p => p.categoryId === c.id).length;
            return (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedProductCategory(c.id);
                  setActiveTab('products');
                }}
                title={language === 'hi' ? 'इस श्रेणी के उत्पाद देखें' : 'View products in this category'}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
              >
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-800 transition-colors">{c.name}</h3>
                  <p className="text-emerald-700 text-xs font-semibold mt-0.5">{c.nameHi}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {count} {language === 'hi' ? 'उत्पाद पंजीकृत (देखने के लिए क्लिक करें →)' : 'products linked (click to view →)'}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Layers className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Units */}
      {activeTab === 'units' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {units.map(u => (
            <div key={u.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Unit Code</span>
              <h3 className="font-extrabold text-slate-900 text-lg mt-0.5">{u.shortCode}</h3>
              <p className="text-xs text-slate-700 font-medium mt-1">{u.name}</p>
              <p className="text-xs text-emerald-700 font-semibold">{u.nameHi}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Suppliers */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map(s => (
            <div key={s.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                    ID: {s.id}
                  </span>
                  <span className="text-xs font-semibold text-rose-600">
                    {language === 'hi' ? 'देय शेष:' : 'Payable:'} ₹{s.currentPayable.toLocaleString('en-IN')}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mt-2">{s.name}</h3>
                <p className="text-xs text-slate-500">{s.company}</p>
                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <p>📞 {s.phone}</p>
                  {s.gstin && <p className="font-mono text-[11px]">GST: {s.gstin}</p>}
                  {s.address && <p className="text-slate-400">{s.address}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Villages & Districts */}
      {activeTab === 'villages' && (
        <div className="space-y-4">
          {/* Sub-toggle Bar: Villages vs Districts */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setVillageView('villages')}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-colors ${
                  villageView === 'villages'
                    ? 'bg-cyan-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'गाँव की सूची' : 'Villages'} ({villages.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setVillageView('districts')}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-colors ${
                  villageView === 'districts'
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'ज़िलों की सूची' : 'Districts'} ({districts.length})</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowDistrictModal(true)}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'नया ज़िला जोड़ें' : 'Add District'}</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'नया गाँव जोड़ें' : 'Add Village'}</span>
              </button>
            </div>
          </div>

          {/* View Mode: Districts List */}
          {villageView === 'districts' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {districts.map(d => {
                const linkedVillages = villages.filter(v => v.districtId === d.id);
                return (
                  <div key={d.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                        <Building className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{d.name}</h4>
                        <p className="text-xs text-blue-700 font-semibold">{d.nameHi}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {linkedVillages.length} {language === 'hi' ? 'गाँव पंजीकृत' : 'villages linked'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* View Mode: Villages List */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {villages.map(v => {
                const dist = districts.find(d => d.id === v.districtId);
                return (
                  <div key={v.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-cyan-50 text-cyan-700 rounded-xl">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{v.name}</h4>
                        <p className="text-xs text-emerald-700 font-semibold">{v.nameHi}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {language === 'hi' ? 'ज़िला:' : 'District:'} {language === 'hi' ? dist?.nameHi || dist?.name : dist?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Dynamic Creation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-lg mb-4">
              {activeTab === 'products' && (language === 'hi' ? 'नया उत्पाद जोड़ें' : 'Create New Product')}
              {activeTab === 'categories' && (language === 'hi' ? 'नई श्रेणी जोड़ें' : 'Create New Category')}
              {activeTab === 'units' && (language === 'hi' ? 'नई इकाई जोड़ें' : 'Create New Unit')}
              {activeTab === 'suppliers' && (language === 'hi' ? 'नया सप्लायर जोड़ें' : 'Create New Supplier')}
              {activeTab === 'villages' && (language === 'hi' ? 'नया गाँव जोड़ें' : 'Create New Village')}
            </h3>

            {/* Product Form */}
            {activeTab === 'products' && (
              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t.productName} (English) *</label>
                  <input
                    type="text"
                    required
                    value={newProd.name}
                    onChange={e => setNewProd({ ...newProd, name: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. Zinc Sulphate 33%"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t.productName} (हिन्दी)</label>
                  <input
                    type="text"
                    value={newProd.nameHi}
                    onChange={e => setNewProd({ ...newProd, nameHi: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="उदा. जिंक सल्फेट 33%"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">{t.productCategory}</label>
                    <select
                      value={newProd.categoryId}
                      onChange={e => setNewProd({ ...newProd, categoryId: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>
                          {language === 'hi' ? c.nameHi : c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">{t.productUnit}</label>
                    <select
                      value={newProd.unitId}
                      onChange={e => setNewProd({ ...newProd, unitId: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {units.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">{t.purchasePrice} (₹)</label>
                    <input
                      type="number"
                      value={newProd.purchasePrice}
                      onChange={e => setNewProd({ ...newProd, purchasePrice: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">{t.sellingPrice} (₹)</label>
                    <input
                      type="number"
                      value={newProd.sellingPrice}
                      onChange={e => setNewProd({ ...newProd, sellingPrice: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">{t.currentStock}</label>
                    <input
                      type="number"
                      value={newProd.currentStock}
                      onChange={e => setNewProd({ ...newProd, currentStock: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">{t.minStockAlert}</label>
                    <input
                      type="number"
                      value={newProd.minStockAlert}
                      onChange={e => setNewProd({ ...newProd, minStockAlert: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow"
                  >
                    {t.save}
                  </button>
                </div>
              </form>
            )}

            {/* Supplier Form */}
            {activeTab === 'suppliers' && (
              <form onSubmit={handleCreateSupplier} className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t.supplierName} *</label>
                  <input
                    type="text"
                    required
                    value={newSup.name}
                    onChange={e => setNewSup({ ...newSup, name: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. IFFCO Agency"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t.companyName}</label>
                  <input
                    type="text"
                    value={newSup.company}
                    onChange={e => setNewSup({ ...newSup, company: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t.phone} *</label>
                  <input
                    type="text"
                    required
                    value={newSup.phone}
                    onChange={e => setNewSup({ ...newSup, phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t.gstin}</label>
                  <input
                    type="text"
                    value={newSup.gstin}
                    onChange={e => setNewSup({ ...newSup, gstin: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow"
                  >
                    {t.save}
                  </button>
                </div>
              </form>
            )}

            {/* Village Form */}
            {activeTab === 'villages' && (
              <form onSubmit={handleCreateVillage} className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t.villageName} (English) *</label>
                  <input
                    type="text"
                    required
                    value={newVil.name}
                    onChange={e => setNewVil({ ...newVil, name: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. Rampur"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t.villageName} (हिन्दी)</label>
                  <input
                    type="text"
                    value={newVil.nameHi}
                    onChange={e => setNewVil({ ...newVil, nameHi: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="उदा. रामपुर"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-medium">{t.districtName} *</label>
                    <button
                      type="button"
                      onClick={() => setShowDistrictModal(true)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{language === 'hi' ? '+ नया ज़िला जोड़ें' : '+ Add District'}</span>
                    </button>
                  </div>
                  <select
                    value={newVil.districtId}
                    onChange={e => setNewVil({ ...newVil, districtId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {districts.map(d => (
                      <option key={d.id} value={d.id}>
                        {language === 'hi' ? d.nameHi || d.name : d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow"
                  >
                    {t.save}
                  </button>
                </div>
              </form>
            )}

            {/* Category Form */}
            {activeTab === 'categories' && (
              <form onSubmit={handleCreateCategory} className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t.categoryName} (English) *</label>
                  <input
                    type="text"
                    required
                    value={newCat.name}
                    onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t.categoryName} (हिन्दी)</label>
                  <input
                    type="text"
                    value={newCat.nameHi}
                    onChange={e => setNewCat({ ...newCat, nameHi: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow"
                  >
                    {t.save}
                  </button>
                </div>
              </form>
            )}

            {/* Unit Form */}
            {activeTab === 'units' && (
              <form onSubmit={handleCreateUnit} className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t.unitName} *</label>
                  <input
                    type="text"
                    required
                    value={newUnitData.name}
                    onChange={e => setNewUnitData({ ...newUnitData, name: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. Kilogram (Kg)"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Code *</label>
                  <input
                    type="text"
                    required
                    value={newUnitData.shortCode}
                    onChange={e => setNewUnitData({ ...newUnitData, shortCode: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. Kg"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow"
                  >
                    {t.save}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Create District Modal */}
      {showDistrictModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>{language === 'hi' ? 'नया ज़िला जोड़ें' : 'Create New District'}</span>
              </h3>
              <button
                onClick={() => setShowDistrictModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDistrict} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {language === 'hi' ? 'ज़िले का नाम (English) *' : 'District Name (English) *'}
                </label>
                <input
                  type="text"
                  required
                  value={newDist.name}
                  onChange={e => setNewDist({ ...newDist, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Aligarh, Agra, Mathura"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {language === 'hi' ? 'ज़िले का नाम (हिन्दी)' : 'District Name (Hindi)'}
                </label>
                <input
                  type="text"
                  value={newDist.nameHi}
                  onChange={e => setNewDist({ ...newDist, nameHi: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="उदा. अलीगढ़, आगरा, मथुरा"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDistrictModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
