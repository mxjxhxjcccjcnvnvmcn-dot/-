
import React, { useState, useRef } from 'react';
import { analyzeChartImage, generateVoiceGuidance } from '../services/geminiService';
import { AnalysisResult, SignalType } from '../types';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
    webkitAudioContext: any;
    AudioContext: any;
  }
}

// Audio utility functions
const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Image optimization utility
const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Optimized for Speed: 1024px is faster to upload and process
        const MAX_WIDTH = 1024; 
        const MAX_HEIGHT = 1024;
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
        // Lower quality slightly (0.85) for smaller payload -> faster request
        resolve(canvas.toDataURL('image/jpeg', 0.85)); 
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
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // We optimize the image immediately upon selection
        const optimizedImage = await resizeImage(file);
        setImage(optimizedImage);
        setResult(null);
        setError(null);
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

  const playAudioResult = async (analysis: AnalysisResult) => {
    let text = "";
    
    // Logic to handle invalid charts vs valid analysis
    if (!analysis.isValidChart) {
      text = "الصورة لا تحتوي على مؤشرات تداول.";
    } else {
      switch (analysis.recommendation) {
        case SignalType.BUY:
          text = "شراء. الاتجاه صاعد.";
          break;
        case SignalType.SELL:
          text = "بيع. الاتجاه هابط.";
          break;
        case SignalType.HOLD:
          text = "انتظر.";
          break;
      }
    }

    if (!text) return;

    try {
      const audioBase64 = await generateVoiceGuidance(text);
      if (audioBase64) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
        const audioBytes = decodeBase64(audioBase64);
        
        const dataInt16 = new Int16Array(audioBytes.buffer);
        const numChannels = 1;
        const frameCount = dataInt16.length / numChannels;
        const audioBuffer = audioContext.createBuffer(numChannels, frameCount, 24000);
        
        for (let channel = 0; channel < numChannels; channel++) {
            const channelData = audioBuffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
                channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
            }
        }

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
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
      // Remove data URL prefix
      const base64Data = image.split(',')[1];
      const analysis = await analyzeChartImage(base64Data, userPrompt);
      setResult(analysis);
      
      // Play voice guidance based on full analysis object
      playAudioResult(analysis);
      
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 lg:p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">حلل شارت تداولك (سريع جداً)</h2>
        <p className="text-slate-400 text-center mb-8 max-w-2xl mx-auto">
          ارفع صورة للشارت الفني، وسنقوم بتحليلها فورياً باستخدام أسرع نماذج الذكاء الاصطناعي.
        </p>

        <div className="flex flex-col items-center justify-center gap-6 w-full">
          {/* Image Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full max-w-xl h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
              image ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-700 hover:border-slate-500 bg-slate-900/40'
            }`}
          >
            {image ? (
              <img src={image} alt="Uploaded chart" className="h-full w-full object-contain p-2 rounded-xl" />
            ) : (
              <>
                <svg className="w-12 h-12 text-slate-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-slate-400">انقر لرفع صورة الشارت</span>
                <span className="text-indigo-400 text-xs mt-1">يتم التحليل بسرعة البرق</span>
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

          {/* Prompt / Voice Input Area */}
          <div className="w-full max-w-xl relative">
            <label className="block text-sm font-medium text-slate-400 mb-2 text-right">
              لديك سؤال محدد؟ (اختياري)
            </label>
            <div className="relative">
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="اكتب سؤالك هنا أو استخدم الميكروفون للتحدث..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 pl-12 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-200 resize-none h-24"
                dir="rtl"
              />
              <button
                onClick={startVoiceInput}
                disabled={isListening}
                className={`absolute bottom-3 left-3 p-2 rounded-full transition-all ${
                  isListening 
                    ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/50' 
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'
                }`}
                title="تحدث الآن"
              >
                {isListening ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>
            </div>
            {isListening && (
              <p className="text-xs text-rose-400 mt-1 absolute left-0 -bottom-6 animate-pulse">جاري الاستماع...</p>
            )}
          </div>

          <button
            onClick={startAnalysis}
            disabled={!image || loading}
            className={`px-12 py-4 rounded-full font-bold text-lg transition-all shadow-xl flex items-center gap-3 mt-4 ${
              !image || loading 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105 active:scale-95 shadow-indigo-500/20'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري التحليل السريع...
              </>
            ) : 'ابدأ التحليل السريع'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden">
          {/* Check validity before showing dashboard */}
          {!result.isValidChart ? (
            <div className="p-10 flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-700">
                 <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
               </div>
               <h3 className="text-2xl font-bold text-slate-200 mb-2">تنبيه</h3>
               <p className="text-slate-400 text-lg max-w-md">
                 {result.summary || "عذراً، الصورة المرفقة لا تحتوي على مؤشرات تداول واضحة أو ليست شارت مالي."}
               </p>
            </div>
          ) : (
            <>
              <div className={`p-1 ${
                result.recommendation === SignalType.BUY ? 'bg-emerald-500' : 
                result.recommendation === SignalType.SELL ? 'bg-rose-500' : 'bg-amber-500'
              }`} />
              
              <div className="p-6 lg:p-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-slate-900 rounded-md text-xs font-mono text-indigo-400">
                        {result.symbol || 'ASSET_IDENTIFIED'}
                      </span>
                      <span className="text-slate-400 text-sm">تحليل فني متقدم</span>
                    </div>
                    <h3 className="text-3xl font-black mb-1">نتيجة التوصية</h3>
                    <p className="text-slate-400">تحليل مبني على الأنماط السعرية والمؤشرات الفنية</p>
                  </div>

                  <div className="text-center md:text-left bg-slate-900/50 p-6 rounded-2xl border border-slate-700 w-full md:w-auto min-w-[200px]">
                    <div className={`text-4xl font-black mb-1 ${
                      result.recommendation === SignalType.BUY ? 'text-emerald-400' : 
                      result.recommendation === SignalType.SELL ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {result.recommendation === SignalType.BUY ? 'شراء' : 
                      result.recommendation === SignalType.SELL ? 'بيع' : 'انتظار'}
                    </div>
                    <div className="text-slate-500 text-sm uppercase tracking-widest">
                      دقة التحليل: {Math.round(result.confidence * 100)}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-slate-900/30 p-5 rounded-xl border border-slate-700/50">
                    <h4 className="font-bold text-slate-300 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      الأسباب الفنية
                    </h4>
                    <ul className="space-y-3">
                      {result.reasoning.map((reason, idx) => (
                        <li key={idx} className="text-sm text-slate-400 flex gap-2">
                          <span className="text-indigo-400">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-900/30 p-5 rounded-xl border border-slate-700/50">
                    <h4 className="font-bold text-slate-300 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      المستويات الهامة
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-slate-500 uppercase block mb-1">الدعم (Support)</span>
                        <div className="flex flex-wrap gap-2">
                          {result.supportLevels.map((lvl, idx) => (
                            <span key={idx} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs border border-emerald-500/20">{lvl}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 uppercase block mb-1">المقاومة (Resistance)</span>
                        <div className="flex flex-wrap gap-2">
                          {result.resistanceLevels.map((lvl, idx) => (
                            <span key={idx} className="px-2 py-1 bg-rose-500/10 text-rose-400 rounded text-xs border border-rose-500/20">{lvl}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/30 p-5 rounded-xl border border-slate-700/50 lg:col-span-1">
                    <h4 className="font-bold text-slate-300 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      المؤشرات الفنية
                    </h4>
                    <div className="space-y-3 text-sm">
                      {result.indicators.rsi && (
                        <div className="flex justify-between items-center py-2 border-b border-slate-800">
                          <span className="text-slate-500">RSI:</span>
                          <span className="text-slate-300 font-mono">{result.indicators.rsi}</span>
                        </div>
                      )}
                      {result.indicators.macd && (
                        <div className="flex justify-between items-center py-2 border-b border-slate-800">
                          <span className="text-slate-500">MACD:</span>
                          <span className="text-slate-300 font-mono">{result.indicators.macd}</span>
                        </div>
                      )}
                      {result.indicators.movingAverages && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-slate-500">المتوسطات:</span>
                          <span className="text-slate-300 text-xs">{result.indicators.movingAverages}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-700/50">
                  <h4 className="font-bold text-slate-300 mb-2">الملخص التنفيذي</h4>
                  <p className="text-slate-400 leading-relaxed italic">
                    "{result.summary}"
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChartAnalyzer;
