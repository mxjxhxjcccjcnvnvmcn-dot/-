
import React from 'react';

interface HeaderProps {
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
  onOpenDonation?: () => void;
  isPlanActivated?: boolean;
  onExitPlan?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenProfile, onOpenDonation, isPlanActivated, onExitPlan }) => {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500">
      <header className="glass-panel rounded-full px-4 sm:px-6 py-3 flex justify-between items-center w-full max-w-6xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-500 bg-white/5 backdrop-blur-xl border border-white/10">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-white/20 shrink-0">
            <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-black text-white leading-none tracking-tight drop-shadow-sm">محلل الأسهم</h1>
            <span className="text-[8px] sm:text-[10px] text-indigo-300 font-bold tracking-[0.2em] uppercase">Liquid AI Core</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden sm:flex gap-1 bg-white/5 rounded-full p-1 border border-white/5">
            {isPlanActivated ? (
              <button 
                onClick={onExitPlan}
                className="px-6 py-1.5 rounded-full text-xs sm:text-sm font-black text-white bg-rose-600 shadow-lg border border-white/10 transition-all hover:bg-rose-500 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                خروج من الباقة
              </button>
            ) : (
              <a href="#" className="px-6 py-1.5 rounded-full text-xs sm:text-sm font-medium text-white bg-white/10 shadow-sm border border-white/5 transition-all">الرئيسية</a>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {onOpenDonation && (
               <button 
                onClick={onOpenDonation}
                className="px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 hover:bg-rose-500/20 transition-all active:scale-95"
                title="تبرع لدعم المنصة"
              >
                <span className="text-sm font-black hidden md:block">تبرع</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}

            {onOpenProfile && (
              <button 
                onClick={onOpenProfile}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all active:scale-95 shadow-sm"
                title="الملف الشخصي"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            )}

            {onOpenSettings && (
              <button 
                onClick={onOpenSettings}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all active:scale-95 shadow-sm"
                title="تخصيص المظهر"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
