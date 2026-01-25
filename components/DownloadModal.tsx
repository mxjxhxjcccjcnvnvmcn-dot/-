
import React, { useEffect, useState } from 'react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: 'android' | 'ios' | null;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose, platform }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('جاري الاتصال بالخادم...');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      setIsComplete(false);
      setStatus('جاري الاتصال بالخادم...');

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          
          const increment = Math.random() * 15;
          const newProgress = Math.min(prev + increment, 100);
          
          if (newProgress > 20 && newProgress < 50) setStatus('جاري تحميل حزمة البيانات...');
          if (newProgress > 50 && newProgress < 80) setStatus('جاري التثبيت وفحص الأمان...');
          if (newProgress > 80) setStatus('جاري إعداد واجهة المستخدم...');
          if (newProgress === 100) {
            setStatus('تم التحميل بنجاح!');
            setIsComplete(true);
          }
          
          return newProgress;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-700 w-full max-w-md rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500"></div>
        
        <div className="text-center">
          {!isComplete ? (
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto bg-slate-800/50 rounded-2xl flex items-center justify-center animate-bounce border border-white/5">
                <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">جاري التحميل...</h3>
                <p className="text-slate-400 text-sm font-medium">{status}</p>
              </div>
              
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_1s_infinite] transform -skew-x-12"></div>
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-black uppercase tracking-widest">
                <span>{Math.round(progress)}%</span>
                <span>{platform === 'ios' ? 'App Store' : 'Google Play'}</span>
              </div>
            </div>
          ) : (
            <div className="animate-in zoom-in duration-500 flex flex-col items-center">
              {/* أيقونة جاهز للاستخدام في الأعلى مع توهج */}
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-3xl font-black text-white mb-3">جاهز للاستخدام!</h3>
              <p className="text-slate-400 mb-8 text-sm leading-relaxed max-w-[280px]">
                تم تجهيز المحرك بنجاح. يمكنك الآن البدء في استخدام أدوات التحليل المتقدمة.
              </p>
              
              <button 
                onClick={onClose}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 text-lg"
              >
                فتح التطبيق الآن
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
