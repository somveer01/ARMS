import React, { useState, useRef, useEffect } from 'react';
import { Product, Category, Unit } from '../types';
import { Search, ChevronDown, Check, X, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SearchableProductSelectProps {
  value: string;
  onChange: (productId: string) => void;
  products: Product[];
  categories: Category[];
  units: Unit[];
  placeholder?: string;
  showStock?: boolean;
  priceType?: 'purchase' | 'selling';
  themeColor?: 'amber' | 'rose' | 'emerald';
}

export const SearchableProductSelect: React.FC<SearchableProductSelectProps> = ({
  value,
  onChange,
  products,
  categories,
  units,
  placeholder,
  showStock = true,
  priceType = 'purchase',
  themeColor = 'amber',
}) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedProduct = products.find(p => p.id === value);
  const selectedUnit = units.find(u => u.id === selectedProduct?.unitId);
  const selectedCategory = categories.find(c => c.id === selectedProduct?.categoryId);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto focus search input when opened
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter products by category and search term
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCat === 'all' || p.categoryId === selectedCat;
    const q = search.trim().toLowerCase();
    if (!q) return matchesCat;

    const matchesName = p.name.toLowerCase().includes(q);
    const matchesNameHi = p.nameHi ? p.nameHi.toLowerCase().includes(q) : false;
    const matchesBatch = p.batchNo ? p.batchNo.toLowerCase().includes(q) : false;
    return matchesCat && (matchesName || matchesNameHi || matchesBatch);
  });

  const activeRing =
    themeColor === 'rose'
      ? 'focus:ring-rose-500 border-rose-300'
      : themeColor === 'emerald'
      ? 'focus:ring-emerald-500 border-emerald-300'
      : 'focus:ring-amber-500 border-amber-300';

  const badgeBg =
    themeColor === 'rose'
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : themeColor === 'emerald'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2 text-left bg-white border border-slate-300 rounded-lg hover:border-slate-400 focus:outline-none focus:ring-2 ${activeRing} flex items-center justify-between gap-2 text-xs sm:text-sm transition-all shadow-sm`}
      >
        <div className="truncate flex-1 min-w-0">
          {selectedProduct ? (
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 truncate">
                {selectedProduct.name}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate mt-0.5">
                {selectedCategory && (
                  <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px] font-medium border border-slate-200">
                    {language === 'hi' ? selectedCategory.nameHi : selectedCategory.name}
                  </span>
                )}
                <span>
                  {priceType === 'purchase'
                    ? `खरीद दर: ₹${selectedProduct.purchasePrice}`
                    : `बिक्री दर: ₹${selectedProduct.sellingPrice}`}
                </span>
                {showStock && (
                  <span className="text-slate-400">
                    | स्टॉक: {selectedProduct.currentStock} {selectedUnit?.shortCode || ''}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span className="text-slate-400">
              {placeholder || (language === 'hi' ? 'उत्पाद चुनें...' : 'Select product...')}
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 min-w-[280px] sm:min-w-[420px]">
          {/* Search Box */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-200 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'ब्रांड, केमिकल या दवा का नाम खोजें...'
                    : 'Search brand or chemical name...'
                }
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCat('all')}
                className={`px-2 py-0.5 rounded-md font-semibold whitespace-nowrap transition-colors ${
                  selectedCat === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {language === 'hi' ? 'सभी' : 'All'} ({products.length})
              </button>
              {categories.map(cat => {
                const count = products.filter(p => p.categoryId === cat.id).length;
                if (count === 0) return null;
                const isSelected = selectedCat === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCat(cat.id)}
                    className={`px-2 py-0.5 rounded-md font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{language === 'hi' ? cat.nameHi.split('(')[0] : cat.name.split('&')[0]}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Items List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
            {filteredProducts.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                <Tag className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                <p>{language === 'hi' ? 'कोई उत्पाद नहीं मिला' : 'No products found'}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {language === 'hi' ? 'कृपया अन्य नाम से खोजें' : 'Try searching with another keyword'}
                </p>
              </div>
            ) : (
              filteredProducts.map(p => {
                const isSelected = p.id === value;
                const cat = categories.find(c => c.id === p.categoryId);
                const u = units.find(unit => unit.id === p.unitId);

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onChange(p.id);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full p-2.5 text-left hover:bg-amber-50/60 flex items-center justify-between gap-2 transition-colors ${
                      isSelected ? 'bg-amber-50 font-bold' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                          {p.name}
                        </span>
                        {cat && (
                          <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] whitespace-nowrap">
                            {language === 'hi' ? cat.nameHi.split('(')[0] : cat.name.split(' ')[0]}
                          </span>
                        )}
                      </div>
                      {p.nameHi && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {p.nameHi}
                        </p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="font-bold text-slate-900 text-xs block">
                        ₹{priceType === 'purchase' ? p.purchasePrice : p.sellingPrice}
                      </span>
                      {showStock && (
                        <span className={`text-[10px] block ${p.currentStock <= p.minStockAlert ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                          स्टॉक: {p.currentStock} {u?.shortCode || ''}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-amber-600 flex-shrink-0 ml-1" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
