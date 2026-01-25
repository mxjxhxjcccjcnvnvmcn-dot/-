
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChartAnalyzer from './components/ChartAnalyzer';
import SubscriptionPlans, { PlanTheme } from './components/SubscriptionPlans';
import SettingsModal, { ThemeConfig, GRADIENTS } from './components/SettingsModal';
import VisitorStats from './components/VisitorStats';
import SnowEffect from './components/SnowEffect';
import TradingCourse from './components/TradingCourse';
import MarketStats from './components/MarketStats';
import UserProfile from './components/UserProfile';
import DonationModal from './components/DonationModal';
import DeveloperStory from './components/DeveloperStory';
import { UserProfileData, HistoryEntry, AnalysisResult } from './types';

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean>(true);
  const [isPlanActivated, setIsPlanActivated] = useState(false);
  const [activatedPlanTitle, setActivatedPlanTitle] = useState<string | null>(null);
  const [remainingQuota, setRemainingQuota] = useState<number | null>(null);
  const [activePlanTheme, setActivePlanTheme] = useState<PlanTheme>({
    glowColor: '#10b981', 
    color: 'from-emerald-500/20 to-emerald-900/20',
    bgGradient: 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)'
  });

  const [expiryTime, setExpiryTime] = useState<number | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [showSnow, setShowSnow] = useState(false);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({ blur: 25, gradientId: 'deep-space' });

  // Profile State
  const [profile, setProfile] = useState<UserProfileData>(() => {
    const saved = localStorage.getItem('user_profile_v1');
    return saved ? JSON.parse(saved) : { favorites: [], watchlists: [], history: [] };
  });

  // Check for API Key on mount
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const keyExists = await window.aistudio.hasSelectedApiKey();
        setHasKey(keyExists);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasKey(true); // Proceed assuming success per race condition rule
    }
  };

  useEffect(() => {
    localStorage.setItem('user_profile_v1', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    const savedExpiry = localStorage.getItem('plan_expiry');
    const savedTitle = localStorage.getItem('plan_title');
    const savedTheme = localStorage.getItem('plan_theme');
    const savedQuota = localStorage.getItem('plan_quota');

    if (savedExpiry && savedTitle) {
      const expiry = parseInt(savedExpiry);
      if (Date.now() < expiry) {
        setIsPlanActivated(true);
        setActivatedPlanTitle(savedTitle);
        setExpiryTime(expiry);
        if (savedTheme) setActivePlanTheme(JSON.parse(savedTheme));
        if (savedQuota) setRemainingQuota(parseInt(savedQuota));
      } else {
        handleLogoutPackage(false);
      }
    }
  }, []);

  useEffect(() => {
    const bgElement = document.querySelector('.ambient-bg') as HTMLElement;
    if (bgElement) {
      if (isPlanActivated) {
        bgElement.style.background = activePlanTheme.bgGradient;
      } else {
        const activeGradient = GRADIENTS.find(g => g.id === themeConfig.gradientId)?.value || GRADIENTS[0].value;
        bgElement.style.background = activeGradient;
      }
    }
  }, [themeConfig.gradientId, isPlanActivated, activePlanTheme.bgGradient]);

  const handlePlanActivation = (title: string, durationMinutes?: number, theme?: PlanTheme, quota?: number) => {
    setIsPlanActivated(true);
    setActivatedPlanTitle(title);
    if (theme) {
      setActivePlanTheme(theme);
      localStorage.setItem('plan_theme', JSON.stringify(theme));
    }
    if (quota !== undefined) {
      setRemainingQuota(quota);
      localStorage.setItem('plan_quota', quota.toString());
    }
    setShowSnow(true);
    setTimeout(() => setShowSnow(false), 5000);
    if (durationMinutes) {
      const newExpiryTime = Date.now() + durationMinutes * 60 * 1000;
      setExpiryTime(newExpiryTime);
      localStorage.setItem('plan_expiry', newExpiryTime.toString());
      localStorage.setItem('plan_title', title);
    }
  };

  const handleLogoutPackage = (withConfirm: boolean = true) => {
    if (withConfirm && !window.confirm("هل أنت متأكد من رغبتك في الخروج من الباقة الحالية؟")) return;
    setIsPlanActivated(false);
    setActivatedPlanTitle(null);
    setExpiryTime(null);
    setRemainingQuota(null);
    localStorage.removeItem('plan_expiry');
    localStorage.removeItem('plan_title');
    localStorage.removeItem('plan_theme');
    localStorage.removeItem('plan_quota');
  };

  const handleDecrementQuota = () => {
    if (remainingQuota && remainingQuota > 0) {
      const newQuota = remainingQuota - 1;
      setRemainingQuota(newQuota);
      localStorage.setItem('plan_quota', newQuota.toString());
    }
  };

  const addHistoryEntry = (result: AnalysisResult) => {
    const entry: HistoryEntry = {
      ...result,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now()
    };
    setProfile(prev => ({
      ...prev,
      history: [entry, ...prev.history].slice(0, 50)
    }));
  };

  // Render Key Picker Gate if no key
  if (!hasKey) {
    return (
      <div className="min-h-screen bg-[#020205] flex items-center justify-center p-6 text-right" dir="rtl">
        <div className="glass-panel-heavy p-12 rounded-[4rem] max-w-xl w-full text-center space-y-8 animate-in zoom-in duration-700 shadow-2xl border-white/10">
          <div className="w-24 h-24 bg-indigo-600/20 border border-indigo-500/30 rounded-3xl flex items-center justify-center mx-auto text-6xl animate-pulse">
            🤖
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white">تجهيز محرك الذكاء</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              لضمان عمل التحليلات الفنية بدقة على منصة Vercel، يرجى ربط حسابك بـ Google AI Studio.
            </p>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-xs text-slate-500 space-y-3">
             <p>• سيتم استخدام مفتاح الـ API الخاص بك محلياً فقط.</p>
             <p>• تأكد من اختيار مشروع مدفوع لتفعيل الميزات المتقدمة.</p>
             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-indigo-400 font-bold hover:underline block pt-2">عرض وثائق الفوترة والدعم</a>
          </div>
          <button 
            onClick={handleSelectKey}
            className="w-full py-6 bg-indigo-600 text-white font-black rounded-2xl text-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
          >
            ربط المحرك الآن
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-tajawal relative w-full overflow-x-hidden">
      {showSnow && <SnowEffect duration={5000} />}
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenDonation={() => setIsDonationOpen(true)}
        isPlanActivated={isPlanActivated}
        onExitPlan={() => handleLogoutPackage(true)}
      />
      
      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          <section className="text-center space-y-6">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter animate-in zoom-in duration-1000">
               حلل <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">بذكاء</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
               النظام الرقمي الأول لتحليل الأسهم والعملات بدقة تصل إلى 95% عبر المعالجة الذكية لصور الشارت.
            </p>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
             <div className="lg:col-span-8 space-y-8">
                <ChartAnalyzer 
                   isLocked={!isPlanActivated} 
                   activePlan={activatedPlanTitle || 'مجاني'}
                   planTheme={activePlanTheme}
                   quota={remainingQuota || 0}
                   onDecrementQuota={handleDecrementQuota}
                   onAnalysisComplete={addHistoryEntry}
                   onOpenDonation={() => setIsDonationOpen(true)}
                />
             </div>
             <div className="lg:col-span-4 space-y-8">
                <MarketStats />
                <button onClick={() => setIsCourseOpen(true)} className="w-full glass-panel-heavy p-8 rounded-[3rem] text-right group relative overflow-hidden transition-all hover:scale-[1.02] border-white/10 active:scale-95">
                   <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
                   <h3 className="text-2xl font-black text-white mb-2">أكاديمية المتداولين</h3>
                   <p className="text-slate-500 text-sm">تعلم أسرار التحليل الفني مع مازن (مجاناً)</p>
                   <div className="mt-4 text-indigo-400 font-bold flex items-center gap-2">تصفح الكتاب <span>←</span></div>
                </button>
             </div>
          </div>

          <DeveloperStory />

          <SubscriptionPlans 
            onActivate={handlePlanActivation} 
            activatedPlanTitle={activatedPlanTitle}
          />

          <VisitorStats />
        </div>
      </main>

      {isSettingsOpen && (
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          config={themeConfig} 
          onUpdate={(k, v) => setThemeConfig(prev => ({...prev, [k]: v}))} 
        />
      )}
      {isCourseOpen && <TradingCourse onClose={() => setIsCourseOpen(false)} />}
      {isProfileOpen && <UserProfile profile={profile} setProfile={setProfile} onClose={() => setIsProfileOpen(false)} />}
      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
    </div>
  );
};

export default App;
