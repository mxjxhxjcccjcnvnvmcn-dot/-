
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AnalysisResult, SignalType } from "../types";

const API_KEY = process.env.API_KEY || "";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to play audio directly from service
export const playBase64Audio = async (base64Audio: string) => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
    
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const dataInt16 = new Int16Array(bytes.buffer);
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
  } catch (e) {
    console.error("Audio playback error:", e);
  }
};

export const analyzeChartImage = async (base64Image: string, userContext?: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Optimized Prompt: Handles specific questions, Arabic summary, and Trade Duration
  const prompt = `
    Analyze this trading chart image.
    1. Check if valid chart. If not, set isValidChart=false.
    2. If valid, set isValidChart=true and provide recommendation (BUY, SELL, HOLD).
    3. Determine best 'suggestedDuration' for a quick trade strictly from: ["5s", "15s", "1m"] based on volatility.
    4. 'summary' field MUST be in ARABIC.
       - If user provides a note/question ("${userContext || ''}"), answer it directly in the 'summary' (max 30 words).
       - If no note, keep 'summary' extremely short describing the trend (max 10 words).
    5. Fill other fields briefly.
  `;

  let lastError: any;
  const maxRetries = 2; 

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", 
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
            { text: prompt }
          ]
        },
        config: {
          temperature: 0.7, 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isValidChart: { type: Type.BOOLEAN },
              symbol: { type: Type.STRING },
              recommendation: { type: Type.STRING, enum: ["BUY", "SELL", "HOLD"] },
              suggestedDuration: { type: Type.STRING, enum: ["5s", "15s", "1m"] },
              confidence: { type: Type.NUMBER },
              reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
              supportLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
              resistanceLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
              summary: { type: Type.STRING },
              indicators: {
                type: Type.OBJECT,
                properties: {
                  rsi: { type: Type.STRING },
                  macd: { type: Type.STRING },
                  movingAverages: { type: Type.STRING }
                }
              }
            },
            required: ["isValidChart", "recommendation", "confidence", "summary", "suggestedDuration"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response");

      const result = JSON.parse(text);
      return {
        ...result,
        recommendation: result.recommendation as SignalType
      };

    } catch (error: any) {
      console.warn(`Attempt ${attempt + 1} failed:`, error);
      lastError = error;
      if (attempt < maxRetries - 1) await delay(1000); 
    }
  }

  throw new Error("فشل التحليل. حاول مرة أخرى.");
};

export const generateVoiceGuidance = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, 
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
  } catch (error) {
    console.error("TTS generation error:", error);
    return "";
  }
};
