
import React, { useState, useEffect } from 'react';

const VisitorStats: React.FC = () => {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    setIsLive(true);
  }, []);

  return (
    <div className="max-w-4xl mx-auto border-t border-white/10 pt-10 mt-10 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reserved Seats Stat */}
        <div className="glass-panel p-6 rounded-3xl flex items-center justify-between group hover:bg-white/5 transition-all">
          <div className="flex items-center gap-4">
            <div className="relative flex h-4 w-4">
              {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-4 w-4 ${isLive ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-slate-500'}`}></span>
            </div>
            <div className="flex flex-col">
               <span className="text-white text-sm font-bold tracking-wide">المقاعد المحجوزة</span>
               <span className="text-[10px] text-indigo-300/60 uppercase">Pre-registration Seats</span>
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight drop-shadow-md group-hover:scale-110 transition-transform">
            250
          </div>
        </div>

        {/* Total Analysis Stat */}
        <div className="glass-panel p-6 rounded-3xl flex items-center justify-between group hover:bg-white/5 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.2)]">
               <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
               </svg>
            </div>
            <div className="flex flex-col">
               <span className="text-white text-sm font-bold tracking-wide">إجمالي التحليلات</span>
               <span className="text-[10px] text-indigo-300/60 uppercase">Current Load</span>
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight drop-shadow-md group-hover:scale-110 transition-transform">
            100
          </div>
        </div>
      </div>

      {/* Developer Credit Footer */}
      <div className="text-center space-y-4 animate-in fade-in duration-1000">
        <div className="flex items-center justify-center gap-4">
           <a href="https://wa.me/249116158407" target="_blank" rel="noreferrer" className="px-6 py-2 bg-emerald-600/10 border border-emerald-600/20 rounded-full text-emerald-400 text-xs font-black flex items-center gap-2 hover:bg-emerald-600/20 transition-all">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             تواصل عبر الواتساب: 0116158407
           </a>
        </div>
        <p className="text-indigo-400 font-black text-lg tracking-widest uppercase flex items-center justify-center gap-3">
          <span className="w-8 h-[1px] bg-indigo-500/30"></span>
          صنع بكل فخر في السودان 🇸🇩
          <span className="w-8 h-[1px] bg-indigo-500/30"></span>
        </p>
        <p className="text-slate-500 text-sm font-bold">المطور: مازن حسين عثمان</p>
      </div>
    </div>
  );
};

export default VisitorStats;
