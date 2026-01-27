
import React, { useState, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import ChartAnalyzer from './components/ChartAnalyzer';
import { UserProfileData, AnalysisResult, PlanTheme, HistoryEntry } from './types';
import { GRADIENTS } from './components/SettingsModal';

const SubscriptionPlans = lazy(() => import('./components/SubscriptionPlans'));
const SettingsModal = lazy(() => import('./components/SettingsModal'));
const VisitorStats = lazy(() => import('./components/VisitorStats'));
const SnowEffect = lazy(() => import('./components/SnowEffect'));
const TradingCourse = lazy(() => import('./components/TradingCourse'));
const MarketStats = lazy(() => import('./components/MarketStats'));
const UserProfile = lazy(() => import('./components/UserProfile'));
const DonationModal = lazy(() => import('./components/DonationModal'));
const DeveloperStory = lazy(() => import('./components/DeveloperStory'));

// مكون احتياطي بسيط وجميل أثناء التحميل
const ComponentLoader = () => (
  <div className="w-full py-12 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
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
    const saved = localStorage.getItem('user_profile_v1');
    return saved ? JSON.parse(saved) : { favorites: [], watchlists: [], history: [] };
  });

  // حفظ التغييرات في البروفايل
  useEffect(() => {
    localStorage.setItem('user_profile_v1', JSON.stringify(profile));
  }, [profile]);

  // تحديث الخلفية بناءً على الثيم المختار أو الباقة المفعلة
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
    if (theme) setActivePlanTheme(theme);
    if (quota !== undefined) setRemainingQuota(quota);
    setShowSnow(true);
    setTimeout(() => setShowSnow(false), 5000);
  };

  const handleDecrementQuota = () => {
    if (activatedPlanTitle !== 'مجاني' && remainingQuota > 0) {
      setRemainingQuota(prev => prev - 1);
    }
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
  };

  return (
    <div className="min-h-screen flex flex-col font-tajawal relative w-full overflow-x-hidden">
      <Suspense fallback={null}>{showSnow && <SnowEffect duration={5000} />}</Suspense>
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenDonation={() => setIsDonationOpen(true)}
        isPlanActivated={isPlanActivated}
        onExitPlan={() => setIsPlanActivated(false)}
      />
      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          <section className="text-center space-y-6">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter animate-in zoom-in duration-1000">
               حلل <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">بذكاء</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
               النظام الرقمي الأول لتحليل الأسهم والعملات بدقة متناهية عبر المعالجة الذكية لصور الشارت.
            </p>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
             <div className="lg:col-span-8 space-y-8">
                <ChartAnalyzer 
                   isLocked={!isPlanActivated} 
                   activePlan={activatedPlanTitle || 'مجاني'}
                   planTheme={activePlanTheme}
                   quota={remainingQuota}
                   onDecrementQuota={handleDecrementQuota}
                   onAnalysisComplete={handleAnalysisComplete}
                   onOpenDonation={() => setIsDonationOpen(true)}
                />
             </div>
             <div className="lg:col-span-4 space-y-8">
                <Suspense fallback={<div className="h-48 glass-panel-heavy rounded-3xl animate-pulse"></div>}>
                  <MarketStats />
                </Suspense>
                <button onClick={() => setIsCourseOpen(true)} className="w-full glass-panel-heavy p-8 rounded-[3rem] text-right group relative overflow-hidden transition-all hover:scale-[1.02] border-white/10 active:scale-95">
                   <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
                   <h3 className="text-2xl font-black text-white mb-2">أكاديمية المتداولين</h3>
                   <p className="text-slate-500 text-sm">تعلم أسرار التحليل الفني مع مازن (مجاناً)</p>
                   <div className="mt-4 text-indigo-400 font-bold flex items-center gap-2">تصفح الكتاب <span>←</span></div>
                </button>
             </div>
          </div>

          <Suspense fallback={<ComponentLoader />}>
            <DeveloperStory />
          </Suspense>

          <Suspense fallback={<ComponentLoader />}>
            <SubscriptionPlans 
              onActivate={handlePlanActivation} 
              activatedPlanTitle={activatedPlanTitle} 
            />
          </Suspense>

          <Suspense fallback={<ComponentLoader />}>
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
    </div>
  );
};

export default App;
