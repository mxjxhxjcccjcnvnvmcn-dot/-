
import React, { useState, useRef } from 'react';
import { analyzeChartImage } from '../services/geminiService';
import { AnalysisResult, SignalType, PlanTheme } from '../types';

interface ChartAnalyzerProps {
  isLocked?: boolean;
  activePlan?: string;
  planTheme?: PlanTheme;
  quota?: number;
  onDecrementQuota?: () => void;
  onAnalysisComplete?: (result: AnalysisResult) => void;
  onOpenDonation?: () => void;
}

const TIMEFRAMES = [
  { id: '1m', label: '1 دقيقة' },
  { id: '5m', label: '5 دقائق' },
  { id: '15m', label: '15 دقيقة' },
  { id: '1h', label: 'ساعة' },
  { id: '4h', label: '4 ساعات' },
  { id: '1d', label: 'يوم' },
  { id: '1w', label: 'أسبوع' },
];

const ChartAnalyzer: React.FC<ChartAnalyzerProps> = ({ 
  isLocked = false, 
  activePlan = 'مجاني', 
  planTheme, 
  quota = 0, 
  onDecrementQuota,
  onAnalysisComplete,
  onOpenDonation
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startAnalysis = async () => {
    if (!image || isLocked) return;
    if (activePlan !== 'مجاني' && quota <= 0) {
      setError("عذراً، انتهى رصيد الصور في باقتك.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const analysis = await analyzeChartImage(base64Data, selectedTimeframe);
      setResult(analysis);
      if (onDecrementQuota) onDecrementQuota();
      if (onAnalysisComplete) onAnalysisComplete(analysis);
      window.dispatchEvent(new CustomEvent('scan-completed'));
    } catch (err: any) {
      setError("فشل الاتصال بمحرك الذكاء الاصطناعي. تأكد من جودة الصورة أو جرب مرة أخرى.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPlanStyles = () => {
    switch (activePlan) {
      case 'ذهبي': 
        return { 
          accent: 'text-amber-400', 
          border: 'border-amber-500/40', 
          bg: 'from-amber-600 to-yellow-500', 
          icon: '🥇', 
          label: 'الباقة الذهبية', 
          desc: 'تحليل فائق السرعة + كشف الحيتان',
          glowClass: 'animate-gold-halo',
          chipActive: 'bg-amber-500 text-black'
        };
      case 'بلاتيني': 
        return { 
          accent: 'text-indigo-400', 
          border: 'border-indigo-500/50', 
          bg: 'from-indigo-600 to-purple-600', 
          icon: '💎', 
          label: 'الباقة البلاتينية', 
          desc: 'أولوية قصوى + تحليل لحظي',
          glowClass: 'animate-liquid-glow-platinum',
          chipActive: 'bg-indigo-500 text-white'
        };
      case 'فضي': 
        return { 
          accent: 'text-slate-300', 
          border: 'border-slate-500/40', 
          bg: 'from-slate-600 to-slate-500', 
          icon: '🥈', 
          label: 'الباقة الفضية', 
          desc: 'تحليل سريع: 25 صورة يومياً',
          glowClass: 'animate-silver-pulse-glow',
          chipActive: 'bg-slate-400 text-black'
        };
      case 'هدية المنصة':
        return {
          accent: 'text-amber-300',
          border: 'border-white/40',
          bg: 'from-red-600 to-blue-600',
          icon: '🎁',
          label: 'هدية المنصة',
          desc: 'باقة الحجز المسبق',
          glowClass: 'animate-royal-glow',
          chipActive: 'bg-white text-black'
        };
      default: 
        return { 
          accent: 'text-indigo-400', 
          border: 'border-white/10', 
          bg: 'from-indigo-600 to-indigo-700', 
          icon: '👤', 
          label: 'خطة مجانية', 
          desc: 'اشترك للتحليل فائق السرعة',
          glowClass: '',
          chipActive: 'bg-indigo-600 text-white'
        };
    }
  };

  const styles = getPlanStyles();

  return (
    <div className="space-y-8">
      <div className={`rounded-[3rem] p-8 relative transition-all duration-700 ${isLocked ? 'glass-panel-heavy overflow-hidden' : `glass-panel-heavy border-2 ${styles.border} shadow-2xl`}`}>
        
        {!isLocked && (
          <div className="absolute top-6 right-6 z-10">
             <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Rapid Logic Active</span>
             </div>
          </div>
        )}

        {!isLocked && activePlan !== 'مجاني' && (
          <div className="absolute top-6 left-6 z-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className={`px-4 py-2 rounded-full border bg-black/40 backdrop-blur-md flex items-center gap-2 shadow-lg ${styles.border}`}>
              <span className="text-sm">{styles.icon}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${styles.accent}`}>{styles.label}</span>
            </div>
          </div>
        )}

        {isLocked && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-6">
            <div className="mb-8 w-full max-w-xs animate-in slide-in-from-top-4 duration-700 delay-300">
               <button 
                onClick={onOpenDonation}
                className="w-full py-4 px-6 rounded-2xl bg-white text-rose-600 font-black flex items-center justify-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all group"
               >
                 <span className="relative flex h-3 w-3">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                 </span>
                 تبرع لدعم المنصة ❤️
               </button>
               <p className="text-[10px] text-white/40 text-center mt-3 font-bold uppercase tracking-widest">Support our development</p>
            </div>

            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 animate-pulse border border-white/10">
               <span className="text-4xl">🔒</span>
            </div>
            <h4 className="text-2xl font-black text-white">النظام مقفل</h4>
            <p className="text-slate-400 text-sm">اشترك لتفعيل محرك التحليل الرقمي</p>
          </div>
        )}

        <div className={`flex flex-col gap-6 ${isLocked ? 'opacity-20 grayscale' : ''}`}>
          <div 
            onClick={() => !isLocked && fileInputRef.current?.click()} 
            className={`w-full h-72 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center transition-all overflow-hidden relative ${image ? 'border-transparent bg-white/5' : `border-white/10 hover:bg-white/5 cursor-pointer`}`}
          >
            {image ? (
              <img src={image} className="h-full w-full object-contain p-4" alt="Chart" />
            ) : (
              <div className="text-center px-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                   <span className="text-3xl">📁</span>
                </div>
                <h4 className="text-xl font-black text-white">اختر لقطة الشارت</h4>
                <p className="text-xs text-slate-500 mt-1">يدعم جميع أنواع الأصول المالية</p>
              </div>
            )}
          </div>

          <input type="file" ref={fileInputRef} onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.readAsDataURL(f); r.onload = () => setImage(r.result as string); } }} className="hidden" accept="image/*" />

          {!isLocked && (
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">الفريم الزمني للشارت (Timeframe)</label>
              <div className="flex flex-wrap gap-2">
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setSelectedTimeframe(tf.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${
                      selectedTimeframe === tf.id 
                        ? `${styles.chipActive} border-transparent shadow-lg scale-105` 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isLocked && activePlan !== 'مجاني' && (
            <div className={`w-full p-6 rounded-[2rem] border bg-black/40 backdrop-blur-xl flex items-center justify-between animate-in zoom-in duration-500 shadow-2xl ${styles.border} ${styles.glowClass}`}>
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl bg-white/5 border flex items-center justify-center text-3xl shadow-inner ${styles.border}`}>
                  {styles.icon}
                </div>
                <div className="text-right">
                  <h5 className={`text-lg font-black ${styles.accent}`}>{styles.label}</h5>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{styles.desc}</p>
                </div>
              </div>
              <div className="text-left">
                <span className="block text-[9px] text-slate-500 font-black uppercase tracking-tighter mb-1">الرصيد المتبقي</span>
                <span className="text-2xl font-black text-white">{quota} <small className="text-[10px] text-slate-400">تحليل</small></span>
              </div>
            </div>
          )}
          
          <button 
            onClick={startAnalysis} 
            disabled={!image || loading || isLocked} 
            className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-3 text-white bg-gradient-to-r ${styles.bg}`}
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
                <React.Fragment>
                  <span>بدء التحليل الذكي</span>
                  <span className="text-sm">⚡</span>
                </React.Fragment>
            )}
          </button>
        </div>
      </div>

      {result && !isLocked && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className={`p-8 rounded-[2.5rem] border-t-[6px] glass-panel-heavy shadow-2xl relative overflow-hidden`} style={{ borderColor: result.recommendation === SignalType.BUY ? '#10b981' : (result.recommendation === SignalType.SELL ? '#f43f5e' : '#94a3b8') }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                 <div className="text-center md:text-right">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-1">توصية النظام ({result.timeframe})</span>
                    <h2 className={`text-6xl font-black italic drop-shadow-xl`} style={{ color: result.recommendation === SignalType.BUY ? '#10b981' : (result.recommendation === SignalType.SELL ? '#f43f5e' : '#94a3b8') }}>
                       {result.recommendation === SignalType.BUY ? 'شـــراء' : (result.recommendation === SignalType.SELL ? 'بـيـــع' : 'انـتـظـار')}
                    </h2>
                 </div>
                 <div className="flex flex-col items-center md:items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-1">قوة الإشارة</span>
                    <div className="text-5xl font-black text-white">{Math.round(result.confidence * 100)}%</div>
                 </div>
              </div>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 mb-6">
                 <p className="text-slate-200 leading-relaxed text-lg italic">"{result.summary}"</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest border-b border-white/5 pb-2">الأسباب الفنية (AI Reasoning)</h4>
                    <ul className="space-y-2">
                       {result.reasoning.map((r, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-400">
                             <span className="text-indigo-500">•</span> {r}
                          </li>
                       ))}
                    </ul>
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest border-b border-white/5 pb-2">تفاصيل المؤشرات والمستويات</h4>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                          <span className="text-[9px] text-slate-500 uppercase block">RSI Status</span>
                          <span className="text-white font-bold text-xs">{result.indicators.rsi}</span>
                       </div>
                       <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                          <span className="text-[9px] text-slate-500 uppercase block">Trend Context</span>
                          <span className="text-white font-bold text-[10px]">{result.indicators.movingAverages}</span>
                       </div>
                       <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                          <span className="text-[9px] text-emerald-500 uppercase block">دعم رئيسي</span>
                          <span className="text-white font-bold text-xs">{result.supportLevels[0] || "غير محدد"}</span>
                       </div>
                       <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                          <span className="text-[9px] text-rose-500 uppercase block">مقاومة رئيسية</span>
                          <span className="text-white font-bold text-xs">{result.resistanceLevels[0] || "غير محدد"}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
      
      {error && <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-center text-sm font-bold animate-pulse">{error}</div>}
    </div>
  );
};

export default ChartAnalyzer;
