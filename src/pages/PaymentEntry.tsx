import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import {
  CreditCard,
  CheckCircle,
  User,
  Search,
  Receipt,
  Printer,
  Share2,
  Calendar,
} from 'lucide-react';
import { Payment, Farmer } from '../types';
import { ReceiptModal } from '../components/ReceiptModal';

interface PaymentEntryProps {
  initialFarmer?: Farmer | null;
  onClearInitialFarmer?: () => void;
}

export const PaymentEntry: React.FC<PaymentEntryProps> = ({
  initialFarmer,
  onClearInitialFarmer,
}) => {
  const { language, t } = useLanguage();
  const { farmers, villages, createPayment, payments } = useData();

  // Find farmers with pending dues
  const dueFarmers = farmers.filter(f => f.currentDue > 0);

  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(
    initialFarmer?.id || dueFarmers[0]?.id || farmers[0]?.id || ''
  );
  const [receiptNo, setReceiptNo] = useState(
    `REC-${new Date().getFullYear()}-${String(payments.length + 1).padStart(3, '0')}`
  );
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'bank' | 'cheque'>('cash');
  const [referenceNo, setReferenceNo] = useState('');
  const [notes, setNotes] = useState('');

  // Receipt modal state
  const [savedPayment, setSavedPayment] = useState<Payment | null>(null);
  const [prevDueSnapshot, setPrevDueSnapshot] = useState(0);
  const [newDueSnapshot, setNewDueSnapshot] = useState(0);

  const selectedFarmer = farmers.find(f => f.id === selectedFarmerId);
  const farmerVillage = villages.find(v => v.id === selectedFarmer?.villageId);
  const currentDue = selectedFarmer?.currentDue || 0;
  const balanceAfterPayment = Math.max(0, currentDue - (Number(amount) || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmerId || !amount || amount <= 0) return;

    const newPayment = createPayment({
      receiptNo,
      farmerId: selectedFarmerId,
      farmerName: selectedFarmer?.name || 'Farmer',
      paymentDate,
      amount: Number(amount),
      paymentMode,
      referenceNo,
      notes,
    });

    setPrevDueSnapshot(currentDue);
    setNewDueSnapshot(balanceAfterPayment);
    setSavedPayment(newPayment);

    // Reset Form
    setReceiptNo(`REC-${new Date().getFullYear()}-${String(payments.length + 2).padStart(3, '0')}`);
    setAmount(0);
    setReferenceNo('');
    setNotes('');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Step Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <CreditCard className="w-4 h-4" />
          <span>{t.step6Title}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
          {language === 'hi' ? 'उधारी जमा प्रविष्टि (खाता वसूली)' : 'Payment Entry (Due Recovery)'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {t.step6Subtitle}
        </p>

        {/* Workflow Diagram Flow */}
        <div className="mt-4 p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-xl text-xs text-indigo-900 flex flex-wrap items-center gap-2 font-medium">
          <span className="font-bold">{language === 'hi' ? 'प्रक्रिया प्रवाह:' : 'Workflow:'}</span>
          <span className="bg-white px-2 py-0.5 rounded border border-indigo-300">
            {language === 'hi' ? '१. किसान चुनें' : '1. Select Farmer'}
          </span>
          <span>➔</span>
          <span className="bg-white px-2 py-0.5 rounded border border-indigo-300">
            {language === 'hi' ? '२. जमा राशि दर्ज करें' : '2. Enter Amount'}
          </span>
          <span>➔</span>
          <span className="bg-white px-2 py-0.5 rounded border border-indigo-300">
            {language === 'hi' ? '३. माध्यम (Cash/UPI/Bank)' : '3. Mode'}
          </span>
          <span>➔</span>
          <span className="bg-white px-2 py-0.5 rounded border border-indigo-300 font-bold">
            {language === 'hi' ? '४. पुराने बिलों के विरुद्ध स्वतः समायोजन (FIFO)' : '4. Auto Adjust Oldest Due'}
          </span>
          <span>➔</span>
          <span className="bg-indigo-600 text-white px-2 py-0.5 rounded font-bold">
            {language === 'hi' ? '५. बकाया घटेगा (Save)' : '5. Save (Reduces Due)'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Farmer Selector Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>{t.selectFarmerForPayment}</span>
          </h3>

          <div>
            <label className="block text-slate-700 font-medium text-xs sm:text-sm mb-1">
              {language === 'hi' ? 'किसान का चयन करें (बकाया राशि सहित)' : 'Choose Farmer (with current due)'}
            </label>
            <select
              value={selectedFarmerId}
              onChange={e => setSelectedFarmerId(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold text-sm text-slate-900"
            >
              {farmers.map(f => {
                const v = villages.find(vil => vil.id === f.villageId);
                return (
                  <option key={f.id} value={f.id}>
                    {f.name} (📍 {v?.name}) — {f.currentDue > 0 ? `₹${f.currentDue} Due` : 'No Due'}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Selected Farmer Due Info */}
          {selectedFarmer && (
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-slate-50 rounded-xl border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-slate-900 text-base">{selectedFarmer.name}</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  📞 {selectedFarmer.mobile} • 📍 {language === 'hi' ? farmerVillage?.nameHi || farmerVillage?.name : farmerVillage?.name}
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-rose-200 text-right">
                <span className="text-xs text-rose-600 font-bold block">
                  {t.farmerTotalDueNotice}
                </span>
                <span className="text-2xl font-black text-rose-600">
                  ₹{currentDue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Payment Amount & Mode Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">
            {language === 'hi' ? 'प्राप्त भुगतान विवरण' : 'Payment Collection Details'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            {/* Receipt No */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">{t.receiptNo}</label>
              <input
                type="text"
                required
                value={receiptNo}
                onChange={e => setReceiptNo(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono font-medium"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">{t.date}</label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">{t.paymentMode}</label>
              <select
                value={paymentMode}
                onChange={e => setPaymentMode(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
              >
                <option value="cash">{t.cash}</option>
                <option value="upi">{t.upi}</option>
                <option value="bank">{t.bank}</option>
                <option value="cheque">{t.cheque}</option>
              </select>
            </div>
          </div>

          {/* Amount Paid Input */}
          <div className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <label className="text-indigo-950 font-bold text-sm">
                {t.paymentAmount} (₹) *
              </label>
              {currentDue > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(currentDue)}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded-lg font-bold transition-colors"
                >
                  {language === 'hi' ? 'पूरा बकाया भरें (Full Due)' : 'Pay Full Due (₹' + currentDue + ')'}
                </button>
              )}
            </div>
            <input
              type="number"
              min="1"
              max={currentDue > 0 ? currentDue : 1000000}
              required
              value={amount || ''}
              onChange={e => setAmount(Number(e.target.value))}
              placeholder="Enter amount..."
              className="w-full p-3 bg-white border border-indigo-300 rounded-xl text-xl font-black text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Reference & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-700 font-medium mb-1">{t.referenceNumber}</label>
              <input
                type="text"
                value={referenceNo}
                onChange={e => setReferenceNo(e.target.value)}
                placeholder="e.g. UPI-123456789 / Cheque #450"
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">{t.notes}</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Paid after selling wheat in mandi"
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Auto balance after calculation preview */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-600">
              {t.balanceRemainingAfterPay}:
            </span>
            <span className={`text-xl font-black ${balanceAfterPayment === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ₹{balanceAfterPayment.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-base sm:text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{language === 'hi' ? 'भुगतान दर्ज करें व रसीद बनाएं' : 'Save Payment & Issue Receipt'}</span>
          </button>
        </div>
      </form>

      {/* Payment Receipt Modal */}
      {savedPayment && (
        <ReceiptModal
          payment={savedPayment}
          farmerPrevDue={prevDueSnapshot}
          farmerNewDue={newDueSnapshot}
          onClose={() => setSavedPayment(null)}
        />
      )}
    </div>
  );
};
