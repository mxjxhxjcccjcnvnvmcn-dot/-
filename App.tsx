
import React, { useState, useEffect, Suspense, lazy, memo } from 'react';
import Header from './components/Header';
import ChartAnalyzer from './components/ChartAnalyzer';
import { UserProfileData, AnalysisResult, PlanTheme, HistoryEntry } from './types';
import { GRADIENTS } from './components/SettingsModal';

// Lazy loading components for better LCP and bundle size
const SubscriptionPlans = lazy(() => import('./components/SubscriptionPlans'));
const SettingsModal = lazy(() => import('./components/SettingsModal'));
const VisitorStats = lazy(() => import('./components/VisitorStats'));
const SnowEffect = lazy(() => import('./components/SnowEffect'));
const TradingCourse = lazy(() => import('./components/TradingCourse'));
const MarketStats = lazy(() => import('./components/MarketStats'));
const UserProfile = lazy(() => import('./components/UserProfile'));
const DonationModal = lazy(() => import('./components/DonationModal'));
const DeveloperStory = lazy(() => import('./components/DeveloperStory'));

// Elegant loading placeholder
const SectionLoader = () => (
  <div className="w-full py-20 flex flex-col items-center justify-center space-y-4">
    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    <p className="text-slate-500 text-xs font-black uppercase tracking-widest animate-pulse">جاري تجهيز القسم...</p>
  </div>
);

const App: React.FC = () => {
  const [isPlanActivated, setIsPlanActivated] = useState(false);
  const [activatedPlanTitle, setActivatedPlanTitle] = useState<string | null>(null);
  const [remainingQuota, setRemainingQuota] = useState<number>(0);
  const [activePlanTheme, setActivePlanTheme] = useState<PlanTheme>({
    glowColor: '#10b981', 
    color: 'from-emerald-500/20 to-emerald-900/20',
    bgGradient: 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)'
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [showSnow, setShowSnow] = useState(false);
  const [themeConfig, setThemeConfig] = useState({ blur: 25, gradientId: 'deep-space' });

  const [profile, setProfile] = useState<UserProfileData>(() => {
    try {
      const saved = localStorage.getItem('user_profile_v1');
      return saved ? JSON.parse(saved) : { favorites: [], watchlists: [], history: [] };
    } catch (e) {
      return { favorites: [], watchlists: [], history: [] };
    }
  });

  useEffect(() => {
    localStorage.setItem('user_profile_v1', JSON.stringify(profile));
  }, [profile]);

  // Handle dynamic background changes
  useEffect(() => {
    const bgElement = document.querySelector('.ambient-bg') as HTMLElement;
    if (bgElement) {
      const targetBg = isPlanActivated 
        ? activePlanTheme.bgGradient 
        : (GRADIENTS.find(g => g.id === themeConfig.gradientId)?.value || GRADIENTS[0].value);
      bgElement.style.background = targetBg;
    }
  }, [themeConfig.gradientId, isPlanActivated, activePlanTheme.bgGradient]);

  const handlePlanActivation = (title: string, durationMinutes?: number, theme?: PlanTheme, quota?: number) => {
    setIsPlanActivated(true);
    setActivatedPlanTitle(title);
    if (theme) setActivePlanTheme(theme);
    if (quota !== undefined) setRemainingQuota(quota);
    setShowSnow(true);
    setTimeout(() => setShowSnow(false), 5000);
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    const newEntry: HistoryEntry = {
      ...result,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: Date.now()
    };
    setProfile(prev => ({
      ...prev,
      history: [newEntry, ...prev.history].slice(0, 50) 
    }));
    if (activatedPlanTitle !== 'مجاني' && remainingQuota > 0) {
      setRemainingQuota(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-tajawal relative w-full overflow-x-hidden selection:bg-indigo-500/30">
      <Suspense fallback={null}>{showSnow && <SnowEffect duration={5000} />}</Suspense>
      
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenDonation={() => setIsDonationOpen(true)}
        isPlanActivated={isPlanActivated}
        onExitPlan={() => {
           if(window.confirm("هل تريد الخروج من الباقة الحالية؟")) {
             setIsPlanActivated(false);
             setActivatedPlanTitle(null);
           }
        }}
      />

      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto space-y-24">
          
          {/* Hero Section */}
          <section className="text-center space-y-8 py-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-1000">
               <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
               الجيل الثالث من التحليل الرقمي
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-none animate-in zoom-in duration-700">
               رؤية <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-[length:200%_auto] animate-gradient-flow">ذكية</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
               حلل صفقاتك بدقة متناهية عبر معالجة الصور بالذكاء الاصطناعي. ارفع الشارت واترك الباقي لنا.
            </p>
          </section>

          {/* Core App Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
             <div className="lg:col-span-8 space-y-8">
                <ChartAnalyzer 
                   isLocked={!isPlanActivated} 
                   activePlan={activatedPlanTitle || 'مجاني'}
                   planTheme={activePlanTheme}
                   quota={remainingQuota}
                   onAnalysisComplete={handleAnalysisComplete}
                   onOpenDonation={() => setIsDonationOpen(true)}
                />
             </div>
             
             <div className="lg:col-span-4 space-y-8">
                <Suspense fallback={<div className="h-48 glass-panel-heavy rounded-3xl animate-pulse"></div>}>
                  <MarketStats />
                </Suspense>
                
                <button 
                  onClick={() => setIsCourseOpen(true)} 
                  className="w-full glass-panel-heavy p-10 rounded-[3.5rem] text-right group relative overflow-hidden transition-all hover:scale-[1.02] border-white/10 active:scale-95 shadow-2xl"
                >
                   <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 group-hover:w-4 transition-all"></div>
                   <h3 className="text-3xl font-black text-white mb-3">أكاديمية مازن</h3>
                   <p className="text-slate-500 text-sm leading-relaxed">تصفح أقوى الدروس التعليمية في تداول الأسهم والعملات الرقمية مجاناً بالكامل.</p>
                   <div className="mt-8 text-indigo-400 font-black flex items-center gap-2 group-hover:gap-4 transition-all">
                      ابدأ التعلم الآن <span>←</span>
                   </div>
                </button>
             </div>
          </div>

          {/* Lazy loaded secondary sections */}
          <Suspense fallback={<SectionLoader />}>
            <DeveloperStory />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <SubscriptionPlans 
              onActivate={handlePlanActivation} 
              activatedPlanTitle={activatedPlanTitle} 
            />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <VisitorStats />
          </Suspense>
        </div>
      </main>

      <Suspense fallback={null}>
        {isSettingsOpen && (
          <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
            config={themeConfig} 
            onUpdate={(k: any, v: any) => setThemeConfig(prev => ({...prev, [k]: v}))} 
          />
        )}
        {isCourseOpen && <TradingCourse onClose={() => setIsCourseOpen(false)} />}
        {isProfileOpen && <UserProfile profile={profile} setProfile={setProfile} onClose={() => setIsProfileOpen(false)} />}
        {isDonationOpen && <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />}
      </Suspense>
      
      <style>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-flow {
          animation: gradient-flow 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
