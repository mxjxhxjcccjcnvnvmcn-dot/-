
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChartAnalyzer from './components/ChartAnalyzer';
import MarketStats from './components/MarketStats';
import VisitorStats from './components/VisitorStats';
import SettingsModal, { ThemeConfig, GRADIENTS } from './components/SettingsModal';
import SnowEffect from './components/SnowEffect';
import VoiceCallModal from './components/VoiceCallModal';
import SubscriptionPlans, { SILVER_CODES, GOLD_CODES, PLATINUM_CODES } from './components/SubscriptionPlans';
import TradingCourse from './components/TradingCourse';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPlanActivated, setIsPlanActivated] = useState(false);
  const [activatedPlanTitle, setActivatedPlanTitle] = useState<string | null>(null);
  const [passcode, setPasscode] = useState('');
  const [loginView, setLoginView] = useState<'choice' | 'standard' | 'subscriber'>('choice');
  const [error, setError] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [showSnow, setShowSnow] = useState(false);
  const [isVoiceCallEnabled, setIsVoiceCallEnabled] = useState(true);
  
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    blur: 20,
    gradientId: 'deep-space'
  });

  const APP_ACCESS_CODE = '124568';

  // تحديث الألوان المحيطة بناءً على الباقة
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--glass-blur', `${themeConfig.blur}px`);
    root.style.setProperty('--glass-blur-heavy', `${Math.min(themeConfig.blur * 2, 60)}px`);
    
    let activeGradient = GRADIENTS.find(g => g.id === themeConfig.gradientId)?.value;
    
    // إذا كانت هناك باقة مفعلة، نقوم بتغيير الخلفية المحيطة
    if (isPlanActivated) {
      if (activatedPlanTitle === 'فضي') {
        activeGradient = 'radial-gradient(at 0% 0%, #1e293b 0, transparent 50%), radial-gradient(at 100% 100%, #334155 0, transparent 50%)';
      } else if (activatedPlanTitle === 'ذهبي') {
        activeGradient = 'radial-gradient(at 0% 0%, #451a03 0, transparent 50%), radial-gradient(at 100% 100%, #78350f 0, transparent 50%)';
      } else if (activatedPlanTitle === 'بلاتيني') {
        activeGradient = 'radial-gradient(at 0% 0%, #1e1b4b 0, transparent 50%), radial-gradient(at 100% 100%, #312e81 0, transparent 50%)';
      }
    }

    if (activeGradient) {
      root.style.setProperty('--bg-gradient', activeGradient);
    }
  }, [themeConfig, isPlanActivated, activatedPlanTitle]);

  const handleUpdateTheme = (key: keyof ThemeConfig, value: any) => {
    setThemeConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const code = passcode.trim();

    if (loginView === 'standard') {
      if (code === APP_ACCESS_CODE) {
        setIsAuthenticated(true);
        setError('');
        setShowSnow(true);
        setTimeout(() => setShowSnow(false), 5000);
      } else {
        setError('الرمز غير صحيح');
        setPasscode('');
      }
    } else {
      // التحقق من أكواد المشتركين وتحديد نوع الباقة فوراً
      let detectedPlan = null;
      if (SILVER_CODES.includes(code)) detectedPlan = 'فضي';
      else if (GOLD_CODES.includes(code)) detectedPlan = 'ذهبي';
      else if (PLATINUM_CODES.includes(code)) detectedPlan = 'بلاتيني';

      if (detectedPlan) {
        setIsAuthenticated(true);
        setIsPlanActivated(true);
        setActivatedPlanTitle(detectedPlan);
        setError('');
        setShowSnow(true);
        setTimeout(() => setShowSnow(false), 5000);
      } else {
        setError('رمز التفعيل هذا غير صالح');
        setPasscode('');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-black">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>

        <div className="glass-panel-heavy w-full max-md rounded-[3rem] p-10 relative z-10 border border-white/10 shadow-2xl animate-in zoom-in duration-500">
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6 glass-panel rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">نظام التحليل الذكي</h1>
            <p className="text-slate-500 text-sm">مرحباً بك في منصة مازن للتداول</p>
          </div>

          {loginView === 'choice' ? (
            <div className="space-y-4 animate-in fade-in duration-500">
              <p className="text-white text-center font-bold mb-6">هل أنت مشترك بالفعل؟</p>
              <button 
                onClick={() => setLoginView('subscriber')}
                className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-lg shadow-xl shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 transition-all"
              >
                نعم، أنا مشترك
              </button>
              <button 
                onClick={() => setLoginView('standard')}
                className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-bold hover:bg-white/10 transition-all"
              >
                لا، دخول عام
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="relative group">
                <label className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 block text-center">
                  {loginView === 'subscriber' ? 'أدخل رمز تفعيل الباقة' : 'أدخل رمز الدخول العام'}
                </label>
                <input
                  type={loginView === 'standard' ? 'password' : 'text'}
                  value={passcode}
                  onChange={(e) => { setPasscode(e.target.value); setError(''); }}
                  className="w-full bg-black/40 border border-white/10 text-center rounded-2xl px-4 py-5 focus:outline-none focus:border-indigo-500 transition-all text-white text-xl font-bold tracking-widest shadow-inner"
                  placeholder={loginView === 'subscriber' ? '#CODE-123' : '••••••'}
                  dir="ltr"
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-black py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full liquid-button text-white font-black py-5 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 text-xl shadow-2xl"
                >
                  {loginView === 'subscriber' ? 'تفعيل ودخول' : 'تأكيد الدخول'}
                </button>
                <button 
                  type="button"
                  onClick={() => { setLoginView('choice'); setPasscode(''); setError(''); }}
                  className="text-slate-500 text-xs font-bold hover:text-white transition-colors"
                >
                  العودة للخلف
                </button>
              </div>
            </form>
          )}

          <div className="mt-12 text-center opacity-30">
             <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.5em]">AI SECURED ACCESS</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-tajawal pt-24 pb-12 transition-colors duration-1000 relative">
      {showSnow && <SnowEffect duration={5000} />}
      
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        onOpenVoiceCall={() => setIsCallOpen(true)}
        isVoiceCallEnabled={isVoiceCallEnabled}
      />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 w-full space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-8 relative">
          <div className="relative flex flex-col items-center">
            <div className="flex gap-3 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel shadow-lg shadow-indigo-500/10">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                    <span className="text-indigo-200 text-xs font-bold tracking-wide">AI GEN 3.0 ACTIVE</span>
                </div>
                {activatedPlanTitle && (
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border shadow-lg transition-all duration-1000 ${
                    activatedPlanTitle === 'فضي' ? 'bg-slate-500/10 border-slate-500/20 text-slate-300' :
                    activatedPlanTitle === 'ذهبي' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' :
                    'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
                  }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        activatedPlanTitle === 'فضي' ? 'bg-slate-400' :
                        activatedPlanTitle === 'ذهبي' ? 'bg-amber-400' :
                        'bg-indigo-400'
                      }`}></span>
                      <span className="text-xs font-bold tracking-wide">باقة {activatedPlanTitle} نشطة</span>
                  </div>
                )}
            </div>

            <h2 className="text-5xl md:text-8xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-lg">
              رؤية ما بعد<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-[shimmer_3s_infinite]">المستحيل</span>
            </h2>
          </div>
        </section>

        <section className="relative z-10">
          <ChartAnalyzer isLocked={!isPlanActivated} />
        </section>

        <MarketStats />

        <SubscriptionPlans 
            onActivate={(title) => { setIsPlanActivated(true); setActivatedPlanTitle(title); }} 
            activatedPlanTitle={activatedPlanTitle}
            onOpenFreeCourse={() => setIsCourseOpen(true)}
        />

        <VisitorStats />
      </main>

      {isCourseOpen && <TradingCourse onClose={() => setIsCourseOpen(false)} />}
      <VoiceCallModal isOpen={isCallOpen} onClose={() => setIsCallOpen(false)} />
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={themeConfig}
        onUpdate={handleUpdateTheme}
        isVoiceCallEnabled={isVoiceCallEnabled}
        onToggleVoiceCall={(enabled) => setIsVoiceCallEnabled(enabled)}
      />
      
      <footer className="mt-20 py-12 text-center border-t border-white/5 opacity-60">
         <p className="text-sm text-slate-400 font-bold mb-2">صنع بكل فخر في السودان 🇸🇩</p>
         <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">المطور مازن حسين عثمان</p>
      </footer>
    </div>
  );
};

export default App;
