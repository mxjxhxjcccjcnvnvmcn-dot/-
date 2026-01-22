
import React from 'react';

interface HeaderProps {
  onOpenSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
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
            <a href="#" className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-400 hover:text-white transition-colors">عن التطبيق</a>
          </nav>

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
