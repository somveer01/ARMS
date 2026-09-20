import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import {
  UserCheck,
  UserPlus,
  Search,
  MapPin,
  Phone,
  CheckCircle,
  Share2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Farmer } from '../types';
import { useAutoHindi } from '../utils/transliterate';

interface FarmerRegistrationProps {
  onSelectFarmerForSale?: (farmer: Farmer) => void;
  onSelectFarmerForPayment?: (farmer: Farmer) => void;
}

export const FarmerRegistration: React.FC<FarmerRegistrationProps> = ({
  onSelectFarmerForSale,
  onSelectFarmerForPayment,
}) => {
  const { language, t } = useLanguage();
  const { farmers, villages, districts, addFarmer } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillageFilter, setSelectedVillageFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [fatherNameHi, setFatherNameHi] = useState('');
  const [mobile, setMobile] = useState('');
  const [districtId, setDistrictId] = useState(districts[0]?.id || '');
  const [villageId, setVillageId] = useState(villages[0]?.id || '');
  const [landAcreage, setLandAcreage] = useState<number | string>('');
  const [creditLimit, setCreditLimit] = useState<number | string>(50000);
  const [openingDue, setOpeningDue] = useState<number | string>('');

  // Auto-transliterate Farmer Name (English -> Hindi)
  const {
    isTranslating: isTranslatingName,
    handleManualHindiChange: handleManualNameHi,
    resetManual: resetNameManual,
  } = useAutoHindi(name, val => setNameHi(val));

  // Auto-transliterate Father Name (English -> Hindi)
  const {
    isTranslating: isTranslatingFather,
    handleManualHindiChange: handleManualFatherHi,
    resetManual: resetFatherManual,
  } = useAutoHindi(fatherName, val => setFatherNameHi(val));

  // Filter villages by selected district in form
  const formVillages = villages.filter(v => v.districtId === districtId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !villageId) return;

    addFarmer({
      name,
      nameHi,
      fatherName,
      fatherNameHi,
      mobile,
      districtId,
      villageId,
      landAcreage: Number(landAcreage) || 0,
      creditLimit: Number(creditLimit) || 50000,
      openingDue: Number(openingDue) || 0,
    });

    setSuccessMessage(t.saveFarmerSuccess);
    setTimeout(() => setSuccessMessage(''), 4000);
    setShowAddModal(false);

    // Reset Form
    setName('');
    setNameHi('');
    resetNameManual();
    setFatherName('');
    setFatherNameHi('');
    resetFatherManual();
    setMobile('');
    setLandAcreage('');
    setCreditLimit(50000);
    setOpeningDue('');
  };

  // Filtered farmers list
  const filteredFarmers = farmers.filter(f => {
    const vil = villages.find(v => v.id === f.villageId);
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      f.name.toLowerCase().includes(q) ||
      (f.nameHi && f.nameHi.toLowerCase().includes(q)) ||
      f.mobile.includes(q) ||
      (vil?.name.toLowerCase().includes(q) || (vil?.nameHi && vil?.nameHi.includes(q)));
    const matchesVillage = selectedVillageFilter === 'all' || f.villageId === selectedVillageFilter;
    return matchesSearch && matchesVillage;
  });

  const totalDuesAllFarmers = farmers.reduce((sum, f) => sum + f.currentDue, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-cyan-600 uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>{t.step4Title}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {language === 'hi' ? 'किसान पंजीकरण एवं खाता सूची' : 'Farmer Registration & Directory'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.step4Subtitle}
          </p>

          {/* Workflow Diagram Banner */}
          <div className="mt-3 p-2.5 bg-cyan-50 border border-cyan-200 rounded-xl text-xs text-cyan-900 flex flex-wrap items-center gap-2 font-medium">
            <span className="font-bold">{language === 'hi' ? 'प्रक्रिया:' : 'Flow:'}</span>
            <span className="bg-white px-2 py-0.5 rounded border border-cyan-300">
              {language === 'hi' ? 'नाम' : 'Farmer Name'}
            </span>
            <span>➔</span>
            <span className="bg-white px-2 py-0.5 rounded border border-cyan-300">
              {language === 'hi' ? 'मोबाइल' : 'Mobile No'}
            </span>
            <span>➔</span>
            <span className="bg-white px-2 py-0.5 rounded border border-cyan-300">
              {language === 'hi' ? 'गाँव ➔ ज़िला' : 'Village ➔ District'}
            </span>
            <span>➔</span>
            <span className="bg-cyan-600 text-white px-2 py-0.5 rounded font-bold">
              {language === 'hi' ? 'सुरक्षित करें (बिक्री व उधारी हेतु)' : 'Save (For Sales & Dues)'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center space-x-1.5 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow transition-all active:scale-95 flex-shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t.addFarmer}</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center space-x-3 text-emerald-800 font-semibold">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Directory Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={language === 'hi' ? 'नाम, मोबाइल या गाँव से खोजें...' : 'Search by Name, Mobile or Village...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedVillageFilter}
            onChange={e => setSelectedVillageFilter(e.target.value)}
            className="p-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none font-medium"
          >
            <option value="all">
              {language === 'hi' ? 'सभी गाँव (All Villages)' : 'All Villages'}
            </option>
            {villages.map(v => (
              <option key={v.id} value={v.id}>
                {language === 'hi' ? v.nameHi || v.name : v.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          {filteredFarmers.length} {language === 'hi' ? 'किसान पंजीकृत' : 'farmers found'} •{' '}
          <strong className="text-rose-600 font-bold">
            ₹{totalDuesAllFarmers.toLocaleString('en-IN')} {language === 'hi' ? 'कुल उधारी' : 'total dues'}
          </strong>
        </div>
      </div>

      {/* Farmers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">#</th>
                <th className="p-3.5">{t.farmerName}</th>
                <th className="p-3.5">{t.villageName} & {t.districtName}</th>
                <th className="p-3.5">{t.phone}</th>
                <th className="p-3.5 text-center">{t.landAcreage}</th>
                <th className="p-3.5 text-right">{t.currentDue}</th>
                <th className="p-3.5 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFarmers.map((f, idx) => {
                const vil = villages.find(v => v.id === f.villageId);
                const dist = districts.find(d => d.id === f.districtId);
                const hasDue = f.currentDue > 0;

                return (
                  <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 text-slate-400">{idx + 1}</td>
                    <td className="p-3.5">
                      <div className="flex items-center space-x-1.5 flex-wrap">
                        <span className="font-bold text-slate-900">{f.name}</span>
                        {f.nameHi && (
                          <span className="text-xs text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                            {f.nameHi}
                          </span>
                        )}
                      </div>
                      {(f.fatherName || f.fatherNameHi) && (
                        <p className="text-[11px] text-slate-500">
                          S/o {f.fatherName} {f.fatherNameHi ? `(${f.fatherNameHi})` : ''}
                        </p>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800">
                        {language === 'hi' ? vil?.nameHi || vil?.name : vil?.name}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        {language === 'hi' ? dist?.nameHi || dist?.name : dist?.name}
                      </p>
                    </td>
                    <td className="p-3.5">
                      <a
                        href={`tel:${f.mobile}`}
                        className="text-cyan-700 font-mono font-medium hover:underline flex items-center space-x-1"
                      >
                        <Phone className="w-3 h-3 text-cyan-600" />
                        <span>{f.mobile}</span>
                      </a>
                    </td>
                    <td className="p-3.5 text-center text-slate-600">
                      {f.landAcreage ? `${f.landAcreage} Acre` : '-'}
                    </td>
                    <td className="p-3.5 text-right font-black text-base">
                      {hasDue ? (
                        <span className="text-rose-600">₹{f.currentDue.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-emerald-600 text-xs font-semibold">₹0 (Paid)</span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        {hasDue && (
                          <button
                            onClick={() => {
                              const text = language === 'hi'
                                ? `नमस्ते ${f.nameHi || f.name} जी, आपका बकाया ₹${f.currentDue.toLocaleString('en-IN')} है। कृपया भुगतान करें। धन्यवाद।`
                                : `Dear ${f.name}, reminder: pending dues ₹${f.currentDue.toLocaleString('en-IN')}. Please clear at earliest. Thank you.`;
                              window.open(`https://wa.me/91${f.mobile}?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title={language === 'hi' ? 'व्हाट्सएप तगादा भेजें' : 'Send WhatsApp Reminder'}
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        )}
                        {onSelectFarmerForSale && (
                          <button
                            onClick={() => onSelectFarmerForSale(f)}
                            className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold"
                          >
                            {language === 'hi' ? 'बिल काटें' : 'Bill'}
                          </button>
                        )}
                        {onSelectFarmerForPayment && hasDue && (
                          <button
                            onClick={() => onSelectFarmerForPayment(f)}
                            className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold"
                          >
                            {language === 'hi' ? 'जमा लें' : 'Pay'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200">
            <div className="flex items-center space-x-2 text-cyan-700 font-bold mb-3">
              <UserPlus className="w-5 h-5" />
              <h3 className="text-lg text-slate-900 font-extrabold">{t.addFarmer}</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
              {/* Farmer Name: English & Auto Hindi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    {t.farmerName} (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Rameshwar Sharma"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-medium">
                      {t.farmerName} (हिन्दी)
                    </label>
                    <span className="text-[11px] font-semibold text-cyan-600 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{isTranslatingName ? (language === 'hi' ? 'अनुवाद...' : 'Translating...') : (language === 'hi' ? 'ऑटो हिन्दी' : 'Auto-Hindi')}</span>
                    </span>
                  </div>
                  <input
                    type="text"
                    value={nameHi}
                    onChange={e => handleManualNameHi(e.target.value)}
                    placeholder={language === 'hi' ? 'उदा. रामेश्वर शर्मा (स्वतः भरा जाएगा)' : 'e.g. रामेश्वर शर्मा (Auto-fills)'}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Father Name: English & Auto Hindi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    {t.fatherName} (English)
                  </label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={e => setFatherName(e.target.value)}
                    placeholder="e.g. Sh. Kashi Ram"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-medium">
                      {t.fatherName} (हिन्दी)
                    </label>
                    <span className="text-[11px] font-semibold text-cyan-600 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{isTranslatingFather ? (language === 'hi' ? 'अनुवाद...' : 'Translating...') : (language === 'hi' ? 'ऑटो हिन्दी' : 'Auto-Hindi')}</span>
                    </span>
                  </div>
                  <input
                    type="text"
                    value={fatherNameHi}
                    onChange={e => handleManualFatherHi(e.target.value)}
                    placeholder={language === 'hi' ? 'उदा. काशी राम (स्वतः भरा जाएगा)' : 'e.g. काशी राम (Auto-fills)'}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">{t.mobileNumber} *</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono"
                />
              </div>

              {/* District & Village Cascading Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t.districtName} *</label>
                  <select
                    value={districtId}
                    onChange={e => {
                      const newDistId = e.target.value;
                      setDistrictId(newDistId);
                      const matchingVils = villages.filter(v => v.districtId === newDistId);
                      if (matchingVils.length > 0) {
                        setVillageId(matchingVils[0].id);
                      }
                    }}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none font-medium"
                  >
                    {districts.map(d => (
                      <option key={d.id} value={d.id}>
                        {language === 'hi' ? d.nameHi || d.name : d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t.villageName} *</label>
                  <select
                    value={villageId}
                    onChange={e => setVillageId(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none font-medium text-slate-900"
                  >
                    {formVillages.map(v => (
                      <option key={v.id} value={v.id}>
                        {language === 'hi' ? v.nameHi || v.name : v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t.landAcreage}</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0"
                    value={landAcreage === 0 || landAcreage === '' ? '' : landAcreage}
                    onFocus={e => e.target.select()}
                    onChange={e => setLandAcreage(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t.creditLimit}</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="50000"
                    value={creditLimit === 0 || creditLimit === '' ? '' : creditLimit}
                    onFocus={e => e.target.select()}
                    onChange={e => setCreditLimit(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t.openingDue}</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0"
                    value={openingDue === 0 || openingDue === '' ? '' : openingDue}
                    onFocus={e => e.target.select()}
                    onChange={e => setOpeningDue(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none text-rose-600 font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold shadow transition-all"
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
