
import React, { useState, useEffect } from 'react';
import { PlanTheme } from '../types';

interface PlanProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  color: string;
  glowColor: string;
  badge?: string;
  quota: string;
  icon: string;
  isPopular?: boolean;
  tier: 'gift' | 'silver' | 'gold' | 'platinum';
  bgGradient: string;
  isSoldOut?: boolean;
}

const PLANS_DATA: PlanProps[] = [
  {
    tier: 'gift',
    title: 'هدية المنصة', 
    price: 'مكتمل', 
    period: 'للأوائل', 
    quota: '0 صورة متاحة', 
    badge: 'انتهى الحجز', 
    glowColor: '#475569', 
    icon: '🎁',
    color: 'from-slate-700/20 to-slate-900/20',
    bgGradient: 'radial-gradient(at 0% 0%, #1e293b 0, transparent 50%), radial-gradient(at 100% 100%, #020617 0, transparent 50%), #020205',
    features: ['باقة الحجز المسبق (مغلقة)', 'لقد اكتمل العدد المسموح به', 'يرجى اختيار باقة مدفوعة'],
    isSoldOut: true
  },
  {
    tier: 'silver',
    title: 'فضي', price: '13,000', period: 'يوم', quota: '25 صورة / يوم', glowColor: '#94a3b8', icon: '🥈',
    color: 'from-slate-500/20 to-slate-900/20',
    bgGradient: 'radial-gradient(at 0% 0%, #1e293b 0, transparent 50%), radial-gradient(at 100% 100%, #334155 0, transparent 50%), #020205',
    features: ['25 تحليل فني يومياً', 'إشارات الدخول والخروج', 'دعم العملات الرقمية والأسهم']
  },
  {
    tier: 'gold',
    title: 'ذهبي', price: '55,000', period: 'أسبوع', quota: '150 صورة', badge: 'الأكثر مبيعاً', isPopular: true, glowColor: '#fbbf24', icon: '🥇',
    color: 'from-amber-500/20 to-amber-900/20',
    bgGradient: 'radial-gradient(at 0% 0%, #451a03 0, transparent 50%), radial-gradient(at 100% 100%, #78350f 0, transparent 50%), #020205',
    features: ['150 تحليل شامل', 'استراتيجيات قنص الصفقات', 'كشف مناطق التجميع والتصريف']
  },
  {
    tier: 'platinum',
    title: 'بلاتيني', price: '120,000', period: 'شهر', quota: '450 صورة', badge: 'VIP', glowColor: '#818cf8', icon: '💎',
    color: 'from-indigo-500/20 to-indigo-900/20',
    bgGradient: 'radial-gradient(at 0% 0%, #1e1b4b 0, transparent 50%), radial-gradient(at 100% 100%, #312e81 0, transparent 50%), #020205',
    features: ['450 تحليل (سقف عالي)', 'أولوية قصوى في السيرفرات', 'توصيات خاصة وحصرية']
  }
];

