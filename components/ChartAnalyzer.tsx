
import React, { useState, useRef } from 'react';
import { analyzeChartImage } from '../services/geminiService';
import { AnalysisResult, SignalType } from '../types';

const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; 
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8)); 
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

interface ChartAnalyzerProps {
  isLocked?: boolean;
}

const ChartAnalyzer: React.FC<ChartAnalyzerProps> = ({ isLocked = false }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [analysisTime, setAnalysisTime] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked) return;
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimizedImage = await resizeImage(file);
        setImage(optimizedImage);
        setResult(null);
        setError(null);
        setAnalysisTime("");
      } catch (err) {
        console.error("Image processing failed", err);
        setError("فشل في معالجة الصورة");
      }
    }
  };

  const startAnalysis = async () => {
    if (!image || isLocked) return;
    
    setLoading(true);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const analysis = await analyzeChartImage(base64Data, userPrompt);
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
      setAnalysisTime(timeString);

      setResult(analysis);
      
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (d?: string) => {
    if (d === '5s') return '5 ثواني';
    if (d === '15s') return '15 ثانية';
    if (d === '1m') return '1 دقيقة';
    return d || '--';
  };

  return (
    <div className="space-y-12">
      {/* Input Zone */}
      <div className={`glass-panel-heavy rounded-[3rem] p-8 lg:p-12 relative overflow-hidden transition-all duration-500 ${isLocked ? 'opacity-80' : 'hover:shadow-[0_0_50px_rgba(79,70,229,0.15)]'}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        {isLocked ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in fade-in duration-700">
             <div className="relative w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                <svg className="w-12 h-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
             </div>
             <h3 className="text-3xl font-black text-white">ميزة التحليل مغلقة</h3>
             <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-amber-500 text-black font-black rounded-2xl shadow-xl">اذهب لخطط التفعيل</button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-8 w-full relative z-10 animate-in zoom-in duration-700">
            <div onClick={() => fileInputRef.current?.click()} className={`w-full max-w-2xl h-72 border border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden relative ${image ? 'border-indigo-400/50 bg-indigo-900/10' : 'border-white/20 hover:border-indigo-400/50 hover:bg-white/5'}`}>
              {image ? <img src={image} alt="Uploaded chart" className="h-full w-full object-contain p-4 drop-shadow-2xl" /> : (
                <>
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10 shadow-lg">
                    <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <span className="text-white font-medium text-lg">اضغط لرفع الشارت</span>
                </>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            </div>

            <div className="w-full max-w-2xl relative">
              <textarea value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} placeholder="اسأل الذكاء الاصطناعي عن هذا الشارت..." className="w-full bg-black/20 border border-white/10 rounded-3xl p-6 pl-16 focus:border-indigo-500/50 outline-none text-white h-28" dir="rtl" />
              <div className="absolute bottom-4 left-4">
                <button onClick={startAnalysis} disabled={!image || loading} className={`w-10 h-10 rounded-full flex items-center justify-center ${!image || loading ? 'bg-white/5 text-slate-600' : 'bg-indigo-600 text-white shadow-lg'}`}>
                  <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </div>
            </div>

            <button onClick={startAnalysis} disabled={!image || loading} className={`w-full max-w-sm py-5 rounded-2xl font-black text-xl liquid-button ${!image || loading ? 'opacity-50 grayscale' : 'text-white'}`}>
              {loading ? 'جاري المعالجة...' : 'تحليل الآن'}
            </button>
          </div>
        )}
      </div>

      {error && <div className="glass-panel bg-rose-500/10 border-rose-500/20 text-rose-300 p-4 rounded-2xl text-center">{error}</div>}

      {result && !isLocked && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
          <div className="glass-panel-heavy rounded-[2.5rem] overflow-hidden border-t border-white/20">
            {!result.isValidChart ? (
              <div className="p-16 text-center"><p className="text-slate-400">الصورة لا تحتوي على تشارت تداول صالح.</p></div>
            ) : (
              <>
                <div className={`h-2 w-full ${result.recommendation === SignalType.BUY ? 'bg-emerald-500' : result.recommendation === SignalType.SELL ? 'bg-rose-500' : 'bg-amber-500'}`} />
                
                <div className="p-8 lg:p-12 space-y-12">
                  {/* Summary Header */}
                  <div className="glass-panel rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-white/5">
                    <div className="text-center md:text-right">
                      <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest block mb-1">القرار الفني</span>
                      <div className={`text-5xl font-black ${result.recommendation === SignalType.BUY ? 'text-emerald-400' : result.recommendation === SignalType.SELL ? 'text-rose-400' : 'text-amber-400'}`}>
                        {result.recommendation === SignalType.BUY ? 'شراء' : result.recommendation === SignalType.SELL ? 'بيع' : 'انتظار'}
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest block mb-2">نسبة الثقة</span>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl font-mono font-bold text-white">{Math.round(result.confidence * 100)}%</span>
                        <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500 transition-all duration-1000" style={{width: `${result.confidence * 100}%`}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center md:text-left">
                      <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest block mb-1">المدة المقترحة</span>
                      <div className="text-2xl font-black text-white">{formatDuration(result.suggestedDuration)}</div>
                    </div>
                  </div>

                  {/* Indicators Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Technical Indicators Details */}
                    <div className="glass-panel p-8 rounded-[2rem] border-white/5 space-y-6">
                       <h4 className="text-lg font-black text-white border-b border-white/10 pb-3 flex items-center gap-2">
                          <span className="text-indigo-400">📊</span> المؤشرات الفنية
                       </h4>
                       <div className="space-y-4">
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                             <span className="text-[10px] font-bold text-indigo-300 uppercase block mb-1">RSI</span>
                             <p className="text-sm text-slate-300 leading-relaxed">{result.indicators.rsi || 'لم يتم اكتشاف إشارة واضحة'}</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                             <span className="text-[10px] font-bold text-indigo-300 uppercase block mb-1">MACD</span>
                             <p className="text-sm text-slate-300 leading-relaxed">{result.indicators.macd || 'لم يتم اكتشاف إشارة واضحة'}</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                             <span className="text-[10px] font-bold text-indigo-300 uppercase block mb-1">Moving Averages</span>
                             <p className="text-sm text-slate-300 leading-relaxed">{result.indicators.movingAverages || 'لم يتم اكتشاف إشارة واضحة'}</p>
                          </div>
                       </div>
                    </div>

                    {/* Support & Resistance Levels */}
                    <div className="glass-panel p-8 rounded-[2rem] border-white/5 space-y-6">
                       <h4 className="text-lg font-black text-white border-b border-white/10 pb-3 flex items-center gap-2">
                          <span className="text-amber-400">⚖️</span> المستويات السعرية
                       </h4>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                             <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block text-center bg-rose-500/10 py-1 rounded-md">المقاومة</span>
                             <div className="space-y-2">
                                {result.resistanceLevels.map((level, i) => (
                                   <div key={i} className="text-center py-2 px-3 rounded-xl bg-white/5 text-rose-200 font-mono text-xs border border-rose-500/10">
                                      {level}
                                   </div>
                                ))}
                             </div>
                          </div>
                          <div className="space-y-3">
                             <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block text-center bg-emerald-500/10 py-1 rounded-md">الدعم</span>
                             <div className="space-y-2">
                                {result.supportLevels.map((level, i) => (
                                   <div key={i} className="text-center py-2 px-3 rounded-xl bg-white/5 text-emerald-200 font-mono text-xs border border-emerald-500/10">
                                      {level}
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Summary & Reasoning */}
                  <div className="glass-panel p-8 rounded-[2rem] border-white/5">
                     <h4 className="text-lg font-black text-white mb-4">التحليل الشامل</h4>
                     <p className="text-slate-300 leading-loose text-lg mb-8 italic">"{result.summary}"</p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.reasoning.map((reason, i) => (
                           <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                              <span className="text-indigo-400 mt-1">●</span>
                              <span className="text-sm text-slate-400">{reason}</span>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartAnalyzer;
