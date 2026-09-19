import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Printer, Share2, X, CheckCircle2 } from 'lucide-react';
import { Sale, Payment } from '../types';

interface ReceiptModalProps {
  sale?: Sale | null;
  payment?: Payment | null;
  farmerPrevDue?: number;
  farmerNewDue?: number;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  sale,
  payment,
  farmerPrevDue = 0,
  farmerNewDue = 0,
  onClose,
}) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  if (!sale && !payment) return null;

  const shopTitle = user?.shopName || (language === 'hi' ? 'किसान सेवा एवं कृषि केंद्र' : 'KISAN AGRI INPUTS & SEVA KENDRA');
  const shopPhone = user?.phone || '9812001122';
  const shopAddress = user?.address ? `${user.address}${user.district ? ', ' + user.district : ''}` : 'Main Market, Near Grain Mandi';
  const shopLic = user?.licenseNo ? ` • Lic: ${user.licenseNo}` : '';
  const shopGst = user?.gstin ? ` • GSTIN: ${user.gstin}` : '';
  const receiptFooter = user?.receiptFooter || (language === 'hi' ? 'खाद, बीज व कीटनाशक खरीदने के लिए धन्यवाद।' : 'Thank you for your purchase.');

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    let text = '';
    const phone = sale?.farmerMobile || '919876543210';

    if (sale) {
      if (language === 'hi') {
        text = `*${shopTitle} - बिल रसीद*\n` +
          (user?.phone ? `फोन: ${user.phone}\n` : '') +
          `बिल नं: ${sale.invoiceNo}\n` +
          `दिनांक: ${sale.saleDate}\n` +
          `किसान का नाम: ${sale.farmerName}\n` +
          `गाँव: ${sale.farmerVillage || ''}\n` +
          `--------------------------\n` +
          sale.items.map(it => `• ${it.productName} (${it.quantity} x ₹${it.unitRate}) = ₹${it.totalCost}`).join('\n') +
          `\n--------------------------\n` +
          `कुल बिल राशि: ₹${sale.grandTotal}\n` +
          `प्राप्त जमा राशि: ₹${sale.paidAmount} (${sale.paymentMode.toUpperCase()})\n` +
          `*आज की शेष उधारी: ₹${sale.remainingDue}*\n` +
          `*कुल बकाया राशि: ₹${farmerNewDue || sale.remainingDue}*\n` +
          `${receiptFooter}\n` +
          `जय जवान, जय किसान! 🌱`;
      } else {
        text = `*${shopTitle} - Bill Receipt*\n` +
          (user?.phone ? `Phone: ${user.phone}\n` : '') +
          `Invoice No: ${sale.invoiceNo}\n` +
          `Date: ${sale.saleDate}\n` +
          `Farmer: ${sale.farmerName}\n` +
          `Village: ${sale.farmerVillage || ''}\n` +
          `--------------------------\n` +
          sale.items.map(it => `• ${it.productName} (${it.quantity} x ₹${it.unitRate}) = ₹${it.totalCost}`).join('\n') +
          `\n--------------------------\n` +
          `Total Bill: ₹${sale.grandTotal}\n` +
          `Amount Paid: ₹${sale.paidAmount} (${sale.paymentMode.toUpperCase()})\n` +
          `*Due Remaining: ₹${sale.remainingDue}*\n` +
          `*Net Outstanding Due: ₹${farmerNewDue || sale.remainingDue}*\n` +
          `${receiptFooter}\n` +
          `Thank you for your visit! 🌱`;
      }
    } else if (payment) {
      if (language === 'hi') {
        text = `*${shopTitle} - उधारी जमा रसीद*\n` +
          `रसीद नं: ${payment.receiptNo}\n` +
          `दिनांक: ${payment.paymentDate}\n` +
          `किसान का नाम: ${payment.farmerName}\n` +
          `प्राप्त राशि: ₹${payment.amount}\n` +
          `माध्यम: ${payment.paymentMode.toUpperCase()}\n` +
          `*जमा के बाद शेष बकाया: ₹${farmerNewDue}*\n` +
          `${receiptFooter}\n` +
          `जय जवान, जय किसान! 🌱`;
      } else {
        text = `*${shopTitle} - Payment Due Receipt*\n` +
          `Receipt No: ${payment.receiptNo}\n` +
          `Date: ${payment.paymentDate}\n` +
          `Farmer: ${payment.farmerName}\n` +
          `Amount Received: ₹${payment.amount}\n` +
          `Payment Mode: ${payment.paymentMode.toUpperCase()}\n` +
          `*Balance Due Remaining: ₹${farmerNewDue}*\n` +
          `${receiptFooter}\n` +
          `Thank you! 🌱`;
      }
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header toolbar */}
        <div className="bg-emerald-900 text-white px-5 py-3.5 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-lime-400" />
            <span className="font-bold text-base">
              {sale ? (language === 'hi' ? 'बिक्री बिल रसीद' : 'Sales Bill Receipt') : (language === 'hi' ? 'भुगतान जमा रसीद' : 'Payment Receipt')}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-emerald-800 rounded-lg text-emerald-100 hover:text-white transition-colors"
              title={t.print}
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="p-2 hover:bg-emerald-800 rounded-lg text-emerald-100 hover:text-lime-300 transition-colors"
              title={t.shareWhatsApp}
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-emerald-800 rounded-lg text-emerald-100 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-receipt" className="p-6 bg-white font-mono text-slate-800 text-xs sm:text-sm">
          {/* Shop Header */}
          <div className="text-center pb-3 border-b-2 border-dashed border-slate-300">
            <h2 className="text-lg font-extrabold uppercase tracking-wide text-slate-900">
              {shopTitle}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {language === 'hi' ? 'उच्च गुणवत्ता बीज, खाद एवं कीटनाशक विक्रेता' : 'Certified Seeds, Fertilizers & Crop Protection'}
            </p>
            <p className="text-[11px] text-slate-500">
              {shopAddress} • Mobile: {shopPhone}{shopLic}{shopGst}
            </p>
            <div className="mt-2 inline-block px-3 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-[11px]">
              {sale ? (language === 'hi' ? 'बिक्री बीजक / RETAIL INVOICE' : 'RETAIL INVOICE') : (language === 'hi' ? 'जमा रसीद / PAYMENT RECEIPT' : 'RECEIPT')}
            </div>
          </div>

          {/* Meta Info */}
          <div className="py-3 border-b border-dashed border-slate-300 grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-slate-500">{language === 'hi' ? 'क्रमांक:' : 'No:'} <strong className="text-slate-900">{sale?.invoiceNo || payment?.receiptNo}</strong></p>
              <p className="text-slate-500">{language === 'hi' ? 'दिनांक:' : 'Date:'} <strong className="text-slate-900">{sale?.saleDate || payment?.paymentDate}</strong></p>
            </div>
            <div className="text-right">
              <p className="text-slate-500">{language === 'hi' ? 'किसान:' : 'Farmer:'} <strong className="text-slate-900">{sale?.farmerName || payment?.farmerName}</strong></p>
              {sale?.farmerVillage && <p className="text-slate-500">{language === 'hi' ? 'गाँव:' : 'Village:'} {sale.farmerVillage}</p>}
            </div>
          </div>

          {/* Sale Items Table */}
          {sale && (
            <div className="py-3 border-b-2 border-dashed border-slate-300">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                    <th className="py-1">Item / उत्पाद</th>
                    <th className="py-1 text-center">Qty / मात्रा</th>
                    <th className="py-1 text-right">Rate / दर</th>
                    <th className="py-1 text-right">Total / कुल</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sale.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-1.5 font-medium pr-1">{it.productName}</td>
                      <td className="py-1.5 text-center">{it.quantity} {it.unitName || ''}</td>
                      <td className="py-1.5 text-right">₹{it.unitRate}</td>
                      <td className="py-1.5 text-right font-semibold">₹{it.totalCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Bill Financials */}
              <div className="mt-3 pt-2 border-t border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{language === 'hi' ? 'उप-कुल (Subtotal):' : 'Sub Total:'}</span>
                  <span>₹{sale.subTotal}</span>
                </div>
                {sale.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>{language === 'hi' ? 'छूट (Discount):' : 'Discount:'}</span>
                    <span>-₹{sale.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold border-t border-slate-300 pt-1 text-slate-900">
                  <span>{language === 'hi' ? 'कुल बिल राशि (Grand Total):' : 'Bill Total:'}</span>
                  <span>₹{sale.grandTotal}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>{language === 'hi' ? `प्राप्त राशि (${sale.paymentMode.toUpperCase()}):` : `Amount Paid (${sale.paymentMode.toUpperCase()}):`}</span>
                  <span>₹{sale.paidAmount}</span>
                </div>
                <div className="flex justify-between text-rose-600 font-bold bg-rose-50 p-1.5 rounded">
                  <span>{language === 'hi' ? 'आज की उधारी / शेष बकाया (Due Today):' : 'Remaining Due Today:'}</span>
                  <span>₹{sale.remainingDue}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment receipt body */}
          {payment && (
            <div className="py-4 border-b-2 border-dashed border-slate-300 space-y-2 text-xs">
              <div className="flex justify-between text-sm font-bold bg-emerald-50 text-emerald-800 p-2 rounded">
                <span>{language === 'hi' ? 'प्राप्त जमा राशि (Amount Paid):' : 'Amount Received:'}</span>
                <span className="text-base">₹{payment.amount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{language === 'hi' ? 'भुगतान माध्यम:' : 'Payment Mode:'}</span>
                <span className="font-semibold uppercase">{payment.paymentMode}</span>
              </div>
              {payment.referenceNo && (
                <div className="flex justify-between text-slate-600">
                  <span>{language === 'hi' ? 'संदर्भ / यूटीआर नंबर:' : 'Reference / UTR:'}</span>
                  <span>{payment.referenceNo}</span>
                </div>
              )}
            </div>
          )}

          {/* Farmer Balance Snapshot */}
          <div className="py-2.5 space-y-1 text-xs bg-slate-50 rounded p-2 mt-2 border border-slate-200">
            <div className="flex justify-between text-slate-600">
              <span>{language === 'hi' ? 'पिछला बकाया (Previous Due):' : 'Previous Due Balance:'}</span>
              <span>₹{farmerPrevDue}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-bold text-sm border-t border-slate-200 pt-1">
              <span>{language === 'hi' ? 'अब कुल शेष बकाया (Net Due Balance):' : 'Total Net Outstanding Due:'}</span>
              <span className={farmerNewDue > 0 ? 'text-rose-600' : 'text-emerald-600'}>₹{farmerNewDue}</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-4 text-[11px] text-slate-500 space-y-1">
            <p>{receiptFooter}</p>
            <p className="font-semibold text-slate-700">🌱 {language === 'hi' ? 'जय जवान जय किसान' : 'Jai Jawan, Jai Kisan'} 🌱</p>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-medium text-xs sm:text-sm"
          >
            {t.cancel}
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs sm:text-sm transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{t.shareWhatsApp}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs sm:text-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{t.print}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
