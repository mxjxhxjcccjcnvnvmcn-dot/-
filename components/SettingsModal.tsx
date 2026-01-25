
import React from 'react';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="glass-panel-heavy w-full max-w-md rounded-[2.5rem] p-8 relative z-10 animate-in zoom-in duration-300 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h3 className="text-2xl font-bold text-white">تخصيص المظهر</h3>
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
            className="w-full liquid-button py-3 rounded-xl font-bold text-white"
          >
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
