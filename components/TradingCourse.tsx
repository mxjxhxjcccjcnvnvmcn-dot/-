
import React, { useState } from 'react';

interface Lesson {
  id: string;
  title: string;
  category: 'basics' | 'fibonacci' | 'averages' | 'rsi_macd';
  content: React.ReactNode;
  icon: string;
  pages: string;
}

const TradingCourse: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState<'basics' | 'fibonacci' | 'averages' | 'rsi_macd'>('basics');
  const [activeLesson, setActiveLesson] = useState<string>('intro');

  const categories = [
    { id: 'basics', title: 'مدخل التداول', subtitle: 'أساسيات الفوركس', icon: '🌍' },
    { id: 'fibonacci', title: 'فيبوناتشي', subtitle: 'مستويات التصحيح', icon: '📐' },
    { id: 'averages', title: 'المعدلات المتحركة', subtitle: 'الاتجاهات والزخم', icon: '📉' },
    { id: 'rsi_macd', title: 'المؤشرات الفنية', subtitle: 'RSI & MACD', icon: '📊' },
  ];

  const lessons: Lesson[] = [
    {
      id: 'intro',
      category: 'basics',
      title: 'مدخل إلى تداول العملات',
      icon: '🏛️',
      pages: '1-2',
      content: (
        <div className="space-y-6 animate-in fade-in duration-500">
          <h3 className="text-3xl font-black text-white">احتراف مؤشرات التداول</h3>
          <p className="text-slate-300 leading-relaxed text-lg">
            تداول فوركس يحقق العوائد والأرباح فقط بعد فهم متطلبات هذا السوق ومتابعته. تستخدم مؤشرات فوركس من قبل المتداولين والمحللين لتفسير وشرح تحركات الأسعار والعملات.
          </p>
          <div className="p-6 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 italic">
            "الهدف هو اختيار أفضل المؤشرات مع استراتيجية مدروسة للنجاح في فوركس."
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="glass-panel p-6 rounded-3xl border-white/5">
                <span className="text-indigo-400 font-bold block mb-2">توصيات التداول</span>
                <p className="text-sm text-slate-400 leading-relaxed">المؤشرات هي الأساس الذي يتم بناءً عليه إرسال توصيات الشراء والبيع في سوق العملات.</p>
             </div>
             <div className="glass-panel p-6 rounded-3xl border-white/5">
                <span className="text-indigo-400 font-bold block mb-2">تحديد الوقت</span>
                <p className="text-sm text-slate-400 leading-relaxed">تساعدك المؤشرات في تحديد أفضل وقت للدخول والخروج من الصفقات لتحقيق أقصى ربح.</p>
             </div>
          </div>
        </div>
      )
    },
    {
      id: 'fibo-math',
      category: 'fibonacci',
      title: 'حساب تراجعات فيبوناتشي',
      icon: '🧮',
      pages: '3-5',
      content: (
        <div className="space-y-6 animate-in fade-in duration-500">
          <h3 className="text-3xl font-black text-white">النسب الذهبية في السوق</h3>
          <p className="text-slate-300 leading-relaxed">تعتمد تراجعات فيبوناتشي على أرقام حسابية تكرر نفسها في مسالك الحياة. الأرقام الرئيسية في تداول FX هي:</p>
          <div className="grid grid-cols-3 gap-4">
             <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl text-center">
                <span className="block text-2xl font-black text-emerald-400">23.6%</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">أقل أهمية</span>
             </div>
             <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-3xl text-center">
                <span className="block text-2xl font-black text-amber-400">50.0%</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">تراجع متوسط</span>
             </div>
             <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-center">
                <span className="block text-2xl font-black text-rose-400">61.8%</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">النسبة الذهبية</span>
             </div>
          </div>
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4">
            <h4 className="text-white font-bold">كيفية الرسم:</h4>
            <ol className="list-decimal list-inside text-slate-400 text-sm space-y-3">
              <li>حدد أعلى وأسفل الاتجاه العام (الدعم والمقاومة).</li>
              <li>ارسم الخطوط من النقطة العالية إلى المنخفضة في الاتجاه الصاعد.</li>
              <li>ابحث عن إشارات تأكيد مثل نماذج الشموع اليابانية (Hammer).</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 'moving-averages',
      category: 'averages',
      title: 'المعدلات المتحركة (SMA/EMA)',
      icon: '🎢',
      pages: '8-10',
      content: (
        <div className="space-y-6 animate-in fade-in duration-500">
          <h3 className="text-3xl font-black text-white">قياس زخم الاتجاه</h3>
          <p className="text-slate-300 leading-relaxed">تقيس المعدلات المتحركة متوسط السعر خلال إطار زمني محدد. الأطر الأكثر استخداماً هي 10، 20، 50، و 200 يوم.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="glass-panel p-6 rounded-3xl border-indigo-500/10">
                <h4 className="text-indigo-400 font-bold mb-2">SMA (بسيط)</h4>
                <p className="text-xs text-slate-400">يحسب متوسط السعر بقسمة مجموع الأسعار على عدد الأيام.</p>
             </div>
             <div className="glass-panel p-6 rounded-3xl border-purple-500/10">
                <h4 className="text-purple-400 font-bold mb-2">EMA (أسي)</h4>
                <p className="text-xs text-slate-400">يشدد أكثر على أسعار الإغلاق الأخيرة، مما يجعله أسرع في التفاعل.</p>
             </div>
          </div>
          <div className="p-6 bg-amber-500/5 rounded-3xl border border-amber-500/10">
             <h4 className="text-amber-400 font-black mb-2 flex items-center gap-2">
                <span>⚠️</span> تنبيه التقاطعات
             </h4>
             <p className="text-sm text-slate-300">عندما يقطع معدل قصير (20) معدلاً أطول (200) للأعلى، تعتبر إشارة شراء قوية (التقاطع الذهبي).</p>
          </div>
        </div>
      )
    },
    {
      id: 'rsi-indicator',
      category: 'rsi_macd',
      title: 'مؤشر القوة النسبية RSI',
      icon: '🌡️',
      pages: '13-15',
      content: (
        <div className="space-y-6 animate-in fade-in duration-500">
          <h3 className="text-3xl font-black text-white">مناطق التشبع السعري</h3>
          <p className="text-slate-300 leading-relaxed">يعمل RSI بصورة جيدة في الأسواق المحددة، وقيمته تتراوح بين 0 و 100. الرقم القياسي المستخدم هو 14 يوماً.</p>
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-6 p-6 glass-panel rounded-3xl border-rose-500/20">
                <div className="text-3xl font-black text-rose-500">70+</div>
                <div>
                   <span className="block text-white font-bold">مبالغ في الشراء</span>
                   <span className="text-xs text-slate-500">إشارة احتمالية للبيع أو جني الأرباح.</span>
                </div>
             </div>
             <div className="flex items-center gap-6 p-6 glass-panel rounded-3xl border-emerald-500/20">
                <div className="text-3xl font-black text-emerald-500">30-</div>
                <div>
                   <span className="block text-white font-bold">مبالغ في البيع</span>
                   <span className="text-xs text-slate-500">إشارة احتمالية للشراء أو ارتداد صاعد.</span>
                </div>
             </div>
          </div>
          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 italic text-sm text-slate-400">
             "يستخدم RSI أيضاً للكشف عن 'التباعد' (Divergence) بين السعر والمؤشر كإشارة لانعكاس الاتجاه."
          </div>
        </div>
      )
    },
    {
      id: 'macd-indicator',
      category: 'rsi_macd',
      title: 'مؤشر الماكدي MACD',
      icon: '🌊',
      pages: '18-21',
      content: (
        <div className="space-y-6 animate-in fade-in duration-500">
          <h3 className="text-3xl font-black text-white">متوسط تقارب/تباعد المعدلات</h3>
          <p className="text-slate-300 leading-relaxed">يعد MACD مؤشراً تقنياً يرتكز على معدلات دليلية متحركة. يتكون من خط الماكدي، خط الإشارة، والهيستوغرام.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-6 glass-panel rounded-3xl border-indigo-500/10">
                <span className="text-indigo-400 font-black block mb-2">خط الإشارة</span>
                <p className="text-xs text-slate-400">المتوسط المتحرك الأسي لليوم التاسع لخط MACD.</p>
             </div>
             <div className="p-6 glass-panel rounded-3xl border-white/5">
                <span className="text-white font-black block mb-2">نقطة الصفر</span>
                <p className="text-xs text-slate-400">تجاوز الأعمدة لخط الوسط صعوداً أو نزولاً يحدد اتجاه الزخم.</p>
             </div>
          </div>
          <div className="p-8 bg-indigo-600/10 rounded-[2.5rem] border border-indigo-600/20 text-center">
             <h4 className="text-white font-black mb-3">إشارة الدخول المثالية</h4>
             <p className="text-sm text-slate-300">عندما يلتقي MACD بخط الإشارة، يتم إصدار إشارة تداول. التقاطع تحت الصفر وصعوداً هو الأقوى.</p>
          </div>
        </div>
      )
    }
  ];

  const filteredLessons = lessons.filter(l => l.category === activeCategory);
  const currentLesson = lessons.find(l => l.id === activeLesson) || lessons[0];

  return (
    <div className="fixed inset-0 z-[120] bg-black/98 backdrop-blur-3xl overflow-y-auto animate-in fade-in duration-500 font-tajawal">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto py-12 px-6 relative">
        
        {/* Navigation Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 border-b border-white/10 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
               <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-xl">كتاب مجاني</span>
               <span className="text-slate-500 text-xs font-bold">دليل احتراف المؤشرات (21 صفحة)</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">أكاديمية <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">مازن الذكية</span></h2>
          </div>
          <button onClick={onClose} className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-rose-500/20 hover:text-rose-400 transition-all active:scale-90 shadow-2xl group">
            <svg className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Category Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as any);
                const first = lessons.find(l => l.category === cat.id);
                if (first) setActiveLesson(first.id);
              }}
              className={`p-6 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-center gap-4 relative overflow-hidden group ${
                activeCategory === cat.id 
                  ? 'bg-indigo-600 border-indigo-400 shadow-[0_20px_40px_rgba(79,70,229,0.2)] text-white' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <div className="text-center">
                <span className="block font-black text-sm">{cat.title}</span>
                <span className={`text-[8px] font-bold uppercase tracking-widest ${activeCategory === cat.id ? 'text-indigo-200' : 'text-slate-600'}`}>{cat.subtitle}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Lessons Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-3">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4 mb-6">فصول الكتاب</h4>
            {filteredLessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson.id)}
                className={`w-full text-right p-5 rounded-[1.5rem] transition-all duration-300 flex items-center justify-between group border ${
                  activeLesson === lesson.id 
                    ? 'bg-white/10 border-white/20 text-white shadow-xl translate-x-4' 
                    : 'bg-transparent border-transparent text-slate-500 hover:bg-white/5'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-bold text-sm">{lesson.title}</span>
                  <span className="text-[9px] opacity-40 font-mono mt-0.5">ص {lesson.pages}</span>
                </div>
                <span className="text-xl">{lesson.icon}</span>
              </button>
            ))}
          </aside>

          {/* Content Viewport */}
          <div className="flex-1 glass-panel-heavy rounded-[3rem] p-10 lg:p-16 border-white/10 min-h-[600px] relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
               {/* Current Lesson Badge */}
               <div className="flex items-center gap-2 mb-8">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></div>
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">
                     المادة العلمية المعتمدة
                  </span>
               </div>

               {/* Lesson Content Rendering */}
               {currentLesson.content}

               {/* Professional Footer Simulation */}
               <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                       <span className="text-xs font-black text-indigo-400">PDF</span>
                    </div>
                    <span className="text-xs text-slate-500 font-bold">المصدر: مدخل إلى تداول العملات - TradersUP</span>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                       <span className="block text-[10px] text-slate-600 font-black uppercase tracking-widest">موقع القراءة</span>
                       <span className="text-white font-mono font-bold">P. {currentLesson.pages} / 21</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
        
        {/* Footer Credit */}
        <div className="mt-20 text-center opacity-40">
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em]">Trading Education System - Free Edition</p>
        </div>
      </div>
    </div>
  );
};

export default TradingCourse;
