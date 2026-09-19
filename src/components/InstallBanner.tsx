import React, { useState } from 'react';
import { usePWA } from '../context/PWAContext';
import { useLanguage } from '../context/LanguageContext';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';

export const InstallBanner: React.FC = () => {
  const { isInstalled, installApp } = usePWA();
  const { language } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  // If already installed or user dismissed for this session, hide
  if (isInstalled || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white px-3 py-2 sm:px-4 sm:py-2.5 shadow-lg border-b border-emerald-700/50 flex items-center justify-between z-40 relative animate-fade-in">
      <div className="flex items-center space-x-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-lime-400 text-emerald-950 flex items-center justify-center shrink-0 shadow-sm animate-bounce">
          <Download className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-xs sm:text-sm font-bold truncate">
              {language === 'hi' ? 'ARMS ऐप अपने फोन में इंस्टॉल करें' : 'Install ARMS App on your Phone'}
            </p>
            <span className="hidden sm:inline-block bg-lime-400/20 text-lime-300 border border-lime-400/30 text-[10px] px-1.5 py-0.2 rounded font-semibold">
              FREE
            </span>
          </div>
          <p className="text-[11px] text-emerald-200 hidden sm:block truncate">
            {language === 'hi'
              ? 'बिना ब्राउज़र लिंक के होम स्क्रीन से 1-क्लिक में चलाएं।'
              : 'Direct 1-tap launch from home screen with full offline access.'}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        <button
          onClick={installApp}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-lime-400 hover:bg-lime-300 active:scale-95 text-emerald-950 rounded-lg text-xs font-black shadow transition-all"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'इंस्टॉल करें' : 'Install App'}</span>
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-emerald-300 hover:text-white rounded-lg transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
