
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
    const amountStr = selectedAmount ? `${selectedAmount.toLocaleString()} SDG` : 'مبلغاً دعمياً';
    const waMessage = encodeURIComponent(`مرحباً مازن، لقد قمت للتو بالتبرع بمبلغ ${amountStr} لدعم المنصة. شكراً لجهودك!`);
    window.open(`https://wa.me/249116158407?text=${waMessage}`, '_blank');
    setShowThankYou(true);
  };

  const amounts = [1000, 3000, 6000];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-white rounded-[3.5rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-500">
        
        <button onClick={onClose} className="absolute top-8 left-8 z-50 p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {!showThankYou ? (
          <div className="flex flex-col h-full">
            {/* Header with BOK Red */}
            <div className="bg-[#cc0000] p-12 text-center text-white space-y-3">
              <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 text-5xl">❤️</div>
              <h3 className="text-4xl font-black">دعم المنصة</h3>
              <p className="text-white/80 font-bold text-lg">تبرعك يساهم في استمرارية وتطوير المحرك</p>
            </div>

            <div className="p-10 space-y-10">
              {/* Bank Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <span className="text-slate-500 font-bold">المستفيد</span>
                  <span className="text-slate-900 font-black text-xl text-right">مازن حسين عثمان محمد</span>
                </div>
                <div className="flex justify-between items-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <span className="text-slate-500 font-bold">رقم الحساب</span>
                  <span className="text-[#cc0000] font-black text-3xl tracking-widest">7928440</span>
                </div>
                <div className="flex justify-between items-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <span className="text-slate-500 font-bold">رقم الهاتف</span>
                  <span className="text-[#cc0000] font-black text-2xl tracking-widest">0116158407</span>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">اختر مبلغ التبرع</label>
                <div className="grid grid-cols-3 gap-4">
                  {amounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setSelectedAmount(amount)}
                      className={`py-5 rounded-2xl font-black text-xl transition-all border-2 ${
                        selectedAmount === amount 
                          ? 'bg-[#cc0000] border-[#cc0000] text-white shadow-xl scale-105' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-[#cc0000]/30'
                      }`}
                    >
                      {amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-start gap-4">
                <span className="text-2xl">📱</span>
                <p className="text-sm text-emerald-800 leading-relaxed font-bold italic">
                   بعد التحويل، اضغط على الزر أدناه لمراسلتنا عبر الواتساب لتأكيد وصول تبرعك.
                </p>
              </div>

              <button 
                onClick={handleConfirm}
                className="w-full py-6 bg-[#cc0000] text-white font-black rounded-[2rem] text-2xl hover:bg-[#aa0000] transition-all shadow-xl shadow-red-600/20 active:scale-95"
              >
                لقد قمت بالتحويل، إرسال الإشعار
              </button>
            </div>
          </div>
        ) : (
          <div className="p-20 text-center space-y-10 animate-in zoom-in-95 duration-500">
            <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white text-6xl shadow-2xl animate-bounce-gentle">✨</div>
            <div className="space-y-4">
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter">شكراً من القلب!</h3>
              <p className="text-slate-500 text-xl font-bold leading-relaxed">
                تبرعك الكريم يدعم جهودنا في تقديم أفضل أدوات التحليل الذكية مجاناً للجميع.
              </p>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 italic text-slate-600 font-medium">
              "نجاحنا مبني على دعمكم المستمر"
            </div>
            <button 
              onClick={onClose}
              className="w-full py-6 bg-slate-900 text-white font-black rounded-2xl text-2xl hover:bg-black transition-all shadow-2xl"
            >
              العودة للمنصة
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationModal;
