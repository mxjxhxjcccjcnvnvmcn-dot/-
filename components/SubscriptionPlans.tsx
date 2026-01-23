
import React, { useState, useEffect } from 'react';

interface PlanProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  color: string;
  glowColor: string;
  badge?: string;
  icon: React.ReactNode;
  quota: string;
}

// أكواد تفعيل الباقة الفضية
export const SILVER_CODES = [
  "#S1@48$7!", "#SV@92&3?", "#S!5@0$6#", "#S8&@14$!", "#SL#67@9!", 
  "#S@3$8&2!", "#S1#9@5$!", "#S@46!#8$", "#S$7@1!9#", "#S@0#5$6!"
];

// أكواد تفعيل الباقة الذهبية
export const GOLD_CODES = [
  "#G1@9$7!", "#GD@45&8!", "#G!8@2$6#", "#GOLD@9$1!", "#G7&@3$!", 
  "#G@56!#8$", "#G9$@1!#", "#G@0#7$6!", "#G!4@9$#", "#G8@2$!#"
];

// أكواد تفعيل الباقة البلاتينية
export const PLATINUM_CODES = [
  "#P1@9$7!", "#PL@4&8$!", "#P!8@2$6#", "#PLT@9$1!", "#P7&@3$!", 
  "#P@56!#8$", "#P9$@1!#", "#P@0#7$6!", "#P!4@9$#", "#P8@2$!#"
];

const SilverIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-1.006 3.502 3.502 0 014.438 0 3.42 3.42 0 001.946 1.006 3.502 3.502 0 012.743 2.743 3.42 3.42 0 001.006 1.946 3.502 3.502 0 010 4.438 3.42 3.42 0 00-1.006 1.946 3.502 3.502 0 01-2.743 2.743 3.42 3.42 0 00-1.946 1.006 3.502 3.502 0 01-4.438 0 3.42 3.42 0 00-1.946-1.006 3.502 3.502 0 01-2.743-2.743z" />
  </svg>
);

const GoldIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
  </svg>
);

const PlatinumIcon = () => (
  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    <circle cx="12" cy="12" r="3" strokeWidth={1.5} className="animate-pulse" />
  </svg>
);

const BankakLogo = () => (
  <div className="flex flex-col items-center justify-center scale-110">
    <div className="relative group">
       <div className="absolute inset-0 bg-red-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
       <div className="relative bg-[#c1272d] rounded-2xl p-4 shadow-2xl border border-white/10 flex flex-col items-center gap-1">
          <div className="text-white text-3xl font-black tracking-tighter flex items-center">
            <span>ب</span>
            <span className="text-[#d4af37]">ـ</span>
            <span>نـكك</span>
            <div className="ml-1 mb-2">
                <svg className="w-6 h-6 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zM4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8zm8 6c3.3 0 6-2.7 6-6s-2.7-6-6-6-6 2.7-6 6 2.7 6 6 6z"/>
                </svg>
            </div>
          </div>
          <div className="text-white text-xs font-black tracking-[0.3em] uppercase opacity-90">bankak</div>
       </div>
    </div>
  </div>
);

