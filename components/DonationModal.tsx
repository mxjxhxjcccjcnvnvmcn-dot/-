
import React, { useState } from 'react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const amountStr = selectedAmount ? `${selectedAmount.toLocaleString()} SDG` : 'دعم مالي';
    const tgMessage = encodeURIComponent(`مرحباً مازن، لقد قمت بالتبرع بمبلغ ${amountStr} لدعم تطوير محرك التحليل الذكي. شكراً لك!`);
    window.open(`https://t.me/+249116158407?text=${tgMessage}`, '_blank');
    setShowThankYou(true);
  };

  const amounts = [2000, 5000, 10000];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-white rounded-[3.5rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-8 left-8 p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {!showThankYou ? (
          <div className="flex flex-col h-full text-right" dir="rtl">
            <div className="bg-[#cc0000] p-12 text-center text-white space-y-3">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-5xl">🏦</div>
              <h3 className="text-4xl font-black">دعم تطوير المحرك</h3>
              <p className="text-white/80 font-bold">تبرعك يضمن استمرار السيرفرات وتحديث الذكاء</p>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-slate-500 font-bold">اسم المستفيد</span>
                  <span className="text-slate-900 font-black">مازن حسين عثمان محمد</span>
                </div>
                <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-slate-500 font-bold">رقم الحساب (بنكك)</span>
                  <span className="text-[#cc0000] font-black text-2xl">7928440</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {amounts.map(amt => (
                  <button key={amt} onClick={() => setSelectedAmount(amt)} className={`py-4 rounded-2xl font-black transition-all border-2 ${selectedAmount === amt ? 'bg-[#cc0000] border-[#cc0000] text-white' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}>
                    {amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <button onClick={handleConfirm} className="w-full py-6 bg-sky-600 text-white font-black rounded-3xl text-xl shadow-xl hover:bg-sky-700 transition-all flex items-center justify-center gap-3">
                <span>إرسال إشعار تليجرام</span>
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.85 1.18-5.23 3.46-.49.34-.94.5-1.34.49-.44-.01-1.28-.24-1.9-.45-.77-.25-1.38-.39-1.33-.82.03-.22.32-.45.89-.69 3.48-1.51 5.8-2.51 6.96-2.99 3.31-1.37 3.99-1.61 4.45-1.62.1 0 .32.03.46.14.12.09.15.22.17.31.02.09.03.27.02.43z"/></svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-20 text-center space-y-8 animate-in zoom-in-95">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white text-5xl">✔️</div>
            <h3 className="text-4xl font-black text-slate-900">شكراً لدعمك!</h3>
            <p className="text-slate-500 text-lg">تم توجيهك للتليجرام لإرسال تأكيد التحويل.</p>
            <button onClick={onClose} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl transition-all">العودة للمحرك</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationModal;
