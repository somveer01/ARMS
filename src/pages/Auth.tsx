import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Sprout,
  Mail,
  Lock,
  Store,
  User,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  Languages,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const Auth: React.FC = () => {
  const { login, signup, loginWithGoogle } = useAuth();
  const { language, toggleLanguage } = useLanguage();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.message || 'Login failed. Please try again.');
        }
      } else {
        if (!shopName || !name || !email || !password) {
          setError(language === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें।' : 'Please fill all required fields.');
          setLoading(false);
          return;
        }
        const res = await signup(email, password, name, shopName, phone);
        if (!res.success) {
          setError(res.message || 'Registration failed.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setError(res.message || 'Google Sign-In failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Google Sign-In error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('somveer@agri.com');
    setPassword('password123');
    setLoading(true);
    await login('somveer@agri.com', 'password123');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-8 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-lime-200/50 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-2 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm text-xs font-bold text-slate-700 transition-all"
        >
          <Languages className="w-4 h-4 text-emerald-600" />
          <span>{language === 'en' ? 'हिन्दी में बदलें' : 'Switch to EN'}</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        {/* App Logo & Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-800 text-lime-300 rounded-2xl shadow-lg mb-3">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ARMS Agri Retail
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {language === 'hi'
              ? 'कृषि खुदरा प्रबंधन प्रणाली — बीज, खाद, कीटनाशक एवं किसान खाता बही'
              : 'Seeds, Pesticides, Fertilizers & Farmer Khata POS Ledger'}
          </p>
        </div>

        {/* Auth Box */}
        <div className="mt-6 bg-white py-8 px-5 sm:px-8 shadow-xl rounded-3xl border border-slate-200">
          {/* Tab Switcher: Login vs Signup */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {language === 'hi' ? 'लॉगिन करें (Login)' : 'Log In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {language === 'hi' ? 'नया पंजीकरण (Register)' : 'New Register'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-center space-x-2 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'कृषि केंद्र / दुकान का नाम *' : 'Shop / Store Name *'}
                  </label>
                  <div className="relative">
                    <Store className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={e => setShopName(e.target.value)}
                      placeholder={language === 'hi' ? 'उदा. किसान कृषि सेवा केंद्र' : 'e.g. Kisan Agri Seva Kendra'}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'दुकानदार / प्रोपराइटर का नाम *' : 'Owner / Retailer Name *'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Somveer Sharma"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'मोबाइल नंबर *' : 'Mobile Phone Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="10-digit phone number"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'ईमेल पता *' : 'Email Address *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="retailer@agri.com"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'पासवर्ड *' : 'Password *'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>
                {mode === 'login'
                  ? language === 'hi'
                    ? 'लॉगिन करें'
                    : 'Log In to Shop'
                  : language === 'hi'
                  ? 'खाता बनाएं एवं शुरू करें'
                  : 'Create Shop Account'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-bold">
                {language === 'hi' ? 'या' : 'Or continue with'}
              </span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-3 active:scale-95 shadow-sm"
          >
            {/* Official Google SVG icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{language === 'hi' ? 'Google से लॉगिन करें' : 'Sign in with Google'}</span>
          </button>

          {/* Quick Demo Access Button */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
            >
              {language === 'hi' ? '⚡ त्वरित डेमो अकाउंट से लॉगिन करें' : '⚡ 1-Click Quick Demo Login'}
            </button>
          </div>
        </div>

        {/* Security Assurance Footer */}
        <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{language === 'hi' ? '100% सुरक्षित कृषि खुदरा डेटा' : '100% Secure Agri-Retail Ledger'}</span>
        </div>
      </div>
    </div>
  );
};
