
import React, { useState, useRef } from 'react';
import { analyzeChartImage, generateVoiceGuidance, playBase64Audio } from '../services/geminiService';
import { AnalysisResult, SignalType } from '../types';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
    webkitAudioContext: any;
    AudioContext: any;
  }
}

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

const ChartAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [analysisTime, setAnalysisTime] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const startVoiceInput = () => {
    if (isListening) return;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setUserPrompt(prev => prev ? `${prev} ${transcript}` : transcript);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("عذراً، متصفحك لا يدعم خاصية الكتابة بالصوت.");
    }
  };

  const playAudioResult = async (analysis: AnalysisResult, hasUserQuestion: boolean) => {
    let text = "";
    
    if (!analysis.isValidChart) {
      text = "عذراً، الصورة غير واضحة";
    } else if (hasUserQuestion && analysis.summary) {
      text = analysis.summary;
    } else {
      switch (analysis.recommendation) {
        case SignalType.BUY: text = "شراء"; break;
        case SignalType.SELL: text = "بيع"; break;
        case SignalType.HOLD: text = "انتظار"; break;
      }
    }

    if (!text) return;

    try {
      const audioBase64 = await generateVoiceGuidance(text);
      if (audioBase64) {
        playBase64Audio(audioBase64);
      }
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    
    setLoading(true);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const analysis = await analyzeChartImage(base64Data, userPrompt);
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
      setAnalysisTime(timeString);

      setResult(analysis);
      const hasUserQuestion = userPrompt.trim().length > 0;
      playAudioResult(analysis, hasUserQuestion);
      
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
      {/* Input Zone - Glass Container */}
      <div className="glass-panel-heavy rounded-[3rem] p-8 lg:p-12 relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(79,70,229,0.15)]">
        
        {/* Decorative background light */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex flex-col items-center justify-center gap-8 w-full relative z-10">
          
          {/* Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full max-w-2xl h-72 border border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden relative ${
              image ? 'border-indigo-400/50 bg-indigo-900/10' : 'border-white/20 hover:border-indigo-400/50 hover:bg-white/5'
            }`}
          >
            {image ? (
              <img src={image} alt="Uploaded chart" className="h-full w-full object-contain p-4 relative z-10 drop-shadow-2xl" />
            ) : (
              <>
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                  <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-white font-medium text-lg mb-1">اضغط لرفع الشارت</span>
                <span className="text-indigo-300/60 text-sm">يقبل صور عالية الدقة</span>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Voice Prompt Area */}
          <div className="w-full max-w-2xl relative">
            <div className="relative group">
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="اسأل الذكاء الاصطناعي عن هذا الشارت..."
                className="w-full bg-black/20 border border-white/10 rounded-3xl p-6 pl-16 focus:border-indigo-500/50 focus:bg-black/40 outline-none transition-all text-white placeholder-white/20 resize-none h-28 shadow-inner"
                dir="rtl"
              />
              <button
                onClick={startVoiceInput}
                disabled={isListening}
                className={`absolute bottom-4 left-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isListening 
                    ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.5)]' 
                    : 'bg-white/10 text-white hover:bg-indigo-500 hover:scale-110'
                }`}
              >
                {isListening ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                ) : (
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            onClick={startAnalysis}
            disabled={!image || loading}
            className={`w-full max-w-sm py-5 rounded-2xl font-black text-xl transition-all shadow-xl flex items-center justify-center gap-3 liquid-button ${
              !image || loading 
                ? 'opacity-50 cursor-not-allowed grayscale' 
                : 'hover:scale-105 active:scale-95 text-white'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري المعالجة...
              </>
            ) : 'تحليل الآن'}
          </button>
        </div>
      </div>

      {error && (
        <div className="glass-panel bg-rose-500/10 border-rose-500/20 text-rose-300 p-4 rounded-2xl text-center shadow-lg">
          {error}
        </div>
      )}

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
          
          <div className="glass-panel-heavy rounded-[2.5rem] overflow-hidden border-t border-white/20">
            {!result.isValidChart ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2">تنبيه</h3>
                 <p className="text-slate-400">{result.summary || "الصورة غير واضحة"}</p>
              </div>
            ) : (
              <>
                {/* Result Indicator Bar */}
                <div className={`h-2 w-full shadow-[0_0_20px_currentColor] ${
                  result.recommendation === SignalType.BUY ? 'bg-emerald-500 text-emerald-500' : 
                  result.recommendation === SignalType.SELL ? 'bg-rose-500 text-rose-500' : 'bg-amber-500 text-amber-500'
                }`} />
                
                <div className="p-8 lg:p-12">
                  {/* HERO TABLE - Glass Style */}
                  <div className="mb-12 glass-panel rounded-3xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <div className="text-[10px] text-white/40 font-mono">{analysisTime}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/10">
                        {/* Decision */}
                        <div className="p-8 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white/5 to-transparent">
                            <span className="text-xs text-indigo-300 uppercase tracking-widest font-bold mb-4">التوصية النهائية</span>
                            <div className={`text-6xl font-black drop-shadow-[0_0_25px_rgba(0,0,0,0.5)] scale-110 ${
                                result.recommendation === SignalType.BUY ? 'text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-emerald-600' : 
                                result.recommendation === SignalType.SELL ? 'text-transparent bg-clip-text bg-gradient-to-br from-rose-300 to-rose-600' : 'text-amber-400'
                            }`}>
                                {result.recommendation === SignalType.BUY ? 'شراء' : 
                                result.recommendation === SignalType.SELL ? 'بيع' : 'انتظار'}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="p-8 flex flex-col justify-center gap-6">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-slate-400 text-sm font-bold">المدة المقترحة</span>
                                <span className="text-2xl font-bold text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]">
                                    {formatDuration(result.suggestedDuration)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm font-bold">نسبة الثقة</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div style={{width: `${result.confidence * 100}%`}} className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                                    </div>
                                    <span className="text-white font-mono">{Math.round(result.confidence * 100)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Summary & Reasoning Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="glass-panel p-6 rounded-3xl hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h4 className="font-bold text-white">الأسباب الفنية</h4>
                        </div>
                        <ul className="space-y-3">
                          {result.reasoning.slice(0, 3).map((r, i) => (
                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2 leading-relaxed">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_5px_currentColor]"></span>
                                {r}
                            </li>
                          ))}
                        </ul>
                     </div>

                     <div className="glass-panel p-6 rounded-3xl hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <h4 className="font-bold text-white">الملخص الذكي</h4>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed opacity-90">
                            {result.summary}
                        </p>
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
