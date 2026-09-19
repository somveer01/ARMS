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
  X,
  CheckCircle2,
  AlertCircle,
  Building,
  Sparkles,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
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

  if (!isOpen || !user) return null;

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
            ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई है!'
            : 'Profile updated successfully!'
        );
        setTimeout(() => {
          setSuccessMsg('');
        }, 3000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 my-8 animate-scale-up">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-lime-400 text-emerald-950 font-black text-2xl flex items-center justify-center shadow-lg border-2 border-emerald-700">
                {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow border border-white">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold tracking-tight text-white">
                  {formData.shopName || (language === 'hi' ? 'मेरी दुकान' : 'My Agri Store')}
                </h2>
                <span className="text-[11px] bg-lime-400/20 text-lime-300 border border-lime-400/40 px-2 py-0.5 rounded-full font-bold">
                  {language === 'hi' ? 'सक्रिय संचालक' : 'Store Owner'}
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                {language === 'hi'
                  ? 'दुकानदार प्रोफ़ाइल, लाइसेंस व बिल रसीद सेटिंग्स'
                  : 'Manage store info, license details & billing receipts'}
              </p>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex space-x-2 mt-6 border-b border-emerald-700/60 pb-1">
            <button
              onClick={() => setActiveTab('store')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'store'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-emerald-200 hover:bg-emerald-800/60'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'दुकान एवं संचालक' : 'Store & Owner'}</span>
            </button>

            <button
              onClick={() => setActiveTab('legal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'legal'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-emerald-200 hover:bg-emerald-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'लाइसेंस व जीएसटी' : 'License & GST'}</span>
            </button>

            <button
              onClick={() => setActiveTab('receipt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'receipt'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-emerald-200 hover:bg-emerald-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'रसीद प्रिव्यू' : 'Receipt Note'}</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl flex items-center space-x-2 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-300 text-rose-900 rounded-xl flex items-center space-x-2 text-xs font-semibold animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {activeTab === 'store' && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'दुकान / प्रतिष्ठान का नाम *' : 'Store / Shop Name *'}
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleChange}
                      placeholder={language === 'hi' ? 'उदा. किसान सेवा केंद्र' : 'e.g. Kisan Seva Kendra'}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'संचालक / मालिक का नाम *' : 'Owner / Retailer Name *'}
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={language === 'hi' ? 'उदा. सोमवीर शर्मा' : 'e.g. Somveer Sharma'}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'मोबाइल नंबर (बिल पर छपने हेतु)' : 'Mobile Phone'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9812001122"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'ईमेल आईडी' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      disabled
                      className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'दुकान का पूरा पता / सड़क' : 'Full Shop Address / Landmark'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={language === 'hi' ? 'उदा. अनाज मंडी, गेट नं. 2' : 'e.g. Grain Mandi, Gate No. 2'}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="space-y-3.5 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi'
                    ? 'कृषि खाद, बीज व कीटनाशक लाइसेंस नंबर'
                    : 'Agri Seeds, Fertilizer & Pesticide License No.'}
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="licenseNo"
                    value={formData.licenseNo}
                    onChange={handleChange}
                    placeholder="UP-AGRI-SEED-2024/8892"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {language === 'hi'
                    ? 'यह नंबर बिल रसीद पर सरकारी नियमों के अनुसार छपेगा।'
                    : 'This license number will be printed on sales bills and POS thermal slips.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'जीएसटी नंबर (GSTIN)' : 'GSTIN Registration No.'}
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    placeholder="09AAACA1234A1Z5"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 uppercase font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'receipt' && (
            <div className="space-y-3.5 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi'
                    ? 'बिल रसीद पर छपने वाली शर्तें / संदेश (Receipt Footer)'
                    : 'Custom Bill Receipt Footer & Note'}
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
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs font-mono space-y-1 shadow-inner">
                <p className="text-center font-bold text-slate-800 text-sm">{formData.shopName || 'ARMS AGRI RETAIL'}</p>
                <p className="text-center text-slate-600 text-[11px]">{formData.address || 'Address'} {formData.district ? `, ${formData.district}` : ''}</p>
                <p className="text-center text-slate-600 text-[11px]">📞 {formData.phone || '9812001122'} {formData.licenseNo ? ` | Lic: ${formData.licenseNo}` : ''}</p>
                <div className="border-t border-dashed border-amber-300 my-2 pt-1 text-[11px] text-slate-500 italic text-center">
                  "{formData.receiptFooter || 'धन्यवाद! जय जवान जय किसान! 🌱'}"
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>
                {loading
                  ? (language === 'hi' ? 'सहेजा जा रहा है...' : 'Saving...')
                  : (language === 'hi' ? 'प्रोफ़ाइल सहेजें' : 'Save Profile')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
