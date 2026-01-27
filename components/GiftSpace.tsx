
import React from 'react';

const GiftSpace: React.FC = () => {
  const handleClaim = () => {
    const tgMessage = encodeURIComponent("مرحباً مازن، أرغب في حجز مكاني ضمن أول 250 شخص والحصول على هدية المنصة (20 تحليل مجاني).");
    window.open(`https://t.me/+249116158407?text=${tgMessage}`, '_blank');
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="relative group">
        {/* Main Card */}
        <div className="animate-royal-glow rounded-[4rem] p-1 shadow-2xl overflow-hidden">
          <div className="bg-[#020205] rounded-[3.8rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
            
            {/* Background Decorative Text */}
            <div className="absolute -bottom-10 -left-10 text-[120px] font-black text-white/5 select-none pointer-events-none uppercase italic tracking-tighter">
              FREE GIFT
            </div>

            {/* Icon Section */}
            <div className="relative shrink-0">
               <div className="w-40 h-40 md:w-56 md:h-56 rounded-[3.5rem] bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-700">
                  <span className="text-8xl md:text-9xl gold-center-icon drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">🎁</span>
               </div>
               {/* Pulse Ring */}
               <div className="absolute inset-0 rounded-[3.5rem] border-2 border-indigo-500/30 animate-ping opacity-20"></div>
            </div>

            {/* Content Section */}
            <div className="flex-1 text-center md:text-right space-y-8 relative z-10">
              <div className="space-y-3">
                <div className="flex items-center justify-center md:justify-start gap-3">
                   <span className="px-4 py-1.5 bg-rose-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-rose-600/20">Limited Offer</span>
                   <span className="text-amber-400 text-xs font-black uppercase tracking-[0.2em]">Platinum Gift Exclusive</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                  مساحة <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-white to-amber-400">هدية المنصة</span> للأوائل
                </h2>
                <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl">
                  احجز مكانك الآن للحصول على <span className="text-white font-black">20 تحليل فني مجاني</span> بصلاحية مفتوحة. مخصصة فقط لأول 250 مسجل قبل الافتتاح.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                 <div className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center backdrop-blur-md">
                    <span className="block text-2xl font-black text-white">250</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">مقعد متاح</span>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center backdrop-blur-md">
                    <span className="block text-2xl font-black text-amber-400">30 JAN</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">موعد الانطلاق</span>
                 </div>
                 <div className="hidden sm:block bg-white/5 border border-white/10 p-4 rounded-3xl text-center backdrop-blur-md">
                    <span className="block text-2xl font-black text-indigo-400">FREE</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">تكلفة الحجز</span>
                 </div>
              </div>

              <div className="pt-4">
                 <button 
                  onClick={handleClaim}
                  className="w-full md:w-auto px-12 py-6 bg-white text-black font-black rounded-[2rem] text-2xl shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                 >
                    <span>المطالبة بالهدية الآن</span>
                    <svg className="w-8 h-8 group-hover:translate-x-[-8px] transition-transform" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.85 1.18-5.23 3.46-.49.34-.94.5-1.34.49-.44-.01-1.28-.24-1.9-.45-.77-.25-1.38-.39-1.33-.82.03-.22.32-.45.89-.69 3.48-1.51 5.8-2.51 6.96-2.99 3.31-1.37 3.99-1.61 4.45-1.62.1 0 .32.03.46.14.12.09.15.22.17.31.02.09.03.27.02.43z"/>
                    </svg>
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftSpace;
