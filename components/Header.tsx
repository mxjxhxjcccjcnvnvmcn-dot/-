
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-l from-white to-slate-400 bg-clip-text text-transparent">
            محلل الأسهم الذكي
          </h1>
        </div>
        <nav className="hidden md:flex gap-6 text-sm text-slate-400">
          <a href="#" className="hover:text-white transition-colors">الرئيسية</a>
          <a href="#" className="hover:text-white transition-colors">عن التطبيق</a>
          <a href="#" className="hover:text-white transition-colors">اتصل بنا</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
