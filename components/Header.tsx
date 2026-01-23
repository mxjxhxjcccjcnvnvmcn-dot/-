
import React from 'react';

interface HeaderProps {
  onOpenSettings?: () => void;
  onOpenVoiceCall?: () => void; // New prop for opening voice call modal
  isVoiceCallEnabled?: boolean; // New prop to control visibility of voice call button
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenVoiceCall, isVoiceCallEnabled }) => {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <header className="glass-panel rounded-full px-6 py-3 flex justify-between items-center w-full max-w-5xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-white/20">
            <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black text-white leading-none tracking-tight drop-shadow-sm">محلل الأسهم</h1>
            <span className="text-[10px] text-indigo-300 font-bold tracking-[0.2em] uppercase">Liquid AI Core</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <nav className="hidden sm:flex gap-1 bg-white/5 rounded-full p-1 border border-white/5">
            <a href="#" className="px-4 py-1.5 rounded-full text-sm font-medium text-white bg-white/10 shadow-sm border border-white/5 transition-all">الرئيسية</a>
          </nav>

          {isVoiceCallEnabled && onOpenVoiceCall && (
            <button 
              onClick={onOpenVoiceCall}
              className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 group"
              title="مكالمة صوتية مع مازن"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
          )}

          {onOpenSettings && (
            <button 
              onClick={onOpenSettings}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all active:scale-95"
              title="تخصيص المظهر"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
