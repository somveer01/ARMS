import React from 'react';
import { usePWA } from '../context/PWAContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Download,
  Share2,
  PlusSquare,
  MoreVertical,
  X,
  Smartphone,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const InstallModal: React.FC = () => {
  const { isInstalled, isIOS, showInstallModal, setShowInstallModal } = usePWA();
  const { language } = useLanguage();

  if (!showInstallModal || isInstalled) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-5 text-white relative">
          <button
            onClick={() => setShowInstallModal(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Smartphone className="w-6 h-6 text-lime-300" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-lg font-bold text-white">ARMS Agri App</h3>
                <span className="text-[10px] bg-lime-400 text-emerald-950 font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  Mobile App
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                {language === 'hi'
                  ? 'अपने फोन में 1-क्लिक में ऐप इंस्टॉल करें'
                  : 'Install on your device for fast 1-click access'}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions Body */}
        <div className="p-6 space-y-5">
          <div className="flex items-start space-x-3 bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">
                {language === 'hi' ? 'ऐप इंस्टॉल करने के फायदे:' : 'Benefits of installing:'}
              </span>{' '}
              {language === 'hi'
                ? 'बिना बार-बार लिंक खोले डायरेक्ट फोन स्क्रीन से ओपन होगा, सुपर फ़ास्ट काम करेगा और इंटरनेट धीमा होने पर भी चलेगा।'
                : 'Direct full-screen experience from your home screen, lightning fast and works offline!'}
            </div>
          </div>

          {isIOS ? (
            /* iOS Instructions */
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {language === 'hi' ? 'iPhone / iPad (Safari) के लिए:' : 'For iPhone / iPad (Safari):'}
              </h4>
              <div className="space-y-2.5">
                <div className="flex items-center space-x-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="font-bold">1. </span>
                    {language === 'hi'
                      ? 'Safari में नीचे शेयर (Share) बटन पर टैप करें।'
                      : 'Tap the Share icon at the bottom of Safari.'}
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="font-bold">2. </span>
                    {language === 'hi'
                      ? 'नीचे स्क्रॉल करके "होम स्क्रीन में जोड़ें" (Add to Home Screen) चुनें।'
                      : 'Scroll down and tap "Add to Home Screen".'}
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="font-bold">3. </span>
                    {language === 'hi'
                      ? 'ऊपर दाईं ओर "Add" (जोड़ें) पर टैप करें।'
                      : 'Tap "Add" in top-right corner to finish.'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Android / Chrome Instructions */
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {language === 'hi' ? 'Android / Chrome / Edge के लिए:' : 'For Android / Chrome / Edge:'}
              </h4>
              <div className="space-y-2.5">
                <div className="flex items-center space-x-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="font-bold">1. </span>
                    {language === 'hi'
                      ? 'ब्राउज़र के ऊपर दाईं ओर 3-डॉट (⋮) मेनू पर टैप करें।'
                      : 'Tap the 3-dots (⋮) menu in top-right of your browser.'}
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="font-bold">2. </span>
                    {language === 'hi'
                      ? '"ऐप इंस्टॉल करें" (Install App) या "होम स्क्रीन पर जोड़ें" पर टैप करें।'
                      : 'Tap "Install app" or "Add to Home Screen".'}
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-lime-100 text-lime-800 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="font-bold">3. </span>
                    {language === 'hi'
                      ? '"Install" पर क्लिक करें और ऐप तुरंत आपके फोन में आ जाएगा!'
                      : 'Confirm "Install" and ARMS will appear on your phone home screen!'}
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowInstallModal(false)}
            className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-sm font-bold shadow transition-colors"
          >
            {language === 'hi' ? 'समझ गया / ठीक है' : 'Got it, Thanks!'}
          </button>
        </div>
      </div>
    </div>
  );
};