const PlanCard: React.FC<PlanProps & { onSelect?: () => void; isActive?: boolean; isUsed?: boolean }> = ({ 
  title, price, features, glowColor, badge, icon, onSelect, quota, isActive, tier, isUsed, isSoldOut
}) => {
  const getGlowClass = () => {
    if (isSoldOut) return 'border-white/5 opacity-60 grayscale cursor-not-allowed';
    if (tier === 'platinum') return 'animate-liquid-glow-platinum';
    if (tier === 'gold') return 'animate-gold-halo';
    return 'animate-silver-pulse-glow';
  };

  return (
    <div 
      className={`rounded-[3.5rem] p-10 flex flex-col relative group transition-all duration-700 overflow-hidden border ${isActive ? 'scale-95 border-white' : 'border-white/10 hover:border-white/40'} ${getGlowClass()} ${isUsed ? 'opacity-50 grayscale' : ''}`}
      onClick={(isActive || isUsed || isSoldOut) ? undefined : onSelect}
      style={{ 
        background: isActive ? '#000' : 'linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      {badge && (
        <div className={`absolute top-8 left-8 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest z-20 flex items-center gap-2 shadow-lg ${isSoldOut ? 'bg-slate-700 text-slate-300' : ''}`} style={isSoldOut ? {} : { background: glowColor, color: '#fff' }}>
           {badge}
        </div>
      )}
      
      <div className={`w-28 h-28 rounded-[3rem] mb-10 flex items-center justify-center text-6xl border border-white/10 relative z-10 bg-white/5 shadow-inner ${isSoldOut ? 'opacity-40' : ''}`}>
        {icon}
      </div>
      
      <div className="mb-6">
        <h3 className="text-4xl font-black text-white">{title}</h3>
        <p className="text-sm font-black uppercase tracking-[0.25em] mt-1" style={{ color: isSoldOut ? '#64748b' : glowColor }}>{quota}</p>
      </div>
      
      <div className="flex items-baseline gap-3 mb-10">
        <span className="text-xl font-bold text-slate-400">{isSoldOut ? '' : 'SDG'}</span>
        <span className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl">{price}</span>
      </div>
      
      <div className="flex-1 space-y-6 mb-12">
        {features.map((f, i) => (
          <div key={i} className="flex gap-4 text-base text-slate-300 font-bold group-hover:text-white transition-colors">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border border-white/10" style={{ background: isSoldOut ? '#334155' : `${glowColor}22` }}>
              <span style={{ color: isSoldOut ? '#94a3b8' : glowColor }}>{isSoldOut ? '×' : '✓'}</span>
            </div>
            {f}
          </div>
        ))}
      </div>
      
      <button 
        disabled={isSoldOut}
        className={`w-full py-6 rounded-3xl font-black text-xl transition-all relative overflow-hidden ${isSoldOut ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : (isActive || isUsed ? 'bg-white/10 text-slate-500' : 'text-white hover:scale-[1.04] active:scale-95 shadow-[0_15px_30px_rgba(0,0,0,0.3)]')}`}
        style={{ 
          background: (isSoldOut || isActive || isUsed) ? undefined : `linear-gradient(135deg, ${glowColor}, ${glowColor}dd)`
        }}
      >
        <span className="relative z-10 text-center">
          {isSoldOut ? 'لقد اكتمل الحجز عليك الاشتراك' : (isActive ? 'الباقة الحالية' : isUsed ? 'تم الحجز' : 'تفعيل الآن')}
        </span>
      </button>
    </div>
  );
};

