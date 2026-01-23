
import React, { useState, useEffect, useRef } from 'react';
import { getAIResponse, generateVoiceGuidance, playBase64Audio, DialectType } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const DIALECTS: { id: DialectType; label: string; flag: string }[] = [
  { id: 'sudanese', label: 'سوداني', flag: '🇸🇩' },
  { id: 'saudi', label: 'سعودي', flag: '🇸🇦' },
  { id: 'syrian', label: 'سوري', flag: '🇸🇾' },
  { id: 'algerian', label: 'جزائري', flag: '🇩🇿' },
  { id: 'tunisian', label: 'تونسي', flag: '🇹🇳' },
];

const ChatMazen: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [selectedDialect, setSelectedDialect] = useState<DialectType>('sudanese');
  const [showSettings, setShowSettings] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");

  // Refs for state access inside callbacks
  const recognitionRef = useRef<any>(null);
  const isSpeakingRef = useRef(false);
  const isProcessingRef = useRef(false);
  const messagesRef = useRef<Message[]>([]);

  // --- Speech Recognition Setup ---
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'ar-SA';
      recognition.continuous = true; // Key for "Siri-like" continuous listening
      recognition.interimResults = false; // We only want final commands
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        if (!isSpeakingRef.current && !isProcessingRef.current) {
             setStatus('listening');
        }
      };

      recognition.onend = () => {
        // Auto-restart if live and not speaking/processing
        if (isLive && !isSpeakingRef.current && !isProcessingRef.current) {
             try {
               recognition.start();
             } catch (e) { /* ignore */ }
        } else if (!isLive) {
            setStatus('idle');
        }
      };

      recognition.onresult = async (event: any) => {
        if (isProcessingRef.current || isSpeakingRef.current) return;

        // Get the latest final result
        const resultsLength = event.results.length;
        const lastResult = event.results[resultsLength - 1];

        if (lastResult.isFinal) {
           const transcript = lastResult[0].transcript.trim();
           setLastTranscript(transcript);
           
           // Basic Wake Word / Command Check
           // Responds to "Mazen", "Ya Mazen", or direct commands if the user is in active mode.
           // To ensure "Siri-like" feel, we process everything but rely on the user to stop talking.
           
           await processConversation(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        // Handle no-speech by ignoring, allowing auto-restart
        if (event.error === 'no-speech') {
            // Do nothing, let onend restart it
        } else {
            console.error("Speech Error:", event.error);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [isLive, selectedDialect]);

  // --- Main Loop Control ---
  useEffect(() => {
    if (isLive) {
       startListening();
    } else {
       stopListening();
    }
    return () => stopListening();
  }, [isLive]);

  const startListening = () => {
    try {
      recognitionRef.current?.start();
      setStatus('listening');
    } catch(e) { /* Already started */ }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();
    setStatus('idle');
    isSpeakingRef.current = false;
    isProcessingRef.current = false;
  };

  const processConversation = async (userText: string) => {
    // 1. Pause Recognition Logic (Soft Pause)
    isProcessingRef.current = true;
    setStatus('processing');
    recognitionRef.current?.stop(); // Stop mic to prevent hearing AI response

    // Update History
    const newMsg: Message = { role: 'user', text: userText };
    messagesRef.current = [...messagesRef.current, newMsg];
    
    // Prepare AI History
    const history = messagesRef.current.slice(-6).map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      // 2. Get AI Response
      const aiText = await getAIResponse(history, userText, selectedDialect);
      
      messagesRef.current = [...messagesRef.current, { role: 'model', text: aiText }];
      
      // 3. Play Audio
      setStatus('speaking');
      isSpeakingRef.current = true;
      
      const audioData = await generateVoiceGuidance(aiText, 'Fenrir');
      
      if (audioData) {
        await playBase64Audio(audioData);
      }
      
    } catch (e) {
      console.error(e);
    } finally {
      // 4. Resume Listening Immediately
      isSpeakingRef.current = false;
      isProcessingRef.current = false;
      if (isLive) {
        setStatus('listening');
        try {
            recognitionRef.current?.start();
        } catch(e) {}
      }
    }
  };

  const toggleLive = () => {
    setIsLive(!isLive);
    setShowSettings(false);
  };

  return (
    <div className="fixed top-24 left-0 right-0 z-[60] flex justify-center pointer-events-none">
      
      {/* Container */}
      <div className="pointer-events-auto flex flex-col items-center gap-2">
        
        {/* Dynamic Island Widget */}
        <div className={`transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xl backdrop-blur-xl border border-white/10 overflow-hidden flex items-center relative ${
          isLive 
            ? 'bg-slate-900/95 rounded-[2rem] p-1.5 min-w-[300px]' 
            : 'bg-indigo-600/90 rounded-full p-0 w-12 h-12 justify-center hover:scale-110 cursor-pointer shadow-indigo-500/30'
        }`}>
          
          {/* Main Toggle Button (Mic) */}
          <button 
            onClick={toggleLive}
            className={`flex items-center justify-center transition-all z-20 ${
              isLive 
                ? 'w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white shrink-0' 
                : 'w-full h-full text-white'
            }`}
          >
            {isLive ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <span className="text-xl drop-shadow-md">🎙️</span>
            )}
          </button>

          {/* Active State Content */}
          {isLive && (
            <div className="flex flex-1 items-center justify-between pl-3 pr-1 animate-in fade-in slide-in-from-left-4 duration-500">
              
              {/* Status Info */}
              <div className="flex flex-col justify-center mr-auto">
                 <div className="flex items-center gap-2">
                    {/* Status Dot */}
                    <div className="w-2 h-2 rounded-full relative">
                        <span className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
                            status === 'listening' ? 'bg-emerald-400' : 
                            status === 'processing' ? 'bg-amber-400' : 
                            status === 'speaking' ? 'bg-indigo-400' : 'bg-slate-400'
                        }`}></span>
                        <span className={`relative block w-2 h-2 rounded-full ${
                            status === 'listening' ? 'bg-emerald-500' : 
                            status === 'processing' ? 'bg-amber-500' : 
                            status === 'speaking' ? 'bg-indigo-500' : 'bg-slate-500'
                        }`}></span>
                    </div>
                    <span className="text-xs font-bold text-white leading-none">
                       {status === 'listening' ? 'قل "يا مازن"...' :
                        status === 'processing' ? 'جاري المعالجة...' :
                        status === 'speaking' ? 'مازن يتحدث' : 'انتظار'}
                    </span>
                 </div>
                 {/* Current Dialect & Last Heard Text */}
                 <div className="flex flex-col mt-0.5">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        {DIALECTS.find(d => d.id === selectedDialect)?.flag}
                        {DIALECTS.find(d => d.id === selectedDialect)?.label}
                    </span>
                 </div>
              </div>

              {/* Settings Toggle */}
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${showSettings ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-slate-400'}`}
              >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
              </button>
            </div>
          )}
        </div>

        {/* Live Transcript Bubble */}
        {isLive && lastTranscript && status !== 'listening' && (
            <div className="glass-panel px-3 py-1 rounded-full animate-in fade-in slide-in-from-top-1">
                <span className="text-[10px] text-indigo-300 truncate max-w-[200px] block">"{lastTranscript}"</span>
            </div>
        )}

        {/* Dialect Selection Dropdown */}
        {isLive && showSettings && (
          <div className="bg-slate-800/90 backdrop-blur-md border border-white/10 rounded-2xl p-2 w-[280px] shadow-2xl grid grid-cols-1 gap-1 animate-in slide-in-from-top-2 fade-in duration-300">
             <div className="text-xs text-slate-400 font-bold px-3 py-2 text-center border-b border-white/5 mb-1">
                اختر لهجة المساعد الصوتي
             </div>
             {DIALECTS.map((dialect) => (
               <button
                 key={dialect.id}
                 onClick={() => {
                   setSelectedDialect(dialect.id);
                   setShowSettings(false);
                 }}
                 className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                   selectedDialect === dialect.id 
                     ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                     : 'hover:bg-white/5 text-slate-300'
                 }`}
               >
                 <div className="flex items-center gap-3">
                    <span className="text-lg">{dialect.flag}</span>
                    <span className="font-medium text-sm">{dialect.label}</span>
                 </div>
                 {selectedDialect === dialect.id && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                 )}
               </button>
             ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ChatMazen;
