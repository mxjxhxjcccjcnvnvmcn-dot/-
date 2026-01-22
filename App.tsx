
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChartAnalyzer from './components/ChartAnalyzer';
import MarketStats from './components/MarketStats';
import VisitorStats from './components/VisitorStats';
import SettingsModal, { ThemeConfig, GRADIENTS } from './components/SettingsModal';
import { generateVoiceGuidance, playBase64Audio } from './services/geminiService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Theme State
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    blur: 20,
    gradientId: 'deep-space'
  });

  // Apply Theme Changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--glass-blur', `${themeConfig.blur}px`);
    // Scale heavy blur based on regular blur
    root.style.setProperty('--glass-blur-heavy', `${Math.min(themeConfig.blur * 2, 60)}px`);
    
    const selectedGradient = GRADIENTS.find(g => g.id === themeConfig.gradientId)?.value;
    if (selectedGradient) {
      root.style.setProperty('--bg-gradient', selectedGradient);
    }
  }, [themeConfig]);

  const handleUpdateTheme = (key: keyof ThemeConfig, value: any) => {
    setThemeConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '124568') {
      setIsAuthenticated(true);
      setError('');
      
      // Trigger "Welcome Sir" immediately
      try {
        const audioData = await generateVoiceGuidance("Welcome Sir");
        if (audioData) {
          playBase64Audio(audioData);
        }
      } catch (err) {
        console.error("Failed to play welcome message");
      }

    } else {
      setError('رمز الدخول غير صحيح');
      setPasscode('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1s'}}></div>

        <div className="glass-panel-heavy w-full max-w-md rounded-[2.5rem] p-8 md:p-12 relative z-10 overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
          {/* Shine effect */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50"></div>
          
          <div className="text-center mb-10">
            <div className="w-24 h-24 mx-auto mb-8 relative">
               <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
               <div className="relative w-full h-full glass-panel rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
                <svg className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
               </div>
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mb-2">
              بوابة الوصول
            </h1>
            <p className="text-indigo-200/60 text-sm font-light tracking-wide">نظام التحليل المالي الذكي</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="relative group">
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError('');
                }}
                className="w-full bg-black/20 border border-white/10 text-center text-4xl tracking-[0.5em] font-bold rounded-2xl px-4 py-6 focus:outline-none focus:border-indigo-500/50 focus:bg-black/30 transition-all text-white placeholder-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                placeholder="••••••"
                dir="ltr"
                autoFocus
                maxLength={6}
              />
              {/* Glow line on focus */}
              <div className="absolute bottom-0 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500"></div>
            </div>
            
            {error && (
              <div className="glass-panel bg-rose-500/10 border-rose-500/30 text-rose-300 text-sm text-center font-medium py-3 rounded-xl animate-pulse backdrop-blur-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full liquid-button text-white font-bold py-5 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] text-lg tracking-wide shadow-lg shadow-indigo-900/40 relative overflow-hidden group"
            >
              <span className="relative z-10">الدخول للنظام</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </form>

          <div className="mt-12 text-center">
             <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Secure Server Active</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-tajawal pt-24 pb-12 transition-colors duration-500">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 w-full space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel mb-4 shadow-lg shadow-indigo-500/10">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span className="text-indigo-200 text-xs font-bold tracking-wide">AI GEN 2.5 ACTIVE</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-lg">
              رؤية ما بعد<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-[shimmer_3s_infinite]">المستحيل</span>
            </h2>
            <p className="text-indigo-100/60 max-w-2xl mx-auto text-lg mt-6 font-light">
              تحليل الكريبتو والأسهم بدقة الذكاء الاصطناعي عبر واجهة زجاجية تفاعلية.
            </p>
          </div>
        </section>

        {/* Core Analysis Tool */}
        <section className="relative z-10">
          <ChartAnalyzer />
        </section>

        {/* Features & Dashboard */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
           {/* Market Stats */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between px-2">
               <h3 className="font-bold text-white/80 flex items-center gap-2 text-lg">
                 نظرة السوق
               </h3>
               <span className="text-[10px] bg-red-500/20 text-red-300 px-3 py-1 rounded-full border border-red-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]">LIVE FEED</span>
             </div>
            <MarketStats />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'BTC', val: '43,210', change: '+2.4%', up: true },
                { label: 'ETH', val: '2,890', change: '-0.5%', up: false },
                { label: 'GOLD', val: '2,030', change: '+0.1%', up: true },
                { label: 'OIL', val: '78.50', change: '+1.2%', up: true },
              ].map((item, i) => (
                <div key={i} className="glass-panel p-4 rounded-2xl flex flex-col items-center hover:bg-white/5 transition-colors group cursor-default">
                  <div className="text-[10px] text-slate-400 font-bold mb-1 tracking-wider">{item.label}</div>
                  <div className="text-xl text-white font-bold group-hover:scale-110 transition-transform duration-300">{item.val}</div>
                  <div className={`text-xs font-bold mt-1 ${item.up ? 'text-emerald-400' : 'text-rose-400'}`}>{item.change}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Card */}
          <div className="glass-panel p-8 rounded-[2rem] flex flex-col justify-center h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
            <h3 className="text-2xl font-bold mb-8 relative text-white">مميزات النظام</h3>
            <div className="space-y-8 relative">
              {[
                { icon: '⚡', title: 'تحليل فوري', desc: 'معالجة بصرية في < 500ms' },
                { icon: '💎', title: 'دقة الكريستال', desc: 'Gemini Vision Pro 2.5' },
                { icon: '🛡️', title: 'حماية الأصول', desc: 'إدارة مخاطر آلية ذكية' }
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-5 items-center group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{feature.title}</h4>
                    <p className="text-sm text-indigo-200/50">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Visitor Stats Section */}
        <section>
          <VisitorStats />
        </section>

        {/* Disclaimer */}
        <section className="glass-panel rounded-3xl p-8 border-white/5">
          <p className="text-slate-400 text-sm italic leading-relaxed text-center opacity-70">
            إخلاء مسؤولية: التحليل المقدم بواسطة هذا التطبيق هو لغرض تعليمي وتوضيحي فقط. سوق المال ينطوي على مخاطر عالية.
          </p>
        </section>
      </main>

      <footer className="mt-20 py-10 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4"></div>
          
          <div className="flex items-center gap-3 glass-panel px-6 py-2 rounded-full">
             <span className="text-2xl drop-shadow-md">🇸🇩</span>
             <p className="font-bold text-slate-200">
               صنع في السودان
             </p>
          </div>
          
          <p className="text-slate-500 text-xs tracking-widest uppercase">
            Designed by Mazen Hussein
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={themeConfig}
        onUpdate={handleUpdateTheme}
      />
    </div>
  );
};

export default App;