interface SubscriptionPlansProps {
  onActivate: (t: string, m?: number, theme?: PlanTheme, quota?: number) => void;
  activatedPlanTitle?: string | null;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onActivate, activatedPlanTitle }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanProps | null>(null);
  const [step, setStep] = useState<'confirm' | 'payment' | 'activation' | 'success'>('confirm');
  const [activationCode, setActivationCode] = useState('');
  const [error, setError] = useState('');

  const handleSendToTelegram = () => {
    if (!selectedPlan) return;
    const tgMessage = encodeURIComponent(`مرحباً مازن، لقد قمت للتو بتحويل مبلغ ${selectedPlan.price} SDG للحصول على الباقة ال${selectedPlan.title}. مرفق إشعار التحويل.`);
    window.open(`https://t.me/+249116158407?text=${tgMessage}`, '_blank');
  };

  const handleActivate = () => {
    const c = activationCode.trim();
    let planName = '';
    let durationMinutes = 0;
    let quota = 0;

    if (c === "#S1@48$7!") { planName = 'فضي'; durationMinutes = 24 * 60; quota = 25; }
    else if (c === "#G1@9$7!") { planName = 'ذهبي'; durationMinutes = 7 * 24 * 60; quota = 150; }
    else if (c === "#P1@VIP$9!") { planName = 'بلاتيني'; durationMinutes = 30 * 24 * 60; quota = 450; }

    if (planName) {
      setStep('success');
      const planDef = PLANS_DATA.find(p => p.title === planName);
      const theme = planDef ? { glowColor: planDef.glowColor, color: planDef.color, bgGradient: planDef.bgGradient } : undefined;
      onActivate(planName, durationMinutes, theme, quota);
    } else { setError('كود التفعيل غير صالح.'); }
  };

  const closeOverlay = () => {
    setSelectedPlan(null);
    setStep('confirm');
    setError('');
  };

  return (
    <div id="pricing" className="space-y-16 pb-20">
      <div className="flex justify-center flex-col items-center gap-6">
         <div className="px-6 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-sm">
            نعتذر، اكتمل عدد الحجوزات المجانية للأوائل (250/250)
         </div>
         
         <div className="flex flex-col items-center gap-4">
            <button onClick={() => { setStep('activation'); setSelectedPlan({} as any); }} className="relative group overflow-hidden rounded-[2rem] p-[3px] transition-transform hover:scale-105 active:scale-95">
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 animate-spin-slow"></span>
              <div className="relative bg-[#050510] rounded-[1.8rem] px-12 py-6 flex items-center gap-5 transition-all hover:bg-black">
                <span className="text-3xl animate-pulse">🔑</span>
                <div className="text-right">
                    <span className="block text-white font-black text-xl">لديك كود تفعيل؟</span>
                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">أدخل كود التفعيل هنا</span>
                </div>
              </div>
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto px-8 text-right" dir="rtl">
        {PLANS_DATA.map((p, i) => (
          <PlanCard 
            key={i} 
            {...p} 
            onSelect={() => { 
              if (!p.isSoldOut) {
                setSelectedPlan(p); 
                setStep('confirm');
              }
            }} 
            isActive={activatedPlanTitle === p.title}
          />
        ))}
      </div>

      {selectedPlan && selectedPlan.title && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" dir="rtl">
          <div className="w-full h-full max-w-2xl max-h-[90vh] rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col bg-white">
            
            <button onClick={closeOverlay} className="absolute top-6 left-6 z-50 p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {step === 'confirm' ? (
              <div className="flex flex-col h-full">
                <div className="bg-[#cc0000] p-10 text-center text-white space-y-2">
                   <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl">🏦</div>
                   <h3 className="text-3xl font-black">تحويل عبر بنكك</h3>
                   <p className="text-white/80 font-bold">بيانات حساب المستفيد المعتمدة</p>
                </div>

                <div className="p-10 flex-1 space-y-8 overflow-y-auto text-right">
                   <div className="space-y-6">
                      <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                         <span className="text-slate-500 font-bold">اسم المستفيد</span>
                         <span className="text-slate-900 font-black text-xl">مازن حسين عثمان محمد</span>
                      </div>
                      <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                         <span className="text-slate-500 font-bold">رقم الحساب</span>
                         <span className="text-[#cc0000] font-black text-3xl tracking-widest">7928440</span>
                      </div>
                      <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                         <span className="text-slate-500 font-bold">رقم الهاتف</span>
                         <span className="text-[#cc0000] font-black text-2xl tracking-widest">0116158407</span>
                      </div>
                   </div>

                   <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 flex items-start gap-4">
                      <span className="text-2xl">💡</span>
                      <p className="text-sm text-amber-800 leading-relaxed font-bold">
                         قم بتحويل مبلغ <span className="text-[#cc0000] text-lg px-1">{selectedPlan.price} SDG</span> ثم انتقل للخطوة التالية لمراسلتنا عبر تليجرام.
                      </p>
                   </div>
                </div>

                <div className="p-8 border-t border-slate-100">
                   <button onClick={() => setStep('payment')} className="w-full py-5 bg-[#cc0000] text-white font-black rounded-2xl text-xl hover:bg-[#aa0000] transition-all shadow-xl shadow-red-600/20 active:scale-95">
                      التالي: إرسال الإشعار
                   </button>
                </div>
              </div>
            ) : step === 'payment' ? (
              <div className="flex flex-col h-full bg-slate-50">
                 <div className="bg-white p-8 text-center border-b border-slate-200">
                    <h3 className="text-2xl font-black text-slate-900">تأكيد الاشتراك</h3>
                    <p className="text-slate-500 text-sm mt-1">إرسال إثبات التحويل عبر تليجرام</p>
                 </div>

                 <div className="p-8 flex-1 space-y-8 overflow-y-auto">
                    <button 
                      onClick={handleSendToTelegram}
                      className="w-full py-10 bg-sky-500 text-white rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:bg-sky-600 transition-all shadow-xl active:scale-95 group"
                    >
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.85 1.18-5.23 3.46-.49.34-.94.5-1.34.49-.44-.01-1.28-.24-1.9-.45-.77-.25-1.38-.39-1.33-.82.03-.22.32-.45.89-.69 3.48-1.51 5.8-2.51 6.96-2.99 3.31-1.37 3.99-1.61 4.45-1.62.1 0 .32.03.46.14.12.09.15.22.17.31.02.09.03.27.02.43z"/>
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-black">إرسال الإشعار للتليجرام</p>
                        <p className="text-white/80 text-sm mt-1">فتح محادثة الدعم الفني والمراسلة</p>
                      </div>
                    </button>

                    <div className="space-y-4 pt-4">
                       <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">هل استلمت كود التفعيل؟</label>
                       <input 
                         type="text"
                         value={activationCode}
                         onChange={e => setActivationCode(e.target.value)}
                         placeholder="أدخل كود التفعيل هنا"
                         className="w-full bg-white border border-slate-200 rounded-2xl py-5 px-6 text-slate-900 font-bold outline-none focus:border-[#cc0000] transition-all text-center text-xl"
                       />
                    </div>

                    {error && <div className="p-4 bg-red-100 text-[#cc0000] rounded-2xl text-center text-sm font-bold border border-red-200">{error}</div>}
                 </div>
                 
                 <div className="p-8 bg-white border-t border-slate-200">
                    <button onClick={handleActivate} className="w-full py-5 bg-[#cc0000] text-white font-black rounded-2xl text-xl hover:bg-[#aa0000] transition-all">
                       تفعيل الباقة الآن
                    </button>
                 </div>
              </div>
            ) : step === 'activation' ? (
              <div className="flex flex-col h-full bg-[#050510] p-16 items-center justify-center space-y-16">
                <div className="w-40 h-40 rounded-[3rem] bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-8xl animate-pulse">🔑</div>
                <input 
                    type="text" 
                    value={activationCode} 
                    onChange={e => setActivationCode(e.target.value)} 
                    placeholder="X X X - X X X" 
                    className="w-full max-w-md bg-white/5 border-2 border-white/10 rounded-[3rem] py-10 text-center text-white font-black text-5xl outline-none focus:border-indigo-500 transition-all uppercase tracking-widest shadow-inner" 
                />
                <button onClick={handleActivate} className="w-full max-w-md py-8 bg-indigo-600 text-white font-black rounded-[3rem] text-4xl shadow-2xl hover:scale-[1.03] active:scale-95 transition-all">تفعيل الآن</button>
              </div>
            ) : (
              <div className="flex flex-col h-full p-16 bg-[#050510] items-center justify-center text-center">
                <div className="bg-white w-full max-w-xl rounded-[4rem] shadow-2xl p-16 space-y-10 animate-in zoom-in-95 duration-700">
                   <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-6xl shadow-2xl animate-bounce-gentle">✓</div>
                   <h3 className="text-5xl font-black text-slate-900">تم التفعيل</h3>
                   <p className="text-slate-500 text-xl">باقتك جاهزة الآن للاستخدام</p>
                   <button onClick={closeOverlay} className="w-full py-8 bg-slate-900 text-white font-black rounded-[2.5rem] text-3xl shadow-2xl hover:scale-102 transition-all">دخول للنظام</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
