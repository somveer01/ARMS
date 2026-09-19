import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  User as UserIcon,
  Store,
  Phone,
  Mail,
  MapPin,
  FileText,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  Building,
  Sparkles,
  LogOut,
  Printer,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    shopName: user?.shopName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    district: user?.district || '',
    state: user?.state || '',
    licenseNo: user?.licenseNo || '',
    gstin: user?.gstin || '',
    receiptFooter: user?.receiptFooter || '',
  });

  const [activeTab, setActiveTab] = useState<'store' | 'legal' | 'receipt'>('store');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.shopName.trim()) {
      setErrorMsg(
        language === 'hi'
          ? 'नाम और दुकान का नाम आवश्यक है।'
          : 'Name and Shop Name are required.'
      );
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await updateProfile({
        name: formData.name.trim(),
        shopName: formData.shopName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        district: formData.district.trim(),
        state: formData.state.trim(),
        licenseNo: formData.licenseNo.trim(),
        gstin: formData.gstin.trim(),
        receiptFooter: formData.receiptFooter.trim(),
      });

      if (res.success) {
        setSuccessMsg(
          language === 'hi'
            ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई है! सभी रसीदों और बिलों पर नई जानकारी लागू हो गई है।'
            : 'Profile updated successfully! New details are now active on all receipts and POS bills.'
        );
        setTimeout(() => {
          setSuccessMsg('');
        }, 4000);
      } else {
        setErrorMsg(res.message || 'Update failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 p-6 sm:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-lime-400 text-emerald-950 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md border-2 border-emerald-700">
                {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow border border-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {formData.shopName || (language === 'hi' ? 'दुकानदार प्रोफ़ाइल' : 'Store Profile')}
                </h1>
                <span className="text-[11px] bg-lime-400/20 text-lime-300 border border-lime-400/40 px-2.5 py-0.5 rounded-full font-bold">
                  {language === 'hi' ? 'सक्रिय संचालक' : 'Store Owner'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                {formData.name} • {formData.email}
              </p>
              <p className="text-[11px] text-emerald-300">
                {language === 'hi'
                  ? 'यहाँ बदली गई जानकारी तुरंत थर्मल बिल रसीदों और WhatsApp संदेशों पर दिखेगी।'
                  : 'Changes saved here immediately apply to thermal POS bills and WhatsApp receipts.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (window.confirm(language === 'hi' ? 'क्या आप लॉगआउट करना चाहते हैं?' : 'Are you sure you want to log out?')) {
                logout();
              }
            }}
            className="self-start sm:self-center flex items-center space-x-1.5 px-3 py-2 bg-emerald-800/80 hover:bg-rose-900/80 text-rose-200 border border-rose-400/30 rounded-xl text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{language === 'hi' ? 'लॉगआउट करें' : 'Log Out'}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mt-6 border-b border-emerald-700/60 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('store')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'store'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{language === 'hi' ? '१. दुकान एवं संचालक' : '1. Store & Owner'}</span>
          </button>

          <button
            onClick={() => setActiveTab('legal')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'legal'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{language === 'hi' ? '२. खाद-बीज लाइसेंस व GST' : '2. Agri License & GST'}</span>
          </button>

          <button
            onClick={() => setActiveTab('receipt')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'receipt'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'hi' ? '३. रसीद प्रिव्यू व शर्तें' : '3. Receipt Note & Preview'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center space-x-2.5 text-xs sm:text-sm font-semibold shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-300 text-rose-900 rounded-2xl flex items-center space-x-2.5 text-xs sm:text-sm font-semibold shadow-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tab 1: Store & Owner Details */}
          {activeTab === 'store' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">
                {language === 'hi' ? 'दुकान व संचालक की जानकारी' : 'Store & Retailer Information'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'दुकान / प्रतिष्ठान का नाम *' : 'Store / Shop Name *'}
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleChange}
                      placeholder={language === 'hi' ? 'उदा. किसान सेवा केंद्र' : 'e.g. Kisan Seva Kendra'}
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'मालिक / संचालक का नाम *' : 'Owner / Retailer Name *'}
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={language === 'hi' ? 'उदा. सोमवीर शर्मा' : 'e.g. Somveer Sharma'}
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'मोबाइल नंबर (बिल पर मुद्रित होगा)' : 'Mobile Phone (Printed on Bills)'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9812001122"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'ईमेल आईडी (लॉगिन खाता)' : 'Email (Login Account)'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      disabled
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'दुकान का पता / सड़क / लैंडमार्क' : 'Shop Address / Market Location'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={language === 'hi' ? 'उदा. मुख्य अनाज मंडी, गेट नं. 2' : 'e.g. Grain Mandi, Near Bus Stand'}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'जिला (District)' : 'District'}
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Mathura"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'राज्य (State)' : 'State'}
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Uttar Pradesh"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Legal & Licenses */}
          {activeTab === 'legal' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">
                {language === 'hi' ? 'लाइसेंस एवं कर विवरण' : 'Agri License & Tax Registration'}
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi'
                    ? 'खाद, बीज व कीटनाशक लाइसेंस नंबर (Seeds/Fertilizer License)'
                    : 'Agri Seeds, Fertilizer & Pesticide License No.'}
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="licenseNo"
                    value={formData.licenseNo}
                    onChange={handleChange}
                    placeholder="UP-AGRI-SEED-2024/8892"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {language === 'hi'
                    ? 'कृषि विभाग के नियमों के अनुसार यह नंबर प्रत्येक बिक्री बीजक पर छपना आवश्यक होता है।'
                    : 'Printed on retail invoices as required by the agriculture department regulations.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'जीएसटी नंबर (GSTIN Registration)' : 'GSTIN Registration No.'}
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    placeholder="09AAACA1234A1Z5"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 uppercase font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Receipt Footer & Notes */}
          {activeTab === 'receipt' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">
                {language === 'hi' ? 'रसीद पर छपने वाली शर्तें एवं संदेश' : 'Bill Receipt Terms & Note'}
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi'
                    ? 'कस्टम रसीद नोट / संदेश (Receipt Footer)'
                    : 'Custom Receipt Footer & Note'}
                </label>
                <textarea
                  name="receiptFooter"
                  rows={3}
                  value={formData.receiptFooter}
                  onChange={handleChange}
                  placeholder={
                    language === 'hi'
                      ? 'उदा. उधारी का भुगतान 15 दिनों में अवश्य करें। बीज की अंकुरण गारंटी कंपनी के नियमों अनुसार है। 🌱'
                      : 'e.g. Please clear due within 15 days. Germination warranty per company terms. 🌱'
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                />
              </div>

              {/* Receipt Preview Box */}
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {language === 'hi' ? 'लाइव रसीद प्रिव्यू (थर्मल पर्ची)' : 'Live Thermal Receipt Preview'}
                </span>
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 text-xs font-mono space-y-1 shadow-inner max-w-sm mx-auto">
                  <p className="text-center font-bold text-slate-900 text-sm sm:text-base">{formData.shopName || 'ARMS AGRI RETAIL'}</p>
                  <p className="text-center text-slate-600 text-[11px]">{formData.address || 'Address'} {formData.district ? `, ${formData.district}` : ''}</p>
                  <p className="text-center text-slate-600 text-[11px]">📞 {formData.phone || '9812001122'} {formData.licenseNo ? ` | Lic: ${formData.licenseNo}` : ''}</p>
                  <div className="border-t border-dashed border-amber-300 my-2 pt-1 text-[11px] text-slate-500 italic text-center">
                    "{formData.receiptFooter || 'धन्यवाद! जय जवान जय किसान! 🌱'}"
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>
                {loading
                  ? (language === 'hi' ? 'सहेजा जा रहा है...' : 'Saving...')
                  : (language === 'hi' ? 'प्रोफ़ाइल सहेजें' : 'Save Profile Changes')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