const PlanCard: React.FC<PlanProps & { onSelect?: () => void, isActive?: boolean, isFree?: boolean }> = ({ title, price, period, features, color, glowColor, badge, icon, onSelect, quota, isActive, isFree }) => {
  return (
    <div 
      className={`glass-panel-heavy rounded-[3rem] p-10 flex flex-col relative group transition-all duration-700 ${!isActive ? 'hover:-translate-y-4' : 'border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.2)]'} border-t border-white/10 overflow-visible h-full`}
      style={{ '--hover-glow': glowColor } as any}
    >
      <div 
        className={`absolute -inset-4 rounded-[3.5rem] ${isActive ? 'opacity-40' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-1000 blur-[60px] z-[-1]`}
        style={{ background: `radial-gradient(circle at 50% 50%, ${glowColor}55 0%, transparent 70%)` }}
      />
      {badge && (
        <div className="absolute -top-5 right-10 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[10px] font-black px-5 py-2 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.5)] z-20 uppercase tracking-[0.2em] animate-bounce">
          {badge}
        </div>
      )}
      <div 
        className={`w-20 h-20 rounded-[2rem] mb-8 flex items-center justify-center shadow-2xl border transition-all duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-3'} ${color}`}
        style={{ boxShadow: `0 0 40px ${glowColor}33` }}
      >
        {icon}
      </div>
      <div className="mb-2">
        <h3 className="text-3xl font-black text-white tracking-tight">{title}</h3>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-70" style={{ color: glowColor }}>
            {quota}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-10">
        <span className="text-5xl font-black text-white drop-shadow-md">{price}</span>
        {period && <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">SD / {period}</span>}
      </div>
      <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent mb-10" />
      <ul className="space-y-5 mb-12 flex-1">
        {features.map((feature, i) => (
          <li key={i} className={`flex items-start gap-4 text-sm transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
            <div className="mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border border-white/10" style={{ backgroundColor: `${glowColor}15` }}>
              <svg className="w-3 h-3" style={{ color: glowColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium leading-tight">{feature}</span>
          </li>
        ))}
      </ul>
      <button 
        onClick={onSelect}
        className={`w-full py-5 rounded-[1.5rem] font-black text-lg transition-all active:scale-95 group/btn shadow-2xl relative overflow-hidden`}
        style={{ 
          background: isFree ? 'rgba(16, 185, 129, 0.1)' : title === 'فضي' ? 'rgba(255,255,255,0.1)' : `linear-gradient(135deg, ${glowColor}, ${glowColor}aa)`,
          color: isFree ? '#10b981' : title === 'فضي' ? 'white' : 'black',
          boxShadow: `0 20px 40px ${glowColor}33`
        }}
      >
        <span className="relative z-10">{isFree ? 'ابدأ القراءة مجاناً' : 'ابدأ الآن'}</span>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
      </button>
    </div>
  );
};

interface SubscriptionPlansProps {
  onActivate?: (planTitle: string) => void;
  activatedPlanTitle?: string | null;
  onOpenFreeCourse?: () => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onActivate, activatedPlanTitle, onOpenFreeCourse }) => {
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [step, setStep] = useState<'confirm' | 'payment' | 'activation' | 'success'>('confirm');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [activationError, setActivationError] = useState('');

  const plans = [
    {
      title: 'فضي',
      price: '13,000',
      period: 'يوم',
      quota: '15 صورة / يوم',
      color: 'bg-slate-800/80 text-slate-200 border-slate-700/50',
      glowColor: '#cbd5e1',
      features: [
        'تحليل 15 صورة يومياً بدقة AI',
        'توصيات تداول لحظية للعملات',
        'دعم فني عبر الشات المباشر',
        'دقة تحليل فني قياسية 85%'
      ],
      icon: <SilverIcon />
    },
    {
      title: 'ذهبي',
      price: '35,000',
      period: 'أسبوع',
      quota: '200 صورة / أسبوع',
      badge: 'الأكثر اختياراً',
      color: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
      glowColor: '#fbbf24',
      features: [
        'تحليل 200 صورة أسبوعياً',
        'توصيات خاصة لكبار المستثمرين',
        'مكالمات صوتية غير محدودة مع مازن',
        'دقة تحليل 95% + نظام التفكير العميق',
        'تقارير أداء ومخاطر أسبوعية'
      ],
      icon: <GoldIcon />
    },
    {
      title: 'بلاتيني',
      price: '120,000',
      period: 'شهر',
      quota: 'صور غير محدودة',
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      glowColor: '#818cf8',
      features: [
        'تحليلات غير محدودة بالكامل',
        'تنبيهات VIP فورية عبر الجوال',
        'مدير حساب خاص لاستراتيجياتك',
        'أولوية معالجة قصوى (خوادم VIP)',
        'دخول حصري لأدوات التنبؤ المستقبلية'
      ],
      icon: <PlatinumIcon />
    }
  ];

  const handleOpenPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
        setIsProcessing(false);
        setStep('payment');
    }, 1500);
  };

  const handleDoneTransfer = () => {
    setStep('activation');
  };

  const handleActivate = () => {
    const codeTrimmed = activationCode.trim();
    let isValid = false;
    
    if (selectedPlan.title === 'فضي' && SILVER_CODES.includes(codeTrimmed)) isValid = true;
    else if (selectedPlan.title === 'ذهبي' && GOLD_CODES.includes(codeTrimmed)) isValid = true;
    else if (selectedPlan.title === 'بلاتيني' && PLATINUM_CODES.includes(codeTrimmed)) isValid = true;

    if (isValid) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep('success');
        if (onActivate) onActivate(selectedPlan.title);
      }, 1500);
    } else {
      setActivationError('رمز التأكيد غير صحيح لهذه الباقة. يرجى التأكد من الرمز المرسل إليك.');
      setActivationCode('');
    }
  };

  const closeModal = () => {
    setSelectedPlan(null);
    setStep('confirm');
    setIsProcessing(false);
    setActivationCode('');
    setActivationError('');
  };

  return (
    <section className="py-32 relative" id="pricing">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24 space-y-4">
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">ابدأ رحلة <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">الاحتراف</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-xl font-light leading-relaxed">باقات صممت لترتقي بتداولك إلى مستويات غير مسبوقة من الدقة والاحترافية.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto items-stretch mb-20">
          {plans.map((plan, i) => (
            <PlanCard 
              key={i} 
              {...plan} 
              onSelect={() => setSelectedPlan(plan)} 
              isActive={activatedPlanTitle === plan.title}
            />
          ))}
        </div>

        {/* Free Course Call to Action Card */}
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-1000">
           <PlanCard 
              title="كورس التداول (كتاب)"
              price="مجاني"
              period=""
              quota="متاح للجميع الآن"
              badge="هدية مازن"
              color="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              glowColor="#10b981"
              isFree={true}
              features={[
                'مدخل شامل لسوق الفوركس والعملات',
                'شرح مفصل لتراجعات فيبوناتشي وكيفية الرسم',
                'تعلم استخدام المعدلات المتحركة SMA/EMA',
                'دليل استخدام مؤشر RSI للكشف عن التشبعات',
                'أسرار مؤشر MACD وتقاطعات الزخم'
              ]}
              icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
              onSelect={onOpenFreeCourse}
           />
        </div>
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="glass-panel-heavy p-12 rounded-[3.5rem] w-full max-w-md text-center border border-white/10 relative overflow-hidden">
            {isProcessing ? (
                <div className="py-20 flex flex-col items-center gap-6 animate-pulse">
                    <BankakLogo />
                    <div className="text-white font-black text-xl mt-4">جاري المعالجة...</div>
                </div>
            ) : step === 'confirm' ? (
              <>
                <h3 className="text-3xl font-black text-white mb-4">تأكيد الترقية</h3>
                <p className="text-slate-400 text-lg mb-10 leading-relaxed px-4">أنت على وشك الانضمام إلى النخبة في الباقة <span className="text-white font-black underline decoration-indigo-500 underline-offset-8">{selectedPlan.title}</span>.</p>
                <div className="flex flex-col gap-4">
                  <button onClick={handleOpenPayment} className="w-full liquid-button py-5 rounded-2xl text-white font-black text-lg hover:scale-[1.02] active:scale-95 transition-all">المتابعة للدفع الآمن</button>
                  <button onClick={closeModal} className="w-full py-4 rounded-2xl text-slate-500 font-bold hover:text-white transition-colors">تراجع</button>
                </div>
              </>
            ) : step === 'payment' ? (
              <div className="animate-in slide-in-from-bottom-8 duration-500">
                 <div className="mb-8"><BankakLogo /></div>
                 <h3 className="text-2xl font-black text-white mb-2">تفاصيل التحويل البنكي</h3>
                 <p className="text-slate-400 text-sm mb-8">يرجى تحويل المبلغ الموضح أدناه لتفعيل اشتراكك فوراً.</p>
                 <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-right space-y-4 mb-8">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-white font-black text-lg">{selectedPlan.price} SD</span>
                        <span className="text-slate-500 text-xs">المبلغ المطلوب</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-white font-mono font-bold">7928440</span>
                        <span className="text-slate-500 text-xs">رقم الحساب</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-white font-mono font-bold tracking-wider">0116158407</span>
                        <span className="text-slate-500 text-xs">رقم التحويل (الإشعار)</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-bold">مازن حسين</span>
                        <span className="text-slate-500 text-xs">اسم المستفيد</span>
                    </div>
                 </div>
                 <div className="flex flex-col gap-4">
                    <button onClick={handleDoneTransfer} className="w-full bg-[#c1272d] hover:bg-red-600 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all">تم التحويل، المتابعة</button>
                    <button onClick={closeModal} className="w-full py-4 rounded-2xl text-slate-500 font-bold hover:text-white transition-colors">إلغاء</button>
                 </div>
              </div>
            ) : step === 'activation' ? (
              <div className="animate-in zoom-in duration-500 space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">رمز التأكيد المطلوب</h3>
                  <p className="text-slate-400 text-sm px-4">أدخل رمز التنشيط الذي حصلت عليه بعد عملية الدفع لإكمال العملية.</p>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={activationCode}
                    onChange={(e) => { setActivationCode(e.target.value); setActivationError(''); }}
                    placeholder="أدخل الرمز هنا"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-4 text-center text-white font-black text-xl focus:border-indigo-500 focus:outline-none transition-all placeholder:text-white/10 tracking-widest shadow-inner"
                  />
                </div>
                {activationError && (
                  <div className="bg-rose-500/10 border-rose-500/20 text-rose-400 text-xs font-black py-3 rounded-xl">
                    {activationError}
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <button onClick={handleActivate} className="w-full liquid-button py-5 rounded-2xl text-white font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-900/20">تأكيد وتفعيل</button>
                  <button onClick={() => setStep('payment')} className="text-slate-500 text-xs font-bold hover:text-white transition-colors">العودة لبيانات التحويل</button>
                </div>
              </div>
            ) : (
                <div className="animate-in zoom-in duration-500">
                    <h3 className="text-4xl font-black text-white mb-4 tracking-tight">تم التنشيط بنجاح!</h3>
                    <p className="text-slate-300 text-lg mb-10 leading-relaxed px-6 font-medium">باقة <span className="text-white font-black underline decoration-emerald-500 underline-offset-8">{selectedPlan.title}</span> مفعلة الآن بالكامل.</p>
                    <button onClick={closeModal} className="w-full liquid-button py-6 rounded-2xl text-white font-black text-xl hover:scale-[1.05] active:scale-95 transition-all shadow-2xl shadow-indigo-900/40">فتح لوحة التحكم الذكية</button>
                </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default SubscriptionPlans;
