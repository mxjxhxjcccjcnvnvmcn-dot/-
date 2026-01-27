
import React, { useState } from 'react';

export interface ThemeConfig {
  blur: number;
  gradientId: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ThemeConfig;
  onUpdate: (key: keyof ThemeConfig, value: any) => void;
}

export const GRADIENTS = [
  {
    id: 'deep-space',
    name: 'فضاء عميق',
    value: 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)',
    preview: 'bg-gradient-to-br from-indigo-900 to-purple-900'
  },
  {
    id: 'cyber-mint',
    name: 'سايبر مينت',
    value: 'radial-gradient(at 0% 0%, #022c22 0, transparent 50%), radial-gradient(at 50% 100%, #134e4a 0, transparent 50%), radial-gradient(at 100% 0%, #064e3b 0, transparent 50%)',
    preview: 'bg-gradient-to-br from-emerald-900 to-teal-900'
  },
  {
    id: 'solar-flare',
    name: 'وهج شمسي',
    value: 'radial-gradient(at 0% 100%, #451a03 0, transparent 50%), radial-gradient(at 50% 0%, #7c2d12 0, transparent 50%), radial-gradient(at 100% 100%, #9a3412 0, transparent 50%)',
    preview: 'bg-gradient-to-br from-orange-900 to-red-900'
  },
  {
    id: 'midnight-blue',
    name: 'أزرق ليلي',
    value: 'radial-gradient(at 0% 0%, #0f172a 0, transparent 50%), radial-gradient(at 100% 100%, #1e3a8a 0, transparent 50%)',
    preview: 'bg-slate-900'
  }
];

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onUpdate }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1555') {
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      <div className="glass-panel-heavy w-full max-w-md rounded-[3rem] p-8 relative z-10 animate-in zoom-in duration-300 shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10">
        {!isAuthorized ? (
          <div className="space-y-8 py-4 text-center animate-in fade-in duration-500">
            <div className={`w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-4xl mb-2 transition-all ${error ? 'border-rose-500 animate-shake' : ''}`}>
              🔒
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-2">تعديل النظام محمي</h3>
              <p className="text-slate-500 text-sm">أدخل رمز الوصول للمتابعة</p>
            </div>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <input 
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="• • • •"
                className={`w-full bg-black/40 border-2 rounded-2xl py-5 text-center text-3xl tracking-[1em] font-black text-white outline-none transition-all ${error ? 'border-rose-500 bg-rose-500/10' : 'border-white/10 focus:border-indigo-500'}`}
                autoFocus
              />
              <button 
                type="submit"
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl text-xl shadow-xl transition-all active:scale-95"
              >
                تأكيد الرمز
              </button>
            </form>
            
            <button onClick={onClose} className="text-slate-500 text-xs font-bold hover:text-white transition-colors">إلغاء الأمر</button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-emerald-400">🔓</span>
                <h3 className="text-2xl font-black text-white">تخصيص المظهر</h3>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-bold text-indigo-200">شفافية الزجاج (Blur)</label>
                  <span className="text-xs font-mono text-slate-400">{config.blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={config.blur}
                  onChange={(e) => onUpdate('blur', parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-indigo-200 mb-4">الخلفية المحيطة</label>
                <div className="grid grid-cols-2 gap-3">
                  {GRADIENTS.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => onUpdate('gradientId', theme.id)}
                      className={`relative h-20 rounded-2xl overflow-hidden border transition-all duration-300 group ${
                        config.gradientId === theme.id 
                          ? 'border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-105' 
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className={`absolute inset-0 ${theme.preview} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white drop-shadow-md z-10">{theme.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <button 
                onClick={onClose}
                className="w-full py-4 bg-indigo-600 rounded-2xl font-black text-white hover:bg-indigo-500 transition-all shadow-xl"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
};

export default SettingsModal;
