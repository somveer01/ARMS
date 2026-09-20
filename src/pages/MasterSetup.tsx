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
  Sparkles,
  Edit2,
  Trash2,
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
} from 'lucide-react';
import { Product, Supplier, Category, Unit, Village, District } from '../types';
import { useAutoHindi, transliterateToHindi } from '../utils/transliterate';

export const MasterSetup: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    products,
    categories,
    units,
    suppliers,
    districts,
    villages,
    farmers,
    purchases,
    sales,
    stockMovements,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addUnit,
    updateUnit,
    deleteUnit,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addDistrict,
    updateDistrict,
    deleteDistrict,
    addVillage,
    updateVillage,
    deleteVillage,
  } = useData();

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'units' | 'suppliers' | 'villages'>('products');
  const [villageView, setVillageView] = useState<'villages' | 'districts'>('villages');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Editing State
  const [editingItem, setEditingItem] = useState<{
    type: 'product' | 'category' | 'unit' | 'supplier' | 'village' | 'district';
    item: any;
  } | null>(null);
  const [isTranslatingEdit, setIsTranslatingEdit] = useState(false);

  // Safe Deletion Modals State
  const [deleteBlockedInfo, setDeleteBlockedInfo] = useState<{
    title: string;
    message: string;
    messageHi: string;
  } | null>(null);

  const [confirmDeleteInfo, setConfirmDeleteInfo] = useState<{
    type: 'product' | 'category' | 'unit' | 'supplier' | 'village' | 'district';
    id: string;
    name: string;
  } | null>(null);

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

  // Auto-transliterate Product Name (English -> Hindi)
  const {
    isTranslating: isTranslatingProd,
    handleManualHindiChange: handleManualProdHi,
    resetManual: resetProdManual,
  } = useAutoHindi(newProd.name, val => {
    setNewProd(prev => ({ ...prev, nameHi: val }));
  });

  // Auto-transliterate Village Name (English -> Hindi)
  const {
    isTranslating: isTranslatingVil,
    handleManualHindiChange: handleManualVilHi,
    resetManual: resetVilManual,
  } = useAutoHindi(newVil.name, val => {
    setNewVil(prev => ({ ...prev, nameHi: val }));
  });

  // Auto-transliterate District Name (English -> Hindi)
  const {
    isTranslating: isTranslatingDist,
    handleManualHindiChange: handleManualDistHi,
    resetManual: resetDistManual,
  } = useAutoHindi(newDist.name, val => {
    setNewDist(prev => ({ ...prev, nameHi: val }));
  });

  // Auto-transliterate Category Name (English -> Hindi)
  const {
    isTranslating: isTranslatingCat,
    handleManualHindiChange: handleManualCatHi,
    resetManual: resetCatManual,
  } = useAutoHindi(newCat.name, val => {
    setNewCat(prev => ({ ...prev, nameHi: val }));
  });

  // Auto-transliterate Unit Name (English -> Hindi)
  const {
    isTranslating: isTranslatingUnit,
    handleManualHindiChange: handleManualUnitHi,
    resetManual: resetUnitManual,
  } = useAutoHindi(newUnitData.name, val => {
    setNewUnitData(prev => ({ ...prev, nameHi: val }));
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
    resetDistManual();
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

  // Handle start editing
  const handleStartEdit = (type: 'product' | 'category' | 'unit' | 'supplier' | 'village' | 'district', item: any) => {
    setEditingItem({ type, item: { ...item } });
  };

  // Auto transliterate Hindi for editing item
  const handleAutoHindiEdit = async () => {
    if (!editingItem || !editingItem.item.name) return;
    setIsTranslatingEdit(true);
    try {
      const transliterated = await transliterateToHindi(editingItem.item.name);
      if (transliterated) {
        setEditingItem(prev => (prev ? { ...prev, item: { ...prev.item, nameHi: transliterated } } : null));
      }
    } finally {
      setIsTranslatingEdit(false);
    }
  };

  // Handle saving edits
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const { type, item } = editingItem;

    if (type === 'product') {
      updateProduct(item.id, {
        ...item,
        purchasePrice: Number(item.purchasePrice) || 0,
        sellingPrice: Number(item.sellingPrice) || 0,
        currentStock: Number(item.currentStock) || 0,
        minStockAlert: Number(item.minStockAlert) || 0,
      });
    } else if (type === 'category') {
      updateCategory(item.id, item);
    } else if (type === 'unit') {
      updateUnit(item.id, item);
    } else if (type === 'supplier') {
      updateSupplier(item.id, {
        ...item,
        openingBalance: Number(item.openingBalance || 0),
      });
    } else if (type === 'village') {
      updateVillage(item.id, item);
    } else if (type === 'district') {
      updateDistrict(item.id, item);
    }

    setSuccessMessage(
      language === 'hi'
        ? `"${item.name || item.shortCode || 'रिकॉर्ड'}" को सफलतापूर्वक अपडेट किया गया।`
        : `"${item.name || item.shortCode || 'Record'}" updated successfully.`
    );
    setTimeout(() => setSuccessMessage(''), 4000);
    setEditingItem(null);
  };

  // Safe delete check
  const handleDeleteRequest = (type: 'product' | 'category' | 'unit' | 'supplier' | 'village' | 'district', item: any) => {
    // 1. Check Product
    if (type === 'product') {
      const pCount = purchases.filter(p => p.items && p.items.some(it => it.productId === item.id)).length;
      const sCount = sales.filter(s => s.items && s.items.some(it => it.productId === item.id)).length;
      const mCount = stockMovements.filter(m => m.productId === item.id).length;

      if (pCount > 0 || sCount > 0 || mCount > 0) {
        const parts: string[] = [];
        const partsHi: string[] = [];
        if (sCount > 0) {
          parts.push(`${sCount} sale invoice(s)`);
          partsHi.push(`${sCount} बिक्री बिल`);
        }
        if (pCount > 0) {
          parts.push(`${pCount} purchase order(s)`);
          partsHi.push(`${pCount} खरीद बिल`);
        }
        if (mCount > 0) {
          parts.push(`${mCount} stock ledger movement(s)`);
          partsHi.push(`${mCount} स्टॉक लेजर प्रविष्टियाँ`);
        }

        setDeleteBlockedInfo({
          title: language === 'hi' ? 'उत्पाद हटाया नहीं जा सकता' : 'Cannot Delete Product',
          message: `This product cannot be deleted because it is referenced in: ${parts.join(', ')}. Business records must be preserved.`,
          messageHi: `इस उत्पाद को हटाया नहीं जा सकता क्योंकि यह निम्नलिखित लेन-देन में दर्ज है: ${partsHi.join(', ')}। वित्तीय व स्टॉक रिकॉर्ड की सुरक्षा हेतु इसे मिटाया नहीं जा सकता।`,
        });
        return;
      }
    }

    // 2. Check Category
    if (type === 'category') {
      const linked = products.filter(p => p.categoryId === item.id);
      if (linked.length > 0) {
        const names = linked.slice(0, 3).map(p => p.name).join(', ');
        const more = linked.length > 3 ? ` and ${linked.length - 3} more` : '';
        setDeleteBlockedInfo({
          title: language === 'hi' ? 'श्रेणी हटाई नहीं जा सकती' : 'Cannot Delete Category',
          message: `This category cannot be deleted because ${linked.length} product(s) are assigned to it (${names}${more}). Reassign or delete those products first.`,
          messageHi: `इस श्रेणी को हटाया नहीं जा सकता क्योंकि इसमें ${linked.length} उत्पाद जुड़े हैं (${names}${more})। पहले उन उत्पादों की श्रेणी बदलें या हटाएं।`,
        });
        return;
      }
    }

    // 3. Check Unit
    if (type === 'unit') {
      const linked = products.filter(p => p.unitId === item.id);
      if (linked.length > 0) {
        const names = linked.slice(0, 3).map(p => p.name).join(', ');
        const more = linked.length > 3 ? ` and ${linked.length - 3} more` : '';
        setDeleteBlockedInfo({
          title: language === 'hi' ? 'इकाई हटाई नहीं जा सकती' : 'Cannot Delete Unit',
          message: `This unit cannot be deleted because ${linked.length} product(s) are using it (${names}${more}).`,
          messageHi: `इस इकाई को हटाया नहीं जा सकता क्योंकि ${linked.length} उत्पाद इसका उपयोग कर रहे हैं (${names}${more})।`,
        });
        return;
      }
    }

    // 4. Check Supplier
    if (type === 'supplier') {
      const pCount = purchases.filter(p => p.supplierId === item.id).length;
      const hasBalance = item && Math.abs(item.currentPayable) > 0.01;
      if (pCount > 0 || hasBalance) {
        const parts: string[] = [];
        const partsHi: string[] = [];
        if (pCount > 0) {
          parts.push(`${pCount} purchase invoice(s)`);
          partsHi.push(`${pCount} खरीद बिल`);
        }
        if (hasBalance) {
          parts.push(`pending payable ₹${item.currentPayable}`);
          partsHi.push(`देय बकाया ₹${item.currentPayable}`);
        }
        setDeleteBlockedInfo({
          title: language === 'hi' ? 'सप्लायर हटाया नहीं जा सकता' : 'Cannot Delete Supplier',
          message: `This supplier cannot be deleted because linked records exist: ${parts.join(', ')}.`,
          messageHi: `इस सप्लायर को हटाया नहीं जा सकता क्योंकि इससे जुड़े रिकॉर्ड मौजूद हैं: ${partsHi.join(', ')}।`,
        });
        return;
      }
    }

    // 5. Check Village
    if (type === 'village') {
      const linked = farmers.filter(f => f.villageId === item.id);
      if (linked.length > 0) {
        const names = linked.slice(0, 3).map(f => f.name).join(', ');
        const more = linked.length > 3 ? ` and ${linked.length - 3} more` : '';
        setDeleteBlockedInfo({
          title: language === 'hi' ? 'गाँव हटाया नहीं जा सकता' : 'Cannot Delete Village',
          message: `This village cannot be deleted because ${linked.length} farmer(s) are registered from it (${names}${more}).`,
          messageHi: `इस गाँव को हटाया नहीं जा सकता क्योंकि इसमें ${linked.length} किसान पंजीकृत हैं (${names}${more})।`,
        });
        return;
      }
    }

    // 6. Check District
    if (type === 'district') {
      const linkedVils = villages.filter(v => v.districtId === item.id);
      const linkedFarms = farmers.filter(f => f.districtId === item.id);
      if (linkedVils.length > 0 || linkedFarms.length > 0) {
        setDeleteBlockedInfo({
          title: language === 'hi' ? 'ज़िला हटाया नहीं जा सकता' : 'Cannot Delete District',
          message: `This district cannot be deleted because ${linkedVils.length} village(s) and ${linkedFarms.length} farmer(s) are linked to it.`,
          messageHi: `इस ज़िले को हटाया नहीं जा सकता क्योंकि इससे ${linkedVils.length} गाँव और ${linkedFarms.length} किसान जुड़े हुए हैं।`,
        });
        return;
      }
    }

    // If no relations exist -> Open Confirm Delete Modal
    setConfirmDeleteInfo({
      type,
      id: item.id,
      name: item.name || item.shortCode || 'Record',
    });
  };

  // Execution of confirmed delete
  const handleConfirmDelete = () => {
    if (!confirmDeleteInfo) return;
    const { type, id, name } = confirmDeleteInfo;

    let res: { success: boolean; reason?: string; reasonHi?: string } = { success: true };
    if (type === 'product') res = deleteProduct(id);
    else if (type === 'category') res = deleteCategory(id);
    else if (type === 'unit') res = deleteUnit(id);
    else if (type === 'supplier') res = deleteSupplier(id);
    else if (type === 'village') res = deleteVillage(id);
    else if (type === 'district') res = deleteDistrict(id);

    setConfirmDeleteInfo(null);

    if (res.success) {
      setSuccessMessage(
        language === 'hi'
          ? `"${name}" को सफलतापूर्वक हटा दिया गया है।`
          : `"${name}" was deleted successfully.`
      );
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      setDeleteBlockedInfo({
        title: language === 'hi' ? 'हटाया नहीं जा सका' : 'Deletion Blocked',
        message: res.reason || '',
        messageHi: res.reasonHi || '',
      });
    }
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

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center space-x-3 text-emerald-800 font-semibold shadow-sm animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

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
                  <th className="p-3.5 text-center">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
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
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handleStartEdit('product', p)}
                              title={language === 'hi' ? 'उत्पाद संपादित करें' : 'Edit Product'}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRequest('product', p)}
                              title={language === 'hi' ? 'उत्पाद हटाएं' : 'Delete Product'}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
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
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-500 hover:shadow-md transition-all group"
              >
                <div
                  onClick={() => {
                    setSelectedProductCategory(c.id);
                    setActiveTab('products');
                  }}
                  title={language === 'hi' ? 'इस श्रेणी के उत्पाद देखें' : 'View products in this category'}
                  className="cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-800 transition-colors">{c.name}</h3>
                      <p className="text-emerald-700 text-xs font-semibold mt-0.5">{c.nameHi}</p>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Layers className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {count} {language === 'hi' ? 'उत्पाद पंजीकृत (देखने के लिए क्लिक करें →)' : 'products linked (click to view →)'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit('category', c);
                    }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'संपादित करें' : 'Edit'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRequest('category', c);
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'हटाएं' : 'Delete'}</span>
                  </button>
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
            <div key={u.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Unit Code</span>
                <h3 className="font-extrabold text-slate-900 text-lg mt-0.5">{u.shortCode}</h3>
                <p className="text-xs text-slate-700 font-medium mt-1">{u.name}</p>
                <p className="text-xs text-emerald-700 font-semibold">{u.nameHi}</p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end space-x-1.5">
                <button
                  type="button"
                  onClick={() => handleStartEdit('unit', u)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'संपादित' : 'Edit'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteRequest('unit', u)}
                  className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'हटाएं' : 'Delete'}</span>
                </button>
              </div>
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
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => handleStartEdit('supplier', s)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'संपादित' : 'Edit'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteRequest('supplier', s)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'हटाएं' : 'Delete'}</span>
                </button>
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
                  <div key={d.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
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
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit('district', d)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'संपादित' : 'Edit'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRequest('district', d)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'हटाएं' : 'Delete'}</span>
                      </button>
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
                  <div key={v.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
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
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit('village', v)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'संपादित' : 'Edit'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRequest('village', v)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'हटाएं' : 'Delete'}</span>
                      </button>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-medium">{t.productName} (हिन्दी)</label>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{isTranslatingProd ? (language === 'hi' ? 'अनुवाद हो रहा है...' : 'Translating...') : (language === 'hi' ? 'ऑटो हिन्दी (Auto-Hindi)' : 'Auto-Hindi')}</span>
                    </span>
                  </div>
                  <input
                    type="text"
                    value={newProd.nameHi}
                    onChange={e => handleManualProdHi(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder={language === 'hi' ? 'उदा. जिंक सल्फेट 33% (अंग्रेजी से स्वतः भरा जाएगा)' : 'e.g. जिंक सल्फेट 33% (Auto-fills from English)'}
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
                      min="0"
                      step="any"
                      placeholder="0"
                      value={!newProd.purchasePrice ? '' : newProd.purchasePrice}
                      onFocus={e => e.target.select()}
                      onChange={e => setNewProd({ ...newProd, purchasePrice: e.target.value === '' ? ('' as any) : Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">{t.sellingPrice} (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0"
                      value={!newProd.sellingPrice ? '' : newProd.sellingPrice}
                      onFocus={e => e.target.select()}
                      onChange={e => setNewProd({ ...newProd, sellingPrice: e.target.value === '' ? ('' as any) : Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">{t.currentStock}</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={!newProd.currentStock ? '' : newProd.currentStock}
                      onFocus={e => e.target.select()}
                      onChange={e => setNewProd({ ...newProd, currentStock: e.target.value === '' ? ('' as any) : Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">{t.minStockAlert}</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={!newProd.minStockAlert ? '' : newProd.minStockAlert}
                      onFocus={e => e.target.select()}
                      onChange={e => setNewProd({ ...newProd, minStockAlert: e.target.value === '' ? ('' as any) : Number(e.target.value) })}
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-medium">{t.villageName} (हिन्दी)</label>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{isTranslatingVil ? (language === 'hi' ? 'अनुवाद हो रहा है...' : 'Translating...') : (language === 'hi' ? 'ऑटो हिन्दी (Auto-Hindi)' : 'Auto-Hindi')}</span>
                    </span>
                  </div>
                  <input
                    type="text"
                    value={newVil.nameHi}
                    onChange={e => handleManualVilHi(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder={language === 'hi' ? 'उदा. रामपुर (अंग्रेजी से स्वतः भरा जाएगा)' : 'e.g. रामपुर (Auto-fills from English)'}
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-medium">{t.categoryName} (हिन्दी)</label>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{isTranslatingCat ? (language === 'hi' ? 'अनुवाद हो रहा है...' : 'Translating...') : (language === 'hi' ? 'ऑटो हिन्दी (Auto-Hindi)' : 'Auto-Hindi')}</span>
                    </span>
                  </div>
                  <input
                    type="text"
                    value={newCat.nameHi}
                    onChange={e => handleManualCatHi(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder={language === 'hi' ? 'उदा. कीटनाशक दवाइयां (अंग्रेजी से स्वतः भरा जाएगा)' : 'e.g. Pesticides (Auto-fills from English)'}
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
                  <label className="block text-slate-700 font-medium mb-1">{t.unitName} (English) *</label>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-medium">{t.unitName} (हिन्दी)</label>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{isTranslatingUnit ? (language === 'hi' ? 'अनुवाद हो रहा है...' : 'Translating...') : (language === 'hi' ? 'ऑटो हिन्दी (Auto-Hindi)' : 'Auto-Hindi')}</span>
                    </span>
                  </div>
                  <input
                    type="text"
                    value={newUnitData.nameHi}
                    onChange={e => handleManualUnitHi(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder={language === 'hi' ? 'उदा. किलोग्राम (अंग्रेजी से स्वतः भरा जाएगा)' : 'e.g. किलोग्राम (Auto-fills from English)'}
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-medium">
                    {language === 'hi' ? 'ज़िले का नाम (हिन्दी)' : 'District Name (Hindi)'}
                  </label>
                  <span className="text-[11px] font-semibold text-blue-600 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{isTranslatingDist ? (language === 'hi' ? 'अनुवाद हो रहा है...' : 'Translating...') : (language === 'hi' ? 'ऑटो हिन्दी (Auto-Hindi)' : 'Auto-Hindi')}</span>
                  </span>
                </div>
                <input
                  type="text"
                  value={newDist.nameHi}
                  onChange={e => handleManualDistHi(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder={language === 'hi' ? 'उदा. अलीगढ़ (अंग्रेजी से स्वतः भरा जाएगा)' : 'e.g. अलीगढ़ (Auto-fills from English)'}
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

      {/* Universal Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center space-x-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                <span>
                  {editingItem.type === 'product' && (language === 'hi' ? 'उत्पाद संपादित करें' : 'Edit Product')}
                  {editingItem.type === 'category' && (language === 'hi' ? 'श्रेणी संपादित करें' : 'Edit Category')}
                  {editingItem.type === 'unit' && (language === 'hi' ? 'इकाई संपादित करें' : 'Edit Unit')}
                  {editingItem.type === 'supplier' && (language === 'hi' ? 'सप्लायर संपादित करें' : 'Edit Supplier')}
                  {editingItem.type === 'village' && (language === 'hi' ? 'गाँव संपादित करें' : 'Edit Village')}
                  {editingItem.type === 'district' && (language === 'hi' ? 'ज़िला संपादित करें' : 'Edit District')}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs sm:text-sm">
              {/* Common Name (English) */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {language === 'hi' ? 'नाम (English) *' : 'Name (English) *'}
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.item.name || ''}
                  onChange={e =>
                    setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, name: e.target.value },
                    })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Hindi Name with Auto-transliterate Button */}
              {editingItem.type !== 'supplier' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-medium">
                      {language === 'hi' ? 'नाम (हिन्दी)' : 'Name (Hindi)'}
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoHindiEdit}
                      disabled={isTranslatingEdit}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>
                        {isTranslatingEdit
                          ? (language === 'hi' ? 'अनुवाद हो रहा है...' : 'Translating...')
                          : (language === 'hi' ? '✨ ऑटो हिन्दी भरें' : '✨ Fill Auto-Hindi')}
                      </span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={editingItem.item.nameHi || ''}
                    onChange={e =>
                      setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, nameHi: e.target.value },
                      })
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Specific Fields for Product */}
              {editingItem.type === 'product' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">{t.productCategory}</label>
                      <select
                        value={editingItem.item.categoryId}
                        onChange={e =>
                          setEditingItem({
                            ...editingItem,
                            item: { ...editingItem.item, categoryId: e.target.value },
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>
                            {language === 'hi' ? c.nameHi || c.name : c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">{t.productUnit}</label>
                      <select
                        value={editingItem.item.unitId}
                        onChange={e =>
                          setEditingItem({
                            ...editingItem,
                            item: { ...editingItem.item, unitId: e.target.value },
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        {units.map(u => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({u.shortCode})
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
                        min="0"
                        step="any"
                        placeholder="0"
                        value={!editingItem.item.purchasePrice ? '' : editingItem.item.purchasePrice}
                        onFocus={e => e.target.select()}
                        onChange={e =>
                          setEditingItem({
                            ...editingItem,
                            item: { ...editingItem.item, purchasePrice: e.target.value === '' ? ('' as any) : Number(e.target.value) },
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">{t.sellingPrice} (₹)</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={!editingItem.item.sellingPrice ? '' : editingItem.item.sellingPrice}
                        onFocus={e => e.target.select()}
                        onChange={e =>
                          setEditingItem({
                            ...editingItem,
                            item: { ...editingItem.item, sellingPrice: e.target.value === '' ? ('' as any) : Number(e.target.value) },
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">{t.currentStock}</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={!editingItem.item.currentStock ? '' : editingItem.item.currentStock}
                        onFocus={e => e.target.select()}
                        onChange={e =>
                          setEditingItem({
                            ...editingItem,
                            item: { ...editingItem.item, currentStock: e.target.value === '' ? ('' as any) : Number(e.target.value) },
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">{t.minStockAlert}</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={!editingItem.item.minStockAlert ? '' : editingItem.item.minStockAlert}
                        onFocus={e => e.target.select()}
                        onChange={e =>
                          setEditingItem({
                            ...editingItem,
                            item: { ...editingItem.item, minStockAlert: e.target.value === '' ? ('' as any) : Number(e.target.value) },
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Batch No</label>
                      <input
                        type="text"
                        value={editingItem.item.batchNo || ''}
                        onChange={e =>
                          setEditingItem({
                            ...editingItem,
                            item: { ...editingItem.item, batchNo: e.target.value },
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">HSN Code</label>
                      <input
                        type="text"
                        value={editingItem.item.hsnCode || ''}
                        onChange={e =>
                          setEditingItem({
                            ...editingItem,
                            item: { ...editingItem.item, hsnCode: e.target.value },
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Specific Fields for Unit */}
              {editingItem.type === 'unit' && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Short Code *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.item.shortCode || ''}
                    onChange={e =>
                      setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, shortCode: e.target.value },
                      })
                    }
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Specific Fields for Supplier */}
              {editingItem.type === 'supplier' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">{t.companyName}</label>
                      <input
                        type="text"
                        value={editingItem.item.company || ''}
                        onChange={e =>
                          setEditingItem({
                            ...editingItem,
                            item: { ...editingItem.item, company: e.target.value },
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">{t.phone} *</label>
                      <input
                        type="tel"
                        required
                        value={editingItem.item.phone || ''}
                        onChange={e =>
                          setEditingItem({
                            ...editingItem,
                            item: { ...editingItem.item, phone: e.target.value },
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">{t.gstin}</label>
                    <input
                      type="text"
                      value={editingItem.item.gstin || ''}
                      onChange={e =>
                        setEditingItem({
                          ...editingItem,
                          item: { ...editingItem.item, gstin: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      {language === 'hi' ? 'पता' : 'Address'}
                    </label>
                    <input
                      type="text"
                      value={editingItem.item.address || ''}
                      onChange={e =>
                        setEditingItem({
                          ...editingItem,
                          item: { ...editingItem.item, address: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Specific Fields for Village */}
              {editingItem.type === 'village' && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t.districtName} *</label>
                  <select
                    value={editingItem.item.districtId}
                    onChange={e =>
                      setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, districtId: e.target.value },
                      })
                    }
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {districts.map(d => (
                      <option key={d.id} value={d.id}>
                        {language === 'hi' ? d.nameHi || d.name : d.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow"
                >
                  {language === 'hi' ? 'अपडेट सुरक्षित करें' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deletion Blocked Modal (Referential Integrity Rule Check) */}
      {deleteBlockedInfo && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-rose-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center space-x-3 text-rose-600 mb-3">
              <div className="p-3 bg-rose-50 rounded-2xl">
                <ShieldAlert className="w-8 h-8 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{deleteBlockedInfo.title}</h3>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  {language === 'hi' ? 'सम्बद्ध प्रविष्टियां मौजूद हैं' : 'Dependent Records Exist'}
                </span>
              </div>
            </div>

            <p className="text-slate-700 text-xs sm:text-sm font-medium mt-3 leading-relaxed">
              {language === 'hi' ? deleteBlockedInfo.messageHi : deleteBlockedInfo.message}
            </p>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                {language === 'hi'
                  ? 'डेटा सुरक्षा नियम: जब तक सम्बद्ध लेन-देन/रिकॉर्ड मौजूद हैं, यह मास्टर रिकॉर्ड मिटाया नहीं जा सकता ताकि आपकी बिलिंग व लेजर रिपोर्ट सुरक्षित रहे।'
                  : 'Referential Integrity: This record cannot be deleted while dependent transactions exist to safeguard your financial and inventory reports.'}
              </span>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setDeleteBlockedInfo(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow"
              >
                {language === 'hi' ? 'समझ गया (बंद करें)' : 'Understood (Close)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Deletion Modal (When No Dependencies Exist) */}
      {confirmDeleteInfo && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center space-x-3 text-rose-600 mb-3">
              <div className="p-3 bg-rose-50 rounded-2xl">
                <Trash2 className="w-8 h-8 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {language === 'hi' ? 'हटाने की पुष्टि करें' : 'Confirm Deletion'}
                </h3>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  {language === 'hi' ? 'कोई सम्बद्ध रिकॉर्ड नहीं' : 'Safe To Delete'}
                </span>
              </div>
            </div>

            <p className="text-slate-700 text-xs sm:text-sm font-medium mt-3 leading-relaxed">
              {language === 'hi'
                ? `क्या आप वाकई "${confirmDeleteInfo.name}" को हटाना चाहते हैं? कोई सम्बद्ध रिकॉर्ड नहीं मिला है, अतः इसे सुरक्षित रूप से हटाया जा सकता है।`
                : `Are you sure you want to delete "${confirmDeleteInfo.name}"? No dependent records exist, so it can be safely removed.`}
            </p>

            <div className="mt-5 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteInfo(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 text-xs sm:text-sm"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow"
              >
                {language === 'hi' ? 'हाँ, हटाएं' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
