
import React, { useState } from 'react';
import Header from './components/Header';
import ChartAnalyzer from './components/ChartAnalyzer';
import MarketStats from './components/MarketStats';
import VisitorStats from './components/VisitorStats';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '124568') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('رمز الدخول غير صحيح');
      setPasscode('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4">
        <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
          
          <div className="text-center mb-8 pt-4">
            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-700">
              <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white mb-2">محلل الأسهم الذكي</h1>
            <p className="text-slate-400 text-sm">منطقة محمية. الرجاء إدخال كود التصريح.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError('');
                }}
                className="w-full bg-slate-950 border border-slate-800 text-center text-3xl tracking-[0.5em] font-bold rounded-2xl px-4 py-5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-800 text-white shadow-inner"
                placeholder="••••••"
                dir="ltr"
                autoFocus
                maxLength={6}
              />
            </div>
            
            {error && (
              <div className="text-rose-400 text-sm text-center font-bold bg-rose-500/5 py-2 rounded-lg border border-rose-500/10 animate-pulse">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              فتح التطبيق
            </button>
          </form>

          <div className="mt-10 text-center border-t border-slate-800/50 pt-6">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">
              Protected System
            </p>
            <p className="text-xs text-slate-500 font-bold">
              صنع في السودان 🇸🇩
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="inline-block px-4 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 mb-2">
            الذكاء الاصطناعي في خدمتك 🚀
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            حول شارتاتك إلى <span className="text-indigo-500">قرارات ذكية</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            دقة عالية في تحليل الاتجاهات السعرية، الأنماط الهندسية، والمؤشرات الفنية من خلال معالجة الصور المتقدمة.
          </p>

          {/* Motivational Limited Time Offer */}
          <div className="animate-pulse bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/30 rounded-xl p-4 max-w-xl mx-auto backdrop-blur-sm shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <p className="text-amber-400 font-bold text-lg flex items-center justify-center gap-2">
              <span>🔥</span>
              لفترة محدودة جداً! التطبيق مجاني بالكامل
            </p>
            <p className="text-amber-200/70 text-sm mt-1">
              استغل الفرصة الآن واجعل تداولاتك أكثر احترافية قبل انتهاء العرض
            </p>
          </div>
        </section>

        {/* Core Analysis Tool */}
        <section>
          <ChartAnalyzer />
        </section>

        {/* Features & Mini Dashboard */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
           {/* Market Stats - Compact Version */}
          <div className="lg:col-span-2">
             <div className="flex items-center justify-between mb-4 px-1">
               <h3 className="font-bold text-slate-300 flex items-center gap-2">
                 <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                 </svg>
                 نظرة سريعة على السوق
               </h3>
               <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full animate-pulse border border-red-500/20">LIVE DATA</span>
             </div>
            <MarketStats />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { label: 'BTC/USD', val: '43,210', change: '+2.4%', up: true },
                { label: 'ETH/USD', val: '2,890', change: '-0.5%', up: false },
                { label: 'XAU/USD', val: '2,030', change: '+0.1%', up: true },
                { label: 'OIL', val: '78.50', change: '+1.2%', up: true },
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-center">
                  <div className="text-xs text-slate-500 font-bold mb-1">{item.label}</div>
                  <div className="font-mono text-white font-bold">{item.val}</div>
                  <div className={`text-xs ${item.up ? 'text-emerald-400' : 'text-rose-400'}`}>{item.change}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-center h-full">
            <h3 className="text-xl font-bold mb-6">لماذا تختارنا؟</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                  ⚡
                </div>
                <div>
                  <h4 className="font-bold">تحليل فوري</h4>
                  <p className="text-sm text-slate-400">احصل على النتيجة في أقل من 10 ثوانٍ.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  🎯
                </div>
                <div>
                  <h4 className="font-bold">دقة عالية</h4>
                  <p className="text-sm text-slate-400">مدعوم بأحدث نماذج Gemini لتحليل الرؤية.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                  🛡️
                </div>
                <div>
                  <h4 className="font-bold">إدارة مخاطر</h4>
                  <p className="text-sm text-slate-400">تحديد مستويات وقف الخسارة والأهداف تلقائياً.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Visitor Stats Section */}
        <section className="py-8 border-t border-slate-800/50">
          <VisitorStats />
        </section>

        {/* Disclaimer Section */}
        <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
          <div className="flex items-start gap-4 text-slate-500 text-sm italic">
            <svg className="w-6 h-6 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              إخلاء مسؤولية: التحليل المقدم بواسطة هذا التطبيق هو لغرض تعليمي وتوضيحي فقط. سوق المال ينطوي على مخاطر عالية. لا يجب اعتبار التوصيات نصيحة مالية استثمارية. يرجى دائماً إجراء بحثك الخاص أو استشارة مستشار مالي مرخص قبل اتخاذ أي قرار تداول. نحن لا نضمن دقة 100% في التوقعات المستقبلية.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/50 py-10 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 mb-2">
             <span className="text-2xl">🇸🇩</span>
             <p className="font-bold text-lg text-slate-200">
               تم تصنيع هذا التطبيق في السودان بكل فخر
             </p>
          </div>
          
          <div className="bg-slate-800/50 px-6 py-2 rounded-full border border-slate-700 hover:border-indigo-500/50 transition-colors">
            <p className="text-slate-400 text-sm">
              بواسطة المطور: <span className="text-indigo-400 font-bold">مازن حسين عثمان محمد</span>
            </p>
          </div>

          <p className="text-slate-600 text-xs mt-6">© {new Date().getFullYear()} محلل الأسهم الذكي. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
