
import React, { useState, useEffect, useRef } from 'react';
import { getAIResponse, generateVoiceGuidance, playBase64Audio, DialectType, API_QUOTA_ERROR } from '../services/geminiService';

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const VoiceCallModal: React.FC<VoiceCallModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'connecting' | 'listening' | 'thinking' | 'speaking'>('connecting');
  const [transcript, setTranscript] = useState(''); // Displays current live speech or AI response
  const [selectedDialect, setSelectedDialect] = useState<DialectType>('sudanese');
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  // Add setError state to handle and display errors
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isSpeakingRef = useRef(false);
  const isProcessingRef = useRef(false);
  const messagesRef = useRef<{ role: string; parts: { text: string }[] }[]>([]);
  
  // Refs for managing user utterance accumulation and silence detection
  const currentUtteranceRef = useRef<string>('');
  const silenceTimeoutRef = useRef<any>(null);

  // Call Timer
  useEffect(() => {
    let interval: any;
    if (isOpen) {
      setCallDuration(0);
      // Clear any previous error when opening the modal
      setError(null);
      interval = setInterval(() => setCallDuration(p => p + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Setup Speech Recognition
  useEffect(() => {
    if (isOpen && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'ar-SA';
      recognition.continuous = true;
      recognition.interimResults = true; // Crucial for real-time display
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        if (!isSpeakingRef.current && !isProcessingRef.current) {
          setStatus('listening');
          setError(null); // Clear error on start
        }
      };

      recognition.onresult = async (event: any) => {
        // Prevent processing new input if AI is already processing or speaking
        if (isProcessingRef.current || isSpeakingRef.current || isMuted) return;

        let interimTranscript = '';
        let finalTranscript = '';

        // Clear any previous silence timeout, as new speech is detected
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        // Always display interim results for real-time feedback
        setTranscript(interimTranscript);

        if (finalTranscript) {
          // Append final transcript to the current utterance buffer
          currentUtteranceRef.current += (currentUtteranceRef.current ? ' ' : '') + finalTranscript;
          setTranscript(finalTranscript); // Show the last final part for a moment

          // Set a new silence timeout. This is the key to waiting for user to finish speaking.
          silenceTimeoutRef.current = setTimeout(triggerAIResponse, 1500); // 1.5 seconds of silence
        } else if (interimTranscript) {
           // If only interim results are coming (user is actively speaking)
           // Set a slightly longer timeout in case of long utterances without final results
           silenceTimeoutRef.current = setTimeout(triggerAIResponse, 2500);
        }
      };

      recognition.onend = () => {
        // Only restart if the modal is open, not currently speaking/processing, AND not muted
        if (isOpen && !isSpeakingRef.current && !isProcessingRef.current && !isMuted) {
          try {
            recognition.start();
          } catch(e) {
            console.warn("Recognition start failed in onend:", e);
          }
        } else if (!isOpen) {
            // If modal closed, ensure it stays stopped
            recognition.current?.stop(); // Defensive stop
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'no-speech') {
            // This can happen during silence, onend should handle restarts
            // If the modal is open and not processing, ensure we're listening
            if (isOpen && !isProcessingRef.current && !isSpeakingRef.current && !isMuted) {
                setStatus('listening');
                try {
                    recognition.start();
                } catch(e) {
                    console.warn("Recognition start failed in onerror 'no-speech':", e);
                }
            }
        } else {
            console.error("Speech Recognition Error:", event.error);
            // Set an error state
            setError("حدث خطأ في التعرف على الصوت: " + event.error);
            stopCall(); // Stop the call on critical error
        }
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch(e) {
        console.warn("Initial recognition start failed:", e);
      }
    } else {
      stopCall();
      // Set an error state when browser doesn't support speech recognition
      setError("متصفحك لا يدعم التعرف على الكلام.");
    }

    return () => {
      stopCall();
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, [isOpen, selectedDialect, isMuted]); // Restart if dialect or mute status changes

  // Function to trigger AI response after silence
  const triggerAIResponse = () => {
    if (currentUtteranceRef.current.trim() && !isProcessingRef.current && !isSpeakingRef.current) {
      const fullUtterance = currentUtteranceRef.current.trim();
      currentUtteranceRef.current = ''; // Clear buffer immediately for next utterance
      setTranscript(''); // Clear user's displayed transcript immediately to make way for AI's response
      setError(null); // Clear any previous error before processing new message

      handleUserMessage(fullUtterance);
    }
    silenceTimeoutRef.current = null; // Clear the ref
  };

  const stopCall = () => {
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel(); // Stop any ongoing TTS
    isSpeakingRef.current = false;
    isProcessingRef.current = false;
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    currentUtteranceRef.current = ''; // Clear any pending user input
  };

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;

    // Set thinking status, but don't stop recognition yet - let it continue listening
    setStatus('thinking');
    isProcessingRef.current = true;
    setError(null); // Clear any previous error

    // Update History
    const userMsg = { role: 'user', parts: [{ text }] };
    messagesRef.current.push(userMsg);

    try {
      // 1. Get Text Response from AI (microphone is still listening during this phase)
      const aiResponse = await getAIResponse(messagesRef.current, text, selectedDialect);
      
      if (aiResponse === API_QUOTA_ERROR) {
        throw new Error(API_QUOTA_ERROR); // Propagate as error to catch block
      }
      
      messagesRef.current.push({ role: 'model', parts: [{ text: aiResponse }] });
      setTranscript(aiResponse); // Display AI's text response

      // 2. Now that we have AI's text, generate and play audio.
      // Stop recognition *before* playing AI's voice to avoid feedback/confusion.
      recognitionRef.current?.stop(); 
      
      setStatus('speaking');
      isSpeakingRef.current = true;
      const audioData = await generateVoiceGuidance(aiResponse);

      if (audioData === API_QUOTA_ERROR) { // Check if generateVoiceGuidance also returned the specific error
        throw new Error(API_QUOTA_ERROR);
      }

      // 3. Play AI's Audio
      if (audioData) {
        await playBase64Audio(audioData);
      } else {
        // If audioData is null/empty for a non-quota error, still proceed
        setTranscript("عذراً، لم أتمكن من تشغيل الصوت.");
      }

    } catch (error: any) {
      console.error("Call Error:", error);
      if (error.message === API_QUOTA_ERROR) {
        // Specific handling for quota error
        setTranscript("عذراً، تجاوزت حدود الاستخدام. يرجى التأكد من تفعيل الفوترة لمفتاح API الخاص بك.");
        setError("تجاوزت حدود الاستخدام. يرجى اختيار مفتاح API مدفوع.");
      } else {
        setTranscript("عذراً، حدث خطأ. حاول مجدداً."); // Display a temporary error
        setError("عذراً، حدث خطأ في الحصول على رد الذكاء الاصطناعي."); // Set a more specific error state
      }
    } finally {
      isSpeakingRef.current = false;
      isProcessingRef.current = false;
      
      if (isOpen && !isMuted) {
        // Clear transcript after AI finishes speaking and we go back to listening
        // Only if it's not an error message we intentionally set
        if (!transcript.startsWith("عذراً") && !error) { // Only clear if not an explicit error or ongoing display
          setTranscript(''); 
        }
        setStatus('listening');
        try {
          recognitionRef.current?.start(); // Resume listening for user input immediately after AI finishes
        } catch(e) {
          console.warn("Recognition start failed in finally block:", e);
        }
      } else if (!isOpen) {
        // If modal was closed during processing, ensure recognition is stopped
        recognitionRef.current?.stop();
      }
    }
  };

  const handleClose = () => {
    stopCall();
    onClose();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      // If muting, stop recognition and change status
      recognitionRef.current?.stop();
      setStatus('connecting'); // "Paused" state effectively
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      currentUtteranceRef.current = '';
      setTranscript(''); // Clear transcript when muted
      setError(null); // Clear error when muting
    } else {
      // If unmuting, resume listening
      setStatus('listening');
      try {
        recognitionRef.current?.start();
      } catch(e) {
        console.warn("Recognition start failed during unmute:", e);
      }
    }
  };

  if (!isOpen) return null;

  // Determine styles based on state
  const getGradient = () => {
      switch(status) {
          case 'listening': return 'from-emerald-900/50 via-black to-slate-900';
          case 'speaking': return 'from-indigo-900/50 via-purple-900/30 to-slate-900';
          case 'thinking': return 'from-amber-900/50 via-black to-slate-900';
          default: return 'from-slate-900 via-black to-black';
      }
  };

  const getOrbColor = () => {
      switch(status) {
          case 'listening': return 'from-emerald-400 to-teal-600';
          case 'speaking': return 'from-indigo-400 to-purple-600';
          case 'thinking': return 'from-amber-400 to-orange-600';
          default: return 'from-slate-400 to-slate-600';
      }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-between py-12 px-6 transition-all duration-1000 bg-gradient-to-b ${getGradient()} backdrop-blur-3xl overflow-hidden`}>
      
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] transition-all duration-1000 opacity-30 ${
             status === 'listening' ? 'bg-emerald-500' :
             status === 'speaking' ? 'bg-indigo-500' :
             status === 'thinking' ? 'bg-amber-500' : 'bg-slate-500'
          }`}></div>
      </div>

      {/* Header Info */}
      <div className="relative z-10 flex flex-col items-center gap-6 mt-4 w-full">
         <div className={`flex items-center gap-3 px-5 py-2 rounded-full border backdrop-blur-md transition-all duration-500 ${
             status === 'listening' ? 'bg-emerald-500/10 border-emerald-500/20' :
             status === 'speaking' ? 'bg-indigo-500/10 border-indigo-500/20' :
             status === 'thinking' ? 'bg-amber-500/10 border-amber-500/20' :
             'bg-white/5 border-white/10'
         }`}>
            <div className={`w-2 h-2 rounded-full ${
                status === 'listening' ? 'bg-emerald-400 animate-pulse' :
                status === 'speaking' ? 'bg-indigo-400 animate-pulse' :
                status === 'thinking' ? 'bg-amber-400 animate-bounce' :
                'bg-slate-400'
            }`}></div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/90">
                {isMuted ? 'MAZEN MUTED' :
                 status === 'listening' ? 'MAZEN LISTENING' : 
                 status === 'speaking' ? 'MAZEN SPEAKING' : 
                 status === 'thinking' ? 'PROCESSING...' : 'CONNECTED'}
            </span>
            <div className="w-px h-3 bg-white/20 mx-1"></div>
            <span className="text-xs font-mono text-white/60">{formatTime(callDuration)}</span>
         </div>
         {error && (
            <div className="bg-rose-500/20 border border-rose-500/30 text-rose-200 text-sm px-4 py-2 rounded-lg backdrop-blur-md">
                {error}
            </div>
         )}
      </div>

      {/* Central Visual (The Orb) */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
            
            {/* Outer Pulsing Rings */}
            {[1, 2, 3].map((i) => (
                <div 
                    key={i}
                    className={`absolute rounded-full border transition-all duration-700 ${
                        status === 'speaking' ? 'border-indigo-400/30 animate-ping' : 
                        status === 'listening' ? 'border-emerald-400/20' : 
                        'border-white/5'
                    }`}
                    style={{
                        width: `${14 + i * 5}rem`, 
                        height: `${14 + i * 5}rem`,
                        animationDuration: status === 'speaking' ? `${2 + i * 0.4}s` : '4s',
                        animationDelay: `${i * 0.2}s`,
                        opacity: status === 'speaking' ? 0.5 : 0.1,
                        transform: status === 'listening' ? `scale(${1 + (Math.sin(Date.now() / 1000) * 0.05)})` : 'scale(1)'
                    }}
                />
            ))}

            {/* The Core Orb */}
            <div className={`relative w-48 h-48 rounded-full transition-all duration-500 flex items-center justify-center ${
                status === 'speaking' ? 'scale-110 shadow-[0_0_80px_rgba(99,102,241,0.6)]' :
                status === 'listening' ? 'scale-100 shadow-[0_0_50px_rgba(16,185,129,0.4)]' :
                'scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
            }`}>
                {/* Spinning Gradient Mesh */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getOrbColor()} animate-[spin_8s_linear_infinite] opacity-80 blur-md`}></div>
                
                {/* Inner Glass Orb */}
                <div className="absolute inset-1 rounded-full bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center border border-white/10">
                     {status === 'thinking' ? (
                         <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin"></div>
                     ) : (
                         <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getOrbColor()} opacity-40 blur-xl animate-pulse`}></div>
                     )}
                     
                     {/* Icon Overlay */}
                     <div className="absolute inset-0 flex items-center justify-center">
                         <svg className={`w-12 h-12 transition-all duration-500 ${
                             isMuted ? 'text-slate-600' :
                             status === 'listening' ? 'text-emerald-200' :
                             status === 'speaking' ? 'text-indigo-200' :
                             status === 'thinking' ? 'text-amber-200' : 'text-slate-600'
                         }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                         </svg>
                     </div>
                </div>
            </div>
        </div>

        {/* Dynamic Transcript */}
        <div className="h-24 flex items-end justify-center w-full max-w-md px-4 mt-12">
            {transcript && (
                <div className="text-center animate-in slide-in-from-bottom-4 fade-in duration-500">
                    <p className={`text-2xl font-medium leading-relaxed ${
                        status === 'speaking' ? 'text-indigo-100' : 'text-white/90'
                    } drop-shadow-md`}>
                        "{transcript}"
                    </p>
                </div>
            )}
        </div>
      </div>

      {/* Controls Area */}
      <div className="relative z-10 w-full max-w-sm flex flex-col gap-6 mb-4">
        
        {/* Dialect Tabs */}
        <div className="flex justify-center gap-2 overflow-x-auto py-2 no-scrollbar px-4">
          {DIALECTS.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDialect(d.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                selectedDialect === d.id 
                  ? 'bg-white/10 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                  : 'bg-transparent border-transparent text-white/40 hover:bg-white/5'
              }`}
              disabled={isProcessingRef.current || isSpeakingRef.current}
            >
              <span className="mr-2">{d.flag}</span>
              {d.label}
            </button>
          ))}
        </div>

        {/* Main Controls */}
        <div className="grid grid-cols-3 gap-6 items-center justify-items-center">
          
          <button 
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md ${
              isMuted 
                ? 'bg-white text-black shadow-lg scale-110' 
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
            }`}
          >
             {isMuted ? (
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
               </svg>
             ) : (
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
               </svg>
             )}
          </button>

          <button 
            onClick={handleClose}
            className="w-20 h-20 rounded-full bg-rose-500 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 group border-4 border-rose-600/50"
          >
             <svg className="w-8 h-8 text-white transform rotate-135 group-hover:rotate-0 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
             </svg>
          </button>

          <button 
            onClick={onClose}
            className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/70 backdrop-blur-md"
            disabled={isProcessingRef.current || isSpeakingRef.current}
          >
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
             </svg>
          </button>

        </div>
      </div>
    </div>
  );
};

export default VoiceCallModal;