
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
          
          // Simulation logic
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
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
        
        <div className="text-center space-y-6">
          {!isComplete ? (
            <>
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-xl flex items-center justify-center animate-bounce">
                <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">جاري التحميل...</h3>
                <p className="text-slate-400 text-sm">{status}</p>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_1s_infinite] transform -skew-x-12"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-mono">
                <span>{Math.round(progress)}%</span>
                <span>{platform === 'ios' ? 'App Store' : 'Google Play'}</span>
              </div>
            </>
          ) : (
            <div className="animate-in zoom-in duration-300">
              <div className="w-20 h-20 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
                <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">جاهز للاستخدام!</h3>
              <p className="text-slate-400 mb-6">
                تم تجهيز التطبيق بنجاح. يمكنك الآن إضافة التطبيق للشاشة الرئيسية للوصول السريع.
              </p>
              <button 
                onClick={onClose}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/25"
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
